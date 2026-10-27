#!/usr/bin/env python3
"""A mixagem de cada Short: a narração como veio + os efeitos da prensa.

A narração NÃO é renormalizada (LEIA-PRIMEIRO: -16,0 LUFS / -1,5 dBFS antes
do MP3; renormalizar só empilha mais um passo de ganho). Os efeitos são
somados por cima, nos frames dos timeline.json (src/data/timeline/, os
mesmos que a imagem lê), e só os picos que passarem de -1,5 dBTP com a soma
levam um limitador em 4x (soxr), como nos Shorts do Houseki.

Os efeitos são ruído filtrado em banda estreita, nunca clique digital (o
ataque tem 1 a 2 ms em cosseno), sem whoosh, riser ou sub-grave:

  batida de chapa   cada numeral da contagem, no impacto       pico -24 dBFS
  tique de madeira  cada anel que cruza a linha (tiques)       pico -22 dBFS
  chapa pousando    os dois desregistros das sagas, no pouso   pico -20 dBFS
  papel levantando  cada casa que sai (descolar_de)            pico -26 dBFS

Cada ocorrência tem a sua semente: cem batidas iguais viram metralhadora.
Trilha e leito de sala ficam para depois da montagem fechada.

Uso: python3 -I mixagem.py <projeto>  ->  public/audio/mix-<short>.flac
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
from scipy import signal

PROJ = sys.argv[1]
A = os.path.join(PROJ, 'public/audio')
SR = 48000
FPS = 30
TL = {s: json.load(open(os.path.join(PROJ, f'src/data/timeline/{s}.json'), encoding='utf-8'))
      for s in ('1-contagem', '2-anel', '3-sagas', '4-oficina')}


def le(arq):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True).stdout
    return np.frombuffer(x, np.float32).reshape(-1, 2).astype(np.float64)


def medir(arq):
    o = subprocess.run(['ffmpeg', '-nostdin', '-i', arq, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    s = o[o.index('Summary'):]
    return float(re.search(r'I:\s+(-?[0-9.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[0-9.]+)', s).group(1))


def banda(g, n, fc, q):
    """Ruído branco por um passa-banda de 2ª ordem (banda estreita)."""
    b, a = signal.iirpeak(fc / (SR / 2), q)
    return signal.lfilter(b, a, g.standard_normal(n))


def envelope(n, ataque, tau):
    t = np.arange(n) / SR
    e = np.exp(-np.maximum(t - ataque, 0) / tau)
    na = max(1, int(ataque * SR))
    e[:na] *= 0.5 - 0.5 * np.cos(np.pi * np.arange(na) / na)
    return e


def pico(x, db):
    return x * (10 ** (db / 20) / (np.abs(x).max() + 1e-12))


def batida(g, pesada=False):
    """Chapa batendo: corpo em banda estreita no médio-grave + estalo médio."""
    k = 0.8 if pesada else 1.0
    n = int((0.22 if pesada else 0.12) * SR)
    corpo = banda(g, n, 240 * k * g.uniform(0.92, 1.08), 4) * envelope(n, 0.0015, (0.048 if pesada else 0.03) * g.uniform(0.85, 1.15))
    estalo = banda(g, n, 1150 * k * g.uniform(0.92, 1.08), 3) * envelope(n, 0.001, 0.016 * g.uniform(0.85, 1.15))
    x = 0.55 * corpo / np.abs(corpo).max() + 0.45 * estalo / np.abs(estalo).max()
    return pico(x, -24)


def tique(g):
    """Tique de madeira: ressonância seca de bloco + topo curto."""
    n = int(0.06 * SR)
    oco = banda(g, n, 900 * g.uniform(0.95, 1.05), 9) * envelope(n, 0.001, 0.011)
    seco = banda(g, n, 2500 * g.uniform(0.95, 1.05), 6) * envelope(n, 0.0008, 0.005)
    x = 0.6 * oco / np.abs(oco).max() + 0.4 * seco / np.abs(seco).max()
    return pico(x, -22)


def pousa(g):
    """Chapa pousando: o peso encostando (médio-grave largo) + o tapa."""
    n = int(0.3 * SR)
    peso = banda(g, n, 420, 2) * envelope(n, 0.002, 0.06)
    tapa = banda(g, n, 1800, 3) * envelope(n, 0.0015, 0.02)
    x = 0.6 * peso / np.abs(peso).max() + 0.4 * tapa / np.abs(tapa).max()
    return pico(x, -20)


def levanta(g):
    """Papel levantando: farfalhar agudo em grãos, subindo e morrendo em ~0,45 s."""
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    chiado = banda(g, n, 3200, 1.5)
    graos = np.convolve((g.random(n) < 0.004) * g.uniform(0.3, 1.0, n), np.hanning(int(0.004 * SR)), 'same')
    forma = np.clip(t / 0.12, 0, 1) ** 1.5 * np.exp(-np.maximum(t - 0.12, 0) / 0.11)
    x = chiado * (0.35 + graos) * forma
    x[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return pico(x, -26)


def efeitos(sid, n):
    g = np.random.default_rng(int(sid[0]) * 1000 + 7)
    trilha = np.zeros(n)
    tl = TL[sid]
    def poe(f, som):
        i = int(round(f / FPS * SR))
        k = min(len(som), n - i)
        trilha[i:i + k] += som[:k]
    if sid == '1-contagem':
        # o impacto é o frame em que a batida chega a 1,00; os cinco últimos (5 frames) são os pesados
        for c in tl['camadas']:
            if c['ancora'] == 'centro' and c.get('efeito') == 'batida':
                poe(c['entra'] + c['batida_frames'] - 1, batida(g, pesada=c['batida_frames'] > 3))
    elif sid == '2-anel':
        for t in tl['tiques_frames']:
            poe(t, tique(g))
    elif sid == '3-sagas':
        for c in tl['camadas']:
            if c.get('efeito') == 'desregistro':
                poe(c['entra'] + c['frames'] - 1, pousa(g))
    elif sid == '4-oficina':
        for c in tl['camadas']:
            if c.get('efeito') == 'descolar':
                poe(c['descolar_de'], levanta(g))
    return np.stack([trilha, trilha], 1)


def main():
    for sid in ('1-contagem', '2-anel', '3-sagas', '4-oficina'):
        frames = TL[sid]['frames']
        n = int(round(frames / FPS * SR))
        voz = le(os.path.join(A, sid + '.mp3'))
        mix = np.zeros((n, 2))
        mix[:min(n, len(voz))] += voz[:n]
        mix += efeitos(sid, n)
        bruto = os.path.join(A, f'mix-{sid}-bruto.wav')
        mix.astype(np.float32).tofile(bruto + '.f32')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', bruto + '.f32',
                        '-c:a', 'pcm_f32le', bruto], check=True)
        os.remove(bruto + '.f32')
        I0, tp0 = medir(bruto)
        saida = os.path.join(A, f'mix-{sid}.flac')
        if tp0 > -1.5:
            lim = 10 ** (-1.7 / 20)
            af = f'aresample={SR * 4}:resampler=soxr,alimiter=limit={lim:.4f}:attack=1:release=60:level=disabled,' \
                 f'aresample={SR}:resampler=soxr'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-af', af, '-c:a', 'flac',
                            '-sample_fmt', 's32', saida], check=True)
        else:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-c:a', 'flac', '-sample_fmt', 's32', saida],
                           check=True)
        os.remove(bruto)
        I, tp = medir(saida)
        print(f'{sid}: soma {I0:.1f} LUFS / {tp0:.1f} dBTP  ->  mix {I:.1f} LUFS / {tp:.1f} dBTP')


if __name__ == '__main__':
    main()
