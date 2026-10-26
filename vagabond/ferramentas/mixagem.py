#!/usr/bin/env python3
"""A mixagem do Vagabond: narração + trilha + leito de sala (+ a página).

Soma direto, sem ducking (LEIA-PRIMEIRO): a narração a -16 LUFS, a trilha
com o envelope que segue a saturação (muda na abertura e no fecho) e o
leito a -50, em loop perfeito de 20 s, o vídeo inteiro. O documento mede a
soma em -16,0 LUFS / -1,5 dBTP; aqui ela é medida de novo (deu -0,9 dBTP
com a página), e o pico desce num limitador em 4x (soxr), como nos Shorts.

A página (sfx-pagina) entra só onde o roteiro fala de página: quando a
primeira página do mangá aparece, e nas duas falas sobre "uma página do
Vagabond" / "na sua própria página". No nível em que veio.

Uso: python3 -I mixagem.py <projeto>  ->  public/audio/vag-mix.mp3
"""
import json
import os
import re
import subprocess
import sys

import numpy as np

R = sys.argv[1]
A = os.path.join(R, 'public/audio')
SR = 48000
FPS = 30
FRAMES = 16538


def le(arq):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True).stdout
    return np.frombuffer(x, np.float32).reshape(-1, 2).astype(np.float64)


def medir(arq):
    o = subprocess.run(['ffmpeg', '-nostdin', '-i', arq, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    s = o[o.index('Summary'):]
    return float(re.search(r'I:\s+(-?[0-9.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[0-9.]+)', s).group(1))


def palavra(p, depois):
    pal = json.load(open(os.path.join(R, 'src/data/palavras.json'), encoding='utf-8'))
    for f, w in pal:
        if f >= depois and w.lower().startswith(p):
            return f
    raise KeyError(p)


def main():
    n = int(round(FRAMES / FPS * SR))
    voz = le(os.path.join(A, 'vag-narracao.mp3'))
    trilha = le(os.path.join(A, 'vag-trilha.mp3'))
    leito = le(os.path.join(A, 'vag-leito-sala.mp3'))
    pagina = le(os.path.join(A, 'sfx-pagina.mp3'))
    mix = np.zeros((n, 2))
    mix[:min(n, len(voz))] += voz[:n]
    mix[:min(n, len(trilha))] += trilha[:n]
    # o leito é um loop de 20 s: repete sem emenda até o fim
    reps = int(np.ceil(n / len(leito)))
    mix += np.tile(leito, (reps, 1))[:n]
    # a página: no corte para a primeira página do mangá e nas duas falas
    # que dizem "página" (dois frames antes da palavra)
    with open(os.path.join(R, 'src/data/montagem.json'), encoding='utf-8') as fh:
        planos = json.load(fh)['planos']
    primeira = min(p['de'] for p in planos if p['folha'] == 'curriculo')
    quando = [primeira, palavra('página', 12100) - 2, palavra('página', 15100) - 2]
    for f in quando:
        i = int(round(f / FPS * SR))
        k = min(len(pagina), n - i)
        mix[i:i + k] += pagina[:k]
    bruto = os.path.join(A, 'vag-mix-bruto.wav')
    mix.astype(np.float32).tofile(bruto + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', bruto + '.f32',
                    '-c:a', 'pcm_f32le', bruto], check=True)
    os.remove(bruto + '.f32')
    I, tp = medir(bruto)
    print(f'soma direta: {I:.1f} LUFS, pico verdadeiro {tp:.1f} dBTP')
    # o arquivo do filme é MP3 de 320 kbps (a gravação original já é MP3 de
    # 128 kbps: FLAC só triplicava o tamanho). O MP3 e depois o AAC do
    # render passam um pouco do pico, então o teto desce até o MP3 medir
    # -1,7 dBTP ou menos
    saida = os.path.join(A, 'vag-mix.mp3')
    teto = -1.7
    while True:
        lim = 10 ** (teto / 20)
        af = f'aresample={SR * 4}:resampler=soxr,alimiter=limit={lim:.4f}:attack=1:release=60:level=disabled,' \
             f'aresample={SR}:resampler=soxr'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-af', af, '-c:a', 'libmp3lame', '-b:a', '320k',
                        '-ar', str(SR), saida], check=True)
        I, tp = medir(saida)
        if tp <= -1.7 or teto < -3:
            break
        teto -= 0.2
    os.remove(bruto)
    print(f'mixagem: {I:.1f} LUFS, pico verdadeiro {tp:.1f} dBTP (teto do limitador {teto:.1f}), '
          f'{FRAMES / FPS:.2f} s; páginas em {quando}')


if __name__ == '__main__':
    main()
