#!/usr/bin/env python3
"""A fosfofilita tratada (public/mineral/h24-fosfofilita.jpg) vira camada de
tinta, para ser impressa num plano maior que o quadro.

A h24 é uma página pronta, 1080x1920: o papel dela não dá para refazer (a
semente e a versão da prensa que a geraram não batem), e sem sobra o plano
não pode inclinar sem mostrar a borda. Então a tinta é separada do papel:
o papel por baixo do mineral é estimado pelo papel em volta (só a nuvem
larga, sem o grão), e a camada é a razão entre a página e esse papel — é
assim que tinta transparente age, por multiplicação. Fora do mineral a
camada é branca (não muda nada)."""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
h = np.asarray(Image.open(os.path.join(RAIZ, "public/mineral/h24-fosfofilita.jpg")).convert("RGB"), float)
lum = h.mean(2)
# o que é mineral: bem mais escuro que o papel, ou verde
croma = h[..., 1] - (h[..., 0] + h[..., 2]) / 2
fundo = ndimage.median_filter(lum, 41)
mineral = (lum < np.median(lum) - 22) | (croma > 9)
mineral = ndimage.binary_opening(mineral, iterations=2)
rot, n = ndimage.label(mineral)
maior = np.argmax(ndimage.sum(mineral, rot, range(1, n + 1))) + 1
mineral = ndimage.binary_fill_holes(ndimage.binary_closing(rot == maior, iterations=6))
mineral = ndimage.binary_dilation(mineral, iterations=3)
# papel por baixo: a nuvem larga do papel em volta, preenchida para dentro
pesos = (~mineral).astype(float)
papel = np.stack([ndimage.gaussian_filter(h[..., c] * pesos, 60) / (ndimage.gaussian_filter(pesos, 60) + 1e-6)
                  for c in range(3)], -1)
razao = np.clip(h / papel, 0, 1)
borda = ndimage.gaussian_filter(mineral.astype(float), 2.0)[..., None]
camada = 255 * (1 - borda * (1 - razao))
ys, xs = np.where(mineral)
x0, y0, x1, y1 = xs.min() - 8, ys.min() - 8, xs.max() + 9, ys.max() + 9
Image.fromarray(camada[y0:y1, x0:x1].astype(np.uint8)).save(os.path.join(RAIZ, "public/pecas/ped-mineral-camada.png"))
print("mineral em", (x0, y0, x1, y1), "do quadro")
