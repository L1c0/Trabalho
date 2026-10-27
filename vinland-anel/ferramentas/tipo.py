#!/usr/bin/env python3
"""O tamanho de cada peça de tipo/ (largura, altura), para posicionar sem
esperar a imagem carregar: rot-aneis vai em x = 150 + largura do numeral + 30.

Uso: python3 -I tipo.py <projeto>  ->  src/data/tipo.json
"""
import json
import os
import sys

from PIL import Image

PROJ = sys.argv[1]
T = os.path.join(PROJ, 'public/tipo')
med = {f[:-4]: list(Image.open(os.path.join(T, f)).size) for f in sorted(os.listdir(T)) if f.endswith('.png')}
json.dump(med, open(os.path.join(PROJ, 'src/data/tipo.json'), 'w'), indent=1)
print(len(med), 'peças')
