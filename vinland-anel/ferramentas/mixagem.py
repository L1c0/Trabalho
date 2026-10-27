#!/usr/bin/env python3
"""O áudio do Anel, como o LEIA-PRIMEIRO pede: narração + tiques + trilha
somados direto, sem ducking, e depois normalizados em -16 LUFS / -1,5 dBTP.

A normalização é um ganho só (linear). Se o pico verdadeiro passar de
-1,5 dBTP depois do ganho, um limitador em 4x (soxr) segura os picos; se
não passar, nada além do ganho toca no som.

Uso: python3 -I mixagem.py <projeto>  ->  public/audio/mix.flac
"""
import json
import os
import re
import subprocess
import sys

import numpy as np

PROJ = sys.argv[1]
A = os.path.join(PROJ, 'public/audio')
SR = 48000
tl = json.load(open(os.path.join(PROJ, 'src/data/timeline.json'), encoding='utf-8'))
N = int(round(tl['formato']['frames'] / tl['formato']['fps'] * SR))
ALVO_I, ALVO_TP = -16.0, -1.5


def le(nome):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(A, nome), '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True).stdout
    x = np.frombuffer(x, np.float32).reshape(-1, 2).astype(np.float64)
    out = np.zeros((N, 2))
    out[:min(N, len(x))] = x[:N]
    return out


def escreve(x, arq, *extra):
    bruto = arq + '.f32'
    x.astype(np.float32).tofile(bruto)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', bruto, *extra,
                    '-c:a', 'flac', '-sample_fmt', 's32', arq], check=True)
    os.remove(bruto)


def mede(arq):
    o = subprocess.run(['ffmpeg', '-nostdin', '-i', arq, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    s = o[o.index('Summary'):]
    return float(re.search(r'I:\s+(-?[0-9.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[0-9.]+)', s).group(1))


def main():
    soma = le('2-anel.mp3') + le('anel-tiques.mp3') + le('anel-trilha.mp3')
    tmp = os.path.join(A, 'soma.flac')
    escreve(soma, tmp)
    i0, tp0 = mede(tmp)
    g = 10 ** ((ALVO_I - i0) / 20)
    saida = os.path.join(A, 'mix.flac')
    escreve(soma * g, saida)
    i1, tp1 = mede(saida)
    lim = ''
    if tp1 > ALVO_TP:
        teto = 10 ** ((ALVO_TP - 0.2) / 20)
        af = f'aresample={SR * 4}:resampler=soxr,alimiter=limit={teto:.4f}:attack=1:release=60:level=disabled,' \
             f'aresample={SR}:resampler=soxr'
        escreve(soma * g, saida, '-af', af)
        i1, tp1 = mede(saida)
        lim = ' (com limitador)'
    os.remove(tmp)
    print(f'soma {i0:.1f} LUFS / {tp0:.1f} dBTP -> ganho {20 * np.log10(g):+.2f} dB -> mix {i1:.1f} LUFS / {tp1:.1f} dBTP{lim}')


if __name__ == '__main__':
    main()
