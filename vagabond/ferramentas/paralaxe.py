#!/usr/bin/env python3
"""
Profundidade: raro, caro, e só em três momentos (a chegada em Ganryūjima, a
baleia, o fecho no picanço).

Não existe separação automática (o escuro do ukiyo-e é contorno de tudo):
cada plano é recortado à mão aqui. As regiões são desenhadas olhando a
gravura (coordenadas em px da original); dentro delas o GrabCut decide a
borda pela cor, e nunca sai delas. O plano de trás leva o buraco tapado por
reflexo da textura vizinha (sumi.tapar), e o da frente é um recorte opaco
com papel próprio.

Limites: nenhum plano passa de 13% de ganho de escala no movimento inteiro,
e a deriva horizontal fica abaixo de 3,5% da largura (montagem.plano confere).
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montagem as M  # noqa: E402
from montagem import empurra, empurra_para  # noqa: E402

G01 = 'g01-ganryujima-triptico.webp'
G02 = 'g02-baleia-triptico.webp'
CACHE = os.path.join(M.PUB, 'pecas', 'mascaras')


def _mascara(nome, fn):
    """Máscara (bool, metade da resolução da original), calculada uma vez."""
    arq = os.path.join(CACHE, nome + '.png')
    if os.path.exists(arq):
        return np.asarray(Image.open(arq)) > 127
    mk = fn()
    os.makedirs(CACHE, exist_ok=True)
    Image.fromarray((mk * 255).astype(np.uint8)).save(arq, optimize=True)
    return mk


def _no_tamanho(mk, iw, ih, suave=0.8):
    a = np.asarray(Image.fromarray((mk * 255).astype(np.uint8)).resize((iw, ih), Image.BILINEAR), float) / 255
    return ndimage.gaussian_filter(a, suave) if suave else a


def alfa(nome, mk):
    return (nome, lambda iw, ih: _no_tamanho(mk, iw, ih))


def buraco(nome, mk, folga=4):
    return (nome, lambda iw, ih: ndimage.binary_dilation(_no_tamanho(mk, iw, ih, 0) > 0.5, iterations=folga))


def _grabcut(a, rotulos, iteracoes=6):
    import cv2
    bg = np.zeros((1, 65), np.float64)
    fg = np.zeros((1, 65), np.float64)
    m = rotulos.copy()
    cv2.grabCut(np.ascontiguousarray(a[..., ::-1]), m, None, bg, fg, iteracoes, cv2.GC_INIT_WITH_MASK)
    return (m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)


def _limpa(mk, menor=400, buraco_menor=60):
    rot, _ = ndimage.label(mk)
    t = np.bincount(rot.ravel())
    t[0] = 0
    mk = np.isin(rot, np.where(t > menor)[0])
    bur, _ = ndimage.label(~mk)
    tb = np.bincount(bur.ravel())
    tb[0] = 0
    return mk | np.isin(bur, np.where(tb < buraco_menor)[0])


class _Desenho:
    """Polígonos e faixas em px da original, rasterizados na metade."""

    def __init__(self, W, H, F=0.5):
        self.W, self.H, self.F = W, H, F

    def poly(self, pts):
        m = Image.new('L', (self.W, self.H), 0)
        ImageDraw.Draw(m).polygon([(x * self.F, y * self.F) for x, y in pts], fill=255)
        return np.asarray(m) > 0

    def faixa(self, pts, meia):
        m = Image.new('L', (self.W, self.H), 0)
        d = ImageDraw.Draw(m)
        p = [(x * self.F, y * self.F) for x, y in pts]
        d.line(p, fill=255, width=int(2 * meia * self.F), joint='curve')
        for x, y in p:
            d.ellipse((x - meia * self.F, y - meia * self.F, x + meia * self.F, y + meia * self.F), fill=255)
        return np.asarray(m) > 0


def _metade(src):
    im = Image.open(os.path.join(M.ORI, src)).convert('RGB')
    W, H = im.width // 2, im.height // 2
    return np.asarray(im.resize((W, H), Image.LANCZOS)), W, H


# --------------------------------------------------------------------- #
#  GANRYŪJIMA: os pinheiros à frente                                     #
# --------------------------------------------------------------------- #
def mascara_g01():
    import cv2
    a, W, H = _metade(G01)
    D = _Desenho(W, H)
    lum = a.astype(float) @ np.array([0.3, 0.59, 0.11])
    prov = np.zeros((H, W), bool)
    certo = np.zeros((H, W), bool)
    # árvore da esquerda: tronco, galho do topo
    tronco = [(120, 1950), (150, 1500), (195, 1000), (235, 700), (270, 500), (330, 300), (420, 150), (520, 40),
              (560, 0)]
    prov |= D.faixa(tronco, 100)
    certo |= D.faixa(tronco, 22)
    prov |= D.poly([(300, 0), (1080, 0), (1080, 360), (900, 360), (640, 200), (420, 180), (300, 120)])
    # galho do meio: as agulhas pendem sobre o mar, da mesma cor dele; só
    # o que é bem mais escuro que o mar
    meio = D.poly([(160, 600), (480, 590), (620, 700), (860, 960), (860, 1130), (700, 1130), (520, 900), (160, 800)])
    # galho do topo, no centro
    prov |= D.poly([(1780, 0), (2420, 0), (2420, 400), (2120, 400), (1800, 200)])
    # a massa da direita: tronco, morro e a plateia sentada nele
    prov |= D.poly([(2580, 0), (3840, 0), (3840, 1130), (3450, 1150), (3300, 1100), (3150, 1090), (3110, 1000),
                    (3110, 760), (3060, 640), (2990, 580), (2900, 540), (2800, 500), (2700, 440), (2600, 380),
                    (2580, 330)])
    certo |= D.faixa([(2600, 260), (2750, 370), (2900, 470), (3050, 560), (3150, 680), (3250, 850), (3350, 1000)],
                     22)
    certo |= D.faixa([(3130, 0), (3130, 330)], 22)
    # o monte atrás do tronco é fundo
    fundo = D.poly([(2930, 560), (2960, 470), (3010, 420), (3070, 378), (3150, 380), (3235, 420), (3240, 470),
                    (3180, 520), (3120, 580), (3000, 590)])
    prov &= lum < 170                       # céu nunca é pinheiro
    prov |= meio & (lum < 112)
    certo |= prov & (lum < 55)
    certo &= ~fundo
    rot = np.full((H, W), cv2.GC_BGD, np.uint8)
    rot[prov] = cv2.GC_PR_FGD
    rot[certo] = cv2.GC_FGD
    rot[fundo] = cv2.GC_BGD
    mk = _limpa(_grabcut(a, rot))
    # só a massa da direita anda. A árvore da esquerda e o galho do centro
    # ficam no fundo: com eles à frente o buraco que abrem cai sobre barco e
    # plateia, e o tapa-buraco vira fantasma
    mk[:, :2585 // 2] = False
    # o mar e o céu entre os braços da plateia e entre os galhos andam junto
    # (são lisos, ninguém vê); buraco dentro da massa vira fantasma
    return ndimage.binary_fill_holes(mk)


def ganryujima(m, de, ate):
    """A chegada em Ganryūjima: o tríptico inteiro; o pinheiro da direita (e a
    plateia no morro dele) cresce 3% mais que o resto ao longo do plano."""
    f = m.folha('ganryujima', tom='washi')
    mk = _mascara('g01-pinho-v3', mascara_g01)
    X, Wd = 0, 1920
    Ht = Wd * 1950 / 3840
    Y = (1080 - Ht) / 2
    comum = dict(tipo='cor', res=1.15, achatar=600, branco_pct=85)
    f.peca('fundo', G01, X, Y, wd=Wd, buraco=buraco('g01-pinho-v3', mk), **comum)
    f.peca('pinho', G01, X, Y, wd=Wd, alfa=alfa('g01-pinho-v3', mk), plano='pinho', **comum)
    # a deriva para a esquerda segura a borda de dentro da massa (x ~ 1450)
    # quase parada: ela cresce para fora, para a borda da gravura (recortada)
    m.plano(de, ate, f, *empurra(1.0, 960, 540, ate - de), px={'fundo': [0, 0, 0], 'pinho': [0.03, -0.008, 0]},
            clip=[X, Y, X + Wd, Y + Ht])


# --------------------------------------------------------------------- #
#  A BALEIA: o animal e o Musashi nas costas dele, à frente do mar       #
# --------------------------------------------------------------------- #
def mascara_g02():
    import cv2
    a, W, H = _metade(G02)
    D = _Desenho(W, H)
    af = a.astype(float)
    r, b = af[..., 0], af[..., 2]
    lum = af @ np.array([0.3, 0.59, 0.11])
    mx, mn = af.max(-1), af.min(-1)
    sat = (mx - mn) / (mx + 1e-6)
    azul = (b - r > 28) & (b > 90)                   # mar
    preto = lum < 45
    creme = (r > 150) & (r - b > 18) & (sat > 0.10)
    rot = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
    rot[creme | preto] = cv2.GC_PR_FGD
    rot[azul] = cv2.GC_BGD
    rot[preto & (lum < 30)] = cv2.GC_FGD
    # o Musashi, recortado à mão (os pés nas costas do bicho)
    rot[D.poly([(1530, 0), (1940, 0), (1960, 120), (1920, 330), (1900, 420), (1840, 440), (1760, 380), (1660, 300),
                (1560, 330), (1520, 250), (1600, 160)])] = cv2.GC_PR_FGD
    rot[D.poly([(1640, 40), (1880, 40), (1880, 300), (1700, 260)])] = cv2.GC_FGD
    # o cartucho de texto e a assinatura são do papel
    rot[D.poly([(2240, 80), (2500, 80), (2500, 440), (2240, 440)])] = cv2.GC_BGD
    rot[D.poly([(1940, 20), (2080, 20), (2080, 300), (1940, 300)])] = cv2.GC_BGD
    # as emendas entre as três folhas do tríptico são do papel: verticais e
    # paradas (a baleia só sobe, então nada abre nelas)
    rot[:, 1039 // 2:1078 // 2] = cv2.GC_BGD
    rot[:, 2129 // 2:2162 // 2] = cv2.GC_BGD
    return _limpa(_grabcut(a, rot), menor=3000, buraco_menor=250)


def baleia(m, de, ate):
    """O pico: a baleia sobe 6 px sobre o mar enquanto a câmera empurra 5%
    ancorada no Musashi. Sem ganho de escala entre os planos: as emendas do
    tríptico são verticais e ficam paradas."""
    f = m.folha('baleia', tom='washi')
    mk = _mascara('g02-baleia-v2', mascara_g02)
    X, Wd = 0, 1920
    Ht = Wd * 1559 / 3200
    Y = (1080 - Ht) / 2
    comum = dict(tipo='cor', res=1.15, branco_pct=99.5)
    f.peca('fundo', G02, X, Y, wd=Wd, buraco=buraco('g02-baleia-v2', mk), **comum)
    f.peca('baleia', G02, X, Y, wd=Wd, alfa=alfa('g02-baleia-v2', mk), plano='baleia', **comum)
    musashi = (X + 1740 * Wd / 3200, Y + 200 * Wd / 3200)
    m.plano(de, ate, f, *empurra_para(1.0, 1.05, (960, 540), musashi),
            px={'fundo': [0, 0, 0], 'baleia': [0, 0, 6]}, clip=[X, Y, X + Wd, Y + Ht])
