#!/usr/bin/env python3
"""Folha de contato dos quadros verticais: python3 -I folha_de_contato.py saida.png q1.png q2.png ..."""
import sys
from PIL import Image, ImageDraw

saida, arqs = sys.argv[1], sys.argv[2:]
col = min(5, len(arqs))
lw, lh = 324, 576
linhas = (len(arqs) + col - 1) // col
o = Image.new('RGB', (col * (lw + 8), linhas * (lh + 26)), (40, 40, 40))
d = ImageDraw.Draw(o)
for i, a in enumerate(arqs):
    im = Image.open(a).convert('RGB').resize((lw, lh), Image.LANCZOS)
    x, y = (i % col) * (lw + 8), (i // col) * (lh + 26)
    o.paste(im, (x, y + 22))
    d.text((x + 4, y + 4), a.split('/')[-1], fill=(230, 230, 230))
o.save(saida)
