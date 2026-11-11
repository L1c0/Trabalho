#!/usr/bin/env python3
"""Folha de conferência: junta quadros de out/quadros numa imagem só.
  python3 -I ferramentas/folha.py saida.jpg colunas largura q1.png q2.png ..."""
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
arqs = sys.argv[4:]
h = w * 9 // 16
tela = Image.new('RGB', (cols * (w + 4), ((len(arqs) + cols - 1) // cols) * (h + 4)), (70, 0, 70))
dr = ImageDraw.Draw(tela)
for k, a in enumerate(arqs):
    im = Image.open(a).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = (k % cols) * (w + 4), (k // cols) * (h + 4)
    tela.paste(im, (x, y))
    dr.text((x + 6, y + 4), a.split('/')[-1], fill=(255, 255, 0))
tela.save(out, quality=88)
