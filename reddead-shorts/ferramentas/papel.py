#!/usr/bin/env python3
"""
Papel e tinta: as texturas e as manchas usadas nos Shorts, todas geradas aqui
(nenhuma imagem de banco).

  public/papel.jpg            textura de papel para multiplicar por cima de tudo
  public/tinta/mancha-N.png   respingos de tinta parados (fundo branco, tinta preta)
  public/tinta/pincel-N.png   pinceladas largas
  public/tinta/sangra-N.mp4   mancha que cresce, como tinta no papel molhado

As manchas entram no Remotion por modo de mistura, como os takes.

  python3 -I ferramentas/papel.py
"""
import subprocess
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
(PUB / 'tinta').mkdir(parents=True, exist_ok=True)


def ruido(g, h, w, escalas, pesos=None):
    """Ruído fractal: campos aleatórios alisados em várias escalas, somados. Sai entre -1 e 1."""
    out = np.zeros((h, w), np.float32)
    pesos = pesos or [1 / (i + 1) for i in range(len(escalas))]
    for s, p in zip(escalas, pesos):
        hh, ww = max(2, int(h / s) + 2), max(2, int(w / s) + 2)
        c = g.standard_normal((hh, ww)).astype(np.float32)
        c = cv2.resize(c, (w, h), interpolation=cv2.INTER_CUBIC)
        out += p * c / (c.std() + 1e-6)
    return out / (np.abs(out).max() + 1e-6)


