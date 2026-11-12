#!/usr/bin/env python3
"""Folha de contato dos quadros de conferência: python3 -I ferramentas/folha.py <saída.jpg> <colunas> <png> ..."""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

saida, cols, arqs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(a).convert('RGB') for a in arqs]
w, h = ims[0].size
lin = (len(ims) + cols - 1) // cols
folha = Image.new('RGB', (cols * (w + 6), lin * (h + 6)), (40, 40, 40))
d = ImageDraw.Draw(folha)
for i, (im, a) in enumerate(zip(ims, arqs)):
    x, y = (i % cols) * (w + 6), (i // cols) * (h + 6)
    folha.paste(im, (x, y))
    d.rectangle((x, y, x + 74, y + 16), fill=(0, 0, 0))
    d.text((x + 4, y + 2), Path(a).stem.split('-')[-1], fill=(0, 255, 0))
folha.save(saida, quality=86)
print(saida, folha.size)
