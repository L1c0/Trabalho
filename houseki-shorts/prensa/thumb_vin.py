#!/usr/bin/env python3
"""
Thumbnail do Vinland, pela prensa.

A identidade do canal é tipo branco riscado sobre arte em P&B. Aqui isso
não é efeito: é UMA chapa só, com a letra como área não imprimente. A
tinta falha em volta da letra, nunca dentro dela.

O teste que vale é a 210 px, que é o tamanho real na grade do YouTube.
Thumb que só funciona em 1280 não funciona.
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import prensa as P

TW, TH = 1280, 720
MG = "/mnt/user-data/outputs/vinland/public/manga/v11-sem-inimigos.png"
OUT = "/mnt/user-data/outputs"

TURFA = (0x12, 0x11, 0x0E)
PAPEL_T = (0xE2, 0xDE, 0xD2)


def recorte(fx0, fy0, fx1, fy1, branco=0.97, preto=0.12):
    """Recorta em fração, preenche 1280x720, devolve chapa.

    Pontos de branco e preto BEM abertos. Apertei primeiro (0,93/0,26) e
    o rosto virou borrão escuro a 210 px — e o rosto é a imagem que para
    o scroll. O contraste quem dá é a tarja, não a curva da arte.
    """
    im = Image.open(MG).convert("L")
    W, H = im.size
    c = im.crop((int(W * fx0), int(H * fy0), int(W * fx1), int(H * fy1)))
    c = c.resize((TW, TH), Image.LANCZOS)
    a = np.asarray(c, float) / 255
    cob = np.clip((branco - a) / (branco - preto), 0, 1)
    return Image.fromarray((cob * 255).astype(np.uint8))


def tarja(arte, ate=0.56, queda=0.17, densidade=0.90, semente=0):
    """Tarja chapada sob o tipo, com a arte sobreimpressa por dentro.

    O vazado precisa de tinta em volta da letra. Medir "onde a arte é
    escura" não resolve aqui: o cabelo é claro, o rosto é escuro, e a
    média não discrimina nada — testei, dava o mesmo número pros três
    recortes.

    A impressão resolve isso há 500 anos com uma tarja. Aqui ela não tem
    borda reta: a queda é irregular e ruidosa, como chapa que recebeu
    mais tinta de um lado. O desenho continua aparecendo por dentro, em
    sobreimpressão, então não vira retângulo de software.
    """
    g = np.random.default_rng(semente + 404)
    a = np.asarray(arte, float) / 255
    xx = np.linspace(0, 1, TW)[None, :]
    borda = ndimage.gaussian_filter(g.random((TH, TW)), 26)
    borda = (borda - borda.mean()) / (borda.std() + 1e-9) * 0.035
    t = np.clip((ate + borda - xx) / queda, 0, 1) * densidade
    return Image.fromarray((np.clip(t + a * 0.30, 0, 1) * 255).astype(np.uint8))


def corpo_que_cabe(linhas, largura, teto):
    """Maior corpo de Anton em que a linha mais longa cabe na largura."""
    for c in range(teto, 70, -4):
        f = P.fonte("anton.ttf", c)
        ch = P.chapa(TW, TH)
        pior = max(P.linha(ch, l, f, 0, 0, tracking=-0.012) for l in linhas)
        if pior <= largura:
            return c
    return 70


def bloco_tipo(linhas, corpo, x, topo, tracking=-0.012, semente=1,
               rodape=None, entrelinha=0.92):
    """Desenha o tipo e devolve a chapa + a caixa de tinta real."""
    ch = P.chapa(TW, TH)
    f = P.fonte("anton.ttf", corpo)
    passo = int(corpo * entrelinha)
    for i, l in enumerate(linhas):
        P.linha(ch, l, f, x, topo + i * passo, tracking=tracking,
                semente=semente * 10 + i, tremor=1.5)
    if rodape:
        fr = P.fonte("oswald.ttf", 32)
        # posiciona pelo fundo REAL do tipo, não pela métrica da fonte
        _, _, _, fundo = P.caixa_tinta(ch)
        P.linha(ch, rodape, fr, x + 4, fundo + 26, tracking=0.2,
                semente=semente + 77)
    return ch, P.caixa_tinta(ch)


def monta(arte, ch_tipo, semente=1):
    folha = P.papel(TW, TH, PAPEL_T, semente=semente, aspereza=1.1)
    ch_arte = P.colar_chapa(P.chapa(TW, TH), arte, 0, 0)
    unica = P.reservar(ch_arte, ch_tipo, folga=1.1)
    return P.imprimir(folha, unica, tinta=TURFA, semente=semente + 5,
                      ganho=0.65, mordida=0.26, batida=0.26, falha=0.45,
                      torcao=0.11, forca=1.0)


def encaixa(linhas, corpo, x, rodape, semente, alvo_centro=0.50):
    """Centra o bloco verticalmente pela caixa de tinta, não pelo chute.
    Duas passadas: desenha, mede, redesenha no lugar certo."""
    ch, cx = bloco_tipo(linhas, corpo, x, 200, semente=semente, rodape=rodape)
    alt = cx[3] - cx[1]
    topo = int(TH * alvo_centro - alt / 2) - (cx[1] - 200)
    ch, cx = bloco_tipo(linhas, corpo, x, topo, semente=semente, rodape=rodape)
    return ch, cx


# ------------------------------------------------------------------ #
# Os três recortes evitam o balão (x 0,66–0,86 / y 0,14–0,28): a 210 px
# ele vira uma bolha branca que o olho lê como erro.
# ------------------------------------------------------------------ #
VAR = [
    ("A", (0.085, 0.175, 0.665, 0.415), ["CEM", "SOCOS"], 54,
     "SEM REVIDAR UMA VEZ", 3),
    ("B", (0.085, 0.175, 0.665, 0.415), ["CEM", "SOCOS"], 54, None, 7),
    ("C", (0.075, 0.180, 0.655, 0.420), ["NÃO", "REVIDOU"], 52,
     "VINLAND SAGA, CAP. 96", 11),
]

feitos = []
for nome, cx, linhas, x, rodape, sem in VAR:
    arte = recorte(*cx)
    ate = 0.58 if len(max(linhas, key=len)) <= 5 else 0.64
    arte = tarja(arte, ate=ate, semente=sem)
    corpo = corpo_que_cabe(linhas, int(TW * ate) - x - 40, 272)
    print(f"  {nome}: tarja ate {ate:.0%}  ->  corpo {corpo}")
    ch_tipo, caixa = encaixa(linhas, corpo, x, rodape, sem)
    arr = monta(arte, ch_tipo, semente=sem)
    P.salvar(arr, f"{OUT}/vin-thumb-{nome}.jpg", q=95)
    oc = (caixa[3] - caixa[1]) / TH
    print(f"thumb {nome}  tipo ocupa {oc:.0%} da altura  caixa {caixa}")
    feitos.append(nome)

# --- a prova: 210 px, o tamanho na grade ---------------------------
grandes = [Image.open(f"{OUT}/vin-thumb-{n}.jpg") for n in feitos]
sh = Image.new("RGB", (1300, 520), (246, 246, 244))
d = ImageDraw.Draw(sh)
fo = P.fonte("oswald.ttf", 22)
for i, g in enumerate(grandes):
    sh.paste(g.resize((410, 231), Image.LANCZOS), (18 + i * 422, 32))
    d.text((18 + i * 422, 4), feitos[i], font=fo, fill=(20, 20, 20))
d.text((18, 292), "COMO APARECE NA GRADE DO YOUTUBE  ·  210 px", font=fo,
       fill=(95, 95, 95))
for i, g in enumerate(grandes):
    sh.paste(g.resize((210, 118), Image.LANCZOS), (18 + i * 230, 330))
sh.save(f"{OUT}/vin-thumb-comparacao.jpg", quality=94)
print("comparacao pronta")
