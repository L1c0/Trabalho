#!/usr/bin/env python3
"""
Recorta a silhueta da foto da floresta (img/silhueta.jpg): o cavalo empinado,
o cavaleiro e o mato do primeiro plano viram uma camada preta com transparência.

  python3 -I recorta.py  ->  img/heroi.png (2400x1350, RGBA)

O recorte é por brilho: o que é escuro fica. O sol lava o tronco e o chapéu do
cavaleiro, então essa região usa um limiar mais alto. Tudo é feito no dobro do
tamanho, para a borda sair lisa.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent
im = Image.open(RAIZ / 'img' / 'silhueta.jpg').convert('RGB')
W0, H0 = im.size  # 1200 x 675
Z = 2
g = np.asarray(im.resize((W0 * Z, H0 * Z), Image.BICUBIC)).astype(np.float32)
lum = 0.2126 * g[..., 0] + 0.7152 * g[..., 1] + 0.0722 * g[..., 2]
lum = ndimage.gaussian_filter(lum, 1.0)
H, W = lum.shape
yy, xx = np.mgrid[0:H, 0:W]

escuro = lum < 128
# o cavaleiro (tronco e chapéu), lavado pela luz: limiar mais alto só nessa caixa
cav = (xx > 588 * Z) & (xx < 742 * Z) & (yy > 44 * Z) & (yy < 288 * Z)
escuro |= cav & (lum < 208)
escuro = ndimage.binary_closing(escuro, iterations=2)

rot, n = ndimage.label(escuro)
semente = rot[330 * Z, 560 * Z]
assert semente > 0, 'a semente não caiu no cavalo'
fica = rot == semente
# o mato que não encosta no cavalo também fica, desde que toque a base da foto
for k in np.unique(rot[H - 3, :]):
    if k:
        fica |= rot == k
fica = ndimage.binary_fill_holes(fica)
# sem galhos soltos no alto, à direita do cavalo, e sem a planta alta do canto esquerdo
# (o chão da esquerda é desenhado na composição)
fica &= ~((yy < 430 * Z) & (xx > 860 * Z))
fica &= xx > 205 * Z

alfa = ndimage.gaussian_filter(fica.astype(np.float32), 1.3)
alfa = np.clip((alfa - 0.32) / 0.36, 0, 1)

# a cor: quase preto, um pouco mais quente no alto (onde o sol bate por trás)
t = (yy / H)[..., None]
cor = (1 - t) * np.array([34, 14, 6], np.float32) + t * np.array([10, 4, 3], np.float32)
rgba = np.dstack([cor, alfa[..., None] * 255]).astype(np.uint8)
Image.fromarray(rgba, 'RGBA').save(RAIZ / 'img' / 'heroi.png')

print('heroi.png', rgba.shape[1], 'x', rgba.shape[0], '| cobertura %.1f%%' % (100 * alfa.mean()))