def papel():
    g = np.random.default_rng(11)
    h, w = 1920, 1080
    base = np.full((h, w), 0.955, np.float32)
    base += 0.020 * ruido(g, h, w, [420, 160, 60])            # manchas largas
    base += 0.012 * ruido(g, h, w, [14, 6])                   # polpa
    fibra = g.standard_normal((h, w)).astype(np.float32)
    fibra = cv2.GaussianBlur(fibra, (0, 0), sigmaX=9, sigmaY=0.6)  # fibras deitadas
    base += 0.016 * fibra / fibra.std()
    base += 0.010 * g.standard_normal((h, w)).astype(np.float32)   # grão fino
    # pintas escuras raras
    for _ in range(260):
        x, y = g.integers(0, w), g.integers(0, h)
        r = g.uniform(0.6, 2.2)
        cv2.circle(base, (int(x), int(y)), int(np.ceil(r)), float(base[y, x] - g.uniform(0.04, 0.14)), -1, cv2.LINE_AA)
    # as bordas escurecem um pouco, como papel velho
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.minimum.reduce([xx, w - 1 - xx, yy * 0.6, (h - 1 - yy) * 0.6]) / 260.0
    borda = np.clip(d, 0, 1)
    base *= 0.90 + 0.10 * (borda * borda * (3 - 2 * borda))
    img = np.clip(base, 0, 1)
    cv2.imwrite(str(PUB / 'papel.jpg'), (img * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print('papel.jpg', img.shape, 'média %.3f' % img.mean())


def campo_mancha(g, n, alonga=1.0, rug=0.34):
    """Campo escalar da mancha: 0 no centro, 1 na borda, deformado por ruído."""
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32)
    cx = cy = n / 2
    r = np.hypot((xx - cx) / alonga, yy - cy) / (n * 0.36)
    ang = np.arctan2(yy - cy, xx - cx)
    # raios: a tinta espirra mais em algumas direções
    raios = np.zeros_like(r)
    for _ in range(9):
        a0, larg, forca = g.uniform(-np.pi, np.pi), g.uniform(0.05, 0.22), g.uniform(0.15, 0.55)
        dif = np.angle(np.exp(1j * (ang - a0)))
        raios += forca * np.exp(-0.5 * (dif / larg) ** 2)
    f = r * (1 - 0.42 * np.clip(raios, 0, 1.2)) + rug * ruido(g, n, n, [n / 5, n / 12, n / 30, n / 70], [1, 0.6, 0.35, 0.2])
    return f, r


def respingos(g, n, m, quanto=120, r0=0.62, r1=1.25):
    """Gotas soltas em volta da mancha."""
    for _ in range(quanto):
        a = g.uniform(0, 2 * np.pi)
        d = g.uniform(r0, r1) ** 1.0 * n * 0.36
        x, y = n / 2 + d * np.cos(a), n / 2 + d * np.sin(a)
        rr = g.exponential(3.2) + 1.2
        if 0 <= x < n and 0 <= y < n:
            cv2.circle(m, (int(x), int(y)), int(rr), 0.0, -1, cv2.LINE_AA)
            if g.random() < 0.3:   # rabo da gota
                cv2.line(m, (int(x), int(y)), (int(x + 3.5 * rr * np.cos(a)), int(y + 3.5 * rr * np.sin(a))), 0.0, max(1, int(rr * 0.6)), cv2.LINE_AA)
    return m


def manchas():
    n = 1024
    for i, (sem, alonga) in enumerate([(3, 1.0), (8, 1.25), (21, 0.85), (34, 1.5)], 1):
        g = np.random.default_rng(sem)
        f, _ = campo_mancha(g, n, alonga)
        m = np.clip((f - 0.86) / 0.035, 0, 1)
        m = respingos(g, n, m.astype(np.float32).copy())
        m = cv2.GaussianBlur(m, (0, 0), 0.8)
        cv2.imwrite(str(PUB / 'tinta' / f'mancha-{i}.png'), (np.clip(m, 0, 1) * 255).astype(np.uint8))
    print('manchas ok')


def pinceladas():
    for i, sem in enumerate([5, 17, 29], 1):
        g = np.random.default_rng(sem)
        h, w = 420, 1600
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        # corpo: uma faixa com as bordas rasgadas
        topo = 70 + 26 * ruido(g, 1, w, [300, 90, 25])[0] + 10 * ruido(g, 1, w, [8])[0]
        baixo = h - 70 + 26 * ruido(g, 1, w, [260, 80, 22])[0] + 10 * ruido(g, 1, w, [7])[0]
        corpo = ((yy > topo[None, :]) & (yy < baixo[None, :])).astype(np.float32)
        # pontas: entra cheia, sai seca
        ini = 60 + 30 * ruido(g, h, 1, [40, 12])[:, 0]
        fim = w - 90 + 60 * ruido(g, h, 1, [30, 9])[:, 0]
        corpo *= (xx > ini[:, None]) * (xx < fim[:, None])
        # cerdas: riscos claros ao longo do traço, mais fortes no fim
        cerdas = cv2.GaussianBlur(g.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=120, sigmaY=1.3)
        cerdas = cerdas / cerdas.std()
        seco = np.clip((xx - w * 0.35) / (w * 0.65), 0, 1) ** 1.6
        falha = (cerdas > (1.9 - 1.9 * seco)).astype(np.float32)
        m = 1 - corpo * (1 - falha)
        m = cv2.GaussianBlur(m, (0, 0), 0.9)
        cv2.imwrite(str(PUB / 'tinta' / f'pincel-{i}.png'), (np.clip(m, 0, 1) * 255).astype(np.uint8))
    print('pinceladas ok')


def sangra():
    """Mancha que cresce: o limiar do campo sobe com o tempo. 45 quadros (1,5 s) e depois fica."""
    n = 1080
    for i, (sem, alonga, quadros) in enumerate([(4, 1.0, 45), (13, 1.3, 45), (27, 0.9, 36)], 1):
        g = np.random.default_rng(sem)
        f, r = campo_mancha(g, n, alonga, rug=0.30)
        gotas = respingos(g, n, np.ones((n, n), np.float32), quanto=90, r0=0.75, r1=1.3)
        destino = PUB / 'tinta' / f'sangra-{i}.mp4'
        ff = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{n}x{n}', '-r', '30', '-i', '-',
                               '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-g', '10', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709',
                               '-color_primaries', 'bt709', '-color_trc', 'bt709', '-vf', 'scale=in_range=full:out_range=tv', '-movflags', '+faststart', str(destino)],
                              stdin=subprocess.PIPE)
        for k in range(quadros):
            t = (k + 1) / quadros
            e = 1 - (1 - t) ** 3                     # corre no começo, freia no fim
            lim = 0.02 + 0.86 * e
            m = np.clip((f - lim) / 0.03, 0, 1)
            if e > 0.55:                             # as gotas aparecem quando a frente passa
                m = np.minimum(m, np.where(r < 0.5 + 1.0 * (e - 0.55) / 0.45 * 1.6, gotas, 1))
            m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.8)
            ff.stdin.write((np.clip(m, 0, 1) * 255).astype(np.uint8).tobytes())
        ff.stdin.close()
        ff.wait()
    print('sangra ok')


if __name__ == '__main__':
    papel()
    manchas()
    pinceladas()
    sangra()
