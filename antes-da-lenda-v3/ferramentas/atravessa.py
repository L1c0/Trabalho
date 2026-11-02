#!/usr/bin/env python3
"""
Refaz o planicie-texto.mp4: o ATRAVESSA escrito letra a letra sobre o
planicie.mp4 limpo, com o Arthur passando na frente das letras.

Por que refazer: no arquivo do pacote, a máscara do Arthur também pega o
mato escuro dos lados, porque preenche cada linha entre os pixels escuros
das pontas. Com isso ela apaga o T inteiro, o alto do R e pedaços dos dois
primeiros A, e faz o segundo S piscar. Os cortes têm borda vertical.

O que foi medido no arquivo do pacote e é reproduzido aqui:
- o planicie.mp4 é o mesmo take, quadro a quadro, sem o texto;
- o texto é Montserrat 600, corpo 112,3, letra a letra sem kerning, com
  53 px (0,47 em) entre as letras, origem em x=400 e linha de base em
  y=647. Nas letras inteiras, as bordas batem a até 1,7 px;
- a cor é o creme F8F0E2 das outras palavras;
- cada letra entra inteira, sem fade, nos quadros 24, 28, 33, 37, 42, 46,
  51, 55 e 59 do arquivo. A cena usa do 17 ao 61;
- a cor segue a conversão do arquivo do pacote: BT.601, faixa tv,
  etiqueta bt470bg.

A máscara do Arthur é só o corpo dele:
- a região escura (luminância < 38) ligada à coluna mais escura perto do
  centro, limitada a 130 px dessa coluna;
- os buracos são preenchidos;
- a borda é suave: rampa de luminância de 30 a 65, até 2 px fora do miolo.
O corpo dele tem luminância de 6 a 20, e o chão em volta, de 60 a 100.

  python3 -I ferramentas/atravessa.py           # gera public/planicie-texto.mp4
  python3 -I ferramentas/atravessa.py quadros   # só os quadros de prova, em out/atravessa/

O arquivo do pacote fica guardado em public/planicie-texto-pacote.mp4.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
FONTE = str(RAIZ / 'ferramentas' / 'fontes' / 'montserrat-latin-600-normal.woff')
W, H, N = 1920, 1080, 188

TEXTO = 'ATRAVESSA'
CORPO = 112.3
ESPACO = 53.0
X0 = 400.0
BASE = 647.0
ENTRADA = [24, 28, 33, 37, 42, 46, 51, 55, 59]
COR = np.array([248, 240, 226], np.float32)
S = 4  # superamostragem, como em palavras.py

# faixa processada (o texto ocupa y 566-647, x 399-1525)
FY0, FY1 = 552, 664
FX0, FX1 = 380, 1550
LINHAS_TEXTO = slice(566 - FY0, 648 - FY0)


def letras():
    """Alfa de cada letra na faixa, em 1x: letra a letra, sem kerning, 4x reduzido em bilinear."""
    ft = ImageFont.truetype(FONTE, CORPO * S)
    out = []
    x = X0
    for ch in TEXTO:
        im = Image.new('L', ((FX1 - FX0) * S, (FY1 - FY0) * S), 0)
        ImageDraw.Draw(im).text(((x - FX0) * S, (BASE - FY0) * S), ch, font=ft, fill=255, anchor='ls')
        out.append(np.asarray(im.resize((FX1 - FX0, FY1 - FY0), Image.BILINEAR), np.float32) / 255)
        x += ft.getlength(ch) / S + ESPACO
    return out


def mascara(Y):
    """Alfa do corpo do Arthur na faixa: 1 onde ele fica na frente das letras."""
    col = Y[LINHAS_TEXTO].mean(0)
    j0, j1 = 700 - FX0, 1150 - FX0
    c = int(np.argmin(col[j0:j1])) + j0
    rot, _ = ndimage.label(Y < 38)
    ids = [i for i in np.unique(rot[LINHAS_TEXTO, c]) if i]
    corpo = np.isin(rot, ids)
    xs = np.arange(Y.shape[1])
    corpo &= (np.abs(xs - c) <= 130)[None, :]
    corpo = ndimage.binary_fill_holes(corpo)
    perto = ndimage.binary_dilation(corpo, iterations=2)
    rampa = np.clip((65 - Y) / (65 - 30), 0, 1)
    return np.where(corpo, 1.0, np.where(perto, rampa, 0.0)).astype(np.float32), c


def compoe(q, k, A):
    """Quadro k do planicie.mp4 (RGB) com as letras que já entraram."""
    vis = [a for a, e in zip(A, ENTRADA) if k >= e]
    if not vis:
        return q, None
    faixa = q[FY0:FY1, FX0:FX1].astype(np.float32)
    m, c = mascara(faixa @ np.array([0.2126, 0.7152, 0.0722], np.float32))
    a = (np.clip(sum(vis), 0, 1) * (1 - m))[..., None]
    q = q.copy()
    q[FY0:FY1, FX0:FX1] = np.clip(faixa * (1 - a) + COR * a + 0.5, 0, 255).astype(np.uint8)
    return q, (m, c)


def quadros_planicie():
    dec = subprocess.Popen(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(PUB / 'planicie.mp4'),
                            '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    for _ in range(N):
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            raise SystemExit('planicie.mp4 acabou antes de 188 quadros')
        yield np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    dec.stdout.close()
    dec.wait()


def main():
    A = letras()
    if sys.argv[1:] == ['quadros']:
        saida = RAIZ / 'out' / 'atravessa'
        saida.mkdir(parents=True, exist_ok=True)
        larguras = []
        for k, q in enumerate(quadros_planicie()):
            r, info = compoe(q, k, A)
            if info:
                m, c = info
                xs = np.where((m > 0.5)[LINHAS_TEXTO].any(0))[0]
                larguras.append((k, int(xs.min()) + FX0, int(xs.max()) + FX0))
            if k in (24, 28, 33, 37, 42, 46, 51, 55, 59, 61, 100, 150):
                Image.fromarray(r).save(saida / f'f{k:03d}.png')
        ls = [b - a for _, a, b in larguras]
        print('máscara na altura do texto: x', min(a for _, a, _ in larguras), '-', max(b for _, _, b in larguras),
              '| largura', min(ls), '-', max(ls), 'px')
        return
    orig = PUB / 'planicie-texto-pacote.mp4'
    dest = PUB / 'planicie-texto.mp4'
    if not orig.exists():
        dest.rename(orig)
    tmp = PUB / 'planicie-texto.tmp.mp4'
    enc = subprocess.Popen(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                            '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                            '-vf', 'scale=out_color_matrix=bt601:out_range=tv,format=yuv420p',
                            '-c:v', 'libx264', '-crf', '12', '-preset', 'slow',
                            '-colorspace', 'bt470bg', '-color_range', 'tv', '-movflags', '+faststart', str(tmp)],
                           stdin=subprocess.PIPE)
    for k, q in enumerate(quadros_planicie()):
        enc.stdin.write(compoe(q, k, A)[0].tobytes())
    enc.stdin.close()
    if enc.wait() != 0:
        raise SystemExit('o ffmpeg falhou')
    tmp.replace(dest)
    print(f'pronto: {dest.relative_to(RAIZ)} (o do pacote está em {orig.relative_to(RAIZ)})')


if __name__ == '__main__':
    main()
