#!/usr/bin/env python3
"""
Reduz os planos de imagem uma vez, com Lanczos, para o tamanho em que eles
terminam o empurrão: 1,05 × 1080×1920 = 1134×2016.

O render é em 1x: a folha e as peças de tipo saem pixel a pixel. Assim, o
Chrome só reamostra os planos entre 0,95x e 1x, perto da identidade, e o
retícula do mangá não vira moiré. A redução pesada (1350 → 1134) é feita
aqui, com filtro bom.

  python3 -I ferramentas/planos.py   # public/s*-p*.jpg -> public/planos/
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
saida = PUB / 'planos'
saida.mkdir(exist_ok=True)
for f in sorted(PUB.glob('s?-p*.jpg')):
    im = Image.open(f).convert('RGB')
    if im.size != (1350, 2400):
        raise SystemExit(f'{f.name}: {im.size}, esperado 1350x2400')
    im.resize((1134, 2016), Image.LANCZOS).save(saida / f.name, quality=95, subsampling=0)
    print(f'{f.name} -> planos/{f.name}')
