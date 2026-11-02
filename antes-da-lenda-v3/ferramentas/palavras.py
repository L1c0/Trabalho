#!/usr/bin/env python3
"""
As quatro palavras que não vieram no pacote: w08, w09, w10 e w11.

Seguem o padrão medido nas sete que vieram (w01 a w07):
- o PNG tem o tamanho exato do pos.json e é recortado rente à tinta;
- a cor é chapada, e só o alfa varia;
- a caixa alta é Montserrat 600, com espaço largo entre as letras; a
  ligação é Pinyon Script, sem espaço extra;
- são três tintas: creme F8F0E2 (nascer e planície), fria D8E9EE (cidade)
  e ouro FAE8C4 (mercado).

O desenho segue o que reproduz as sete originais (`conferir` mede isso):
letra a letra, sem kerning, em 4x, reduzido com filtro bilinear. Com essa
receita, a borda tem a mesma maciez das originais (91 a 96% dos pixels
parciais), e o corpo que dá o tamanho delas fica a ±1,5 px do pos.json.

Para cada palavra, o corpo parte do pos.json e anda em décimos de px até a
altura bater. Depois o espaço entre as letras é resolvido para a largura
bater.

  python3 -I ferramentas/palavras.py            # gera public/w08..w11.png
  python3 -I ferramentas/palavras.py conferir   # refaz w01..w07 e compara

As fontes estão em ferramentas/fontes/ (Fontsource 5.1.0, licença OFL).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FONTES = RAIZ / 'ferramentas' / 'fontes'
MONT = str(FONTES / 'montserrat-latin-600-normal.woff')
PINY = str(FONTES / 'pinyon-script-latin-400-normal.woff')
S = 4  # superamostragem
FILTRO = Image.BILINEAR
KERN = False  # as originais não têm kerning (AV de AVISOU)

CREME = (248, 240, 226)  # w01, w02, w07
FRIA = (216, 233, 238)   # w03, w04
OURO = (250, 232, 196)   # w05, w06

NOVAS = {
    'w08': CREME,  # f409, planície
    'w09': FRIA,   # f454, cidade
    'w10': OURO,   # f484, mercado
    'w11': CREME,  # f615, close do Arthur: quente, o mesmo creme da abertura
}


def fonte_de(texto):
    return PINY if texto[0].islower() else MONT


def tinta(texto, fonte, corpo, espaco):
    """Alfa em 1x, recortado rente à tinta. `espaco` é em px de 1x."""
    ft = ImageFont.truetype(fonte, corpo * S)
    asc, desc = ft.getmetrics()
    m = int(corpo * S)
    larg = int(ft.getlength(texto) + espaco * S * len(texto)) + 2 * m
    alt = asc + desc + 2 * m
    larg += (-larg) % S
    alt += (-alt) % S
    im = Image.new('L', (larg, alt), 0)
    d = ImageDraw.Draw(im)
    base = m + asc
    if espaco == 0:
        d.text((m, base), texto, font=ft, fill=255, anchor='ls')
    else:
        # letra a letra: avanço de cada letra + espaço
        for i, ch in enumerate(texto):
            if ch == ' ':
                continue
            if KERN:
                x = m + ft.getlength(texto[: i + 1]) - ft.getlength(ch) + i * espaco * S
            else:
                x = m + sum(ft.getlength(c) for c in texto[:i]) + i * espaco * S
            d.text((x, base), ch, font=ft, fill=255, anchor='ls')
    a = np.asarray(im.resize((larg // S, alt // S), FILTRO))
    ys, xs = np.nonzero(a)
    return a[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]


def ajusta(texto, w, h, corpo0):
    """Devolve (corpo, espaco, alfa) com a tinta exatamente w x h."""
    fonte = fonte_de(texto)
    corpos = sorted({round(corpo0 + d / 10, 1) for d in range(-60, 61)}, key=lambda c: abs(c - corpo0))
    if fonte == PINY:
        # sem espaço extra: só o corpo anda; fica o mais perto nas duas medidas
        melhor = None
        for c in corpos:
            a = tinta(texto, fonte, c, 0)
            erro = abs(a.shape[0] - h) + abs(a.shape[1] - w)
            if melhor is None or erro < melhor[0]:
                melhor = (erro, c, a)
            if erro == 0:
                break
        return melhor[1], 0.0, melhor[2]
    for c in corpos:
        if tinta(texto, fonte, c, 0).shape[0] != h:
            continue
        lo, hi = 0.0, float(c)
        for _ in range(40):
            e = (lo + hi) / 2
            a = tinta(texto, fonte, c, e)
            if a.shape[1] < w:
                lo = e
            elif a.shape[1] > w:
                hi = e
            else:
                return c, e, a
    raise SystemExit(f'{texto}: nenhum corpo perto de {corpo0} dá {w}x{h}')


def encaixa(a, w, h):
    """Recorta ou completa com transparente, centrado, até w x h."""
    out = np.zeros((h, w), np.uint8)
    hh, ww = min(h, a.shape[0]), min(w, a.shape[1])
    sy, sx = (a.shape[0] - hh) // 2, (a.shape[1] - ww) // 2
    dy, dx = (h - hh) // 2, (w - ww) // 2
    out[dy : dy + hh, dx : dx + ww] = a[sy : sy + hh, sx : sx + ww]
    return out


def main():
    pos = json.loads((RAIZ / 'src' / 'pos.json').read_text(encoding='utf-8'))
    if sys.argv[1:] == ['conferir']:
        for k in ['w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'w07']:
            p = pos[k]
            c, e, a = ajusta(p['texto'], p['w'], p['h'], p['corpo'])
            a = encaixa(a, p['w'], p['h']).astype(float)
            o = np.asarray(Image.open(RAIZ / 'public' / p['peca']).convert('RGBA'))[..., 3].astype(float)
            # sobreposição da tinta (alfa > 127), no melhor deslocamento de até 2 px
            iou = max(
                ((np.roll(a, (dy, dx), (0, 1)) > 127) & (o > 127)).sum()
                / ((np.roll(a, (dy, dx), (0, 1)) > 127) | (o > 127)).sum()
                for dy in range(-2, 3)
                for dx in range(-2, 3)
            )
            macio = ((a > 0) & (a < 255)).sum() / ((o > 0) & (o < 255)).sum()
            print(f"{k} {p['texto']!r:24} corpo {p['corpo']} -> {c:5.1f}  espaço {e:4.1f} px ({e / c:.3f} em)  "
                  f"sobreposição {iou:.2f}  borda {macio:.2f}")
        return
    for k, cor in NOVAS.items():
        p = pos[k]
        c, e, a = ajusta(p['texto'], p['w'], p['h'], p['corpo'])
        tam = a.shape
        a = encaixa(a, p['w'], p['h'])
        rgba = np.zeros((p['h'], p['w'], 4), np.uint8)
        rgba[..., :3] = cor
        rgba[..., 3] = a
        Image.fromarray(rgba, 'RGBA').save(RAIZ / 'public' / p['peca'], optimize=True)
        print(f"{p['peca']} {p['texto']!r:22} {p['w']}x{p['h']} (tinta {tam[1]}x{tam[0]})  "
              f"corpo {p['corpo']} -> {c}  espaço {e:.1f} px ({e / c:.3f} em)  cor #{bytes(cor).hex().upper()}")


if __name__ == '__main__':
    main()
