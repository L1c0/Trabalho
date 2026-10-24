#!/usr/bin/env python3
"""
Thumb de três figuras recortadas, no formato da referência.

A referência faz três coisas, e a terceira é a que eu tinha perdido:
  1. título enorme em sans condensada atravessando o topo
  2. o do meio destacado, os de fora apagados
  3. as figuras RECORTADAS do fundo, não coladas como retângulo

O recorte é o que faz a composição existir. Sem ele são três fotos numa
fileira; com ele é um grupo.

Como recorta: o fundo é a região CLARA conectada à borda. A figura tem
contorno preto fechado, então o alagamento para nela. Funciona porque
quadro de mangá com fundo claro tem exatamente essa topologia.

Trio: Thors, Thorfinn, Askeladd. Pai, filho, assassino. É o triângulo do
arco da guerra e são três rostos que não se confundem.
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import prensa as P

TW, TH = 1280, 720
M = "/mnt/user-data/outputs/vinland/public/manga"
OUT = "/mnt/user-data/outputs"
TURFA = (0x12, 0x11, 0x0E)
FERRUGEM = (0x7E, 0x42, 0x26)
PAPEL_T = (0xDC, 0xD7, 0xCA)


def recorta_fundo(nome, limiar=0.74):
    im = Image.open(f"{M}/{nome}.png").convert("L")
    a = np.asarray(im, float) / 255
    rot, n = ndimage.label(a > limiar)
    borda = set(rot[0, :]) | set(rot[-1, :]) | set(rot[:, 0]) | set(rot[:, -1])
    borda.discard(0)
    fig = ~np.isin(rot, list(borda))
    fig = ndimage.binary_fill_holes(ndimage.binary_closing(fig, np.ones((5, 5))))
    r2, n2 = ndimage.label(fig)
    if n2:
        t = np.bincount(r2.ravel()); t[0] = 0
        fig = r2 == t.argmax()
    return a, fig


def peca(nome, altura):
    """Devolve a cobertura de tinta já recortada, na altura pedida."""
    a, fig = recorta_fundo(nome)
    ys, xs = np.where(fig)
    a = a[ys.min():ys.max()+1, xs.min():xs.max()+1]
    f = fig[ys.min():ys.max()+1, xs.min():xs.max()+1]
    cob = np.clip((0.95 - a) / (0.95 - 0.14), 0, 1) * f
    im = Image.fromarray((cob * 255).astype(np.uint8))
    k = altura / im.height
    return im.resize((max(1, int(im.width * k)), altura), Image.LANCZOS)


def cola(alvo, p, cx, base):
    """Cola pelo centro horizontal e pela BASE — figura apoia no chão."""
    arr = np.asarray(p, float) / 255
    h, w = arr.shape
    x, y = int(cx - w / 2), int(base - h)
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(TW, x + w), min(TH, y + h)
    if x1 <= x0 or y1 <= y0:
        return alvo
    alvo[y0:y1, x0:x1] = np.maximum(alvo[y0:y1, x0:x1],
                                    arr[y0-y:y1-y, x0-x:x1-x])
    return alvo


FAIXA = 0.30                      # altura da tarja do título
ALT_C, ALT_L = 505, 425           # centro maior que os lados
BASE = TH + 8                     # sangra um fio embaixo

lados = np.zeros((TH, TW))
lados = cola(lados, peca("v02-thors", ALT_L), 232, BASE)
lados = cola(lados, peca("v03-askeladd-close", ALT_L), TW - 232, BASE)
centro = cola(np.zeros((TH, TW)), peca("v12b-thorfinn-retrato", ALT_C),
              TW // 2, BASE)
# o do meio fica na frente: onde ele pinta, os de fora somem
lados = lados * (1 - np.clip(ndimage.binary_dilation(centro > 0.02,
                                                     np.ones((9, 9))), 0, 1))


def tarja_titulo(texto, corpo):
    ch = P.chapa(TW, TH)
    f = P.fonte("anton.ttf", corpo)
    P.linha(ch, texto, f, TW // 2, 16, tracking=-0.012, semente=3,
            tremor=1.3, ancora="centro")
    t = np.clip(ndimage.gaussian_filter(np.asarray(ch, float)/255, 0.9) * 1.9, 0, 1)
    g = np.random.default_rng(77)
    yy = np.linspace(0, 1, TH)[:, None]
    b = ndimage.gaussian_filter(g.random((TH, TW)), 30)
    b = (b - b.mean()) / (b.std() + 1e-9) * 0.022
    faixa = np.clip((FAIXA + b - yy) / 0.055, 0, 1) * 0.95
    return np.clip(faixa * (1 - t), 0, 1)


def monta(quente):
    folha = P.papel(TW, TH, PAPEL_T, semente=11, aspereza=1.0)
    # os de fora: tinta fraca, como chapa que não recebeu pressão
    folha = P.imprimir(folha, Image.fromarray((lados*255).astype(np.uint8)),
                       tinta=TURFA, semente=12, ganho=0.6, mordida=0.16,
                       batida=0.3, falha=0.5, torcao=0.22, forca=0.44)
    # o do meio: tinta cheia
    folha = P.imprimir(folha, Image.fromarray((centro*255).astype(np.uint8)),
                       tinta=FERRUGEM if quente else TURFA, semente=13,
                       ganho=0.72, mordida=0.36, batida=0.24, falha=0.4,
                       torcao=0.11, forca=1.0 if quente else 1.0)
    if quente:   # segunda passada preta por cima, só o traço
        folha = P.imprimir(folha, Image.fromarray(
            (np.clip((centro-0.45)/0.55, 0, 1)*255).astype(np.uint8)),
            tinta=TURFA, semente=15, ganho=0.6, mordida=0.3, batida=0.24,
            falha=0.4, torcao=0.09)
    tt = tarja_titulo("CEM SOCOS", 168)
    return P.imprimir(folha, Image.fromarray((tt*255).astype(np.uint8)),
                      tinta=TURFA, semente=14, ganho=0.55, mordida=0.2,
                      batida=0.28, falha=0.85, torcao=0.08)


P.salvar(monta(False), f"{OUT}/vin-thumb-G.jpg", q=95)
P.salvar(monta(True),  f"{OUT}/vin-thumb-F.jpg", q=95)
print("F (meio em ferrugem) e G (meio em preto) prontos")

ims = [("B   a atual", "vin-thumb-B.jpg"),
       ("G   trio, meio em preto", "vin-thumb-G.jpg"),
       ("F   trio, meio em ferrugem", "vin-thumb-F.jpg")]
sh = Image.new("RGB", (1340, 500), (246, 246, 244))
d = ImageDraw.Draw(sh); fo = P.fonte("oswald.ttf", 21)
for i, (rot, f) in enumerate(ims):
    sh.paste(Image.open(f"{OUT}/{f}").resize((420, 236), Image.LANCZOS), (16+i*436, 30))
    d.text((16+i*436, 6), rot, font=fo, fill=(20, 20, 20))
d.text((16, 290), "NA GRADE  ·  210 px", font=fo, fill=(95, 95, 95))
for i, (rot, f) in enumerate(ims):
    sh.paste(Image.open(f"{OUT}/{f}").resize((210, 118), Image.LANCZOS), (16+i*230, 320))
sh.save(f"{OUT}/vin-thumb-tres.jpg", quality=94)
print("comparacao")
