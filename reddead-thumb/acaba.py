#!/usr/bin/env python3
"""Reduz as fotos de out/thumb-*.png (2560x1440) para 1280x720 e grava os JPG de envio.
  python3 -I acaba.py  ->  out/thumb-red-dead-<variante>.jpg (até 2 MB, o limite do YouTube)"""
from pathlib import Path
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent
NOMES = {'a': 'A-nao-foi-tiro', 'b': 'B-morto-por-um-papel', 'c': 'C-ele-ja-sabia', 'd': 'D-acabou-em-1890'}
for v, nome in NOMES.items():
    src = RAIZ / 'out' / f'thumb-{v}.png'
    if not src.exists():
        continue
    im = Image.open(src).convert('RGB').resize((1280, 720), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2))
    dst = RAIZ / 'out' / f'thumb-red-dead-{nome}.jpg'
    im.save(dst, quality=94, subsampling=0, optimize=True)
    print(dst.name, im.size, '%.0f KB' % (dst.stat().st_size / 1024))
