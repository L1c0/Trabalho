#!/usr/bin/env python3
"""
As peças dos quatro Shorts (houseki-SHORTS-V2.md), impressas uma vez.

Os frames em que cada pedaço entra NÃO moram aqui: aqui só se compõe e se
imprime. A montagem (src/data/montagem.ts) diz quando cada passo revela,
pelo nome do passo.

Uso:  python3 -I prensa/shorts.py              (todas)
      python3 -I prensa/shorts.py lev ped-a    (só essas)
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import pecas as K  # noqa: E402
from pecas import (AN, EB, EG, FERRUGEM, FW, MG, OS, PG, PQ, PR, TURFA, COL, DIR,  # noqa: E402
                   Bloco, Plano, cabe, carga, conectivo, rotulo)
import prensa as P  # noqa: E402

K.PAPEL["carta"] = (0xF1, 0xEE, 0xE7)


def rotulo_no_papel(p, texto, y=176, corpo=38):
    ch = p.chapa()
    p.tipo(ch, texto, OS, corpo, MG, y, tracking=0.22)
    nome = p.el("rotulo", ch, semente=p.semente + 7, **PR)
    p.no_papel(nome)
    return nome


def gravura_no_papel(p, arq, x, y, largura=None, altura=None, nome="quadro", **kw):
    ch, caixa = p.quadro(p.chapa(), arq, x, y, largura=largura, altura=altura, **kw)
    p.el(nome, ch, semente=p.semente + 5, **PQ)
    p.no_papel(nome)
    return caixa


# ===================================================================== #
#  1 · O LEVIATÃ                                                        #
# ===================================================================== #
def leviata():
    # a gravura 1:1 (2208x3521) numa folha larga: o começo mostra o
    # frontispício inteiro a ~0,3x, o fim entra no tronco a ~2x. As
    # coordenadas deste plano são as da própria gravura.
    W, H = 3900, 4500
    p = Plano("lev", "neutro", 101, tamanho=(W, H), origem=((W - 2208) // 2, (H - 3521) // 2),
              grao=6.6, grao_sigma=1.7)
    gravura_no_papel(p, "classico/c03-leviata.png", 0, 0, largura=2208, branco=0.92, preto=0.11, nome="gravura")
    # círculo que marca uma pessoa da armadura (ferrugem, desenhado à mão)
    ch = p.circulo(p.chapa(), 1029, 736, 46, espessura=4, semente=1012)
    p.el("circulo", ch, tinta=FERRUGEM, semente=1013, ganho=0.35, mordida=0.15, batida=0.10, falha=0.15, torcao=0.0)
    p.passo({"circulo": 1}, modo="angulo", nome="circulo")

    # a faixa de papel por baixo da janela: filete, procedência e a pergunta
    # a faixa não inclina (não é reamostrada): grão menor que o dos planos
    m = Plano("lev-mat", "neutro", 102, tamanho=(FW, 770), origem=(0, -1150), grao=5.6)
    ch = m.fio(m.chapa(), 0, 1150, FW, 1151)
    m.tipo(ch, "PRANCHA I · LONDRES 1651", OS, 34, MG, 1178, tracking=0.22)
    m.el("mobilia", ch, semente=1021, **PR)
    m.no_papel("mobilia")
    b = Bloco(m, y=1236, semente=11)
    b.ultimo = "rotulo"
    b.topo_tinta = 1206
    b.pedaco([conectivo("Quantas pessoas você consegue", 46)], "conectivo", respiro=0, nome="q1")
    b.pedaco([conectivo("contar aí?", 46)], "conectivo", respiro=12, nome="q2")
    return [p, m]


# ===================================================================== #
#  2 · O NAVIO                                                          #
# ===================================================================== #
def navio():
    F = []
    # --- o vaso (Exekias): o gancho ------------------------------------
    p = Plano("nav-vaso", "fosfofilita", 201)
    rotulo_no_papel(p, "EXEKIAS · c. 530 a.C.")
    gravura_no_papel(p, "classico/c01-navio-exekias.png", (FW - 700) // 2, 236, largura=700, branco=0.93, preto=0.10)
    b = Bloco(p, y=828, semente=21)
    b.pedaco([conectivo("esse navio não tem")], "conectivo", no_papel=True)     # primeiro frame completo
    c = min(cabe(t, AN, COL) for t in ("NENHUMA PEÇA", "ORIGINAL."))
    b.pedaco([carga("NENHUMA PEÇA", c)], "carga", nome="p2")
    b.pedaco([carga("ORIGINAL.", c)], "carga", nome="p3")
    b.pedaco([conectivo("e ainda assim pode ser o mesmo navio.")], "conectivo", nome="p4")
    F.append(p)

    # --- Teseu ---------------------------------------------------------
    p = Plano("nav-teseu", "fosfofilita", 202)
    rotulo_no_papel(p, "TESEU E O MINOTAURO")
    gravura_no_papel(p, "classico/c10-teseu-minotauro.png", (FW - 700) // 2, 240, largura=700, branco=0.93, preto=0.10)
    b = Bloco(p, y=1000, semente=22)
    b.pedaco([conectivo("o navio em que Teseu voltou de Creta,")], "conectivo", nome="p1")
    b.pedaco([carga("COMO MONUMENTO.", cabe("COMO MONUMENTO.", AN, COL))], "carga", nome="p2")
    F.append(p)

    # --- as tábuas (o navio em arame vive por cima deste papel) ---------
    p = Plano("nav-tabuas", "fosfofilita", 203)
    ch = p.chapa()
    p.tipo(ch, "AS TÁBUAS", OS, 38, MG, 176, tracking=0.22)
    p.el("rotulo", ch, semente=2031, **PR)
    leg_o, leg_n = p.chapa(), p.chapa()
    p.grade(leg_o, "legenda", [(MG + 13, 252)], lado=24, semente=2032)
    p.tipo(leg_o, "ORIGINAL", OS, 28, MG + 40, 241, tracking=0.18)
    p.grade(leg_n, "legenda", [(MG + 263, 252)], lado=24, semente=2033)
    p.tipo(leg_n, "NOVA", OS, 28, MG + 290, 241, tracking=0.18)
    p.el("leg-o", leg_o, tinta=FERRUGEM, semente=2034, desloc=(1.2, -0.8), **PR)
    p.el("leg-n", leg_n, semente=2035, **PR)
    p.no_papel("rotulo", "leg-o", "leg-n")
    b = Bloco(p, y=900, semente=23)
    b.pedaco([conectivo("até não sobrar")], "conectivo", nome="p1")
    c = min(cabe(t, AN, COL) for t in ("NENHUMA DAS", "ORIGINAIS."))
    b.pedaco([carga("NENHUMA DAS", c)], "carga", nome="p2")
    b.pedaco([carga("ORIGINAIS.", c)], "carga", nome="p3")
    F.append(p)

    # --- o busto (a identificação como Plutarco é só provável: não legendar)
    p = Plano("nav-busto", "fosfofilita", 204)
    rotulo_no_papel(p, "BUSTO DE DELFOS · SÉC. II")
    gravura_no_papel(p, "classico/c02-busto-plutarco.png", (FW - 420) // 2, 236, altura=630, branco=0.95, preto=0.12)
    b = Bloco(p, y=920, semente=24)
    b.pedaco([conectivo("os filósofos gregos se dividiram em")], "conectivo", nome="p1")
    b.pedaco([carga("DOIS GRUPOS.", cabe("DOIS GRUPOS.", AN, COL * 0.86))], "carga", nome="p2")
    b.pedaco([conectivo("uns: o mesmo navio.")], "conectivo", nome="p3")
    b.pedaco([conectivo("outros: outra coisa.")], "conectivo", nome="p4")
    F.append(p)

    # --- Hobbes ---------------------------------------------------------
    p = Plano("nav-hobbes", "fosfofilita", 205)
    rotulo_no_papel(p, "THOMAS HOBBES · J. M. WRIGHT, c. 1670")
    gravura_no_papel(p, "classico/c11-hobbes.png", (FW - 500) // 2, 236, altura=657, branco=0.96, preto=0.10)
    b = Bloco(p, y=960, semente=25)
    b.pedaco([conectivo("mil e seiscentos anos depois,")], "conectivo", nome="p1")
    b.pedaco([carga("PIOROU TUDO.", cabe("PIOROU TUDO.", AN, COL))], "carga", nome="p2")
    F.append(p)

    # --- os dois navios (arame por cima) e as perguntas -----------------
    p = Plano("nav-dois", "fosfofilita", 206)
    ch = p.chapa()
    p.tipo(ch, "O NAVIO DE TESEU", OS, 38, MG, 176, tracking=0.22)
    p.el("rotulo", ch, semente=2061, **PR)
    p.no_papel("rotulo")
    fa, fm = p.chapa(), p.chapa()
    p.tipo(fa, "FORMA", OS, 32, 190, 800, tracking=0.22)
    p.tipo(fm, "MATÉRIA", OS, 32, 650, 800, tracking=0.22)
    p.el("forma", fa, semente=2062, **PR)
    p.el("materia", fm, semente=2063, **PR)
    p.passo({"forma": 1}, nome="forma")
    p.passo({"materia": 1}, nome="materia")
    fixos = ("rotulo", "forma", "materia")
    b = Bloco(p, y=900, semente=26)
    b.pedaco([conectivo("qual dos dois é")], "conectivo", nome="q1")
    b.pedaco([carga("O NAVIO DE TESEU?", cabe("O NAVIO DE TESEU?", AN, COL))], "carga", nome="q2")
    p.limpa("corte-1104", manter=fixos)
    b = Bloco(p, y=900, semente=27)
    b.pedaco([conectivo("não existe resposta certa.")], "conectivo", nome="r1")
    b.pedaco([conectivo("existe")], "conectivo", nome="r2")
    b.pedaco([carga("ESCOLHA", cabe("ESCOLHA", AN, COL * 0.62))], "carga", nome="r3")
    b.pedaco([conectivo("sobre o que faz uma coisa"), conectivo("ser ela mesma.")], "conectivo", nome="r4")
    p.limpa("corte-1291", manter=fixos)
    b = Bloco(p, y=930, semente=28)
    b.pedaco([conectivo("qual dos dois você acha")], "conectivo", nome="f1")
    b.pedaco([carga("QUE É O NAVIO?", cabe("QUE É O NAVIO?", AN, COL))], "carga", nome="f2")
    F.append(p)
    return F


# ===================================================================== #
#  3 · A MEMÓRIA                                                        #
# ===================================================================== #
# a figura do corpo em unidades: cada quadrado é uma peça do corpo dela
FIG_X, FIG_Y, PASSO = 490, 300, 48


def celula(c, r):
    return (FIG_X + (c - 3) * PASSO, FIG_Y + r * PASSO + 15)


CABECA = [celula(c, r) for r in (0, 1) for c in (2, 3, 4)]
TORSO = [celula(c, r) for r in (2, 3, 4, 5) for c in (2, 3, 4)]
BRACOS = [celula(c, r) for r in (2, 3, 4, 5) for c in (0, 6)]
PERNAS = [celula(c, r) for r in (6, 7, 8, 9) for c in (2, 4)]
TROCADA = celula(0, 3)          # a unidade do braço trocada no exemplo


def memoria():
    F = []
    p = Plano("mem", ["fosfofilita", "agata", "ouro", "lapis", "perola"], 301)
    for _ in range(4):
        p.troca_papel()
    rotulo_no_papel(p, "HOUSEKI NO KUNI · HARUKO ICHIKAWA", corpo=34)
    fixo = ("rotulo",)
    # bloco 1: a carta (m08a) mora em cima, o tipo embaixo
    b = Bloco(p, y=900, semente=31)
    b.pedaco([conectivo("nesse mangá a memória")], "conectivo", no_papel=True)
    b.pedaco([conectivo("não fica no cérebro.")], "conectivo", nome="a2")
    b.pedaco([carga("FICA NA PEDRA", cabe("FICA NA PEDRA", AN, COL))], "carga", nome="a3")
    b.pedaco([conectivo("de que o corpo é feito.")], "conectivo", nome="a4")
    p.limpa("corte-148", manter=fixo)

    # a figura em unidades, desenhada em rajada, de cima para baixo; a
    # unidade do braço que vai ser trocada fica numa chapa só dela
    corpo, um = p.chapa(), p.chapa()
    for i, c in enumerate(CABECA + TORSO + BRACOS + PERNAS):
        p.grade(um if c == TROCADA else corpo, "corpo", [c], lado=30, semente=3200 + i)
    p.el("corpo", corpo, semente=3101, **PR)
    p.el("um", um, semente=3102, **PR)
    rot = p.chapa()
    p.tipo(rot, "AS PEÇAS DO CORPO", OS, 30, MG, 250, tracking=0.22)
    p.el("rot-corpo", rot, semente=3103, **PR)
    p.passo({"rot-corpo": 1}, nome="rot-corpo")
    p.passo({"corpo": 1, "um": 1}, modo="unidades", grupo="corpo", nome="corpo")
    p.passo({"um": 0}, modo="inteiro", nome="sai")
    vaz = p.grade(p.chapa(), "vazada", [(*TROCADA, "vazado")], lado=30, semente=3104)
    p.el("vazada", vaz, semente=3105, **PR)
    p.passo({"vazada": 1}, modo="inteiro", nome="entra")
    b = Bloco(p, y=860, semente=32)
    b.pedaco([conectivo("a lembrança que estava ali")], "conectivo", nome="b1")
    b.pedaco([carga("VAI EMBORA", cabe("VAI EMBORA", AN, COL * 0.8))], "carga", nome="b2")
    b.pedaco([conectivo("junto com a peça antiga.")], "conectivo", nome="b3")
    p.limpa("corte-452", manter=fixo)

    # as pernas (a carta m01 em cima)
    b = Bloco(p, y=900, semente=33)
    b.pedaco([conectivo("ela perdeu as")], "conectivo", nome="c1")
    b.pedaco([carga("PERNAS.", cabe("PERNAS.", AN, COL * 0.7))], "carga", nome="c2")
    b.pedaco([conectivo("esqueceu uma amiga.")], "conectivo", nome="c3")
    p.limpa("corte-516", manter=fixo)

    # a rajada é só carta; para seco na figura: o que foi trocado, vazado
    depois = p.chapa()
    vazadas = [(*c, "vazado") for c in CABECA + BRACOS + PERNAS]
    p.grade(depois, "depois", vazadas, lado=30, semente=3106)
    tor = p.chapa()
    p.grade(tor, "torso", TORSO, lado=30, semente=3107)
    p.el("depois", depois, semente=3108, **PR)
    p.el("torso", tor, semente=3109, **PR)
    ferr = p.chapa()
    p.grade(ferr, "ferrugem", TORSO, lado=30, semente=3110)
    p.el("ferrugem", ferr, tinta=FERRUGEM, semente=3111, desloc=(2.0, -1.2), ganho=0.5, mordida=0.2,
         batida=0.2, falha=0.3, torcao=0.12)
    p.passo({"rot-corpo": 1, "depois": 1, "torso": 1}, modo="corte", nome="torso")
    b = Bloco(p, y=860, semente=34)
    b.pedaco([conectivo("cada troca levou")], "conectivo", nome="d1")
    b.pedaco([carga("UM PEDAÇO", cabe("UM PEDAÇO", AN, COL * 0.8))], "carga", nome="d2")
    b.pedaco([conectivo("do passado dela.")], "conectivo", nome="d3")
    p.limpa("corte-692", manter=fixo + ("rot-corpo", "depois", "torso"))
    b = Bloco(p, y=860, semente=35)
    b.pedaco([conectivo("no fim, o que sobrou")], "conectivo", nome="e1")
    p.passo({"ferrugem": 1}, modo="inteiro", nome="ferrugem")
    b.pedaco([carga("UM TORSO.", cabe("UM TORSO.", AN, COL * 0.8))], "carga", nome="e2")
    p.limpa("corte-782", manter=fixo)

    # a pergunta do mangá (a carta m23 em cima)
    b = Bloco(p, y=900, semente=36)
    b.pedaco([conectivo("a pergunta que o mangá")], "conectivo", nome="f1")
    b.pedaco([conectivo("nunca faz em voz alta:")], "conectivo", nome="f2")
    b.pedaco([carga("EM QUE MOMENTO", cabe("EM QUE MOMENTO", AN, COL))], "carga", nome="f3")
    b.pedaco([conectivo("ela parou de ser ela?")], "conectivo", nome="f4")
    p.limpa("corte-934")

    # a pergunta final, sozinha no papel
    b = Bloco(p, y=560, semente=37)
    b.pedaco([conectivo("se você esquecesse tudo,", 52)], "conectivo", nome="g1")
    c = min(cabe(t, AN, COL) for t in ("AINDA SERIA", "VOCÊ?"))
    b.pedaco([carga("AINDA SERIA", c)], "carga", nome="g2")
    b.pedaco([carga("VOCÊ?", c)], "carga", nome="g3")
    F.append(p)
    F += cartas()
    return F


class Carta:
    """Quadro de mangá como carta física: papel de carta, 20 px de respiro,
    moldura de 2 px. Opaca, sem revelação (entra e sai inteira)."""

    def __init__(self, id, arq, largura=None, altura=None, semente=0):
        self.id, self.arq, self.semente = id, arq, semente
        im = Image.open(os.path.join(K.PUB, arq))
        r = im.width / im.height
        if largura is None:
            largura = altura * r
        self.w = round(largura)
        self.h = round(self.w / r)

    def imprimir(self):
        pad = 22
        p = Plano(self.id, "carta", self.semente, tamanho=(self.w + 2 * pad, self.h + 2 * pad), origem=(pad, pad),
                  aspereza=0.6)
        ch, _ = p.quadro(p.chapa(), self.arq, 0, 0, largura=self.w, branco=0.95, preto=0.12)
        d = ImageDraw.Draw(ch)
        d.rectangle([0, 0, p.W - 1, p.H - 1], outline=255, width=2)
        p.el("quadro", ch, semente=self.semente + 1, **PQ)
        p.no_papel("quadro")
        papel = P.papel(p.W, p.H, K.PAPEL["carta"], semente=self.semente, aspereza=0.6, grao=K.GRAO)
        tinta = p.tinta_estado({"quadro": 1}, np.array(K.PAPEL["carta"], float))
        os.makedirs(K.OUT, exist_ok=True)
        P.salvar(papel * tinta / 255, f"{K.OUT}/{self.id}.jpg", q=94)
        return dict(id=self.id, carta=True, w=p.W, h=p.H)


def cartas():
    return [Carta("carta-m08a", "manga/m08a-estilhaco-rosto.png", largura=880, semente=311),
            Carta("carta-m01", "manga/m01-pernas-agata.png", largura=820, semente=312),
            Carta("carta-m03b", "manga/m03b-doacao-cabeca.png", largura=880, semente=313),
            Carta("carta-m04b", "manga/m04b-olho-perola.png", largura=940, semente=314),
            Carta("carta-m05", "manga/m05-cabeca-escorrendo.png", altura=560, semente=315),
            Carta("carta-m23", "manga/m23-figura-minuscula.png", largura=900, semente=316)]


# ===================================================================== #
#  4 · A PEDRA                                                          #
# ===================================================================== #
# a régua de Mohs em coluna: 1 em cima, 10 embaixo, marcas para a direita
R_X, R_Y0, R_Y1 = 150, 380, 1130
mohs_y = lambda v: R_Y0 + (v - 1) * (R_Y1 - R_Y0) / 9


def pedra():
    F = []
    # --- a frase que abre ----------------------------------------------
    p = Plano("ped-a", "pedra", 401)
    b = Bloco(p, y=380, semente=41)
    b.pedaco([rotulo("HOUSEKI NO KUNI · A PROTAGONISTA", 36)], "rotulo", no_papel=True)
    b.pedaco([conectivo("a autora escolheu, para a protagonista"),
              conectivo("de um mangá sobre perder o corpo")], "conectivo", respiro=56, no_papel=True)
    b.pedaco([("PEDAÇO POR PEDAÇO,", EB, cabe("PEDAÇO POR PEDAÇO,", EB, COL, tracking=0.02), 0.02)],
             "conectivo", respiro=40, nome="a3", ganho=0.64, mordida=0.3, falha=0.55)
    c = min(cabe(t, AN, COL) for t in ("A PEDRA", "MAIS FRÁGIL", "QUE EXISTE"))
    b.pedaco([carga("A PEDRA", c)], "carga", nome="a4")
    b.pedaco([carga("MAIS FRÁGIL", c)], "carga", nome="a5")
    b.pedaco([carga("QUE EXISTE", c)], "carga", nome="a6")
    F.append(p)

    # --- a régua ---------------------------------------------------------
    p = Plano("ped-regua", "pedra", 402)
    rotulo_no_papel(p, "DUREZA NA ESCALA MOHS")
    ch = p.chapa()
    p.fio(ch, R_X - 2, R_Y0, R_X + 2, R_Y1)
    for v in range(1, 11):
        y = mohs_y(v)
        p.fio(ch, R_X, y - 2, R_X + 30, y + 2)
        p.tipo(ch, str(v), OS, 26, R_X - 18, y - 9, ancora="dir")
    p.el("regua", ch, semente=4021, ganho=0.6, mordida=0.2, batida=0.26, falha=0.45, torcao=0.08)
    p.passo({"regua": 1}, modo="regua", nome="regua")
    # 3,5: a marca sai da régua para a direita, e só então o número
    m35 = p.chapa()
    y35 = mohs_y(3.5)
    p.fio(m35, R_X, y35 - 2, R_X + 86, y35 + 2)
    c35 = cabe("3,5", AN, 400, tracking=-0.03)
    t = K.tinta_de("3,5", AN, c35, -0.03)
    caixa = p.tipo(m35, "3,5", AN, c35, R_X + 104, y35 - (t[3] - t[1]) / 2, tracking=-0.03, semente=4022,
                   tremor=1.4)
    p.el("m35", m35, semente=4023, **PG)
    fos = p.chapa()
    p.tipo(fos, "FOSFOFILITA", OS, 50, R_X + 110, caixa[3] + 40, tracking=0.14)
    p.el("fos", fos, tinta=FERRUGEM, semente=4024, desloc=(1.8, -1.2), ganho=0.62, mordida=0.26, batida=0.26,
         falha=0.46, torcao=0.10)
    p.passo({"m35": 1}, nome="m35")
    p.passo({"fos": 1}, nome="fos")
    # 10: diamante
    m10 = p.chapa()
    y10 = mohs_y(10)
    p.fio(m10, R_X, y10 - 2, R_X + 86, y10 + 2)
    c10 = round(c35 * 0.5)
    t = K.tinta_de("10", AN, c10, -0.03)
    caixa = p.tipo(m10, "10", AN, c10, R_X + 104, y10 - (t[3] - t[1]) / 2, tracking=-0.03, semente=4025,
                   tremor=1.0)
    p.tipo(m10, "DIAMANTE", OS, 40, caixa[2] + 34, y10 - 14, tracking=0.14)
    p.el("m10", m10, semente=4026, **PG)
    p.passo({"m10": 1}, nome="m10")
    F.append(p)

    # --- o espécime -------------------------------------------------------
    p = Plano("ped-foto", "pedra", 403)
    rotulo_no_papel(p, "FOSFOFILITA")
    p.el("mineral", None, pronta=os.path.join(K.OUT, "ped-mineral-camada.png"), em=(p.x(141), p.y(697)))
    p.no_papel("mineral")
    F.append(p)

    # --- o resto, em cortes secos (o cristal fica no alto, à direita) ----
    p = Plano("ped-tipo", "pedra", 404)
    b = Bloco(p, y=760, semente=44)
    b.pedaco([conectivo("os melhores cristais vieram de")], "conectivo", nome="p1")
    b.pedaco([conectivo("uma mina em")], "conectivo", nome="p2")
    b.pedaco([carga("POTOSÍ,", cabe("POTOSÍ,", AN, COL * 0.72))], "carga", nome="p3")
    b.pedaco([conectivo("na Bolívia, que não produz mais.")], "conectivo", nome="p4")
    b.pedaco([("o que existe é o que já foi tirado.", EB, 46, 0.0)], "conectivo", nome="p5")
    p.limpa("corte-855")
    b = Bloco(p, y=760, semente=45)
    b.pedaco([conectivo("ela não escolheu uma")], "conectivo", nome="q1")
    b.pedaco([carga("PEDRA BONITA", cabe("PEDRA BONITA", AN, COL))], "carga", nome="q2")
    b.pedaco([conectivo("para protagonista.")], "conectivo", nome="q3")
    p.limpa("corte-946")
    b = Bloco(p, y=760, semente=46)
    b.pedaco([conectivo("escolheu uma que")], "conectivo", nome="r1")
    b.pedaco([carga("QUEBRA", cabe("QUEBRA", AN, COL * 0.86))], "carga", nome="r2")
    b.pedaco([conectivo("se você olhar com força.")], "conectivo", nome="r3")
    p.limpa("corte-1055")
    b = Bloco(p, y=760, semente=47)
    b.pedaco([conectivo("que outra obra esconde")], "conectivo", nome="s1")
    b.pedaco([carga("CIÊNCIA", cabe("CIÊNCIA", AN, COL * 0.8))], "carga", nome="s2")
    b.pedaco([conectivo("de verdade assim?")], "conectivo", nome="s3")
    F.append(p)
    return F


def todas():
    F = {}
    for f in leviata() + navio() + memoria() + pedra():
        F[f.id] = f
    return F


if __name__ == "__main__":
    F = todas()
    pedidos = sys.argv[1:] or list(F)
    meta = json.load(open(K.META)) if os.path.exists(K.META) else {}
    for id in pedidos:
        m = F[id].imprimir()
        meta[id] = m
        print(f"{id:12s} ok", flush=True)
    os.makedirs(os.path.dirname(K.META), exist_ok=True)
    json.dump(meta, open(K.META, "w"), ensure_ascii=False, indent=1)
