#!/usr/bin/env python3
"""A mixagem de cada Short: narração + trilha + leito de sala + efeitos.

Soma direto, sem ducking (V2 §3): a narração a -16 LUFS, a trilha a -31 e
o leito a -50 já vêm no nível; só se soma. O leito é periódico (gerado no
domínio da frequência) e repete sem emenda.

Efeitos: papel e prensa, nunca whoosh. Pico de cada um em -20 dBFS, bem
abaixo da voz; no máximo um por batida e só quatro ou cinco por Short. Eles
caem nas batidas da narração (as marcas do AUDIO.md, que caem em pausa) e,
se uma batida da música estiver a menos de 60 ms, o efeito anda até 100 ms
para longe dela: efeito na batida da música transforma o ensaio em edit.

- pagina: a virada de página (sfx-pagina), na troca de chapa
- papel:  o farfalhar (sfx-papel)
- prensa: a batida de prensa, "montável" (V2 §3): um baque curto, sem
          sub-grave, mais o farfalhar por baixo — no assentamento do plano
- tique:  o tique seco de cada marca da régua de Mohs. Não veio arquivo;
          é um estalo de 3 ms de ruído filtrado, sintetizado aqui.

Uso: python3 -I mixagem.py <projeto>
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy import signal

R = sys.argv[1]
A = os.path.join(R, "public/audio/shorts")
SR = 48000
FPS = 30

EFEITOS = {
    "1-leviata": [(280, "papel"), (915, "prensa")],
    "2-navio": [(12, "prensa"), (157, "pagina"), (475, "pagina"), (726, "pagina"), (963, "prensa")],
    "3-memoria": [(148, "pagina"), (462, "prensa"), (625, "prensa"), (792, "prensa"), (934, "pagina")],
    "4-pedra": [(262, "pagina")] + [(290 + 2 * i, "tique") for i in range(10)]
               + [(455, "pagina"), (855, "pagina"), (1055, "pagina")],
}


def le(arq):
    x = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                       capture_output=True, check=True).stdout
    return np.frombuffer(x, np.float32).reshape(-1, 2).astype(np.float64)


def pico(x, alvo_db):
    return x * (10 ** (alvo_db / 20) / (np.abs(x).max() + 1e-12))


def apara(x, lim_db=-50):
    """Tira o silêncio do começo e do fim (arquivo de efeito costuma vir com folga)."""
    env = np.abs(x).max(1)
    on = np.where(env > env.max() * 10 ** (lim_db / 20))[0]
    return x[on[0]:on[-1] + 1]


def efeitos():
    papel = apara(le(os.path.join(A, "sfx-papel.mp3")))
    pagina = apara(le(os.path.join(A, "sfx-pagina.mp3")))
    g = np.random.default_rng(7)
    # prensa: baque de 140 Hz (nada de sub) com queda rápida + estalo curto
    t = np.arange(int(0.16 * SR)) / SR
    baque = np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.028)
    b, a = signal.butter(2, [400, 3000], btype="band", fs=SR)
    estalo = signal.lfilter(b, a, g.normal(0, 1, len(t))) * np.exp(-t / 0.004)
    prensa = baque / np.abs(baque).max() + 0.35 * estalo / np.abs(estalo).max()
    prensa = np.stack([prensa, prensa], 1)
    farf = papel[: int(0.5 * SR)] * np.linspace(1, 0, min(len(papel), int(0.5 * SR)))[:, None]
    mont = np.zeros((max(len(prensa), len(farf)), 2))
    mont[: len(prensa)] += prensa
    mont[: len(farf)] += 0.5 * farf / (np.abs(farf).max() + 1e-12)
    # tique: 3 ms de ruído entre 2 e 7 kHz
    t = np.arange(int(0.012 * SR)) / SR
    b, a = signal.butter(2, [2000, 7000], btype="band", fs=SR)
    tq = signal.lfilter(b, a, g.normal(0, 1, len(t))) * np.exp(-t / 0.0015)
    tique = np.stack([tq, tq], 1)
    return {"pagina": pico(pagina, -20), "papel": pico(papel, -20), "prensa": pico(mont, -20), "tique": pico(tique, -24)}


def batidas_da_musica(trilha):
    """Ataques da trilha (fluxo espectral), em segundos."""
    m = trilha.mean(1)
    f, t, Z = signal.stft(m, SR, nperseg=1024, noverlap=1024 - 480)
    mag = np.abs(Z)
    fluxo = np.maximum(0, np.diff(mag, axis=1)).sum(0)
    if fluxo.std() == 0:
        return np.array([])
    lim = fluxo.mean() + 2.5 * fluxo.std()
    picos, _ = signal.find_peaks(fluxo, height=lim, distance=8)
    return t[1:][picos]


def main():
    fx = efeitos()
    leito = le(os.path.join(A, "leito-sala.flac"))
    rel = {}
    for n, lista in EFEITOS.items():
        narr = le(os.path.join(A, f"{n}.flac"))
        trilha = le(os.path.join(A, f"trilha-{n}.flac"))
        N = len(narr)
        mix = narr.copy()
        mix[: min(N, len(trilha))] += trilha[:N]
        reps = int(np.ceil(N / len(leito)))
        mix += np.tile(leito, (reps, 1))[:N]
        ataques = batidas_da_musica(trilha)
        log = []
        for f, tipo in lista:
            s = f / FPS
            perto = ataques[np.abs(ataques - s) < 0.06] if len(ataques) else []
            if len(perto):
                s = float(perto.max()) + 0.1 if perto.max() >= s else s
            i = int(round(s * SR))
            e = fx[tipo][: max(0, N - i)]
            mix[i:i + len(e)] += e
            log.append((f, tipo, round(s * FPS, 1)))
        saida = os.path.join(A, f"mix-{n}.flac")
        # a soma passa de -1,5 dBTP em picos raros (a narração sozinha já
        # chega a -1,5): um limitador transparente, a 4x, segura só esses
        # picos sem mexer na loudness
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                        "-af", "aresample=192000:resampler=soxr,alimiter=limit=0.83:attack=1:release=60:level=false,"
                               "aresample=48000:resampler=soxr",
                        "-c:a", "flac", "-sample_fmt", "s32", saida], input=mix.astype(np.float32).tobytes(), check=True)
        med = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", saida, "-af", "ebur128=peak=true", "-f", "null", "-"],
                             capture_output=True, text=True).stderr
        resumo = med[med.rfind("Summary"):]
        i_lufs = float(resumo.split("I:")[1].split("LUFS")[0])
        tp = float(resumo.split("Peak:")[1].split("dBFS")[0])
        rel[n] = dict(lufs=i_lufs, dbtp=tp, efeitos=log)
        print(f"{n}: {i_lufs} LUFS, pico {tp} dBTP, efeitos {[(a, b) for a, b, _ in log]}", flush=True)
    json.dump(rel, open(os.path.join(R, "src/data/mixagem.json"), "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
