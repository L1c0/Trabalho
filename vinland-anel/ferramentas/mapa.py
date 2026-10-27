#!/usr/bin/env python3
"""O mapa de anéis em ponto flutuante, para o compositor.

chapa/mapa-anel.png é um PNG de 16 bits em cinza: o valor de cada pixel é
a coordenada contínua de anel (0 na medula, 18→19 o anel de 993, 46→47 o
de 1021, 49 o topo da escala). O navegador decodifica PNG em 8 bits por
canal, o que daria passos de 49/255 = 0,19 anel — mais largos que a
suavidade do limiar (0,06). Aqui ele vira float32 cru (little-endian,
linha 0 em cima), já em coordenada de anel: valor / 65535 × 49.

Uso: python3 -I mapa.py <projeto>  ->  public/chapa/mapa-anel.f32
"""
import json
import os
import sys

import numpy as np
from PIL import Image

PROJ = sys.argv[1]
CH = os.path.join(PROJ, 'public/chapa')
geo = json.load(open(os.path.join(PROJ, 'src/data/geometria.json')))
m = np.asarray(Image.open(os.path.join(CH, 'mapa-anel.png')))
assert m.dtype == np.uint16 and m.shape == (geo['lado'], geo['lado']), (m.dtype, m.shape)
c = (m.astype(np.float64) / 65535.0 * geo['topo_mapa']).astype('<f4')
c.tofile(os.path.join(CH, 'mapa-anel.f32'))
cy, cx = (int(v) for v in geo['centro'][::-1])
print('mapa', c.shape, 'min', c.min(), 'max', c.max(), '| no centro', c[cy, cx], '| passo', geo['topo_mapa'] / 65535)
