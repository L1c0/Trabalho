#!/usr/bin/env python3
"""
O som da vinheta de abertura (public/vinheta.mp3), feito aqui do zero:

  python3 -I ferramentas/vinheta-som.py [musica.wav inicio_s [ganho]]

- duas batidas graves, nos quadros 8 e 26 da vinheta (0,267 s e 0,867 s):
  a primeira seca, a segunda funda e longa;
- uma subida de acorde em ré menor com ar e brilho, que acompanha o mergulho
  nas faixas de luz e acaba em 4,2 s;
- junto, se vier, um trecho da música do vídeo (o arquivo e o segundo em que
  o trecho começa), desde o primeiro instante e saindo devagar;
- depois de 4,4 s, silêncio de verdade (zeros).

Tudo é síntese: senos, ruído filtrado e um eco de sala feito de ruído que
decai. Não usa amostra nem som de terceiros.
"""
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from scipy import signal

RAIZ = Path(__file__).resolve().parent.parent
SR = 48000
DUR = 5.0
B1, B2 = 8 / 30, 26 / 30
FIM = 4.25

rng = np.random.default_rng(1899)
t = np.arange(int(SR * DUR)) / SR


def env_exp(t0, tau, ataque=0.002):
    x = t - t0
    e = np.where(x >= 0, np.exp(-np.maximum(x, 0) / tau), 0.0)
    return e * np.clip(x / ataque, 0, 1)


def passa(x, f1, f2=None, ordem=4):
    if f2 is None:
        sos = signal.butter(ordem, f1, 'low', fs=SR, output='sos')
    elif f1 is None:
        sos = signal.butter(ordem, f2, 'high', fs=SR, output='sos')
    else:
        sos = signal.butter(ordem, [f1, f2], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def batida(t0, f_ini, f_fim, tau_amp, tau_tom, ganho_ruido):
    """Bumbo sintético: seno que desce de tom, mais um estalo de ruído."""
    x = np.maximum(t - t0, 0)
    freq = f_fim + (f_ini - f_fim) * np.exp(-x / tau_tom)
    fase = 2 * np.pi * np.cumsum(freq) / SR
    corpo = np.sin(fase) * env_exp(t0, tau_amp)
    corpo += 0.35 * np.sin(2 * fase) * env_exp(t0, tau_amp * 0.4)
    ruido = passa(rng.standard_normal(len(t)), 150, 1800) * env_exp(t0, 0.035) * ganho_ruido
    return corpo + ruido


# as duas batidas
seco = batida(B1, 150, 62, 0.16, 0.035, 0.5) * 0.85
fundo = batida(B2, 120, 41, 0.75, 0.06, 0.35) * 1.0

# a subida: ré menor em serras desafinadas, abrindo o filtro
notas = [36.71, 73.42, 110.0, 146.83, 174.61, 220.0, 293.66]
pad = np.zeros(len(t))
for k, fz in enumerate(notas):
    for des in (-0.004, 0.0, 0.005):
        fase = 2 * np.pi * fz * (1 + des) * t + rng.uniform(0, 6.28)
        pad += signal.sawtooth(fase) / (1 + k * 0.35)
sobe = np.clip((t - 0.95) / (3.3 - 0.95), 0, 1) ** 2.2
desce = np.clip((FIM - t) / 0.85, 0, 1) ** 1.5
# o filtro abre com a subida: mistura de três bandas
pad = (passa(pad, 220) * 1.0 + passa(pad, 220, 900) * sobe * 0.8 + passa(pad, 900, 3500) * sobe ** 2 * 0.5) * sobe * desce * 0.05

# ar: ruído agudo que cresce, e um brilho de sinos finos
ar = passa(rng.standard_normal(len(t)), None, 5000) * (sobe ** 3) * desce * 0.035
brilho = np.zeros(len(t))
for k in range(26):
    t0 = 1.7 + rng.uniform(0, 1.9)
    fz = rng.choice([1174.7, 1396.9, 1760.0, 2349.3, 2793.8, 3520.0])
    brilho += np.sin(2 * np.pi * fz * t) * env_exp(t0, 0.22, 0.004) * rng.uniform(0.3, 1.0)
brilho *= 0.012 * desce

mono = seco + fundo + pad

# eco de sala: ruído que decai, com menos agudo no fim
n_eco = int(SR * 2.2)
te = np.arange(n_eco) / SR
resp = []
for canal in range(2):
    r = rng.standard_normal(n_eco) * np.exp(-te / 0.55)
    r = passa(r, 180, 6000)
    r[: int(0.012 * SR)] = 0
    resp.append(r / np.sqrt((r ** 2).sum()))
estereo = []
for canal in range(2):
    lado = (ar + brilho) * (1.0 if canal == 0 else 0.85) + np.roll(ar + brilho, 211 * (1 - canal)) * 0.3
    seco_c = mono + lado
    molhado = signal.fftconvolve(seco_c, resp[canal])[: len(t)]
    estereo.append(seco_c + 0.38 * molhado)
x = np.stack(estereo, axis=1)

# a música do vídeo por baixo, se vier
if len(sys.argv) >= 3:
    ini = float(sys.argv[2])
    raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', str(ini), '-t', str(DUR), '-i', sys.argv[1], '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    m = np.frombuffer(raw, np.float32).reshape(-1, 2)
    m = np.pad(m, ((0, max(0, len(t) - len(m))), (0, 0)))[: len(t)]
    entra = np.clip(t / 0.25, 0, 1)
    sai = np.clip((FIM - t) / 1.3, 0, 1) ** 1.3
    ganho_m = float(sys.argv[3]) if len(sys.argv) >= 4 else 1.0
    x = x + m * (entra * sai)[:, None] * ganho_m

# o fim é silêncio de verdade
x *= np.clip((FIM + 0.12 - t) / 0.12, 0, 1)[:, None]
x[t > FIM + 0.12] = 0
pico = np.abs(x).max()
x = x / pico * 10 ** (-5.0 / 20)
saida = RAIZ / 'out' / 'vinheta.wav'
saida.parent.mkdir(exist_ok=True)
with wave.open(str(saida), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', str(saida), '-c:a', 'libmp3lame', '-b:a', '256k', str(RAIZ / 'public' / 'vinheta.mp3')], check=True)
print('public/vinheta.mp3: pico -5 dBFS, silêncio a partir de %.2f s' % (FIM + 0.12))
