#!/usr/bin/env python3
"""Mede as chapas e escreve o que o Remotion precisa (src/data/chapas.json).

Posições, frames e efeitos vêm dos timeline.json do pacote
(src/data/timeline/), que são a fonte da verdade. Este script não decide
nada disso: só MEDE o que o JSON não diz e a câmera precisa.

  tinta     o centro da tinta das camadas de quadro inteiro que batem ou
            descem fora de registro (a origem da escala do efeito)
  mascaras  a faixa útil do ruído de cada máscara da oficina (o limiar
            varre só onde há ruído)
  legenda   o tom do papel de cada Short, para o halo da legenda
  anel      a linha de medição (anel.json)

E estende com espelho os papéis (PAD px em volta: a batida desloca o
quadro, a deriva anda e a mesa da oficina inclina 11°, que abre ~110 px
em cima) e a chapa do anel (PAD_ANEL: inclinada 5°, a borda de cima recua
e abriria ~37 px no frame 0). Espelho não é textura nova: é o mesmo papel,
congelado, uma vez. A chapa não muda de escala.

As faixas da chapa param de 1 a 5 px antes das bordas laterais (a margem
da impressão). Espelhada, essa margem virava um filete claro dentro de cada
faixa, e a deriva o traz para dentro do quadro: antes do espelho, APARA px
de cada lado são trocados pelo espelho da tinta logo ao lado. Nada muda de
lugar; só a margem some.

Uso: python3 -I preparar.py <projeto>
"""
import json
import os
import sys

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
PROJ = sys.argv[1]
PUB = os.path.join(PROJ, 'public')
PAD = 128
PAD_ANEL = 64
APARA = 6
SHORTS = ('1-contagem', '2-anel', '3-sagas', '4-oficina')
TL = {s: json.load(open(os.path.join(PROJ, f'src/data/timeline/{s}.json'), encoding='utf-8')) for s in SHORTS}


def centro_tinta(arq, limiar=128):
    a = np.asarray(Image.open(os.path.join(PUB, arq)).convert('RGBA'))[..., 3]
    ys, xs = np.where(a > limiar)
    return [round((int(xs.min()) + int(xs.max()) + 1) / 2, 1), round((int(ys.min()) + int(ys.max()) + 1) / 2, 1)]


def espelho(origem, destino, pad, apara=0):
    im = np.asarray(Image.open(os.path.join(PUB, origem)).convert('RGB'))
    if apara:
        im = im[:, apara:im.shape[1] - apara]
    ext = np.pad(im, ((pad, pad), (pad + apara, pad + apara), (0, 0)), mode='symmetric')
    Image.fromarray(ext).save(os.path.join(PUB, destino), quality=95, subsampling=0)


def tom(im):
    """O tom médio do papel (sem a tinta): vira a cor do halo da legenda."""
    a = np.asarray(im.convert('RGB')).astype(float)
    claro = a.mean(2) > 170
    r, g, b = a[claro].mean(0).round().astype(int)
    return f'#{r:02X}{g:02X}{b:02X}'


def main():
    for s in ('1-contagem', '3-sagas', '4-oficina'):
        f = TL[s]['fundo']
        espelho(f, f.replace('.jpg', '-ext.jpg'), PAD)
    espelho('2-anel/anel-9000.jpg', '2-anel/anel-9000-ext.jpg', PAD_ANEL, APARA)

    tinta, mascaras = {}, {}
    for s in SHORTS:
        for c in TL[s]['camadas']:
            if c['ancora'] == 'quadro' and c.get('efeito') in ('batida', 'desregistro'):
                tinta[c['arquivo']] = centro_tinta(c['arquivo'])
            if c.get('mascara'):
                m = np.asarray(Image.open(os.path.join(PUB, c['mascara'])), float)
                mascaras[c['mascara']] = [round(float(np.percentile(m, 0.5)), 1), round(float(np.percentile(m, 99.5)), 1)]

    legenda = {s: tom(Image.open(os.path.join(PUB, TL[s]['fundo']))) for s in ('1-contagem', '3-sagas', '4-oficina')}
    legenda['2-anel'] = tom(Image.open(os.path.join(PUB, TL['2-anel']['chapa']['arquivo'])))
    anel = json.load(open(os.path.join(PUB, '2-anel/anel.json')))

    dados = dict(pad=PAD, pad_anel=PAD_ANEL, tinta=tinta, mascaras=mascaras, legenda=legenda,
                 anel=dict(linha=anel['linha_sugerida'], bordas=anel['bordas_y']))
    json.dump(dados, open(os.path.join(PROJ, 'src/data/chapas.json'), 'w'), ensure_ascii=False, indent=1)
    print('tinta:', tinta)
    print('legenda:', legenda)
    print('máscaras:', mascaras)


if __name__ == '__main__':
    main()
