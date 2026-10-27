#!/usr/bin/env python3
"""Mede as chapas e escreve o que o Remotion precisa (src/data/chapas.json).

Nada aqui gera textura: as chapas vieram prontas (a prensa rodou uma vez).
Este script só MEDE onde a tinta está, para a câmera saber o que fazer:

  contagem  para cada numeral, o centro da tinta do grande e do pequeno e a
            escala em que o grande vira o pequeno (assentar sem salto)
  anel      o frame em que cada uma das 28 bordas cruza a linha de medição
  sagas     o centro da tinta de cada chapa (origem da descida e do recuo)
  oficina   a faixa útil de cada máscara (o limiar varre só onde há ruído)

E estende os quatro papéis com 64 px de espelho em volta: a batida desloca
o quadro alguns pixels e a deriva anda; a borda do papel nunca pode
aparecer.

Uso: python3 -I preparar.py <projeto>
"""
import json
import os
import sys

import numpy as np
from PIL import Image

PROJ = sys.argv[1]
PUB = os.path.join(PROJ, 'public')
PAD = 64


def tinta(arq, limiar=128):
    """Caixa e centro da tinta (alfa acima do limiar) de uma chapa RGBA."""
    a = np.asarray(Image.open(os.path.join(PUB, arq)).convert('RGBA'))[..., 3]
    ys, xs = np.where(a > limiar)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    return dict(w=a.shape[1], h=a.shape[0], caixa=[x0, y0, x1, y1], cx=(x0 + x1) / 2, cy=(y0 + y1) / 2)


def papeis():
    for nome in ('papel-socos', 'papel-anel', 'papel-sagas', 'papel-oficina'):
        im = np.asarray(Image.open(os.path.join(PUB, 'comum', nome + '.jpg')).convert('RGB'))
        ext = np.pad(im, ((PAD, PAD), (PAD, PAD), (0, 0)), mode='symmetric')
        Image.fromarray(ext).save(os.path.join(PUB, 'comum', nome + '-ext.jpg'), quality=95, subsampling=0)


# a última linha do arquivo (91 a 100) caía em y 1370-1430, dentro da faixa
# da legenda (1330-1430): as linhas se aproximam, a primeira fica onde está
# (logo abaixo da cartela) e a tinta da última termina em LIMITE
LIMITE = 1316


def contagem():
    pos = {p['n']: p for p in json.load(open(os.path.join(PUB, '1-contagem/posicoes.json')))}
    med = {n: (tinta(f'1-contagem/num-{n:03d}.png'), tinta(f'1-contagem/arq-{n:03d}.png')) for n in range(1, 101)}
    topo = np.mean([pos[n]['arq_y'] for n in range(1, 11)])
    fundo = max(pos[n]['arq_y'] - med[n][1]['h'] / 2 + med[n][1]['caixa'][3] for n in range(1, 101))
    base = max(pos[n]['arq_y'] for n in range(1, 101))
    k = min(1.0, (LIMITE - (fundo - base) - topo) / (base - topo))
    out = []
    for n in range(1, 101):
        g, p = med[n]
        # posicoes.json: centro da imagem pequena na grade (arq_x, arq_y)
        ax, ay = pos[n]['arq_x'], topo + (pos[n]['arq_y'] - topo) * k
        alvo_x = ax - p['w'] / 2 + p['cx']
        alvo_y = ay - p['h'] / 2 + p['cy']
        escala = (p['caixa'][3] - p['caixa'][1]) / (g['caixa'][3] - g['caixa'][1])
        out.append(dict(n=n, gw=g['w'], gh=g['h'], gcx=g['cx'], gcy=g['cy'], pw=p['w'], ph=p['h'],
                        ax=ax, ay=round(ay, 2), alvo=[round(alvo_x, 2), round(alvo_y, 2)], escala=round(escala, 4),
                        fundo=round(ay - p['h'] / 2 + p['caixa'][3], 1)))
    return out


def anel():
    js = json.load(open(os.path.join(PUB, '2-anel/anel.json')))
    # bordas_y é a borda de baixo de cada faixa escura (conferido na chapa)
    return dict(linha=js['linha_sugerida'], bordas=js['bordas_y'], marcador=js['marcador_993_y'],
                altura=js['altura'])


def sagas():
    return {n: tinta(f'3-sagas/{n}.png') for n in
            ('cabecalho', 'divisor', 'esq-60', 'dir-140', 'esq-credito', 'dir-credito', '200-anos', 'haukr')}


def oficina():
    out = {}
    for i in range(1, 9):
        m = np.asarray(Image.open(os.path.join(PUB, f'4-oficina/mascara-{i}.png')), float)
        out[i] = [round(float(np.percentile(m, 0.5)), 1), round(float(np.percentile(m, 99.5)), 1)]
    casas = {c['casa']: c for c in json.load(open(os.path.join(PUB, '4-oficina/casas.json')))}
    return dict(mascaras=out, casas=casas, tinta={n: tinta(f'4-oficina/{n}.png') for n in
                                                  ['rotulo', 'achados', 'fecho'] + [f'casa-{i}' for i in range(1, 9)]})


def main():
    papeis()
    dados = dict(pad=PAD, contagem=contagem(), anel=anel(), sagas=sagas(), oficina=oficina())
    json.dump(dados, open(os.path.join(PROJ, 'src/data/chapas.json'), 'w'), ensure_ascii=False, indent=1)
    c = dados['contagem']
    print('contagem: escala grande->pequeno de', min(x['escala'] for x in c), 'a', max(x['escala'] for x in c))
    print('contagem: tinta da última linha termina em', max(x['fundo'] for x in c))


if __name__ == '__main__':
    main()
