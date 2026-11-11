#!/usr/bin/env python3
"""
Tira do pacote v3 as imagens que a v4 usa e grava em public/arte/:

  python3 -I ferramentas/prepara-v4.py <pasta rd-v3 do pacote>

Na v4 os textos e os gráficos são desenhados no código. Do pacote ficam só
as fotos, recortadas dos fundos das chapas, e o fundo liso de papel escuro:

- fundo.jpg     o fundo liso (p07-turner), 2400x1350
- neve.jpg      a nevasca de Colter (p05-1899)
- garrafa.jpg   o frasco de láudano (p05b-remedios)
- atlas.jpg     o atlas Rand McNally de 1890 (p06b-mapa)
- circular.jpg  a circular da Pinkerton (p10-circular)
- arthur.jpg    o close do Arthur (p12-fecho)
"""
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
RECORTES = {
    'neve.jpg': ('p05-1899', (586, 270, 2158, 1075)),
    'garrafa.jpg': ('p05b-remedios', (1759, 449, 2050, 834)),
    'atlas.jpg': ('p06b-mapa', (619, 208, 1965, 1234)),
    'circular.jpg': ('p10-circular', (1758, 418, 2026, 816)),
    'arthur.jpg': ('p12-fecho', (1074, 235, 2021, 1104)),
}


def main():
    V = Path(sys.argv[1])
    arte = RAIZ / 'public' / 'arte'
    arte.mkdir(parents=True, exist_ok=True)
    Image.open(V / 'pecas' / 'p07-turner' / '_fundo.jpg').convert('RGB').save(arte / 'fundo.jpg', quality=92)
    for nome, (chapa, caixa) in RECORTES.items():
        im = Image.open(V / 'pecas' / chapa / '_fundo.jpg').convert('RGB').crop(caixa)
        im.save(arte / nome, quality=95, subsampling=0)
        print(nome, im.size)


if __name__ == '__main__':
    main()
