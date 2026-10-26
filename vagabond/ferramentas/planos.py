#!/usr/bin/env python3
"""
Os planos do Vagabond, bloco a bloco, amarrados à narração.

Cada bloco é uma função que recebe a montagem e o frame em que ele começa,
monta as folhas e devolve o frame em que termina. Os cortes caem em pausa
real da fala (corte()); a tinta encosta na palavra (w()).

Tamanhos e posições em px de quadro (1920x1080). Datas em vermelhão
(Anton); números que não são data, em sumi. A EB Garamond carrega.

Uso: python3 -I ferramentas/planos.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montagem as M  # noqa: E402
from montagem import corte, w, empurra, deriva, parado, borda_suave, caixa_alta, avanco  # noqa: E402
from sumi import EBG, EBG7, OSW, ANT  # noqa: E402

MG = 180            # margem esquerda da tipografia
ROT = 0.22          # tracking dos rótulos (Oswald)


def rotulo(t, c=24):
    return (t, OSW, c, ROT)


def corpo(t, c=52):
    return (t, EBG, c, 0.0)


def forte(t, c=110):
    return (t, EBG7, c, 0.0)


def numero(t, c=150):
    return (t, ANT, c, -0.01)


# --------------------------------------------------------------------- #
#  A — A PINTURA                                       0%               #
# --------------------------------------------------------------------- #
# o Koboku Meigekizu em pé no meio da folha: 432 x 1000 px de quadro, com o
# material na resolução da foto (2048 px de altura) para o plano fechado
PX0, PY0, PW, PH = 744, 40, 432, 1000


def no_koboku(u, v):
    """Ponto da pintura (fração da foto) -> px da folha."""
    return PX0 + u * PW, PY0 + v * PH


def pintura(m, folha_id, chega=None, plano=None, entradas=None, janela=None):
    f = m.folha(folha_id, tom='washi')
    f.peca('koboku', 'p01-koboku-meigekizu.jpg', PX0, PY0, ht=PH, tipo='sumi', res=2048 / (PH * M.K),
           mascara=borda_suave(0.03), chega=chega, entradas=entradas, janela=janela, borda=0.24, plano=plano,
           achatar=160, branco_pct=40, preto_pct=0.05, mordida=0.12, fibra=0.04, firmeza=0.0, gama=1.0)
    return f


def bloco_a(m):
    # a tinta sobe pelo galho, de baixo do quadro até o pássaro (o ritmo é o
    # da tinta que o primeiro plano mostra)
    f = pintura(m, 'pintura', chega=(w('pintura') - 4, 22), entradas=[(0.45, 0.75)], janela=(0, 0, 1, 0.75))
    passaro = no_koboku(0.415, 0.165)
    lagarta = no_koboku(0.46, 0.44)
    c1, c2, c3, c4, c5 = corte(296), corte(466), corte(624), corte(737), corte(904)
    m.plano(0, c1, f, *empurra(1.45, 935, 420, c1))
    m.plano(c1, c2, f, *empurra(1.0, 960, 540, c2 - c1))
    m.plano(c2, c3, f, *empurra(2.0, passaro[0], passaro[1] + 30, c3 - c2))
    m.plano(c3, c4, f, *deriva(1.6, 1480, 1520, 600))
    m.plano(c4, c5, f, *empurra(2.0, lagarta[0], lagarta[1], c5 - c4))
    # o nome da pintura, à direita, no papel vazio
    tx = 1290
    f.texto('titulo', [corpo('Koboku Meigekizu', 58)], tx, 430, chega=(w('Koboku') - 2, 18))
    f.texto('bem', [rotulo('BEM CULTURAL IMPORTANTE DO JAPÃO', 24)], tx, 522, tinta='sumi2',
            chega=(w('bem', 990) - 2, 16))
    f.texto('museu', [rotulo('MUSEU KUBOSO · IZUMI · OSAKA', 24)], tx, 568, tinta='sumi2',
            chega=(w('museu', 1100) - 2, 16))
    c6 = corte(1312)
    m.plano(c5, c6, f, *deriva(1.0, 1090, 1050, 540))
    # quem pintou
    g = m.folha('nome', tom='washi')
    g.texto('nome', [forte('Miyamoto Musashi', 112)], 960, 420, ancora='centro', chega=(w('Miyamuto') - 3, 20))
    g.texto('existiu', [corpo('ele existiu.', 60)], 960, 600, ancora='centro', tinta='sumi1',
            chega=(w('existiu') - 2, 16))
    c7 = corte(1572)
    m.plano(c6, c7, g, *empurra(1.0, 960, 520, c7 - c6))
    return c7


# --------------------------------------------------------------------- #
#  B — ELE EXISTIU / REGISTROS                         5%               #
# --------------------------------------------------------------------- #
def linha_com_numero(f, nome, num, texto, x, y, chega_num, chega_txt, tinta_num='vermelhao', cn=150, ct=52):
    """Numeral em Anton e, à direita, o texto centrado na altura do numeral.
    (x, y) = origem e topo da caixa-alta do numeral. Devolve a base dele."""
    f.texto(nome + '-n', [numero(num, cn)], x, y, tinta=tinta_num, chega=chega_num)
    hn = caixa_alta(ANT, cn)
    ht = caixa_alta(EBG, ct)
    f.texto(nome + '-t', [corpo(texto, ct)], x + avanco(num, ANT, cn, -0.01) + 0.28 * cn, y + hn / 2 - ht / 2,
            chega=chega_txt)
    return y + hn


def bloco_b(m, ini):
    f = m.folha('registros', tom='velho')
    f.texto('rotulo', [rotulo('REGISTROS DO CLÃ HOSOKAWA · KUMAMOTO', 24)], MG, 150, tinta='sumi2',
            chega=(w('registros', 1580) - 2, 16))
    base = linha_com_numero(f, 'chegada', '1640', 'a chegada a Kumamoto', MG, 230,
                            chega_num=(w('1640') - 2, 18), chega_txt=(w('chegada', 1700) - 2, 16))
    y = base + 96
    itens = [('valor', 'o valor que recebia', 'valor'), ('casa', 'a casa em que morava', 'casa'),
             ('saude', 'o estado de saúde nos últimos anos', 'estado'), ('morte', 'a data da morte', 'data')]
    linhas_y = {}
    for nome, txt, pal in itens:
        f.texto(nome, [corpo(txt, 50)], MG, y, chega=(w(pal, 1770) - 2, 16))
        linhas_y[nome] = y
        y += 50 * 1.45
    y += 60
    linha_com_numero(f, 'morte-data', '1645', '19º dia do 5º mês de Shōhō 2', MG, y,
                     chega_num=(w('1645', 2000) - 2, 18), chega_txt=(w('Décimo', 1940) - 2, 18))
    # "ninguém falsifica folha de pagamento": o pincel sublinha o valor
    yv = linhas_y['valor'] + caixa_alta(EBG, 50) + 14
    lv = avanco('o valor que recebia', EBG, 50)
    f.traco('sublinha', [(MG - 6, yv + 2), (MG + lv * 0.55, yv + 5), (MG + lv + 14, yv)], 9, seco=0.55,
            chega=(w('pagamento') - 4, 14))
    c1, c2 = corte(1774), corte(1950)
    m.plano(ini, c1, f, *empurra(1.0, 960, 540, c1 - ini))
    m.plano(c1, c2, f, *empurra(1.22, 820, linhas_y['casa'] + 40, c2 - c1))
    c3 = corte(2127)
    m.plano(c2, c3, f, *empurra(1.22, 820, y + 40, c3 - c2))
    # kyakubun
    g = m.folha('kyakubun', tom='washi')
    g.texto('vassalo', [corpo('vassalo', 56)], 960 - 60, 270, ancora='dir', tinta='sumi3',
            chega=(w('vassalo') - 2, 16))
    g.texto('hospede', [corpo('hóspede', 56)], 960 + 60, 270, chega=(w('hóspede') - 2, 16))
    g.texto('kyakubun', [forte('kyakubun', 132)], 960, 410, ancora='centro', chega=(w('Kyakubum') - 3, 20))
    g.texto('convidado', [corpo('convidado da casa', 60)], 960, 610, ancora='centro', tinta='sumi1',
            chega=(w('Convidado') - 2, 16))
    c4 = corte(2340)
    m.plano(c3, c4, g, *empurra(1.0, 960, 500, c4 - c3))
    c5 = corte(2549)
    m.plano(c4, c5, f, *deriva(1.04, 930, 990, 560))
    return c5


# --------------------------------------------------------------------- #
PARTITURA = [[0, 0.0, 0], [1384, 0.05, 0], [2550, 0.10, 0], [4458, 0.0, 0], [4650, 0.35, 0],
             [6726, 0.60, 0], [8669, 0.80, 0], [9442, 1.0, 0], [10392, 0.40, 1], [12038, 0.12, 0],
             [15532, 0.0, 0]]


def principal():
    papel, fibra = M.papel_e_fibra()
    m = M.Montagem()
    fim = bloco_a(m)
    fim = bloco_b(m, fim)
    # (provisório) papel vazio até o fim
    z = m.folha('vazio', tom='limpo')
    z.texto('falta', [rotulo('EM MONTAGEM', 20)], 960, 530, ancora='centro', tinta='sumi3')
    m.plano(fim, M.FRAMES, z, *parado(1.0, 960, 540))
    m.escrever(papel, fibra, PARTITURA)


if __name__ == '__main__':
    principal()
