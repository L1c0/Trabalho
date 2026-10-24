#!/usr/bin/env python3
"""
Thumb no formato da referência, com frames do anime.

O que a referência faz, olhando de perto:
  1. fundo único, borrado e dessaturado — cola as três figuras num
     ambiente só, em vez de três recortes soltos
  2. as três entram com borda MACIA, não com recorte duro. Recorte duro
     em cel de anime entrega colagem na hora, porque a linha do desenho
     é limpa demais e a borda fica serrilhada
  3. o do meio em cor, os de fora cinza
  4. título enorme em sans condensada, branco, com contorno escuro

Sem o contorno escuro o título some quando o fundo clareia. É a única
parte da referência que não é gosto: é legibilidade.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import prensa as P

TW, TH = 1280, 720
UP = "/root/.claude/uploads/910b9125-9f14-5862-8a0a-396e2e4a9b5d"
OUT = "/mnt/user-data/outputs"

# (arquivo, centro do rosto em fração x/y, largura do recorte em fração)
FIGS = [
    ("7ade4eb7-image.jpg", 0.515, 0.26, 0.40),   # Thors
    ("e5efdd6a-image.jpg", 0.470, 0.42, 0.52),   # Thorfinn  <- centro
    ("1bc1b477-image.jpg", 0.500, 0.44, 0.62),   # Askeladd
]
CENTRO = 1


def recorte_rosto(arq, cx, cy, fw, alt):
    """Recorta em volta do rosto e entrega na altura pedida."""
    im = Image.open(f"{UP}/{arq}").convert("RGB")
    W, H = im.size
    w = W * fw
    h = w * 1.18                       # retrato, um pouco mais alto que largo
    x0 = int(np.clip(cx * W - w / 2, 0, W - 1))
    y0 = int(np.clip(cy * H - h * 0.42, 0, H - 1))
    c = im.crop((x0, y0, int(min(W, x0 + w)), int(min(H, y0 + h))))
    k = alt / c.height
    return c.resize((max(1, int(c.width * k)), alt), Image.LANCZOS)


def mascara_suave(w, h):
    """Borda macia: elipse esfumada, mais aberta em cima (cabelo) e
    fechando embaixo, pra figura 'dissolver' no fundo em vez de cortar."""
    yy, xx = np.mgrid[0:h, 0:w]
    nx = (xx - w / 2) / (w * 0.365)
    ny = (yy - h * 0.46) / (h * 0.56)
    r = np.sqrt(nx ** 2 + ny ** 2)
    m = np.clip((1.04 - r) / 0.16, 0, 1)
    # desce suave no pé
    m *= np.clip((h - yy) / (h * 0.30), 0, 1) ** 0.6
    # apaga nas quatro bordas do recorte. sem isso a elipse encosta no
    # limite e sobra um retangulo visivel, que entrega a colagem.
    b = int(min(w, h) * 0.07) + 1
    for eixo, n in ((1, w), (0, h)):
        ramp = np.clip(np.minimum(np.arange(n), n - 1 - np.arange(n)) / b, 0, 1)
        m *= ramp[None, :] if eixo == 1 else ramp[:, None]
    return ndimage.gaussian_filter(m, h * 0.012)


def cinza(a, resto=0.10):
    g = (a[..., 0] * 0.30 + a[..., 1] * 0.59 + a[..., 2] * 0.11)[..., None]
    return a * resto + g * (1 - resto)


# --- fundo: um dos frames, borrado e lavado -------------------------
fundo = Image.open(f"{UP}/7ade4eb7-image.jpg").convert("RGB").resize((TW, TH), Image.LANCZOS)
fundo = fundo.filter(ImageFilter.GaussianBlur(26))
F = cinza(np.asarray(fundo, float), 0.06)
F = F * 0.42 + 30                       # lava, pra figura destacar
# vinheta
yy, xx = np.mgrid[0:TH, 0:TW]
vin = 1 - 0.52 * np.clip(((xx - TW/2) / (TW*0.62))**2 + ((yy - TH/2) / (TH*0.72))**2, 0, 1)
F *= vin[..., None]

ALT_C, ALT_L = 726, 598
POS = [int(TW * 0.182), TW // 2, int(TW * 0.818)]
BASE = TH + 196   # o titulo pode cobrir o cabelo, nunca os olhos   # enquadra do peito pra cima: a cabeca tem que sair de baixo do titulo

for i, (arq, cx, cy, fw) in enumerate(FIGS):
    alt = ALT_C if i == CENTRO else ALT_L
    p = recorte_rosto(arq, cx, cy, fw, alt)
    a = np.asarray(p, float)
    if i != CENTRO:
        a = cinza(a, 0.06) * 0.74 + 26      # lados: cinza e bem abaixo
    else:
        # satura e aprofunda o centro: ele tem que ser a unica cor viva
        g0 = (a[...,0]*0.30+a[...,1]*0.59+a[...,2]*0.11)[...,None]
        a = np.clip(g0 + (a - g0) * 1.35, 0, 255)
        a = np.clip((a - 128) * 1.12 + 128 - 6, 0, 255)
    m = mascara_suave(p.width, p.height)[..., None]
    x = int(POS[i] - p.width / 2); y = BASE - p.height
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(TW, x + p.width), min(TH, y + p.height)
    sa = a[y0-y:y1-y, x0-x:x1-x]; sm = m[y0-y:y1-y, x0-x:x1-x]
    F[y0:y1, x0:x1] = F[y0:y1, x0:x1] * (1 - sm) + sa * sm

im = Image.fromarray(np.clip(F, 0, 255).astype(np.uint8))

# --- título: branco com contorno escuro -----------------------------
# acha o corpo que faz o titulo ocupar 92% da largura. A versao gerada
# pelo modelo acertou isso: titulo pequeno desperdica a faixa de cima.
alvo = TW * 0.88
corpo = 172
for c in range(140, 380, 2):
    teste = P.chapa(TW, TH)
    if P.linha(teste, "CEM SOCOS", P.fonte("anton.ttf", c), 0, 0,
               tracking=-0.014) <= alvo:
        corpo = c
    else:
        break
ch = P.chapa(TW, TH)
f = P.fonte("anton.ttf", corpo)
P.linha(ch, "CEM SOCOS", f, TW // 2, 10, tracking=-0.014, semente=3,
        tremor=1.1, ancora="centro")
print("corpo do titulo:", corpo)
t = np.asarray(ch, float) / 255
cont = np.clip(ndimage.gaussian_filter(t, 6.5) * 4.2, 0, 1)[..., None]
tt = np.clip(ndimage.gaussian_filter(t, 0.7) * 1.7, 0, 1)[..., None]
A = np.asarray(im, float)
A = A * (1 - cont * 0.82) + np.array([14, 13, 11], float) * cont * 0.82
A = A * (1 - tt) + np.array([252, 251, 248], float) * tt

# grão leve, só pra não ficar liso de render
g = np.random.default_rng(9)
A += g.normal(0, 3.2, (TH, TW, 1))
P.salvar(np.clip(A, 0, 255), f"{OUT}/vin-thumb-H.jpg", q=95)
print("thumb H (anime, formato da referencia)")

ims = [("B   mangá, prensa", "vin-thumb-B.jpg"),
       ("G   trio mangá", "vin-thumb-G.jpg"),
       ("H   trio anime", "vin-thumb-H.jpg")]
sh = Image.new("RGB", (1340, 500), (246, 246, 244))
d = ImageDraw.Draw(sh); fo = P.fonte("oswald.ttf", 21)
for i, (rot, fn) in enumerate(ims):
    sh.paste(Image.open(f"{OUT}/{fn}").resize((420, 236), Image.LANCZOS), (16+i*436, 30))
    d.text((16+i*436, 6), rot, font=fo, fill=(20, 20, 20))
d.text((16, 290), "NA GRADE  ·  210 px", font=fo, fill=(95, 95, 95))
for i, (rot, fn) in enumerate(ims):
    sh.paste(Image.open(f"{OUT}/{fn}").resize((210, 118), Image.LANCZOS), (16+i*230, 320))
sh.save(f"{OUT}/vin-thumb-anime.jpg", quality=94)
print("comparacao")
