#!/usr/bin/env python3
"""
As folhas do Vinland — cada plano do vídeo impresso UMA vez.

A regra do briefing: Python faz a prensa, o Remotion move a câmera. Então
cada plano vira uma folha impressa em 1,16x o quadro (sobra pro empurrão e
pro sulco), e o Remotion só escolhe que pedaço da folha mostrar.

Quando uma folha tem revelação de tinta, ela é impressa em ESTADOS: o
estado 0 é o papel (com o que já estava nele), e cada passo acrescenta uma
chapa. A revelação no vídeo vai do estado k-1 pro estado k descobrindo
pixel que já estava impresso, pela ordem de um campo (leitura, de dentro
pra fora, de baixo pra cima...). Nada é re-impresso por frame: os estados
saem daqui, e cada um é a mesma folha com uma passada a mais.

Unidades: tudo é composto em pixel do QUADRO (1920x1080, grade da casa:
esquerda 240, direita 180, topo 190, base 170) e impresso em ESCALA
(4/3 = folha pronta pra 1440p). A folha tem sangria em volta do quadro;
(0, 0) é o canto do quadro quando a câmera está no centro da folha.

Uso:  python3 -I prensa/folhas.py            (todas)
      python3 -I prensa/folhas.py c1 t2b     (só essas)
Saída: public/folhas/<id>-<k>.jpg (estados), <id>-o<k>.png (campo de cada
passo, só na caixa que muda) e src/data/folhas.json (medidas e passos).
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import prensa as P  # noqa: E402

RAIZ = os.path.dirname(AQUI)
PUB = os.path.join(RAIZ, "public")
OUT = os.path.join(PUB, "folhas")
META = os.path.join(RAIZ, "src", "data", "folhas.json")

ESCALA = float(os.environ.get("ESCALA", 4 / 3))
# grão de superfície do papel. Calibrado no FRAME renderizado pelo desvio
# local 5x5 (alvo 6 a 8), não na folha: a câmera reamostra.
GRAO = float(os.environ.get("GRAO", 8.0))
SOBRA = 1.16
FW, FH = 1920, 1080
ESQ, DIR, TOPO, BASE = 240, 1920 - 180, 190, 1080 - 170

TINTA = (0x14, 0x12, 0x0E)
FERRUGEM = (0x7A, 0x3B, 0x22)
TURFA = (0x15, 0x13, 0x0F)

PAPEL = {
    "guerra": "#B3ABA0", "perda": "#B8B1A6", "ferro": "#BFB8AD", "fazenda": "#C6C0B4",
    "socos": "#CDC7BB", "baltico": "#D6D1C6", "neve": "#E2DFD6", "broto": "#EDECE7",
}
hx = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))

# a impressão da casa (blocos.py) e a do quadro de mangá (cartelas.py, cartela_d)
PR = dict(ganho=0.95, mordida=0.56, batida=0.29, falha=0.55)
PQ = dict(ganho=0.9, mordida=0.46, batida=0.30, falha=0.6)
MANGA = os.path.join(PUB, "manga")


# ===================================================================== #
#  A FOLHA                                                              #
# ===================================================================== #
class Folha:
    def __init__(self, id, tom, semente, sobra=(SOBRA, SOBRA), escala=None, aspereza=1.0):
        self.id = id
        self.tom = tom
        self.semente = semente
        self.e = escala or ESCALA
        self.uw, self.uh = FW * sobra[0], FH * sobra[1]
        self.ox, self.oy = (self.uw - FW) / 2, (self.uh - FH) / 2
        self.W, self.H = round(self.uw * self.e), round(self.uh * self.e)
        self.aspereza = aspereza
        self.elementos = []      # (nome, chapa, kw) na ordem em que passam na prensa
        self.estados = [{}]      # cada estado: {nome: forca}; o 0 é o papel
        self.passos = []         # um por estado depois do 0: como revelar
        self.base = {}           # o que já está impresso no estado 0
        self.pecas = []          # (tipo, x0, y0, x1, y1) em px da folha: cada linha, fio e quadro composto

    # --- unidades ---------------------------------------------------
    def x(self, v):
        return round((v + self.ox) * self.e)

    def y(self, v):
        return round((v + self.oy) * self.e)

    def s(self, v):
        return v * self.e

    def chapa(self):
        return P.chapa(self.W, self.H)

    # --- composição -------------------------------------------------
    def tipo(self, ch, texto, fonte, corpo, x, y, ancora="esq", tracking=0.0,
             semente=0, tremor=0.0):
        f = P.fonte(fonte, max(1, round(corpo * self.e)))
        X, Y = self.x(x), self.y(y)
        total = P.linha(ch, texto, f, X, Y, tracking=tracking,
                        semente=semente, tremor=tremor * self.e, ancora=ancora)
        x0 = X - {"centro": total / 2, "dir": total}.get(ancora, 0)
        _, t, _, b = f.getbbox(texto)
        self.pecas.append(("tipo", x0, Y + t, x0 + total, Y + b))
        return total / self.e

    def quadro(self, ch, arq, x, y, largura=None, altura=None, recorte=None,
               branco=0.95, preto=0.12):
        """Quadro de mangá (ou foto, ou gráfico) virando chapa. Devolve a
        chapa e o tamanho do quadro em unidades de frame."""
        im = Image.open(os.path.join(PUB, arq)).convert("L")
        if recorte:
            fx0, fy0, fx1, fy1 = recorte
            im = im.crop((round(im.width * fx0), round(im.height * fy0),
                          round(im.width * fx1), round(im.height * fy1)))
        r = im.width / im.height
        if largura is None:
            largura = altura * r
        w = round(largura * self.e)
        h = round(w / r)
        im = im.resize((w, h), Image.LANCZOS)
        a = np.asarray(im, float) / 255
        cob = np.clip((branco - a) / (branco - preto), 0, 1)
        peca = Image.fromarray((cob * 255).astype(np.uint8))
        self.pecas.append(("quadro", self.x(x), self.y(y), self.x(x) + w, self.y(y) + h))
        return P.colar_chapa(ch, peca, self.x(x), self.y(y)), (largura, h / self.e)

    def fio(self, ch, x0, y0, x1, y1):
        ImageDraw.Draw(ch).rectangle([self.x(x0), self.y(y0), self.x(x1), self.y(y1)], fill=255)
        self.pecas.append(("fio", self.x(x0), self.y(y0), self.x(x1) + 1, self.y(y1) + 1))
        return ch

    # --- o que passa na prensa --------------------------------------
    def el(self, nome, ch, **kw):
        self.elementos.append((nome, ch, kw))
        return nome

    def no_papel(self, *nomes):
        """Elementos que já estão na folha antes de qualquer revelação."""
        for n in nomes:
            self.base[n] = 1.0
        self.estados[0] = dict(self.base)

    def passo(self, muda, modo="leitura", **opcoes):
        """Um estado novo: `muda` = {nome: forca}. forca 0 tira o elemento,
        forca menor que 1 deixa ele fantasma (uma apagando a outra)."""
        novo = dict(self.estados[-1])
        novo.update(muda)
        self.estados.append(novo)
        self.passos.append(dict(modo=modo, **opcoes))

    # --- impressão ----------------------------------------------------
    def imprimir_estado(self, papel, estado):
        f = papel
        for nome, ch, kw in self.elementos:
            forca = estado.get(nome, 0.0)
            if forca <= 0:
                continue
            kw = dict(kw)
            vazado = kw.pop("vazado", False)
            kw["forca"] = kw.get("forca", 1.0) * forca
            kw.setdefault("tinta", TINTA)
            f = (P.arrancar if vazado else P.imprimir)(f, ch, **kw)
        return f

    def imprimir(self):
        os.makedirs(OUT, exist_ok=True)
        papel = P.papel(self.W, self.H, hx(PAPEL[self.tom]) if self.tom in PAPEL else self.tom,
                        semente=self.semente, aspereza=self.aspereza, grao=GRAO)
        meta = dict(id=self.id, w=self.W, h=self.H, uw=self.uw, uh=self.uh,
                    escala=self.e, tom=self.tom, estados=len(self.estados), passos=[])
        anterior = None
        for k, estado in enumerate(self.estados):
            arr = self.imprimir_estado(papel, estado)
            P.salvar(arr, f"{OUT}/{self.id}-{k}.jpg", q=95)
            if k > 0:
                meta["passos"].append(self.campo(anterior, arr, k, self.passos[k - 1]))
            anterior = arr
        grao = P.medir_grao(papel, (self.H // 10, self.H // 10 * 2, self.W // 10, self.W // 10 * 3))
        meta["grao_folha"] = round(grao, 2)
        return meta

    # --- a ordem em que a tinta aparece -------------------------------
    def campo(self, a, b, k, opcoes):
        """Caixa onde o estado muda e o campo que decide a ordem da revelação."""
        d = np.abs(b.mean(2) - a.mean(2)) > 3
        d = ndimage.binary_dilation(d, iterations=int(6 * self.e))
        ys, xs = np.where(d)
        if len(ys) == 0:
            x0, y0, x1, y1 = 0, 0, 1, 1
        else:
            x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        H, W = y1 - y0, x1 - x0
        g = np.random.default_rng(self.semente * 31 + k)
        ruido = ndimage.gaussian_filter(g.random((H, W)), 70 * self.e)
        ruido = (ruido - ruido.min()) / (ruido.max() - ruido.min() + 1e-9)
        modo = opcoes["modo"]
        yy = np.linspace(0, 1, H)[:, None]
        xx = np.linspace(0, 1, W)[None, :]
        # largura da frente de tinta, em fração do campo. A referência
        # (movimento.py) usa 0,095 numa caixa de três linhas; aqui as caixas
        # são bem maiores, e com 0,095 a frente vira um degradê de centenas de
        # pixels (fade, não tinta). Estreita: a borda irregular é o ruído.
        largura = {"coluna": 0.035, "baixo": 0.06, "radial": 0.05}.get(opcoes["modo"], 0.035)
        if modo == "leitura":
            cru = (np.abs(b.mean(2) - a.mean(2)) > 3)[y0:y1, x0:x1]
            c, largura = self.campo_leitura(cru, x0, y0, g)
        elif modo == "mancha":
            # a diagonal de movimento.py: de cima à esquerda pra baixo à direita
            c = ruido * 0.17 + yy * 0.56 + xx * 0.27
        elif modo == "coluna":
            # coluna a coluna (a esquerda inteira antes da direita)
            c = ruido * 0.15 + xx * 0.55 + yy * 0.30
        elif modo == "baixo":
            # broto: cresce de baixo, lento
            c = ruido * 0.22 + (1 - yy) * 0.78
        elif modo == "radial":
            # os anéis: de dentro pra fora, como a árvore cresceu
            cx, cy, rx, ry = opcoes["centro"]
            Y = (np.arange(y0, y1)[:, None] / self.e - self.oy - cy) / ry
            X = (np.arange(x0, x1)[None, :] / self.e - self.ox - cx) / rx
            r = np.sqrt(X ** 2 + Y ** 2)
            c = 0.88 * r / r.max() + 0.12 * ruido
        elif modo == "escada":
            # a régua: cada traço aparece inteiro, um por vez
            (ax, ay), (bx, by) = opcoes["linha"]
            Y = np.arange(y0, y1)[:, None] / self.e - self.oy
            X = np.arange(x0, x1)[None, :] / self.e - self.ox
            vx, vy = bx - ax, by - ay
            t = ((X - ax) * vx + (Y - ay) * vy) / (vx * vx + vy * vy)
            marcas = np.array(opcoes["marcas"])
            c = np.searchsorted(marcas, np.clip(t, 0, 1), side="right") / (len(marcas) + 1)
            largura = 0.5 / (len(marcas) + 1)
        else:
            raise ValueError(modo)
        c = (c - c.min()) / (c.max() - c.min() + 1e-9)
        # 16 bits (alto no vermelho, baixo no verde): com várias linhas num
        # passo, cada linha fica com uma fatia do campo, e 8 bits davam
        # degraus de dezenas de pixels na frente de uma linha só
        v = np.round(c * 65535).astype(np.uint32)
        rgb = np.zeros((H, W, 3), np.uint8)
        rgb[..., 0], rgb[..., 1] = v >> 8, v & 255
        Image.fromarray(rgb, "RGB").save(f"{OUT}/{self.id}-o{k}.png", optimize=True)
        return dict(caixa=[int(x0), int(y0), int(W), int(H)], largura=round(float(largura), 6), modo=modo)

    def pecas_do_passo(self, cru, x0, y0):
        """As peças (linha de tipo, fio, quadro) que ganharam tinta neste
        passo, em coordenadas da caixa e na ordem em que se lê."""
        H, W = cru.shape
        sel = []
        for tipo, a0, b0, a1, b1 in self.pecas:
            lx0, ly0 = max(0, int(a0) - x0), max(0, int(b0) - y0)
            lx1, ly1 = min(W, int(np.ceil(a1)) - x0), min(H, int(np.ceil(b1)) - y0)
            if lx1 <= lx0 or ly1 <= ly0:
                continue
            if cru[ly0:ly1, lx0:lx1].sum() >= max(20, 0.02 * (lx1 - lx0) * (ly1 - ly0)):
                sel.append((tipo, lx0, ly0, lx1, ly1))
        if not sel:
            # desenho que não passou por tipo/fio/quadro (as partes do g01):
            # cada faixa de linhas da folha com tinta nova é uma linha
            faixas = []
            for r in np.where(cru.any(1))[0]:
                if faixas and r - faixas[-1][1] <= max(3, int(4 * self.e)):
                    faixas[-1][1] = r
                else:
                    faixas.append([r, r])
            for p, q in faixas or [[0, H - 1]]:
                cols = np.where(cru[p:q + 1].any(0))[0]
                sel.append(("tipo", int(cols.min()), int(p), int(cols.max()) + 1, int(q) + 1))
        vertical = lambda p: p[0] == "fio" and (p[4] - p[2]) > (p[3] - p[1])
        # fileira: peças na mesma altura (sobrepostas em pelo menos metade da
        # MAIOR das duas) se leem da esquerda pra direita
        filas = []
        for p in sorted((p for p in sel if not vertical(p)), key=lambda p: p[2]):
            for fila in filas:
                if min(fila[1], p[4]) - max(fila[0], p[2]) >= 0.5 * max(fila[1] - fila[0], p[4] - p[2]):
                    fila[0], fila[1] = min(fila[0], p[2]), max(fila[1], p[4])
                    fila[2].append(p)
                    break
            else:
                filas.append([p[2], p[4], [p]])
        ordem = [q for fila in sorted(filas, key=lambda f: f[0]) for q in sorted(fila[2], key=lambda q: q[1])]
        # o fio que divide colunas entra por último: a palavra dita não espera o fio
        return ordem + sorted((p for p in sel if vertical(p)), key=lambda p: p[1])

    def campo_leitura(self, cru, x0, y0, g):
        """ORDEM DE LEITURA de verdade: uma linha inteira, da esquerda pra
        direita, antes da seguinte. A frente anda na mesma velocidade em
        todas as linhas (tinta saindo do rolo, não tempo fixo por linha), e o
        ruído só deixa a borda dela irregular, na escala da letra.

        Normalizar y pela caixa (como em movimento.py) fazia, numa linha só,
        a tinta descer de cima pra baixo dentro das letras: cortina, não
        tinta. Quadro e fio vertical correm 4x e 2x mais depressa que o tipo
        (e com a borda proporcionalmente mais larga): a imagem chega, o
        texto se lê.

        Devolve o campo (0..1) e a largura da frente na unidade do campo."""
        H, W = cru.shape
        ordem = self.pecas_do_passo(cru, x0, y0)
        alt = [p[4] - p[2] for p in ordem if p[0] == "tipo"] or [min(p[3] - p[1], p[4] - p[2]) for p in ordem]
        hm = float(np.median(alt))

        def comprimento(p):
            w, h = p[3] - p[1], p[4] - p[2]
            if p[0] == "quadro":
                return 0.25 * max(w, h)
            if p[0] == "fio" and h > w:
                return 0.5 * h
            return w

        L = np.array([comprimento(p) for p in ordem], float)
        S = np.concatenate([[0.0], np.cumsum(L)[:-1]])
        Y = np.arange(H, dtype=float)[:, None]
        X = np.arange(W, dtype=float)[None, :]
        # cada pixel é da peça mais perto: a tinta que a torção da chapa
        # empurra pra fora do retângulo vai junto com a linha dela
        dist = np.full((H, W), np.inf)
        c = np.zeros((H, W))
        for j, (tipo, a0, b0, a1, b1) in enumerate(ordem):
            d = np.maximum(np.maximum(a0 - X, X - a1), 0) ** 2 + np.maximum(np.maximum(b0 - Y, Y - b1), 0) ** 2
            xp = np.clip((X - a0) / max(1, a1 - a0), 0, 1)
            yp = np.clip((Y - b0) / max(1, b1 - b0), 0, 1)
            if tipo == "quadro":
                pr = 0.62 * yp + 0.38 * xp
            elif tipo == "fio" and (b1 - b0) > (a1 - a0):
                pr = np.broadcast_to(yp, (H, W))
            else:
                pr = np.broadcast_to(xp, (H, W))
            m = d < dist
            dist[m] = d[m]
            c[m] = (S[j] + pr * L[j])[m]
        # borda irregular: ruído na escala da letra, desvio de 12% da altura
        n = ndimage.gaussian_filter(g.random((H, W)), float(np.clip(0.18 * hm, 3, 30)))
        n = (n - n.mean()) / (n.std() + 1e-9)
        c = c + 0.12 * hm * n
        lo, hi = c.min(), c.max()
        frente = float(np.clip(0.30 * hm, 8 * self.e, 64 * self.e))
        return (c - lo) / (hi - lo), frente / (hi - lo)


# ===================================================================== #
#  CARTELAS — o desenho de blocos.py, impresso em 1,16x e na ESCALA      #
# ===================================================================== #
def cartela(n, tom=None):
    """As oito cartelas. Mesmo texto, mesmas fontes, mesmas posições e
    sementes de blocos.py; aqui impressas com sangria e na escala da folha,
    e com o grão de superfície calibrado (as JPG entregues medem 2,6 a 4,1)."""
    tons = ["guerra", "perda", "ferro", "fazenda", "socos", "baltico", "neve", "broto"]
    asp = {1: 1.15, 7: 0.85, 8: 0.78}.get(n, 1.0)
    f = Folha(f"c{n}" + ("" if tom is None else f"-{tom}"), tom or tons[n - 1],
              semente=100 + (n - 1) * 7, aspereza=asp)
    ch = f.chapa()
    if n == 1:
        f.tipo(ch, "THORFINN", "ebg-700.ttf", 191, ESQ, 548, tracking=0.012, semente=1, tremor=0.9)
        f.tipo(ch, "EXISTIU", "ebg-700.ttf", 191, ESQ, 760, tracking=0.012, semente=2, tremor=0.9)
        f.el("fantasma", ch, tinta=FERRUGEM, semente=11, torcao=0.34, desloc=(-1.9, 2.3), forca=0.52, **PR)
        f.el("tipo", ch, semente=12, torcao=0.16, **PR)
        f.passo({"fantasma": 1, "tipo": 1})
    elif n == 2:
        f.tipo(ch, "A FONTE", "oswald.ttf", 23, ESQ, 262, tracking=0.24, semente=20)
        f.tipo(ch, "Haukr Erlendsson", "ebg-700.ttf", 106, ESQ, 328, semente=21, tremor=0.7)
        for i, l in enumerate(["copiou o manuscrito que sobreviveu.",
                               "Dizia-se descendente do Thorfinn.",
                               "Os estudiosos suspeitam que acrescentou",
                               "material para lisonjear o antepassado."]):
            f.tipo(ch, l, "ebg-500.ttf", 38, ESQ, 506 + i * 58, semente=22 + i)
        f.el("tipo", ch, semente=29, torcao=-0.21, desloc=(1.1, -0.9), **PR)
        f.passo({"tipo": 1})
    elif n == 3:
        for i, l in enumerate(["O mundo é histórico.", "O motivo é ficção."]):
            f.tipo(ch, l, "ebg-700.ttf", 122, DIR, 404 + i * 150, semente=30 + i, tremor=0.8, ancora="dir")
        f.tipo(ch, "ASKELADD, THORS E EINAR NÃO EXISTIRAM", "oswald.ttf", 22, DIR, 736,
               tracking=0.17, semente=34, ancora="dir")
        f.tipo(ch, "CANUTE, THORKELL, SWEYN E LEIF EXISTIRAM", "oswald.ttf", 22, DIR, 776,
               tracking=0.17, semente=35, ancora="dir")
        f.el("tipo", ch, semente=39, torcao=0.24, **PR)
        f.passo({"tipo": 1})
    elif n == 4:
        f.tipo(ch, "EU NÃO TENHO", "anton.ttf", 196, ESQ, 404, tracking=-0.004, semente=41, tremor=1.0)
        f.tipo(ch, "INIMIGOS", "anton.ttf", 196, ESQ, 614, tracking=-0.004, semente=42, tremor=1.0)
        f.tipo(ch, "VINLAND SAGA, CAPÍTULO 96", "oswald.ttf", 23, ESQ, 872, tracking=0.19, semente=43)
        f.el("vazado", ch, vazado=True, tinta=TURFA, semente=49, ganho=0.55, mordida=0.22,
             batida=0.26, falha=0.85, torcao=0.14)
        # o que chega aqui é o fundo (o tipo é reserva): a tinta inunda a
        # folha na diagonal, e as letras aparecem porque ela não as cobre
        f.passo({"vazado": 1}, modo="mancha")
    elif n == 5:
        ano = f.chapa()
        f.tipo(ano, "1893", "anton.ttf", 300, ESQ - 10, 300, tracking=-0.02, semente=50, tremor=1.3)
        fundo = P.caixa_tinta(ano)[3] / f.e - f.oy
        f.tipo(ch, "Não resistir ao mal.", "ebg-700.ttf", 77, ESQ, fundo + 54, semente=51, tremor=0.7)
        f.tipo(ch, "Aceitar ser morto antes de matar. Nada de punição,", "ebg-500.ttf", 34,
               ESQ, fundo + 176, semente=52)
        f.tipo(ch, "nada de força, nem para se defender.", "ebg-500.ttf", 34, ESQ, fundo + 222, semente=53)
        f.tipo(ch, "TOLSTÓI, O REINO DE DEUS ESTÁ EM VÓS", "oswald.ttf", 19, ESQ, fundo + 292,
               tracking=0.2, semente=54)
        f.el("ano", ano, tinta=FERRUGEM, semente=55, torcao=-0.18, forca=0.88, **PR)
        f.el("tipo", ch, semente=56, torcao=0.13, **PR)
        f.passo({"ano": 1, "tipo": 1})
    elif n == 6:
        meio = 980
        topo, gan, tol, rodape = f.chapa(), f.chapa(), f.chapa(), f.chapa()
        f.tipo(topo, "TOLSTÓI", "oswald.ttf", 22, ESQ, 300, tracking=0.26, semente=60)
        f.tipo(topo, "GANDHI", "oswald.ttf", 22, meio, 300, tracking=0.26, semente=65)
        f.fio(topo, meio - 86, 296, meio - 84, 618)
        f.tipo(tol, "Nunca.", "ebg-700.ttf", 67, ESQ, 348, semente=61, tremor=0.7)
        for i, l in enumerate(["Matar só pode vir de raiva,", "medo ou ódio. Nenhum dos", "três é amor."]):
            f.tipo(tol, l, "ebg-500.ttf", 32, ESQ, 474 + i * 48, semente=62 + i)
        f.tipo(gan, "Quase nunca.", "ebg-700.ttf", 67, meio, 348, semente=66, tremor=0.7)
        for i, l in enumerate(["Entre covardia e violência,", "ele aconselharia a", "violência."]):
            f.tipo(gan, l, "ebg-500.ttf", 32, meio, 474 + i * 48, semente=67 + i)
        f.tipo(rodape, "Um pode mudar de ideia diante dos fatos. O outro não pode.", "ebg-500.ttf", 36,
               ESQ, 748, semente=70)
        f.tipo(rodape, "É por isso que o segundo parece ingênuo.", "ebg-500.ttf", 36, ESQ, 798, semente=71)
        kw = dict(semente=79, torcao=-0.15, **PR)
        # quatro chapas da mesma forme: a discordância entra em partes,
        # na ordem em que a narração chega nela
        f.el("topo", topo, **kw)
        f.el("gandhi", gan, **kw)
        f.el("tolstoi", tol, **kw)
        f.el("rodape", rodape, **kw)
        f.passo({"topo": 1})
        f.passo({"gandhi": 1})
        f.passo({"tolstoi": 1})
        f.passo({"rodape": 1})
    elif n == 7:
        f.tipo(ch, "O ANO EM QUE CORTARAM A MADEIRA", "oswald.ttf", 24, ESQ, 338, tracking=0.22, semente=80)
        so = f.chapa()
        f.tipo(so, "1021", "anton.ttf", 356, ESQ - 12, 372, tracking=-0.018, semente=81, tremor=1.5)
        fundo = P.caixa_tinta(so)[3] / f.e - f.oy
        ch = P.colar_chapa(ch, so, 0, 0)
        f.tipo(ch, "L'Anse aux Meadows, ponta norte de Newfoundland.", "ebg-500.ttf", 33, ESQ, fundo + 62, semente=82)
        f.tipo(ch, "Datado pelo pico de carbono-14 da tempestade solar de 993.", "ebg-500.ttf", 33,
               ESQ, fundo + 110, semente=83)
        f.tipo(ch, "KUITEMS ET AL., NATURE, 2021", "oswald.ttf", 19, ESQ, fundo + 182, tracking=0.2, semente=84)
        f.el("tipo", ch, semente=89, torcao=-0.19, desloc=(1.2, -0.8), **PR)
        f.passo({"tipo": 1})
    elif n == 8:
        f.tipo(ch, "E você,", "ebg-700.ttf", 94, ESQ, 452, semente=90, tremor=0.6)
        f.tipo(ch, "continuaria tentando?", "ebg-700.ttf", 94, ESQ, 574, semente=91, tremor=0.6)
        f.el("tipo", ch, semente=99, torcao=0.11, ganho=0.8, mordida=0.5, batida=0.22, falha=0.35)
        f.passo({"tipo": 1})
    return f


# ===================================================================== #
#  helpers de composição                                                #
# ===================================================================== #
def folha_tipo(id, tom, semente, linhas, **kw):
    """Folha só de tipo. `linhas`: lista de passos; cada passo é uma lista
    de (texto, fonte, corpo, x, y, opções). Um passo = uma revelação."""
    f = Folha(id, tom, semente, **kw)
    for i, passo in enumerate(linhas):
        ch = f.chapa()
        tinta = TINTA
        for (texto, fonte, corpo, x, y, *op) in passo:
            op = op[0] if op else {}
            if op.get("tinta"):
                tinta = op["tinta"]
            f.tipo(ch, texto, fonte, corpo, x, y, ancora=op.get("ancora", "esq"),
                   tracking=op.get("tracking", 0.0), semente=semente * 10 + i * 3 + len(texto) % 3,
                   tremor=op.get("tremor", 0.0))
        nome = f"p{i}"
        f.el(nome, ch, tinta=tinta, semente=semente + i, torcao=0.12 + 0.03 * (i % 3), **PR)
        f.passo({nome: 1})
    return f


def folha_quadro(id, tom, semente, arq, x, y, largura=None, altura=None, recorte=None,
                 branco=0.95, preto=0.12, tipo=None, sobra=(SOBRA, SOBRA), escala=None,
                 revela=False, modo="leitura"):
    """Um quadro impresso na folha (estado 0 = papel, estado 1 = quadro).
    `tipo`: passos de tipo depois do quadro, como em folha_tipo."""
    f = Folha(id, tom, semente, sobra=sobra, escala=escala)
    ch, tam = f.quadro(f.chapa(), arq, x, y, largura, altura, recorte, branco, preto)
    f.el("quadro", ch, semente=semente + 5, torcao=0.17, desloc=(0.8, -1.4), **PQ)
    f.passo({"quadro": 1}, modo=modo)
    for i, passo in enumerate(tipo or []):
        ch = f.chapa()
        tinta = TINTA
        for (texto, fonte, corpo, tx, ty, *op) in passo:
            op = op[0] if op else {}
            if op.get("tinta"):
                tinta = op["tinta"]
            f.tipo(ch, texto, fonte, corpo, tx, ty, ancora=op.get("ancora", "esq"),
                   tracking=op.get("tracking", 0.0), semente=semente * 10 + i,
                   tremor=op.get("tremor", 0.0))
        f.el(f"t{i}", ch, tinta=tinta, semente=semente + 20 + i, torcao=0.15, **PR)
        f.passo({f"t{i}": 1})
    f.tamanho = tam
    return f


LBL = dict(tracking=0.26)          # rótulo Oswald, entreletra alta
LBL_D = dict(tracking=0.26, ancora="dir")


# ===================================================================== #
#  AS FOLHAS DO FILME                                                   #
# ===================================================================== #
def todas():
    F = {}

    def add(f):
        F[f.id] = f

    # ---------------- BLOCO 1 · guerra --------------------------------
    add(cartela(1))
    add(folha_tipo("t1a", "guerra", 201, [
        [("Thorfinn Karlsefni", "ebg-700.ttf", 132, ESQ, 380, dict(tremor=0.8))],
        [("ISLANDÊS  ·  NASCIDO POR VOLTA DE 980  ·  COMERCIANTE E EXPLORADOR", "oswald.ttf", 25, ESQ + 4, 590, LBL)],
    ]))
    # a família (Gudrid?) — página alta, folha alta pra descer devagar
    add(folha_quadro("q1a", "guerra", 202, "manga/v16-familia-capa.png", 700, -150, largura=1040,
                     recorte=(0.05, 0.0, 1.0, 0.93), sobra=(SOBRA, 1.62)))
    # navios: acima da caixa de legenda vazia (não se inventa letreiro)
    add(folha_quadro("q1b", "guerra", 203, "manga/v17-navios.png", -110, -30, largura=2140,
                     recorte=(0.0, 0.0, 1.0, 0.70)))
    add(folha_tipo("t1b", "guerra", 204, [
        [("COMO OS NÓRDICOS CHAMAVAM OS HABITANTES DO LUGAR", "oswald.ttf", 24, DIR, 356, LBL_D)],
        [("skrælingar", "ebg-700.ttf", 168, DIR, 410, dict(ancora="dir", tremor=0.9))],
    ]))
    add(folha_quadro("q1c", "guerra", 205, "manga/v15b-leif-retrato.png", DIR - 960, 60, largura=960))
    add(folha_tipo("t1c", "guerra", 206, [
        [("TRÊS ANOS", "anton.ttf", 250, ESQ - 8, 280, dict(tracking=-0.01, tremor=1.2))],
        [("Acabou por desentendimento interno, não por ataque.", "ebg-500.ttf", 44, ESQ, 640)],
    ]))

    # ---------------- BLOCO 2 · perda ---------------------------------
    add(cartela(2))
    add(folha_tipo("t2a", "perda", 210, [
        [("As duas sagas", "ebg-700.ttf", 124, ESQ, 330, dict(tremor=0.8))],
        [("divergem em quase tudo.", "ebg-500.ttf", 58, ESQ + 4, 520)],
    ]))
    # sessenta contra cento e quarenta: uma apagando a outra
    f = Folha("t2b", "perda", 211)
    rot, sl, cr = f.chapa(), f.chapa(), f.chapa()
    meio = 1000
    f.tipo(rot, "UMA DIZ", "oswald.ttf", 24, ESQ + 4, 300, **LBL)
    f.tipo(rot, "A OUTRA DIZ", "oswald.ttf", 24, meio + 4, 300, **LBL)
    f.tipo(sl, "SESSENTA", "anton.ttf", 176, ESQ - 6, 350, tracking=-0.01, semente=2111, tremor=1.2)
    f.tipo(sl, "HOMENS", "anton.ttf", 176, ESQ - 6, 545, tracking=-0.01, semente=2112, tremor=1.2)
    f.tipo(cr, "CENTO E", "anton.ttf", 176, meio - 6, 350, tracking=-0.01, semente=2113, tremor=1.2)
    f.tipo(cr, "QUARENTA", "anton.ttf", 176, meio - 6, 545, tracking=-0.01, semente=2114, tremor=1.2)
    f.el("rot", rot, semente=2115, torcao=0.13, **PR)
    f.el("sessenta", sl, semente=2116, torcao=-0.17, **PR)
    f.el("cento", cr, semente=2117, torcao=0.21, desloc=(1.2, 0.6), **PR)
    f.no_papel("rot")
    f.passo({"sessenta": 1})
    f.passo({"sessenta": 0.22, "cento": 1}, modo="coluna")
    f.passo({"sessenta": 1, "cento": 0.22}, modo="coluna")
    add(f)
    add(folha_tipo("t2c", "perda", 212, [
        [("copiado por", "ebg-700.ttf", 104, DIR, 300, dict(ancora="dir", tremor=0.8)),
         ("alguém da família,", "ebg-700.ttf", 104, DIR, 420, dict(ancora="dir", tremor=0.8))],
        [("com motivo para melhorar a história.", "ebg-500.ttf", 46, DIR, 590, dict(ancora="dir"))],
        [("OS ESTUDIOSOS SUSPEITAM QUE ELE ACRESCENTOU", "oswald.ttf", 23, DIR, 730, LBL_D),
         ("MATERIAL PARA LISONJEAR O ANTEPASSADO", "oswald.ttf", 23, DIR, 770, LBL_D)],
    ]))
    add(folha_tipo("t2d", "perda", 213, [
        [("Guarda essa informação.", "ebg-700.ttf", 96, ESQ, 440, dict(tremor=0.7))],
    ]))
    # a publicação, em linha do tempo
    linhas = []
    for i, (data, onde) in enumerate([("ABRIL DE 2005", "Weekly Shōnen Magazine"),
                                      ("DEZEMBRO DE 2005", "Monthly Afternoon"),
                                      ("JULHO DE 2025", "o fim")]):
        y = 250 + i * 150
        linhas.append([(data, "oswald.ttf", 24, ESQ + 4, y, LBL),
                       (onde, "ebg-700.ttf", 70, ESQ, y + 34, dict(tremor=0.6))])
    linhas.append([("20 ANOS  ·  29 VOLUMES", "anton.ttf", 112, ESQ - 4, 720, dict(tinta=FERRUGEM, tremor=1.0))])
    add(folha_tipo("t2e", "perda", 214, linhas))
    add(folha_tipo("t2f", "perda", 215, [
        [("O QUE O YUKIMURA DECLAROU", "oswald.ttf", 24, ESQ + 4, 330, LBL)],
        [("Violência não leva", "ebg-700.ttf", 112, ESQ, 380, dict(tremor=0.8)),
         ("a nada de bom.", "ebg-700.ttf", 112, ESQ, 512, dict(tremor=0.8))],
    ]))
    add(folha_quadro("q2a", "perda", 216, "manga/v12-corrente-desarmado.png", -150, 150, largura=2220,
                     recorte=(0.0, 0.0, 1.0, 0.905), sobra=(1.30, SOBRA)))
    add(folha_tipo("t2g", "perda", 217, [
        [("Por que você escreve", "ebg-700.ttf", 98, ESQ, 300, dict(tremor=0.7)),
         ("em direção a um fim", "ebg-700.ttf", 98, ESQ, 420, dict(tremor=0.7)),
         ("que a história já reprovou?", "ebg-700.ttf", 98, ESQ, 540, dict(tremor=0.7))],
    ]))

    # ---------------- BLOCO 3 · ferro ---------------------------------
    add(cartela(3))
    add(folha_quadro("q3a", "ferro", 230, "manga/v01-thorfinn-crianca.png", ESQ, 130, largura=1000))
    add(folha_quadro("q3b", "ferro", 231, "manga/v04-thorfinn-cacador.png", DIR - 840, -60,
                     largura=840, sobra=(SOBRA, 1.36)))
    add(folha_quadro("q3c", "ferro", 232, "manga/v03-askeladd-close.png", ESQ, 190, largura=1080, tipo=[
        [("ASKELADD", "oswald.ttf", 26, 1380, 470, LBL)],
        [("INVENÇÃO", "ebg-700.ttf", 74, 1376, 520, dict(tremor=0.7))],
    ]))
    # Thors e Einar: dois retratos, cada um quando é dito
    f = Folha("q3d", "ferro", 233)
    a, _ = f.quadro(f.chapa(), "manga/v02-thors.png", ESQ, 170, largura=640)
    b, _ = f.quadro(f.chapa(), "manga/v09b-einar-pergunta.png", 1000, 170, largura=600)
    ra, rb, inv = f.chapa(), f.chapa(), f.chapa()
    f.tipo(ra, "THORS, O PAI", "oswald.ttf", 24, ESQ + 4, 835, **LBL)
    f.tipo(rb, "EINAR, O COMPANHEIRO DE LAVOURA", "oswald.ttf", 24, 1004, 835, **LBL)
    f.tipo(inv, "INVENÇÃO", "ebg-700.ttf", 58, ESQ, 870, semente=2331, tremor=0.6)
    f.tipo(inv, "INVENÇÃO", "ebg-700.ttf", 58, 1000, 870, semente=2332, tremor=0.6)
    f.el("thors", a, semente=2334, torcao=0.15, **PQ)
    f.el("einar", b, semente=2335, torcao=-0.12, **PQ)
    f.el("ra", ra, semente=2336, torcao=0.1, **PR)
    f.el("rb", rb, semente=2337, torcao=0.1, **PR)
    f.el("inv", inv, semente=2338, torcao=-0.1, **PR)
    f.passo({"thors": 1, "ra": 1})
    f.passo({"einar": 1, "rb": 1})
    f.passo({"inv": 1}, modo="coluna")
    add(f)
    add(folha_quadro("q3e", "ferro", 234, "manga/v13-canute.png", DIR - 1000, 210, largura=1000, tipo=[
        [("CANUTE", "oswald.ttf", 26, ESQ + 4, 300, LBL),
         ("EXISTIU", "ebg-700.ttf", 74, ESQ, 340, dict(tremor=0.7))],
        [("Rei da Inglaterra,", "ebg-500.ttf", 40, ESQ, 470),
         ("da Dinamarca", "ebg-500.ttf", 40, ESQ, 522),
         ("e da Noruega.", "ebg-500.ttf", 40, ESQ, 574)],
    ]))
    # os que existiram, em fila: Thorkell, Sweyn (e Harald), Leif (e Gudrid)
    f = Folha("q3f", "ferro", 235)
    pecas = [("manga/v14-thorkell.png", "THORKELL"), ("manga/v19-sweyn.png", "SWEYN E HARALD"),
             ("manga/v15b-leif-retrato.png", "LEIF ERIKSON E GUDRID")]
    nomes = []
    for i, (arq, rotulo) in enumerate(pecas):
        x = ESQ + i * 520
        im = Image.open(os.path.join(PUB, arq))
        larg = 440
        alt = larg * im.height / im.width
        q, _ = f.quadro(f.chapa(), arq, x, 780 - alt, largura=larg)
        f.tipo(q, rotulo, "oswald.ttf", 23, x + 2, 805, **LBL)
        f.tipo(q, "EXISTIU" if i == 0 else "EXISTIRAM", "ebg-700.ttf", 46, x, 840, semente=2350 + i, tremor=0.6)
        nomes.append(f.el(f"r{i}", q, semente=2360 + i, torcao=0.12 * (1 - i), **PQ))
    for n in nomes:
        f.passo({n: 1})
    add(f)
    f = Folha("t3a", "ferro", 236)
    esq, dir_ = f.chapa(), f.chapa()
    for i, l in enumerate(["político,", "militar,", "documentado."]):
        f.tipo(esq, l, "ebg-700.ttf", 82, ESQ, 250 + i * 104, semente=2370 + i, tremor=0.7)
    f.tipo(esq, "ELE MANTEVE", "oswald.ttf", 26, ESQ + 4, 600, **LBL)
    for i, l in enumerate(["familiar,", "íntimo,", "formador."]):
        f.tipo(dir_, l, "ebg-700.ttf", 82, 1000, 250 + i * 104, semente=2375 + i, tremor=0.7)
    f.tipo(dir_, "ELE INVENTOU", "oswald.ttf", 26, 1004, 600, **LBL)
    f.fio(esq, 918, 250, 920, 640)
    f.el("esq", esq, semente=2380, torcao=0.14, **PR)
    f.el("dir", dir_, semente=2381, torcao=-0.16, **PR)
    f.passo({"esq": 1})
    f.passo({"dir": 1})
    add(f)
    add(folha_quadro("q3g", "ferro", 237, "manga/v04b-thorfinn-escudo.png", 1240, 250, largura=440, tipo=[
        [("O motivo muda", "ebg-700.ttf", 92, ESQ, 300, dict(tremor=0.7)),
         ("duas vezes.", "ebg-700.ttf", 92, ESQ, 410, dict(tremor=0.7))],
        [("PRIMEIRO", "oswald.ttf", 25, ESQ + 4, 590, LBL),
         ("vingança", "ebg-700.ttf", 92, ESQ, 626, dict(tinta=FERRUGEM, tremor=0.8))],
    ]))
    # (v05b-askeladd-queda ficou fora: não há pausa entre a queda e "tira a vingança da mesa")
    # add(folha_quadro("q3h", "ferro", 238, "manga/v05b-askeladd-queda.png", 260, -60, largura=1440))
    add(folha_quadro("q3i", "ferro", 239, "manga/v05-askeladd-morte.png", -60, 50, largura=2040))

    # ---------------- BLOCO 4 · fazenda (cap. 96 em socos) ------------
    add(cartela(4))
    add(folha_quadro("q4a", "fazenda", 240, "manga/v07-arrancando-toco.png", -240, -80, largura=2400,
                     sobra=(1.40, SOBRA)))
    add(folha_quadro("q4b", "fazenda", 241, "manga/v08-maos-na-terra.png", -330, 90, largura=2580,
                     sobra=(1.48, SOBRA)))
    add(folha_quadro("q4c", "fazenda", 242, "manga/v10-cem-socos.png", 600, -140, largura=1000,
                     sobra=(SOBRA, 1.46)))
    # as duas cenas prontas do cap. 96: a folha tem o quadro exatamente onde
    # a cena punha a PNG (CemSocos: 86% centrado; SemInimigos: esquerda 10%,
    # 92% da altura). A cena SemInimigos entra 3,6x no balão: escala 2.
    larg = 1920 * 0.86
    alt = larg * 630 / 1500
    add(folha_quadro("cs", "socos", 243, "manga/v10b-soco-detalhe.png", (1920 - larg) / 2, (1080 - alt) / 2,
                     largura=larg))
    alt = 1080 * 0.92
    add(folha_quadro("si", "socos", 244, "manga/v11-sem-inimigos.png", 1920 * 0.10, (1080 - alt) / 2,
                     altura=alt, escala=2.0))

    # ---------------- BLOCO 5 · socos ---------------------------------
    add(cartela(5))
    add(folha_tipo("t5a", "socos", 250, [
        [("não resistência", "ebg-700.ttf", 150, ESQ, 330, dict(tremor=0.9))],
        [("O DEFENSOR MAIS CONHECIDO", "oswald.ttf", 25, ESQ + 4, 560, LBL),
         ("Tolstói", "ebg-700.ttf", 88, ESQ, 598, dict(tremor=0.7))],
    ]))
    add(folha_tipo("t5b", "socos", 251, [
        [("O Reino de Deus", "ebg-700.ttf", 100, DIR, 250, dict(ancora="dir", tremor=0.8)),
         ("Está em Vós", "ebg-700.ttf", 100, DIR, 366, dict(ancora="dir", tremor=0.8))],
        [("1893", "anton.ttf", 290, DIR + 8, 470, dict(ancora="dir", tinta=FERRUGEM, tracking=-0.02, tremor=1.3))],
        [("O SERMÃO DA MONTANHA, LIDO AO PÉ DA LETRA", "oswald.ttf", 23, DIR, 860, LBL_D)],
    ]))
    # raiva, medo, ódio: o espaço entre as palavras é o mesmo, medido pela
    # largura real de cada uma (Anton tem larguras bem diferentes)
    xs, x = [], ESQ - 6
    for pal in ("RAIVA", "MEDO", "ÓDIO"):
        xs.append(x)
        x += Folha("_", "socos", 0).tipo(P.chapa(10, 10), pal, "anton.ttf", 190, 0, 0) + 74
    add(folha_tipo("t5c", "socos", 252, [
        [("RAIVA", "anton.ttf", 190, xs[0], 300, dict(tremor=1.2))],
        [("MEDO", "anton.ttf", 190, xs[1], 300, dict(tremor=1.2))],
        [("ÓDIO", "anton.ttf", 190, xs[2], 300, dict(tremor=1.2))],
        [("E nenhum dos três é amor.", "ebg-500.ttf", 56, ESQ, 640)],
    ]))
    add(folha_tipo("t5d", "socos", 253, [
        [("O LIVRO CHEGOU NAS MÃOS DE", "oswald.ttf", 25, DIR, 350, LBL_D),
         ("Gandhi.", "ebg-700.ttf", 150, DIR, 392, dict(ancora="dir", tremor=0.9))],
        [("ELE DIZIA QUE FOI DECISIVO", "oswald.ttf", 25, DIR, 640, LBL_D)],
    ]))

    # ---------------- BLOCO 6 · báltico -------------------------------
    add(cartela(6))
    add(folha_quadro("q6a", "baltico", 260, "manga/v12c-atras-do-mastro.png", -150, 160, largura=2220,
                     sobra=(1.30, SOBRA)))
    add(folha_quadro("q6b", "baltico", 261, "manga/v12b-thorfinn-retrato.png", ESQ, 70, largura=940, tipo=[
        [("THORFINN ESTÁ", "oswald.ttf", 26, 1260, 430, LBL),
         ("no segundo", "ebg-700.ttf", 80, 1256, 470, dict(tremor=0.7)),
         ("grupo.", "ebg-700.ttf", 80, 1256, 566, dict(tremor=0.7))],
    ]))

    # ---------------- BLOCO 7 · neve ----------------------------------
    add(folha_quadro("h7", "neve", 270, "foto/h01-lanse-aux-meadows.png", -280, -220, largura=2480,
                     branco=0.97, preto=0.06, sobra=(1.40, 1.62)))
    linhas = []
    for i, (num, txt) in enumerate([("8", "CONSTRUÇÕES DE TURFA SOBRE ESTRUTURA DE MADEIRA"),
                                    ("1", "CASA GRANDE"), ("1", "FORJA DE FERRO"),
                                    ("1", "OFICINA DE CARPINTARIA"), ("1", "ÁREA DE REPARO DE BARCO"),
                                    ("800+", "OBJETOS")]):
        y = 200 + i * 116
        linhas.append([(num, "anton.ttf", 92, 470, y, dict(ancora="dir", tremor=0.9)),
                       (txt, "oswald.ttf", 30, 512, y + 46, LBL)])
    add(folha_tipo("t7a", "neve", 271, linhas))
    add(grafico())
    add(cartela(7))
    add(folha_quadro("q7a", "neve", 272, "manga/v17-navios.png", -110, -30, largura=2140,
                     recorte=(0.0, 0.0, 1.0, 0.70)))
    add(folha_tipo("t7b", "neve", 273, [
        [("A terra prometida", "ebg-700.ttf", 112, ESQ, 360, dict(tremor=0.8)),
         ("era uma oficina.", "ebg-700.ttf", 112, ESQ, 490, dict(tremor=0.8))],
    ]))

    # ---------------- BLOCO 8 · broto ---------------------------------
    f = Folha("t8a", "broto", 280)
    ce, cd = f.chapa(), f.chapa()
    meio = 1000
    f.tipo(ce, "O THORFINN DO YUKIMURA", "oswald.ttf", 24, ESQ + 4, 280, **LBL)
    for i, l in enumerate(["Vinte anos indo", "em direção a Vinland,"]):
        f.tipo(ce, l, "ebg-700.ttf", 62, ESQ, 326 + i * 78, semente=2800 + i, tremor=0.6)
    for i, l in enumerate(["onde não haveria guerra", "nem escravo."]):
        f.tipo(ce, l, "ebg-500.ttf", 36, ESQ, 520 + i * 50, semente=2802 + i)
    f.tipo(cd, "O THORFINN DE VERDADE", "oswald.ttf", 24, meio + 4, 280, **LBL)
    for i, l in enumerate(["Chegou lá, brigou,", "não segurou o grupo."]):
        f.tipo(cd, l, "ebg-700.ttf", 62, meio, 326 + i * 78, semente=2810 + i, tremor=0.6)
    for i, l in enumerate(["Voltou e comprou uma", "fazenda na Islândia."]):
        f.tipo(cd, l, "ebg-500.ttf", 36, meio, 520 + i * 50, semente=2812 + i)
    f.fio(ce, meio - 86, 276, meio - 84, 620)
    f.el("esq", ce, semente=2820, torcao=0.13, **PR)
    f.el("dir", cd, semente=2821, torcao=-0.18, **PR)
    f.passo({"esq": 1})
    f.passo({"dir": 1})
    add(f)
    add(folha_quadro("q8a", "broto", 281, "manga/v08b-cesto-de-pedra.png", DIR - 640, 140, largura=640, tipo=[
        [("Arrancando toco.", "ebg-700.ttf", 86, ESQ, 380, dict(tremor=0.7))],
        [("Era escravo.", "ebg-700.ttf", 86, ESQ, 500, dict(tremor=0.7))],
    ]))
    add(folha_quadro("q8b", "broto", 282, "manga/v07-arrancando-toco.png", -240, -80, largura=2400,
                     sobra=(1.40, SOBRA)))
    add(cartela(2, tom="broto"))
    add(folha_tipo("t8b", "broto", 283, [
        [("um texto que já foi mexido", "ebg-700.ttf", 86, ESQ, 330, dict(tremor=0.7))],
        [("por alguém que queria", "ebg-700.ttf", 86, ESQ, 440, dict(tremor=0.7))],
        [("contar uma história melhor.", "ebg-700.ttf", 86, ESQ, 550, dict(tremor=0.7))],
    ]))
    add(folha_quadro("q8c", "broto", 284, "manga/v16-familia-capa.png", 700, -150, largura=1040,
                     recorte=(0.05, 0.0, 1.0, 0.93), sobra=(SOBRA, 1.62)))
    add(folha_tipo("t8c", "broto", 285, [
        [("O PACIFISMO ABSOLUTO E A ARQUEOLOGIA DIZEM A MESMA COISA", "oswald.ttf", 24, ESQ + 4, 290, LBL)],
        [("Uma posição que só se sustenta", "ebg-700.ttf", 84, ESQ, 340, dict(tremor=0.7)),
         ("se funcionar não é uma posição.", "ebg-700.ttf", 84, ESQ, 448, dict(tremor=0.7))],
        [("É uma estratégia.", "ebg-700.ttf", 84, ESQ, 600, dict(tinta=FERRUGEM, tremor=0.7))],
    ]))
    add(folha_quadro("q8d", "broto", 286, "manga/v12b-thorfinn-retrato.png", DIR - 760, 130, largura=760, tipo=[
        [("Tolstói recusou a violência", "ebg-700.ttf", 64, ESQ, 330, dict(tremor=0.6)),
         ("sem prometer vitória.", "ebg-700.ttf", 64, ESQ, 410, dict(tremor=0.6))],
        [("Thorfinn recusa sem", "ebg-700.ttf", 64, ESQ, 560, dict(tremor=0.6)),
         ("garantia de chegar.", "ebg-700.ttf", 64, ESQ, 640, dict(tremor=0.6))],
    ]))
    add(folha_quadro("h8", "broto", 287, "foto/h01-lanse-aux-meadows.png", -280, -220, largura=2480,
                     branco=0.97, preto=0.06, sobra=(1.40, 1.62)))
    add(folha_tipo("t8e", "broto", 288, [
        [("Nada disso refuta a obra.", "ebg-700.ttf", 92, ESQ, 380, dict(tremor=0.7))],
        [("Isso é a obra.", "ebg-700.ttf", 92, ESQ, 500, dict(tremor=0.7))],
    ]))
    add(folha_quadro("q8e", "broto", 289, "manga/v18-painel-final.png", 560, -110, largura=860,
                     recorte=(0.05, 0.0, 1.0, 0.94), sobra=(SOBRA, 1.36), modo="baixo"))
    add(cartela(8))
    return F


# ===================================================================== #
#  O GRÁFICO DOS ANÉIS                                                  #
# ===================================================================== #
# medido na g01-anel-993.png (1920x1080): centro e raios do anel de 993,
# a régua do anel marcado até a casca e onde caem os 28 traços.
REGUA = ((640, 494), (917, 370))


def grafico():
    """g01 impresso na prensa, em partes, pra animar.

    A coluna de texto da direita veio em Cormorant e sem acento ("ANEIS",
    "arvores", "ate", "nordicos"). O briefing proíbe Cormorant justamente
    por causa dos acentos, então ela é recomposta aqui em EB Garamond, com
    o mesmo texto acentuado. O resto do desenho (anéis, régua, rótulos em
    Anton/Oswald) é o arquivo entregue, virado chapa."""
    f = Folha("g7", "neve", 275)
    g = np.asarray(Image.open(os.path.join(PUB, "grafico/g01-anel-993.png")).convert("L"), float) / 255
    # papel do gráfico (0,89) vira zero de tinta; traço preto vira tinta cheia
    cob = np.clip((0.80 - g) / (0.80 - 0.10), 0, 1)
    cob[cob < 0.06] = 0
    Hh, Ww = cob.shape
    yy, xx = np.mgrid[0:Hh, 0:Ww]
    # regiões, em pixel do gráfico
    # a coluna de texto original (Cormorant sem acento): linhas 372 a 862, a partir de x=1084
    texto = (xx >= 1060) & (yy >= 340) & (yy <= 880)
    # a legenda "1021 / O ANO DO CORTE" (até x=1135) e a linha-guia que desce
    # dela até a ponta da régua; para antes de encostar na casca
    lx0, ly0, lx1, ly1 = 979, 326, 918, 369
    lt = ((xx - lx0) * (lx1 - lx0) + (yy - ly0) * (ly1 - ly0)) / ((lx1 - lx0) ** 2 + (ly1 - ly0) ** 2)
    ld = np.abs((xx - lx0) * (ly1 - ly0) - (yy - ly0) * (lx1 - lx0)) / np.hypot(lx1 - lx0, ly1 - ly0)
    guia = (ld <= 3) & (lt >= -0.05) & (lt <= 0.9)
    rot1021 = ((xx >= 925) & (yy >= 222) & (yy <= 322) & (xx <= 1145)) | guia
    (ax, ay), (bx, by) = REGUA
    vx, vy = bx - ax, by - ay
    L = np.hypot(vx, vy)
    t = ((xx - ax) * vx + (yy - ay) * vy) / (L * L)
    dist = np.abs((xx - ax) * vy - (yy - ay) * vx) / L
    regua = (dist <= 11) & (t >= -0.01) & (t <= 1.03)
    aneis = cob * ~texto * ~rot1021
    # a régua conta: o traço dela vira ferrugem por cima do preto, um por um
    regua_cob = cob * regua
    lider = cob * rot1021

    def chapa_de(a):
        ch = f.chapa()
        peca = Image.fromarray((a * 255).astype(np.uint8)).resize(
            (round(Ww * f.e), round(Hh * f.e)), Image.LANCZOS)
        return P.colar_chapa(ch, peca, f.x(0), f.y(0))

    ch_txt = f.chapa()
    # mesmas posições do original: título em 372, fio em 445, corpo de 46 em 46 px
    X0 = 1084
    f.tipo(ch_txt, "VINTE E OITO ANÉIS", "ebg-700.ttf", 54, X0, 362, tracking=0.04, semente=2751, tremor=0.5)
    f.fio(ch_txt, X0, 445, X0 + 286, 447)
    corpo = ["Em 993 uma tempestade solar deixou o mesmo pico de",
             "carbono-14 nos anéis de todas as árvores do planeta.",
             "O pico funciona como marco.", "",
             "Conta-se do anel marcado até a casca. Vinte e oito",
             "anéis depois está a madeira que os nórdicos cortaram",
             "em L'Anse aux Meadows."]
    for i, l in enumerate(corpo):
        if l:
            f.tipo(ch_txt, l, "ebg-500.ttf", 32, X0, 489 + i * 46, semente=2752 + i)
    ch_fonte = f.chapa()
    f.tipo(ch_fonte, "KUITEMS ET AL., NATURE, 2021", "oswald.ttf", 18, X0 + 1, 845, tracking=0.08, semente=2760)

    f.el("aneis", chapa_de(aneis), semente=2761, torcao=0.0, ganho=0.6, mordida=0.3, batida=0.2, falha=0.3)
    f.el("texto", ch_txt, semente=2762, torcao=0.11, **PR)
    f.el("fonte", ch_fonte, semente=2763, torcao=0.11, forca=0.55, **PR)
    f.el("regua", chapa_de(regua_cob), tinta=FERRUGEM, semente=2764, torcao=0.0, ganho=0.5,
         mordida=0.2, batida=0.1, falha=0.15)
    f.el("1021", chapa_de(lider), semente=2765, torcao=0.0, ganho=0.6, mordida=0.3, batida=0.2, falha=0.3)
    cx, cy = 464, 533
    f.passo({"aneis": 1}, modo="radial", centro=(cx, cy, 451, 381))
    f.passo({"texto": 1, "fonte": 1})
    f.passo({"regua": 1}, modo="escada", linha=REGUA, marcas=marcas_da_regua(g))
    f.passo({"1021": 1})
    return f


def marcas_da_regua(g):
    """Onde cada um dos 28 anéis cruza a régua (0..1 do anel de 993 até a
    casca), medido na própria PNG. Os traços da régua caem em cima dos anéis,
    então quem se conta é o anel: a 18–20 px do eixo, fora do comprimento do
    traço, só o anel continua. Mede dos dois lados e tira a média (os anéis
    cruzam levemente inclinados)."""
    (ax, ay), (bx, by) = REGUA
    vx, vy = bx - ax, by - ay
    L = np.hypot(vx, vy)
    nx, ny = -vy / L, vx / L
    ts = np.linspace(-0.05, 1.05, int(L * 6))

    def cruzamentos(ds):
        s = []
        for t in ts:
            px, py = ax + vx * t, ay + vy * t
            s.append(max(1 - g[int(round(py + ny * d)), int(round(px + nx * d))] for d in ds))
        s = ndimage.gaussian_filter1d(np.array(s), 0.8)
        m = []
        for i in range(1, len(s) - 1):
            if s[i] > 0.30 and s[i] >= s[i - 1] and s[i] >= s[i + 1] and 0 < ts[i] < 1:
                if not m or ts[i] - m[-1] > 0.01:
                    m.append(float(ts[i]))
        return m

    a, b = cruzamentos((18, 19, 20)), cruzamentos((-18, -19, -20))
    if len(a) != 28 or len(b) != 28:
        raise SystemExit(f"régua: esperava 28 anéis, achei {len(a)} e {len(b)}")
    return [round((p + q) / 2, 4) for p, q in zip(a, b)]


# ===================================================================== #
if __name__ == "__main__":
    F = todas()
    pedidos = sys.argv[1:] or list(F)
    meta = json.load(open(META)) if os.path.exists(META) else {}
    for id in pedidos:
        f = F[id]
        m = f.imprimir()
        if hasattr(f, "tamanho"):
            m["quadro"] = [round(v, 1) for v in f.tamanho]
        if id == "g7":
            m["marcas"] = len(f.passos[2]["marcas"])
        meta[id] = m
        print(f"{id:8s} {m['w']}x{m['h']}  estados {m['estados']}  grão da folha {m['grao_folha']}", flush=True)
    os.makedirs(os.path.dirname(META), exist_ok=True)
    json.dump(meta, open(META, "w"), ensure_ascii=False, indent=1)
