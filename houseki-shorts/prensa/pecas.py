#!/usr/bin/env python3
"""
As peças dos quatro Shorts — cada uma impressa UMA vez.

O Python imprime; o Remotion move. Cada peça é um PLANO (a folha que vive
dentro do espaço 3D) com duas camadas:

  papel   a folha em si, com grão, fibra e mancha. Pode ter estados de cor
          (no Memória o papel deriva uma vez por perda): a cor nova entra
          pela mesma máscara de ruído da tinta. Reimpressa, não dissolvida.
  tinta   tudo o que a prensa pôs no papel, impresso sobre BRANCO e somado
          ao papel no Remotion por multiplicação. É assim que tinta
          transparente se comporta, e é o que deixa o grão do papel aparecer
          por baixo da mancha. Os estados são cumulativos: o estado k é o
          k-1 com mais uma passada, e a revelação vai de um ao outro pela
          ordem de um campo (leitura, unidade por unidade, a régua descendo,
          o círculo se fechando).

Unidades: pixel do QUADRO (1080x1920). (0, 0) é o canto do quadro quando a
câmera está no centro do plano; o plano tem sobra em volta para a
inclinação de até 14 graus nunca mostrar a borda.

Uso:  python3 -I prensa/pecas.py                 (todas)
      python3 -I prensa/pecas.py lev nav-vaso     (só essas)
Saída: public/pecas/<id>-papel-<k>.jpg, <id>-tinta-<k>.jpg, os campos
<id>-papel-o<k>.png / <id>-tinta-o<k>.png e src/data/pecas.json.
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
OUT = os.path.join(PUB, "pecas")
META = os.path.join(RAIZ, "src", "data", "pecas.json")

FW, FH = 1080, 1920
# zona segura do v1: nada legível fora de x 60..920, y 120..1540. A coluna
# de texto começa em 96 (as provas) e para em 920 (os botões do Shorts).
MG, DIR = 96, 920
COL = DIR - MG
# grão de superfície do papel; calibrado no frame renderizado (alvo 6 a 8)
GRAO = float(os.environ.get("GRAO", 8.8))

TURFA = (0x15, 0x13, 0x0F)
FERRUGEM = (0x7A, 0x3B, 0x22)
hx = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))

# o papel é o Phos (theme.ts do ensaio); o Pedra usa o papel da prova da
# fosfofilita (h24), para a peça tratada cortar sem costura
PAPEL = {
    "fosfofilita": hx("#DCE6E2"), "agata": hx("#E0DDD4"), "ouro": hx("#E6DFCE"),
    "lapis": hx("#DCDEE4"), "perola": hx("#E6E4DE"), "prata": hx("#E2E3E4"),
    "mercurio": hx("#DEDFE0"), "neutro": hx("#E4E2DD"), "pedra": (0xDE, 0xDA, 0xD0),
}

# a impressão da casa: tipo pequeno no padrão, tipo grande manchando
# (V2 §4-bis: carga acima de corpo 150 com falha 0,70–0,85 e ganho 0,60–0,66)
PR = dict(ganho=0.58, mordida=0.26, batida=0.26, falha=0.46, torcao=0.10)
PG = dict(ganho=0.62, mordida=0.30, batida=0.26, falha=0.78, torcao=0.10, mancha=0.62)
PQ = dict(ganho=0.66, mordida=0.30, batida=0.26, falha=0.40, torcao=0.13)   # gravura e quadro

AN, EG, EB, OS = "anton.ttf", "ebg-500.ttf", "ebg-700.ttf", "oswald.ttf"


def manchar(f, ch, semente, quanto):
    """O miolo de área sólida grande não entinta igual (V2 §4-bis): a tinta
    falta em manchas irregulares por dentro do traço, e a borda, onde a
    prensa empurra a tinta, fica cheia. O falha da prensa sozinho só abre
    pontos raros; aqui a falta de tinta tem corpo de mancha."""
    g = np.random.default_rng(semente + 4242)
    cob = np.asarray(ch, float) / 255 > 0.5
    if not cob.any():
        return f
    prof = ndimage.distance_transform_edt(cob)
    miolo = np.clip((prof - 3.0) / 9.0, 0, 1)
    H, W = cob.shape
    n = ndimage.gaussian_filter(g.random((H, W)), 4.0)
    n = (n - n.mean()) / (n.std() + 1e-9)
    m = ndimage.gaussian_filter(g.random((H, W)), 16.0)
    m = (m - m.mean()) / (m.std() + 1e-9)
    # manchas médias (onde a tinta acabou) e salpico fino dentro delas
    falta = np.clip((0.6 * m + 0.4 * n - 0.55) / 1.1, 0, 1) ** 1.5
    tira = (miolo * falta * quanto)[..., None]
    return 255 - (255 - f) * (1 - tira)


# ===================================================================== #
#  MEDIDA: corpo e empilhamento saem da tinta, nunca do olho            #
# ===================================================================== #
_med = {}


def tinta_de(texto, fonte, corpo, tracking=0.0):
    """Caixa de tinta REAL (x0, y0, x1, y1) de uma linha desenhada na origem.
    A caixa métrica da fonte não é onde a tinta está (no Anton ela é muito
    maior que o olho do numeral), então desenha e mede."""
    k = (texto, fonte, corpo, round(tracking, 4))
    if k not in _med:
        pad = corpo
        ch = P.chapa(int(corpo * (len(texto) + 4) * 1.2) + 2 * pad, int(corpo * 2.4) + 2 * pad)
        P.linha(ch, texto, P.fonte(fonte, corpo), pad, pad, tracking=tracking)
        cx = P.caixa_tinta(ch)
        _med[k] = (cx[0] - pad, cx[1] - pad, cx[2] - pad, cx[3] - pad) if cx else (0, 0, 0, 0)
    return _med[k]


def cabe(texto, fonte, largura, lo=24, hi=460, tracking=0.0):
    """Maior corpo cuja tinta caiba na largura (busca binária na tinta)."""
    melhor = lo
    while lo <= hi:
        m = (lo + hi) // 2
        x0, _, x1, _ = tinta_de(texto, fonte, m, tracking)
        if x1 - x0 <= largura:
            melhor, lo = m, m + 1
        else:
            hi = m - 1
    return melhor


# ===================================================================== #
#  O PLANO                                                              #
# ===================================================================== #
class Plano:
    def __init__(self, id, tons, semente, sobra=(1.32, 1.24), tamanho=None, origem=None,
                 aspereza=1.0, grao=None, grao_sigma=0.55):
        """tons: chave de PAPEL (ou lista delas: estados de cor do papel).
        tamanho: (W, H) do plano em px; por padrão o quadro vezes a sobra.
        origem: onde o canto (0, 0) do quadro cai no plano; por padrão o
        quadro fica centrado."""
        self.id = id
        self.tons = tons if isinstance(tons, list) else [tons]
        self.semente = semente
        self.W, self.H = tamanho or (round(FW * sobra[0]), round(FH * sobra[1]))
        self.ox, self.oy = origem or ((self.W - FW) // 2, (self.H - FH) // 2)
        self.aspereza = aspereza
        self.grao = GRAO if grao is None else grao
        self.grao_sigma = grao_sigma
        self.elementos = []       # (nome, chapa, kw)
        self.estados = [{}]       # estados da tinta: {nome: forca}
        self.passos = []          # um por estado depois do 0
        self.pecas = []           # (tipo, x0, y0, x1, y1) em px do plano
        self.unidades = {}        # nome -> lista de caixas (ordem do desenho)
        self.passos_papel = []    # trocas de cor do papel

    # --- unidades ----------------------------------------------------
    def x(self, v):
        return round(v + self.ox)

    def y(self, v):
        return round(v + self.oy)

    def chapa(self):
        return P.chapa(self.W, self.H)

    # --- composição -------------------------------------------------
    def tipo(self, ch, texto, fonte, corpo, x, y, tracking=0.0, ancora="esq", semente=0, tremor=0.0,
             topo="tinta"):
        """Escreve com o TOPO DA TINTA em y (não o topo da caixa da fonte) e
        devolve a caixa de tinta em px do quadro. topo="altura": y é o topo
        da caixa-alta (o acento sobe acima dele, medido)."""
        t = tinta_de(texto, fonte, corpo, tracking)
        larg = t[2] - t[0]
        x0 = x - {"centro": larg / 2, "dir": larg}.get(ancora, 0) - t[0]
        if topo == "altura":
            y = y - (tinta_de("H", fonte, corpo)[1] - t[1])
        X, Y = self.x(x0), self.y(y - t[1])
        P.linha(ch, texto, P.fonte(fonte, corpo), X, Y, tracking=tracking, semente=semente, tremor=tremor)
        caixa = (x0 + t[0], y, x0 + t[2], y + t[3] - t[1])
        self.pecas.append(("tipo", self.x(caixa[0]), self.y(caixa[1]), self.x(caixa[2]), self.y(caixa[3]), id(ch)))
        return caixa

    def quadro(self, ch, arq, x, y, largura=None, altura=None, recorte=None, branco=0.95, preto=0.12,
               moldura=0):
        """Imagem virando chapa: pontos de branco e preto, nunca contraste
        simétrico (senão a margem branca vira moldura cinza). PNG com alfa
        (as pranchas clássicas, cinza + alfa): a cobertura é multiplicada
        pelo alfa, que já vem esfumado no arquivo."""
        im = Image.open(os.path.join(PUB, arq))
        alfa = im.getchannel("A") if im.mode in ("LA", "RGBA") else None
        im = im.convert("L")
        if recorte:
            fx0, fy0, fx1, fy1 = recorte
            caixa = (round(im.width * fx0), round(im.height * fy0), round(im.width * fx1), round(im.height * fy1))
            im = im.crop(caixa)
            alfa = alfa.crop(caixa) if alfa else None
        r = im.width / im.height
        if largura is None:
            largura = altura * r
        w = round(largura)
        h = round(w / r)
        im = im.resize((w, h), Image.LANCZOS)
        a = np.asarray(im, float) / 255
        cob = np.clip((branco - a) / (branco - preto), 0, 1)
        if alfa is not None:
            cob *= np.asarray(alfa.resize((w, h), Image.LANCZOS), float) / 255
        if moldura:
            m = moldura
            cob[:m, :] = cob[-m:, :] = 1
            cob[:, :m] = cob[:, -m:] = 1
        peca = Image.fromarray((cob * 255).astype(np.uint8))
        nova = P.colar_chapa(ch, peca, self.x(x), self.y(y))
        self.pecas.append(("quadro", self.x(x), self.y(y), self.x(x) + w, self.y(y) + h, id(nova)))
        return nova, (x, y, x + w, y + h)

    def fio(self, ch, x0, y0, x1, y1):
        ImageDraw.Draw(ch).rectangle([self.x(x0), self.y(y0), self.x(x1), self.y(y1)], fill=255)
        self.pecas.append(("fio", self.x(x0), self.y(y0), self.x(x1) + 1, self.y(y1) + 1, id(ch)))
        return ch

    def grade(self, ch, nome, celulas, lado=30, semente=0):
        """Unidades: quadrados de `lado` px nas posições dadas (em px do
        quadro), com jitter de ±1,5 px — grade perfeita entrega render. A
        ordem da lista é a ordem em que elas se desenham na rajada."""
        g = np.random.default_rng(semente)
        d = ImageDraw.Draw(ch)
        caixas = []
        for (cx, cy, *estilo) in celulas:
            jx, jy = g.uniform(-1.5, 1.5, 2)
            s = lado + g.uniform(-1.0, 1.0)
            x0, y0 = self.x(cx - s / 2 + jx), self.y(cy - s / 2 + jy)
            x1, y1 = self.x(cx + s / 2 + jx), self.y(cy + s / 2 + jy)
            if estilo and estilo[0] == "vazado":
                d.rectangle([x0, y0, x1, y1], outline=255, width=4)
            else:
                d.rectangle([x0, y0, x1, y1], fill=255)
            caixas.append((x0 - 3, y0 - 3, x1 + 3, y1 + 3))
        self.unidades[nome] = self.unidades.get(nome, []) + caixas
        return ch

    def circulo(self, ch, cx, cy, r, espessura=5, semente=0):
        """Círculo que marca, à mão: raio bambo, ponta que passa do começo."""
        g = np.random.default_rng(semente)
        d = ImageDraw.Draw(ch)
        n = 360
        a0 = g.uniform(0, 2 * np.pi)
        ang = a0 + np.linspace(0, 2 * np.pi * 1.08, n)
        bam = ndimage.gaussian_filter1d(g.normal(0, 1, n), 18, mode="wrap")
        rr = r * (1 + 0.035 * bam / (np.abs(bam).max() + 1e-9))
        pts = [(self.x(cx + rr[i] * np.cos(ang[i])), self.y(cy + rr[i] * 0.92 * np.sin(ang[i]))) for i in range(n)]
        d.line(pts, fill=255, width=espessura, joint="curve")
        self.circ = (self.x(cx), self.y(cy), a0)
        self.pecas.append(("circulo", self.x(cx - r), self.y(cy - r), self.x(cx + r), self.y(cy + r), id(ch)))
        return ch

    # --- o que passa na prensa --------------------------------------
    def el(self, nome, ch, **kw):
        self.elementos.append((nome, ch, kw))
        self.chapa_de = getattr(self, "chapa_de", {})
        self.chapa_de[nome] = id(ch)
        return nome

    def no_papel(self, *nomes):
        for n in nomes:
            self.estados[0][n] = 1.0

    def passo(self, muda, modo="leitura", **opcoes):
        """Um estado novo. modo="corte": troca seca, sem campo (limpeza de
        tela na troca de batida grande — nunca fade)."""
        novo = dict(self.estados[-1])
        novo.update(muda)
        self.estados.append(novo)
        self.passos.append(dict(modo=modo, **opcoes))

    def limpa(self, nome, manter=()):
        """Corte seco: tira da folha tudo o que não está em `manter`."""
        self.passo({n: 0 for n, v in self.estados[-1].items() if v > 0 and n not in manter}, modo="corte", nome=nome)

    def troca_papel(self, **opcoes):
        """Mais um estado de cor do papel (a ordem é a lista `tons`)."""
        self.passos_papel.append(dict(modo="mancha", **opcoes))

    # --- impressão ----------------------------------------------------
    def tinta_estado(self, estado, papel_medio, base=None, so=None):
        """Imprime o estado sobre branco. base/so: atalho quando o estado só
        acrescenta elementos registrados depois de tudo o que já estava na
        folha — aí basta passar os novos por cima do estado anterior (é a
        mesma ordem de prensa, sem reimprimir tudo a cada passo)."""
        f = np.full((self.H, self.W, 3), 255.0) if base is None else base.copy()
        for nome, ch, kw in self.elementos:
            forca = estado.get(nome, 0.0)
            if forca <= 0 or (so is not None and nome not in so):
                continue
            kw = dict(kw)
            if "pronta" in kw:
                # camada de tinta que já veio pronta (a fosfofilita tratada)
                cam = np.asarray(Image.open(kw["pronta"]).convert("RGB"), float) / 255
                X, Y = kw["em"]
                h, w = cam.shape[:2]
                f[Y:Y + h, X:X + w] *= cam
                continue
            kw["forca"] = kw.get("forca", 1.0) * forca
            # a camada vai por multiplicação sobre o papel: a tinta é
            # impressa clareada pelo tom do papel, para chegar na cor certa
            t = np.array(kw.pop("tinta", TURFA), float)
            kw["tinta"] = tuple(np.clip(t * 255 / papel_medio, 0, 255))
            mancha = kw.pop("mancha", 0.0)
            antes = f
            f = P.imprimir(f, ch, **kw)
            if mancha > 0:
                f = np.minimum(antes, manchar(f, ch, kw.get("semente", 0), mancha))
        return f

    def imprimir(self):
        os.makedirs(OUT, exist_ok=True)
        meta = dict(id=self.id, w=self.W, h=self.H, ox=self.ox, oy=self.oy, tons=self.tons)
        # papel: um estado por tom, mesma semente (a folha é a mesma, a cor não)
        papeis = []
        for k, tom in enumerate(self.tons):
            arr = P.papel(self.W, self.H, PAPEL[tom], semente=self.semente, aspereza=self.aspereza, grao=self.grao,
                          grao_sigma=self.grao_sigma)
            P.salvar(arr, f"{OUT}/{self.id}-papel-{k}.jpg", q=94)
            papeis.append(arr)
        meta["papel"] = []
        for k in range(1, len(papeis)):
            op = self.passos_papel[k - 1] if k - 1 < len(self.passos_papel) else dict(modo="mancha")
            meta["papel"].append(self.campo(papeis[k - 1], papeis[k], f"papel-o{k}", op, k))
        meta["grao_folha"] = round(P.medir_grao(papeis[0], (self.H // 10, self.H // 10 * 2,
                                                            self.W // 10, self.W // 10 * 3)), 2)
        # tinta
        medio = np.array(PAPEL[self.tons[0]], float)
        meta["tinta"] = []
        anterior = None
        ordem = {nome: i for i, (nome, _, _) in enumerate(self.elementos)}
        for k, estado in enumerate(self.estados):
            arr = None
            if k > 0:
                ant = self.estados[k - 1]
                novos = [n for n in estado if n not in ant]
                mesmo = all(estado.get(n) == v for n, v in ant.items())
                ultimo = max((ordem[n] for n, v in ant.items() if v > 0), default=-1)
                if mesmo and novos and all(ordem[n] > ultimo for n in novos):
                    arr = self.tinta_estado(estado, medio, base=anterior, so=set(novos))
            if arr is None:
                arr = self.tinta_estado(estado, medio)
            P.salvar(arr, f"{OUT}/{self.id}-tinta-{k}.jpg", q=94)
            if k > 0:
                ant = self.estados[k - 1]
                mudou = {n for n in set(estado) | set(ant) if estado.get(n, 0) != ant.get(n, 0)}
                self.chapas_do_passo = {self.chapa_de[n] for n in mudou if n in self.chapa_de}
                meta["tinta"].append(self.campo(anterior, arr, f"tinta-o{k}", self.passos[k - 1], k))
            anterior = arr
        meta["estados"] = len(self.estados)
        return meta

    # --- a ordem em que a tinta aparece -------------------------------
    def campo(self, a, b, nome, opcoes, k):
        if opcoes["modo"] == "corte":
            return dict(caixa=[0, 0, 1, 1], largura=1, modo="corte", nome=opcoes.get("nome"))
        d = np.abs(b.mean(2) - a.mean(2)) > 3
        if opcoes["modo"] == "mancha":
            d = np.ones_like(d)           # o papel inteiro muda de cor
        d = ndimage.binary_dilation(d, iterations=6)
        ys, xs = np.where(d)
        if len(ys) == 0:
            x0, y0, x1, y1 = 0, 0, 1, 1
        else:
            x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        H, W = y1 - y0, x1 - x0
        g = np.random.default_rng(self.semente * 31 + k + (7 if nome.startswith("papel") else 0))
        modo = opcoes["modo"]
        largura = 0.04
        Y = np.arange(y0, y1, dtype=float)[:, None]
        X = np.arange(x0, x1, dtype=float)[None, :]
        if modo == "leitura":
            cru = (np.abs(b.mean(2) - a.mean(2)) > 3)[y0:y1, x0:x1]
            c, largura = self.campo_leitura(cru, x0, y0, g)
        elif modo == "mancha":
            # a cor nova entra em manchas, como a tinta: ruído largo e médio
            n1 = P._suave(g, H, W, 140)
            n2 = ndimage.gaussian_filter(g.random((H, W)), 18)
            n1 = (n1 - n1.mean()) / (n1.std() + 1e-9)
            n2 = (n2 - n2.mean()) / (n2.std() + 1e-9)
            c = n1 + 0.45 * n2
            largura = 0.08
        elif modo == "unidades":
            # cada unidade inteira de uma vez, na ordem em que foi desenhada
            caixas = self.unidades[opcoes["grupo"]]
            c = np.full((H, W), 1.0)
            N = len(caixas)
            for i, (a0, b0, a1, b1) in enumerate(caixas):
                c[max(0, b0 - y0):max(0, b1 - y0), max(0, a0 - x0):max(0, a1 - x0)] = (i + 0.5) / N
            largura = 0.35 / N
        elif modo == "regua":
            # a linha desce de cima pra baixo; o tique aparece quando ela passa
            c = np.clip((Y - y0) / max(1, H - 1), 0, 1) + 0 * X
            largura = 0.03
        elif modo == "angulo":
            # o círculo se fecha a partir de onde a pena encostou
            cx, cy, a0 = self.circ
            ang = np.arctan2(Y - cy, X - cx) - a0
            c = np.mod(ang, 2 * np.pi) / (2 * np.pi)
            largura = 0.02
        elif modo == "inteiro":
            # tudo de uma vez, com a borda em manchas (a ferrugem por cima)
            n = ndimage.gaussian_filter(g.random((H, W)), 9)
            c = (n - n.min()) / (n.max() - n.min() + 1e-9)
            largura = 0.25
        else:
            raise ValueError(modo)
        c = (c - c.min()) / (c.max() - c.min() + 1e-9)
        v = np.round(c * 65535).astype(np.uint32)
        rgb = np.zeros((H, W, 3), np.uint8)
        rgb[..., 0], rgb[..., 1] = v >> 8, v & 255
        Image.fromarray(rgb, "RGB").save(f"{OUT}/{self.id}-{nome}.png", optimize=True)
        return dict(caixa=[int(x0), int(y0), int(W), int(H)], largura=round(float(largura), 6), modo=modo,
                    nome=opcoes.get("nome"))

    def pecas_do_passo(self, cru, x0, y0):
        H, W = cru.shape
        sel = []
        # só as peças que este passo imprime: páginas diferentes do mesmo
        # plano reusam a mesma área, e a linha de outra página no mesmo
        # lugar não pode entrar na ordem desta
        chapas = getattr(self, "chapas_do_passo", None)
        for tipo, a0, b0, a1, b1, ch in self.pecas:
            if chapas is not None and ch not in chapas:
                continue
            lx0, ly0 = max(0, int(a0) - x0), max(0, int(b0) - y0)
            lx1, ly1 = min(W, int(np.ceil(a1)) - x0), min(H, int(np.ceil(b1)) - y0)
            if lx1 <= lx0 or ly1 <= ly0:
                continue
            if cru[ly0:ly1, lx0:lx1].sum() >= max(20, 0.02 * (lx1 - lx0) * (ly1 - ly0)):
                sel.append((tipo, lx0, ly0, lx1, ly1))
        if not sel:
            faixas = []
            for r in np.where(cru.any(1))[0]:
                if faixas and r - faixas[-1][1] <= 4:
                    faixas[-1][1] = r
                else:
                    faixas.append([r, r])
            for p, q in faixas or [[0, H - 1]]:
                cols = np.where(cru[p:q + 1].any(0))[0]
                sel.append(("tipo", int(cols.min()), int(p), int(cols.max()) + 1, int(q) + 1))
        vertical = lambda p: p[0] == "fio" and (p[4] - p[2]) > (p[3] - p[1])
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
        return ordem + sorted((p for p in sel if vertical(p)), key=lambda p: p[1])

    def campo_leitura(self, cru, x0, y0, g):
        """Ordem de leitura: uma linha inteira antes da seguinte, a frente na
        mesma velocidade em todas. Em manchas (V2: "a máscara de ruído da
        prensa revela a tinta em manchas"): o ruído tem a escala da letra e
        desvio grande, então a tinta chega em ilhas que se juntam, não numa
        borda reta."""
        H, W = cru.shape
        ordem = self.pecas_do_passo(cru, x0, y0)
        alt = [p[4] - p[2] for p in ordem if p[0] == "tipo"] or [min(p[3] - p[1], p[4] - p[2]) for p in ordem]
        hm = float(np.median(alt))

        def comprimento(p):
            w, h = p[3] - p[1], p[4] - p[2]
            if p[0] in ("quadro", "circulo"):
                return 0.25 * max(w, h)
            if p[0] == "fio" and h > w:
                return 0.5 * h
            return w

        L = np.array([comprimento(p) for p in ordem], float)
        S = np.concatenate([[0.0], np.cumsum(L)[:-1]])
        Y = np.arange(H, dtype=float)[:, None]
        X = np.arange(W, dtype=float)[None, :]
        dist = np.full((H, W), np.inf)
        c = np.zeros((H, W))
        for j, (tipo, a0, b0, a1, b1) in enumerate(ordem):
            d = np.maximum(np.maximum(a0 - X, X - a1), 0) ** 2 + np.maximum(np.maximum(b0 - Y, Y - b1), 0) ** 2
            xp = np.clip((X - a0) / max(1, a1 - a0), 0, 1)
            yp = np.clip((Y - b0) / max(1, b1 - b0), 0, 1)
            if tipo in ("quadro", "circulo"):
                pr = 0.62 * yp + 0.38 * xp
            elif tipo == "fio" and (b1 - b0) > (a1 - a0):
                pr = np.broadcast_to(yp, (H, W))
            else:
                pr = np.broadcast_to(xp, (H, W))
            m = d < dist
            dist[m] = d[m]
            c[m] = (S[j] + pr * L[j])[m]
        n = ndimage.gaussian_filter(g.random((H, W)), float(np.clip(0.22 * hm, 3, 40)))
        n = (n - n.mean()) / (n.std() + 1e-9)
        c = c + 0.22 * hm * n
        lo, hi = c.min(), c.max()
        frente = float(np.clip(0.30 * hm, 8, 64))
        return (c - lo) / (hi - lo), frente / (hi - lo)


# ===================================================================== #
#  TIPO CINÉTICO: um bloco que acumula                                  #
# ===================================================================== #
class Bloco:
    """Empilha pedaços de frase pela tinta medida. Cada pedaço vira um
    elemento (uma passada na prensa) e um passo de revelação."""

    def __init__(self, plano, x=MG, y=420, semente=0):
        self.p, self.x, self.y, self.s = plano, x, y, semente
        self.n = 0
        self.ultimo = None          # registro do pedaço anterior
        self.topo_tinta = None      # onde a tinta de cima termina

    def pedaco(self, linhas, registro, respiro=None, tinta=TURFA, nome=None, no_papel=False, **kw):
        """linhas: [(texto, fonte, corpo, tracking)]; registro: rotulo /
        conectivo / carga / pergunta. Devolve o nome do elemento."""
        p = self.p
        ch = p.chapa()
        if self.ultimo is not None:
            if respiro is None:
                respiro = {("conectivo", "carga"): 34, ("carga", "conectivo"): 46,
                           ("carga", "carga"): 30, ("conectivo", "conectivo"): 22,
                           ("rotulo", "conectivo"): 44, ("rotulo", "carga"): 40}.get(
                    (self.ultimo, registro), 36)
            self.y += respiro
        for i, (texto, fonte, corpo, tr) in enumerate(linhas):
            # a linha assenta pela caixa-alta (ritmo regular); o acento sobe
            # acima dela e nunca pode chegar a menos de 10 px da tinta de cima
            t, h = tinta_de(texto, fonte, corpo, tr), tinta_de("H", fonte, corpo)
            sobe = h[1] - t[1]
            y = max(self.y, self.topo_tinta + 10 + sobe) if self.topo_tinta is not None else self.y
            cx = p.tipo(ch, texto, fonte, corpo, self.x - (6 if fonte == AN else 0), y, tracking=tr,
                        semente=self.s * 10 + self.n * 3 + i, tremor=1.2 if fonte == AN else 0.6, topo="altura")
            self.topo_tinta = cx[3]
            self.y = cx[3] + (16 if fonte == AN else 14) * (i < len(linhas) - 1)
        el = f"b{self.s}-{self.n}"
        prensa = dict(PG if registro == "carga" and max(c for _, _, c, _ in linhas) > 150 else PR)
        prensa.update(kw)
        p.el(el, ch, tinta=tinta, semente=self.s * 100 + self.n, **prensa)
        if no_papel:
            p.no_papel(el)          # já está impresso no primeiro frame
        else:
            p.passo({el: 1}, nome=nome or el)
        self.n += 1
        self.ultimo = registro
        return el


def conectivo(texto, corpo=48):
    return (texto, EG, corpo, 0.0)


def carga(texto, corpo, tr=-0.02):
    return (texto, AN, corpo, tr)


def rotulo(texto, corpo=40):
    return (texto, OS, corpo, 0.22)
