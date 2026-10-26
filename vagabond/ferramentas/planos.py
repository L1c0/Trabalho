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
from montagem import corte, w, empurra, deriva, parado, borda_suave, borda_tinta, borda_lados, caixa_alta, avanco  # noqa: E402
from sumi import EBG, EBG7, OSW, ANT  # noqa: E402

MG = 180            # margem esquerda da tipografia
MARCAS = {}         # posições que um bloco guarda para outro reenquadrar
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
# (a base sangra para fora do quadro embaixo: a aguada do pé do galho não
# pode terminar numa linha reta)
PH = 1040
PW = PH * 885 / 2048
PX0, PY0 = 960 - PW / 2, 60


def no_koboku(u, v):
    """Ponto da pintura (fração da foto) -> px da folha."""
    return PX0 + u * PW, PY0 + v * PH


def pintura(m, folha_id, chega=None, plano=None, entradas=None, janela=None):
    f = m.folha(folha_id, tom='washi')
    f.peca('koboku', 'p01-koboku-meigekizu.jpg', PX0, PY0, ht=PH, tipo='sumi', res=2048 / (PH * M.K),
           mascara=borda_lados(0.2, 0.06, 0.02, 0.05), chega=chega, entradas=entradas, janela=janela, borda=0.24,
           plano=plano,
           achatar=900, branco_pct=25, preto_pct=0.5, mordida=0.12, fibra=0.04, firmeza=0.0, gama=1.0)
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
    # 1,9x: o mais apertado que a foto aguenta (BRIEFING §6)
    m.plano(c2, c3, f, *empurra(1.84, passaro[0], passaro[1] + 30, c3 - c2))
    m.plano(c3, c4, f, *deriva(1.6, 1480, 1520, 600))
    m.plano(c4, c5, f, *empurra(1.84, lagarta[0], lagarta[1], c5 - c4))
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
    MARCAS['registros-1645'] = y
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
#  C — OS SESSENTA DUELOS                              10%              #
#  D — ESCREVEU O FINAL EM DUAS FRASES                  0%              #
# --------------------------------------------------------------------- #
def bloco_c(m, ini):
    # o livro: a edição brasileira, página da apresentação (é o livro como
    # objeto; a caligrafia dessa edição é a apresentação de 2005, não o texto
    # do Musashi, e por isso não entra)
    f = m.folha('livro', tom='washi')
    f.peca('pagina', 'd01-gorinnosho-edicao-br.jpg', 200, 150, ht=780, tipo='cor', recorte=(100, 40, 455, 560),
           chega=(2596, 20), entradas=[(0.5, 0.35)])
    f.texto('titulo', [forte('Go Rin no Sho', 96)], 880, 400, chega=(w('Gorin') - 4, 20))
    f.texto('sub', [corpo('O Livro dos Cinco Anéis', 54)], 880, 530, tinta='sumi1', chega=(w('livro', 2775) - 3, 18))
    c1 = corte(2876)
    m.plano(ini, c1, f, *deriva(1.0, 960, 1000, 540))

    # a conta que ele mesmo faz, na abertura do livro
    g = m.folha('idades', tom='washi')
    g.texto('rotulo', [rotulo('GO RIN NO SHO · A ABERTURA', 24)], 200, 150, tinta='sumi2',
            chega=(w('conta', 2880) - 2, 16))
    idades = [('13', 200, w('13', 2930), 'Arima Kihei', w('Arima')),
              ('16', 470, w('16', 3040), 'derrubou outro', w('derrubou')),
              ('21', 740, w('21', 3100), 'a capital', w('capital'))]
    for num, x, fn, leg, fl in idades:
        g.texto('i' + num, [numero(num, 120)], x, 250, chega=(fn - 3, 16))
        g.texto('l' + num, [corpo(leg, 36)], x + 2, 400, tinta='sumi1', chega=(fl - 2, 16))
    g.texto('i2829', [numero('28, 29', 120)], 1010, 250, chega=(w('28', 3280) - 3, 16))
    g.texto('l2829', [corpo('anos', 36)], 1012, 400, tinta='sumi1', chega=(w('29', 3330) - 2, 16))
    # a soma: o pincel passa embaixo da conta
    g.traco('soma', [(188, 484), (700, 490), (1290, 480)], 11, seco=0.5, chega=(w('soma') - 3, 16))
    g.texto('n60', [numero('60', 330)], 200, 560, chega=(w('60', 3420) - 3, 18))
    av = avanco('60', ANT, 330, -0.01)
    hn = caixa_alta(ANT, 330)
    g.texto('combates', [corpo('combates', 60)], 200 + av + 60, 560 + hn * 0.18, chega=(w('combates') - 2, 16))
    g.texto('invicto', [forte('invicto.', 78)], 200 + av + 60, 560 + hn * 0.55, chega=(w('invicto') - 3, 18))
    # "nenhuma das vitórias era mérito dele": o pincel risca o 60
    g.traco('risca', [(160, 560 + hn * 0.62), (380, 560 + hn * 0.55), (200 + av + 40, 560 + hn * 0.44)], 26,
            seco=0.62, chega=(w('nenhuma', 4390) - 4, 16))
    c2, c3 = corte(3222), corte(3569)
    m.plano(c1, c2, g, *deriva(1.0, 900, 940, 540))
    m.plano(c2, c3, g, *empurra(1.0, 860, 600, c3 - c2))

    # o Vagabond inteiro persegue esse currículo
    h = m.folha('curriculo', tom='washi')
    h.peca('m08', 'm08.jpg', 240, 44, wd=1440, recorte=(0, 0, 768, 530), chega=(c3 + 2, 16),
           entradas=[(0.42, 0.45)])
    c4 = corte(3655)
    m.plano(c3, c4, h, *empurra(1.0, 960, 540, c4 - c3))

    # a frase
    q = m.folha('frase', tom='limpo')
    q.texto('rotulo', [rotulo('GO RIN NO SHO', 24)], 300, 236, tinta='sumi2', chega=(w('Quando') - 3, 16))
    q.texto('data', [numero('1645', 44)], 300 + avanco('GO RIN NO SHO', OSW, 24, ROT) + 26,
            236 + caixa_alta(OSW, 24) / 2 - caixa_alta(ANT, 44) / 2, tinta='vermelhao',
            chega=(w('1645', 4500) - 3, 16))
    q.texto('l1', [corpo('“Quando cheguei aos trinta,', 66), corpo('olhei para o meu passado.', 66)], 300, 320,
            chega=(w('Quando') - 3, 20))
    q.texto('l2', [corpo('As vitórias anteriores não vieram', 66), corpo('de eu ter dominado a estratégia.”', 66)],
            300, 320 + 2 * 66 * 1.45 + 40, chega=(w('vitórias', 3860) - 4, 20))
    c5 = corte(3997)
    m.plano(c4, c5, q, *empurra(1.0, 960, 520, c5 - c4))

    # a que ele atribui
    r = m.folha('atribui', tom='limpo')
    for i, (nome, txt, pal) in enumerate([('talento', 'talento natural', 'Talento'),
                                          ('ceu', 'a ordem do céu', 'Ordem'),
                                          ('escolas', 'as outras escolas, piores que a dele', 'outras')]):
        r.texto(nome, [corpo(txt, 62)], 300, 330 + i * 125, chega=(w(pal, 4080) - 3, 18))
    c6 = corte(4252)
    m.plano(c5, c6, r, *deriva(1.0, 960, 1000, 520))

    # sessenta vitórias, nenhuma dele
    c7 = corte(4458)
    m.plano(c6, c7, g, *empurra(1.2, 760, 690, c7 - c6))

    # D: o final do Vagabond em duas frases (volta ao cinza)
    c8 = corte(4650)
    m.plano(c7, c8, q, *deriva(1.0, 940, 980, 520))
    return c8


# --------------------------------------------------------------------- #
#  E — YOSHIKAWA / 1935                                35%              #
# --------------------------------------------------------------------- #
def quadro_vazio(f, nome, x, y, wd, ht, chega, semente):
    """Um quadro de mangá traçado a pincel, quatro traços com kasure. Vazio:
    é o lugar de quem nunca existiu."""
    e = 9
    f.traco(nome + '-t', [(x - 6, y + 2), (x + wd * 0.5, y - 2), (x + wd + 8, y + 3)], e, seco=0.45,
            chega=(chega, 12), semente=semente)
    f.traco(nome + '-d', [(x + wd + 2, y - 6), (x + wd - 2, y + ht * 0.5), (x + wd + 1, y + ht + 7)], e, seco=0.6,
            chega=(chega + 3, 12), semente=semente + 1)
    f.traco(nome + '-b', [(x + wd + 5, y + ht + 1), (x + wd * 0.5, y + ht + 3), (x - 7, y + ht - 2)], e, seco=0.7,
            chega=(chega + 6, 12), semente=semente + 2)
    f.traco(nome + '-e', [(x + 1, y + ht + 6), (x - 2, y + ht * 0.5), (x + 2, y - 8)], e, seco=0.5,
            chega=(chega + 9, 12), semente=semente + 3)


def bloco_e(m, ini):
    # o Musashi que você conhece: o da gravura (nome teatral no cartucho) e
    # o do Inoue
    f = m.folha('conhece', tom='washi')
    # (a mão do monge e o espelho saem: fica só o Musashi do cartucho)
    f.peca('gravura', 'g04-monge-espelho.jpg', 330, 90, ht=900, tipo='cor', recorte=(300, 240, 670, 1000),
           apagar=[[(300, 270), (374, 270), (374, 392), (363, 402), (356, 474), (338, 540), (300, 540)]],
           chega=(ini + 1, 20), entradas=[(0.45, 0.25)], achatar=420, branco_pct=80, mascara=borda_suave(0.05))
    f.peca('inoue', 'm16-musashi-cor.jpg', 1010, 240, wd=600, tipo='cor', chega=(w('Vagabut') - 6, 20),
           entradas=[(0.5, 0.45)], mascara=borda_suave(0.07))
    c1 = corte(4800)
    m.plano(ini, c1, f, *deriva(1.0, 940, 980, 540))

    # o romance
    g = m.folha('yoshikawa', tom='washi')
    g.peca('capa', 'd02-romance-yoshikawa-br.jpg', 220, 170, ht=720, tipo='cor', chega=(w('romance') - 5, 20),
           entradas=[(0.5, 0.3)])
    g.peca('retrato', 'd03-yoshikawa-retrato.jpg', 820, 170, ht=480, tipo='cor', chega=(w('Yoshikawa', 4880) - 6, 18),
           entradas=[(0.5, 0.3)])
    g.texto('nome', [corpo('Eiji Yoshikawa', 44)], 820, 690, chega=(w('Yoshikawa', 4880) + 4, 16))
    g.texto('jornal', [rotulo('ASAHI SHIMBUN', 26)], 1290, 330, tinta='sumi2', chega=(w('jornal') - 2, 16))
    g.texto('datas', [numero('1935–1939', 120)], 1290, 390, tinta='vermelhao', chega=(w('1935') - 4, 20))
    c2, c3 = corte(5130), corte(5240)
    m.plano(c1, c2, g, *deriva(1.0, 960, 1000, 540))
    m.plano(c2, c3, g, *empurra(1.2, 1300, 440, c3 - c2))

    # livro, filme, novela
    h = m.folha('virou', tom='limpo')
    x = 300
    for nome, txt, pal in [('livro', 'livro', 'livro'), ('p1', '·', None), ('filme', 'filme', 'filme'),
                           ('p2', '·', None), ('novela', 'novela de televisão', 'novela')]:
        fr = w(pal, 5240) - 3 if pal else (w('filme', 5300) - 8 if nome == 'p1' else w('novela', 5300) - 8)
        h.texto(nome, [corpo(txt, 70)], x, 470, tinta='sumi2' if nome.startswith('p') else 'sumi', chega=(fr, 16))
        x += avanco(txt, EBG, 70) + 34
    c4 = corte(5430)
    m.plano(c3, c4, h, *deriva(1.0, 960, 1000, 540))
    c5 = corte(5513)
    m.plano(c4, c5, g, *empurra(1.0, 960, 540, c5 - c4))

    # o elenco: dois quadros vazios e o monge que existiu
    e = m.folha('elenco', tom='washi')
    qx, qy, qw, qh = [230, 760, 1290], 230, 400, 560
    quadro_vazio(e, 'otsu', qx[0], qy, qw, qh, w('Utsu') - 8, 31)
    e.texto('otsu-n', [corpo('Otsū', 46)], qx[0] + qw / 2, qy + qh + 44, ancora='centro', chega=(w('Utsu') - 2, 16))
    quadro_vazio(e, 'mata', qx[1], qy, qw, qh, w('Matahachi') - 8, 41)
    e.texto('mata-n', [corpo('Matahachi', 46)], qx[1] + qw / 2, qy + qh + 44, ancora='centro',
            chega=(w('Matahachi') - 2, 16))
    e.peca('takuan', 'm18-takuan.jpg', qx[2], qy, wd=qw, recorte=(260, 120, 888, 1000), tipo='sumi',
           chega=(w('Itaquan') - 6, 18), entradas=[(0.5, 0.3)])
    quadro_vazio(e, 'taku', qx[2], qy, qw, qh, w('Itaquan') - 8, 51)
    e.texto('taku-n', [corpo('Takuan', 46)], qx[2] + qw / 2, qy + qh + 44, ancora='centro',
            chega=(w('Itaquan') + 2, 16))
    c6 = corte(5896)
    m.plano(c5, c6, e, *deriva(1.0, 940, 980, 540))
    c7 = corte(6060)
    m.plano(c6, c7, e, *empurra(1.45, qx[2] + qw / 2, qy + qh / 2 + 30, c7 - c6))

    # o monge que amarra o Takezō na árvore: ficção de 1935
    t = m.folha('arvore', tom='washi')
    t.peca('m17', 'm17-takezo-arvore.jpg', 150, 110, wd=1150, recorte=(0, 0, 1088, 805), tipo='sumi',
           clonar=[(532, 352, 604, 384, 0, -40), (836, 416, 910, 490, 0, 80)], chega=(c7 + 2, 22),
           entradas=[(0.3, 0.3)])
    t.texto('ficcao', [corpo('ficção escrita em', 50)], 1380, 410, tinta='sumi1', chega=(w('ficção', 6300) - 3, 16))
    t.texto('1935', [numero('1935', 170)], 1380, 490, tinta='vermelhao', chega=(w('escrita', 6320) + 14, 18))
    c8 = corte(6390)
    m.plano(c7, c8, t, *deriva(1.0, 930, 970, 540))

    # não é defeito de nenhum dos dois
    d = m.folha('dois-autores', tom='washi')
    d.peca('yoshi', 'd03-yoshikawa-retrato.jpg', 520, 230, ht=480, tipo='cor', chega=(w('Yoshikawa', 6420) - 6, 18),
           entradas=[(0.5, 0.3)])
    d.peca('inoue', 'd04-inoue-pintando.jpg', 1000, 230, ht=480, tipo='cor', chega=(w('Inui', 6450) - 6, 18),
           entradas=[(0.6, 0.4)])
    d.texto('yoshi-n', [corpo('Eiji Yoshikawa', 40)], 520, 760, tinta='sumi1', chega=(w('Yoshikawa', 6420), 16))
    d.texto('inoue-n', [corpo('Takehiko Inoue', 40)], 1000, 760, tinta='sumi1', chega=(w('Inui', 6450), 16))
    c9 = corte(6511)
    m.plano(c8, c9, d, *empurra(1.0, 960, 520, c9 - c8))

    # romance pode inventar
    r = m.folha('registro', tom='limpo')
    r.texto('pode', [corpo('romance pode inventar.', 66)], 300, 330, chega=(w('Romance', 6500) - 3, 18))
    r.texto('absorvida', [corpo('o problema é que a invenção foi absorvida', 66)], 300, 470,
            chega=(w('invenção', 6580) - 4, 20))
    r.texto('registro', [corpo('como se fosse registro.', 66)], 300, 470 + 66 * 1.45, chega=(w('como', 6620) - 3, 18))
    xr = 300 + avanco('como se fosse ', EBG, 66)
    yr = 470 + 66 * 1.45 + caixa_alta(EBG, 66) + 16
    r.traco('sublinha', [(xr - 4, yr + 2), (xr + avanco('registro', EBG, 66) * 0.5, yr + 5),
                         (xr + avanco('registro.', EBG, 66) + 10, yr)], 9, seco=0.55,
            chega=(w('registro', 6640) - 2, 14))
    c10 = corte(6667)
    m.plano(c9, c10, r, *deriva(1.0, 960, 1000, 520))
    return c10


# --------------------------------------------------------------------- #
#  F — AS FONTES SE CONTRADIZEM                        60%              #
# --------------------------------------------------------------------- #
# o tríptico de Ganryūjima: 3840 x 1950
G1W, G1H = 3840, 1950


def bloco_f(m, ini):
    # mais uma camada: a plateia nos barcos (detalhe do tríptico)
    f = m.folha('plateia', tom='washi')
    f.peca('barcos', 'g01-ganryujima-triptico.webp', 300, 70, wd=1320, tipo='cor', recorte=(0, 330, 1600, 1270),
           chega=(ini + 2, 22), entradas=[(0.3, 0.55)], achatar=600, branco_pct=85, mascara=borda_tinta(0.012))
    c1 = corte(6880)
    m.plano(ini, c1, f, *deriva(1.0, 940, 980, 540))

    # a pedra do filho: o que ela diz vai se acumulando
    p = m.folha('pedra', tom='velho')
    p.texto('rotulo', [rotulo('O DOCUMENTO MAIS ANTIGO SOBRE MUSASHI', 24)], MG, 150, tinta='sumi2',
            chega=(w('documento', 6880) - 2, 16))
    base = linha_com_numero(p, 'data', '1654', 'monumento de pedra, Kokura', MG, 230,
                            chega_num=(w('1654') - 3, 18), chega_txt=(w('monumento', 6940) - 2, 16), cn=180)
    y = base + 100
    linhas = [('iori', 'erguido pelo filho adotivo, Miyamoto Iori', w('filho', 7040) - 2),
              ('nove', 'nove anos depois da morte', w('Nove', 7150) - 2),
              ('centenas', 'centenas de mortos contra a escola Yoshioka', None),
              ('ganryu', 'lutou contra Ganryū e venceu', w('lutou') - 2),
              ('espada', 'espada de madeira no formato de um chapéu eboshi', w('espada', 8560) - 2)]
    ys = {}
    for nome, txt, fr in linhas:
        ys[nome] = y
        if fr is not None:
            p.texto(nome, [corpo(txt, 50)], MG, y, chega=(fr, 16))
        y += 50 * 1.5
    c2, c3 = corte(7153), corte(7404)
    m.plano(c1, c2, p, *empurra(1.0, 960, 540, c2 - c1))
    m.plano(c2, c3, p, *empurra(1.2, 820, ys['nove'] - 40, c3 - c2))

    # Ichijōji: uma emboscada contra um homem só; centenas de mortos
    q = m.folha('ichijoji', tom='washi')
    q.peca('m05', 'm05.jpg', 452, 60, ht=960, tipo='sumi', chega=(c3 + 2, 20), entradas=[(0.45, 0.5)])
    c4 = corte(7590)
    m.plano(c3, c4, q, *empurra(1.0, 960, 540, c4 - c3))
    r = m.folha('chuva', tom='washi')
    r.peca('m06', 'm06.jpg', 320, 58, wd=1280, tipo='sumi', chega=(c4 + 2, 20), entradas=[(0.35, 0.6)])
    c5 = corte(7685)
    m.plano(c4, c5, r, *empurra(1.0, 960, 540, c5 - c4))

    # começou no túmulo: a pedra de novo, agora com os mortos
    p.texto('centenas', [corpo('centenas de mortos contra a escola Yoshioka', 50)], MG, ys['centenas'],
            chega=(c5 + 6, 18))
    c6 = corte(7773)
    m.plano(c5, c6, p, *empurra(1.12, 860, ys['centenas'] - 60, c6 - c5))

    # o duelo da ilha (profundidade: planos de paralaxe em paralaxe.py)
    c7 = corte(8040)
    ganryujima(m, c6, c7)

    # a data, e nada mais
    d = m.folha('data-duelo', tom='velho')
    d.texto('rotulo', [rotulo('REGISTRO OFICIAL DO DOMÍNIO', 24)], MG, 300, tinta='sumi2',
            chega=(w('registro', 8040) - 2, 16))
    linha_com_numero(d, 'data', '1612', '13º dia do 4º mês', MG, 380, chega_num=(w('1612') - 3, 18),
                     chega_txt=(w('13o') - 3, 16), cn=180)
    c8 = corte(8289)
    m.plano(c7, c8, d, *empurra(1.0, 960, 540, c8 - c7))

    # no livro dele, o duelo não aparece: o nome mal chega ao papel
    n = m.folha('nao-cita', tom='limpo')
    n.texto('rotulo', [rotulo('GO RIN NO SHO', 24)], 960, 330, ancora='centro', tinta='sumi2',
            chega=(w('livro', 8300) - 2, 16))
    n.texto('ganryujima', [forte('Ganryūjima', 130)], 960, 430, ancora='centro', tinta='sumi4',
            chega=(w('duelo', 8340) - 2, 22))
    n.texto('nenhuma', [corpo('nenhuma vez.', 56)], 960, 640, ancora='centro', chega=(w('nenhuma', 8360) - 2, 16))
    c9 = corte(8400)
    m.plano(c8, c9, n, *empurra(1.0, 960, 520, c9 - c8))

    # o que a pedra diz do duelo
    c10 = corte(8669)
    m.plano(c9, c10, p, *empurra(1.06, 900, 500, c10 - c9))
    return c10, n


def ganryujima(m, de, ate):
    """A chegada em Ganryūjima: o tríptico inteiro, com profundidade."""
    import paralaxe
    paralaxe.ganryujima(m, de, ate)


# --------------------------------------------------------------------- #
#  G — O REMO / NITEN-KI 1776                          80%              #
# --------------------------------------------------------------------- #
def bloco_g(m, ini):
    # a salamandra do Kuniyoshi: o Musashi com uma vara vermelha na mão
    f = m.folha('salamandra', tom='washi')
    sx, sy, sh = 616, 40, 1000
    sw = sh * 1620 / 2356
    f.peca('g03', 'g03-salamandra.jpg', sx, sy, ht=sh, tipo='cor', res=2356 / (sh * M.K), chega=(ini + 2, 22),
           entradas=[(0.12, 0.08)], janela=(0.0, 0.05, 0.75, 0.62), mascara=borda_tinta(0.012))
    c1 = corte(8792)
    m.plano(ini, c1, f, *empurra(1.85, sx + 0.33 * sw, sy + 0.33 * sh, c1 - ini))
    c2 = corte(8934)
    m.plano(c1, c2, f, *empurra(1.0, 960, 540, c2 - c1))

    # o Niten-ki, 1776
    g = m.folha('nitenki', tom='velho')
    g.texto('nome', [forte('Niten-ki', 120)], MG, 250, chega=(w('Nitenki') - 3, 20))
    linha_com_numero(g, 'data', '1776', '131 anos depois da morte de Musashi', MG, 450,
                     chega_num=(w('1776') - 3, 18), chega_txt=(w('131') - 3, 18), cn=180)
    g.texto('relato', [corpo('um relato anterior, do começo do mesmo século:', 50)], MG, 760, tinta='sumi1',
            chega=(w('relato', 9220) - 3, 18))
    g.texto('primeiro', [forte('Musashi chegou primeiro.', 66)], MG, 850, chega=(w('Musashi', 9340) - 3, 18))
    c3 = corte(9210)
    m.plano(c2, c3, g, *empurra(1.0, 960, 540, c3 - c2))
    c4 = corte(9380)
    m.plano(c3, c4, g, *empurra(1.15, 900, 640, c4 - c3))
    return c4


# --------------------------------------------------------------------- #
#  H — O NOME / KABUKI                                100%              #
# --------------------------------------------------------------------- #
def bloco_h(m, ini):
    # Sasaki Kojirō, o do mangá
    f = m.folha('kojiro', tom='washi')
    f.peca('m02', 'm02.webp', 300, 60, ht=960, tipo='cor', chega=(ini + 2, 20), entradas=[(0.5, 0.35)],
           mascara=borda_tinta(0.012))
    f.texto('nome', [forte('Sasaki Kojirō', 96)], 1100, 470, chega=(w('Sasaki', 9390) - 3, 20))
    c1 = corte(9490)
    m.plano(ini, c1, f, *empurra(1.0, 960, 540, c1 - ini))

    # o cartucho da gravura: 佐々木岸柳. Os relatos antigos só dizem Ganryū
    g = m.folha('cartucho', tom='washi')
    gx, gy, gh = 120, 65, 950
    k = gh / 970
    g.peca('kojiro', 'g01-ganryujima-triptico.webp', gx, gy, ht=gh, tipo='cor', recorte=(2560, 980, 3840, 1950),
           chega=(c1 + 2, 20), entradas=[(0.4, 0.4)], achatar=600, branco_pct=85, mascara=borda_tinta(0.012))

    def py(v):
        return gy + (v - 980) * k
    xc = gx + (3787 - 2560) * k + 16
    g.traco('ganryu', [(xc, py(1724)), (xc + 16, py(1726)), (xc + 18, py(1880)), (xc, py(1886))], 8, seco=0.5,
            chega=(w('Gangyu') - 4, 14))
    g.texto('ganryu-t', [forte('Ganryū', 70)], xc + 60, py(1780), chega=(w('Gangyu') - 2, 16))
    g.traco('sasaki', [(xc, py(1564)), (xc + 16, py(1566)), (xc + 18, py(1716)), (xc, py(1720))], 8, seco=0.5,
            chega=(w('Sasaki', 9600) - 4, 14))
    g.texto('sasaki-t', [forte('Sasaki', 70)], xc + 60, py(1618), chega=(w('Sasaki', 9600) - 2, 16))
    g.texto('kabuki', [corpo('pelo teatro kabuki,', 50)], xc + 60, 230, tinta='sumi1', chega=(w('teatro') - 3, 16))
    g.texto('volta', [corpo('por volta de', 40)], xc + 60, 320, tinta='sumi1', chega=(w('volta', 9700) - 3, 14))
    g.texto('1730', [numero('1730', 160)], xc + 60, 385, tinta='vermelhao', chega=(w('1730') - 3, 18))
    c2 = corte(9798)
    m.plano(c1, c2, g, *deriva(1.0, 940, 980, 540))

    # a baleia: o pico (profundidade em paralaxe.py)
    c3 = corte(9983)
    import paralaxe
    paralaxe.baleia(m, c2, c3)
    return c3


# --------------------------------------------------------------------- #
#  CHAMADA — o carimbo                                                  #
# --------------------------------------------------------------------- #
def chamada(m, ini):
    f = m.folha('chamada', tom='limpo')
    for i, (nome, txt, pal, depois) in enumerate([('l1', 'eu só falo o que consigo checar', 'Eu', 10060),
                                                  ('l2', 'e quando não consigo,', 'quando', 10130),
                                                  ('l3', 'eu digo que não consegui.', 'eu', 10170)]):
        f.texto(nome, [corpo(txt, 58)], 150, 430 + i * 82, chega=(w(pal, depois) - 3, 18))
    # o carimbo cai logo depois do corte: o vermelhão aparece no instante
    # em que toda a outra cor foi embora
    f.carimbo('selo', [('INSCREVA-SE', 40), ('E DEIXA', 40), ('O LIKE', 40)], 1420, 300, 330, 430,
              quando=ini + 10)
    c1 = corte(10366)
    m.plano(ini, c1, f, *parado(1.0, 960, 540))
    return c1


# --------------------------------------------------------------------- #
#  I — A CAVERNA / O LIVRO / DOKKŌDŌ             40% drenando até 12%   #
# --------------------------------------------------------------------- #
def bloco_i(m, ini):
    # o caminho até a caverna
    f = m.folha('monte', tom='washi')
    f.peca('escada', 'l02-reigando-escadaria.jpg', 200, 170, wd=1000, tipo='cor', chega=(ini + 2, 20),
           entradas=[(0.5, 0.8)], mascara=borda_tinta(0.012))
    f.texto('mes', [corpo('décimo mês de', 46)], 1300, 330, tinta='sumi1', chega=(w('décimo', 10440) - 3, 16))
    f.texto('1643', [numero('1643', 170)], 1300, 400, tinta='vermelhao', chega=(w('1643') - 3, 18))
    f.texto('monte', [rotulo('MONTE IWATO', 26)], 1300, 620, tinta='sumi2', chega=(w('Monte', 10540) - 3, 16))
    c1 = corte(10550)
    m.plano(ini, c1, f, *deriva(1.0, 940, 980, 540))

    # Reigandō
    g = m.folha('reigando', tom='washi')
    g.peca('boca', 'l01-reigando-boca.jpg', 160, 90, ht=900, tipo='cor', chega=(c1 + 2, 22), res=1.8,
           entradas=[(0.4, 0.5)], mascara=borda_tinta(0.012))
    gx = 160 + 900 * 2404 / 1944 + 70
    g.texto('nome', [forte('Reigandō', 84)], gx, 380, chega=(w('Heigandu') - 3, 18))
    g.texto('templo', [rotulo('UNGAN-ZENJI', 26)], gx, 520, tinta='sumi2', chega=(w('templo') - 2, 16))
    g.texto('kumamoto', [rotulo('KUMAMOTO', 26)], gx, 568, tinta='sumi2', chega=(w('Kumamut') - 2, 16))
    c2 = corte(10815)
    m.plano(c1, c2, g, *empurra(1.0, 960, 540, c2 - c1))

    # as quinhentas figuras de pedra
    h = m.folha('arhats', tom='washi')
    h.peca('arhats', 'l03-arhats-unganzenji.jpg', 120, 120, wd=1260, tipo='cor', chega=(c2 + 2, 22),
           entradas=[(0.65, 0.6)], mascara=borda_tinta(0.012))
    h.texto('500', [numero('500', 170)], 1470, 380, chega=(w('quintas') - 3, 18))
    h.texto('figuras', [corpo('figuras de pedra', 46)], 1470, 600, tinta='sumi1', chega=(w('seguras') - 2, 16))
    c3 = corte(10999)
    m.plano(c2, c3, h, *deriva(1.0, 930, 970, 540))

    # dois anos escrevendo: a boca da caverna, mais perto
    c4 = corte(11088)
    # 1,85x: a menor escala em que a foto (sem a borda mordida) cobre o quadro
    m.plano(c3, c4, g, *empurra(1.85, 160 + 450 * 2404 / 1944, 450, c4 - c3))

    # terminou, e entregou
    t = m.folha('entrega', tom='velho')
    t.texto('terminou', [corpo('terminou.', 56)], MG, 230, tinta='sumi1', chega=(w('Terminou') - 2, 16))
    linha_com_numero(t, 'data', '1645', '12º dia do 5º mês', MG, 360, chega_num=(w('1645', 11150) - 3, 18),
                     chega_txt=(w('12o') - 3, 16), cn=180)
    t.texto('discipulo', [corpo('entregue ao discípulo', 50)], MG, 640, tinta='sumi1',
            chega=(w('discípulo') - 3, 16))
    t.texto('terao', [forte('Terao Magonojō', 84)], MG, 720, chega=(w('Terau') - 3, 18))
    c5 = corte(11339)
    m.plano(c4, c5, t, *empurra(1.0, 960, 540, c5 - c4))

    # o Dokkōdō: vinte e uma linhas. Não é a caligrafia dele (não sobrou):
    # são vinte e uma colunas a pincel, da direita para a esquerda
    d = m.folha('dokkodo', tom='washi')
    import numpy as np
    g = np.random.default_rng(21)
    x0, x1, y0 = 1730, 1030, 160
    for k in range(21):
        x = x0 - k * (x0 - x1) / 20 + g.uniform(-4, 4)
        y = y0 + g.uniform(0, 30)
        fim = y0 + g.uniform(430, 720)
        n = 0
        while y < fim - 40:
            comp = min(fim - y, g.uniform(70, 260))
            d.traco(f'linha{k:02d}-{n}', [(x + g.uniform(-2, 2), y), (x + g.uniform(-2, 2), y + comp)],
                    g.uniform(5.5, 8), seco=g.uniform(0.45, 0.85), tinta='sumi3',
                    chega=(w('21', 11360) - 6 + k, 12), semente=100 + 7 * k + n)
            y += comp + g.uniform(22, 60)
            n += 1
    d.texto('nome', [forte('Dokkōdō', 104)], MG, 170, chega=(w('Dokodu') - 3, 18))
    d.texto('caminho', [corpo('o caminho de andar sozinho', 50)], MG, 330, tinta='sumi1',
            chega=(w('caminho', 11440) - 3, 16))
    for i, (nome, txt, pal) in enumerate([('desejar', 'não desejar nada', 'desejar'),
                                          ('arrepender', 'não se arrepender do que fez', 'arrepender'),
                                          ('preferencias', 'não ter preferências', 'preferências')]):
        d.texto(nome, [corpo(txt, 50)], MG, 520 + i * 86, chega=(w(pal) - 8, 16))
    c6 = corte(11701)
    m.plano(c5, c6, d, *deriva(1.0, 940, 980, 540))

    # sete dias depois: a papelada de novo, na data da morte
    c7 = corte(11822)
    m.plano(c6, c7, 'registros', *empurra(1.35, 700, MARCAS['registros-1645'] - 10, c7 - c6))
    # organizou, entregou, parou de respirar. Na ordem certa.
    c8 = corte(12038)
    m.plano(c7, c8, d, *empurra(1.0, 960, 540, c8 - c7))
    return c8


# --------------------------------------------------------------------- #
#  J — O INOUE PAROU                                  12%               #
# --------------------------------------------------------------------- #
# a página do fim: os balões vazios (o texto vai no papel, em português)
M04 = dict(apagar=[[(20, 480), (70, 440), (150, 425), (220, 440), (262, 490), (270, 560), (255, 625), (200, 660),
                    (120, 665), (50, 640), (15, 580)],
                   [(1255, 90), (1300, 45), (1370, 30), (1430, 50), (1470, 110), (1480, 190), (1465, 265),
                    (1420, 315), (1350, 335), (1285, 310), (1250, 250), (1243, 170)]],
           recorte=(0, 0, 1600, 1080))   # a nota do tradutor, embaixo, fica fora


def bloco_j(m, ini):
    # justo com o Inoue
    f = m.folha('inoue', tom='washi')
    f.peca('foto', 'd04-inoue-pintando.jpg', 520, 120, ht=840, tipo='cor', chega=(ini + 2, 20),
           entradas=[(0.75, 0.6)], mascara=borda_tinta(0.012))
    f.texto('nome', [corpo('Takehiko Inoue', 46)], 520 + 840 * 432 / 500 + 60, 460, tinta='sumi1',
            chega=(w('Inoi') - 3, 16))
    c1 = corte(12123)
    m.plano(ini, c1, f, *empurra(1.0, 960, 540, c1 - ini))

    # a página: desperdicei vinte e dois anos
    g = m.folha('pagina', tom='washi')
    g.peca('m04', 'm04.png', 110, 120, wd=1180, tipo='sumi', chega=(c1 + 3, 20), entradas=[(0.45, 0.35)],
           res=1.35, **M04)
    g.texto('frase', [corpo('“Desperdicei', 56), corpo('vinte e dois anos', 56), corpo('para aprender', 56),
                      corpo('só isso.”', 56)], 1370, 380, chega=(w('Desperdicei') - 3, 22))
    c2 = corte(12406)
    m.plano(c1, c2, g, *deriva(1.0, 940, 980, 540))
    # é a mesma conclusão: a frase de 1645
    c3 = corte(12644)
    m.plano(c2, c3, 'frase', *empurra(1.0, 960, 520, c3 - c2))
    # o personagem de 1998: o rosto, mais perto
    c4 = corte(12824)
    m.plano(c3, c4, g, *empurra(1.6, 110 + 0.36 * 1180, 120 + 0.33 * 1180 * 1080 / 1600, c4 - c3))

    # chegou lá, por um caminho torto: o arco da fazenda
    h = m.folha('fazenda', tom='washi')
    h.peca('m09', 'm09.jpg', 274, 40, ht=1000, tipo='sumi', chega=(c4 + 2, 20), entradas=[(0.6, 0.55)],
           apagar=[(160, 160, 760, 250), (1590, 50, 1990, 140)])
    c5 = corte(12930)
    m.plano(c4, c5, h, *empurra(1.0, 960, 540, c5 - c4))
    # que inventou metade do elenco
    c6 = corte(13017)
    m.plano(c5, c6, 'elenco', *empurra(1.0, 960, 540, c6 - c5))

    # e aí ele parou: a cronologia, como a folha de pagamento
    k = m.folha('cronologia', tom='velho')
    k.texto('rotulo', [rotulo('VAGABOND · TAKEHIKO INOUE', 24)], MG, 110, tinta='sumi2',
            chega=(w('Take', 13050) - 2, 16))
    linhas = [('1998', 'setembro, revista Morning', w('1998', 13120), w('setembro', 13100)),
              ('327', 'capítulos · 37 volumes · 82 milhões de cópias', w('327'), w('volumes', 13280)),
              ('2009', 'diz que fecha em um ou dois anos', w('2009'), w('fecharia')),
              ('2010', 'para por problema de saúde', w('2010'), w('saúde', 13500)),
              ('2012', 'volta, como mensal', w('2012'), w('mensal')),
              ('2014', 'para de novo, para pesquisar', w('2014'), w('pesquisar')),
              ('2015', 'volta em janeiro', w('2015', 13850), w('janeiro')),
              ('2015', '21 de maio: para outra vez, sem data', w('2015', 13930), w('maio'))]
    y = 175
    ys = []
    for i, (num, txt, fn, ft) in enumerate(linhas):
        ys.append(y)
        linha_com_numero(k, f'c{i}', num, txt, MG, y, chega_num=(fn - 3, 16), chega_txt=(ft - 3, 16),
                         tinta_num='sumi' if num == '327' else 'vermelhao', cn=86, ct=40)
        y += 100
    c7, c8 = corte(13201), corte(13405)
    m.plano(c6, c7, k, *empurra(1.3, 860, ys[0] + 140, c7 - c6))
    m.plano(c7, c8, k, *empurra(1.15, 900, ys[1] + 140, c8 - c7))
    c9 = corte(13693)
    m.plano(c8, c9, k, *empurra(1.15, 900, ys[3] + 60, c9 - c8))
    c10 = corte(14005)
    m.plano(c9, c10, k, *empurra(1.0, 960, 540, c10 - c9))

    # onze anos
    o = m.folha('onze', tom='limpo')
    o.texto('onze', [numero('onze anos', 200)], 960, 420, ancora='centro', chega=(w('11', 14000) - 3, 20))
    # "onze anos" segura até "travou": o respiro de 70 ms antes da palavra
    c11 = corte(14127, folga=6, minimo=6)
    m.plano(c10, c11, o, *parado(1.0, 960, 540))
    # a obra que travou no meio: a página com muito branco
    q = m.folha('branco', tom='washi')
    q.peca('m11', 'm11.jpg', 302, 60, ht=960, tipo='sumi', chega=(c11 + 2, 22), entradas=[(0.69, 0.62)])
    c12 = corte(14290)
    m.plano(c11, c12, q, *deriva(1.0, 940, 980, 540))

    # dívidas diferentes
    d = m.folha('dividas', tom='limpo')
    d.texto('musashi', [forte('Musashi', 96)], 960 - 120, 400, ancora='dir', chega=(w('dois', 14300) - 3, 18))
    d.texto('inoue', [forte('Inoue', 96)], 960 + 120, 400, chega=(w('dois', 14300) + 3, 18))
    d.texto('dividas', [corpo('dívidas diferentes', 56)], 960, 600, ancora='centro', tinta='sumi1',
            chega=(w('dívidas') - 3, 16))
    c13 = corte(14370)
    m.plano(c12, c13, d, *empurra(1.0, 960, 520, c13 - c12))
    # Musashi não devia um duelo: no livro dele, Ganryūjima não aparece
    c14 = corte(14570)
    m.plano(c13, c14, 'nao-cita', *empurra(1.0, 960, 520, c14 - c13))
    # vinte e uma linhas, sete dias, estava feito
    c15 = corte(14764)
    m.plano(c14, c15, 'dokkodo', *deriva(1.0, 980, 940, 540))

    # o Inoue deve a ilha: Ganryūjima hoje, o duelo virado estátua (o
    # Musashi de bronze segura o remo do Niten-ki)
    p = m.folha('ilha', tom='washi')
    p.peca('l05', 'l05-ganryujima-estatuas.jpg', 300, 40, ht=1000, tipo='cor', chega=(c15 + 2, 20),
           entradas=[(0.7, 0.45)], mascara=borda_tinta(0.012))
    p.texto('nome', [rotulo('GANRYŪJIMA · HOJE', 24)], 1360, 520, tinta='sumi2', chega=(w('ilha', 14790) - 2, 16))
    c16 = corte(14904)
    m.plano(c15, c16, p, *empurra(1.0, 960, 540, c16 - c15))
    # dois homens e uma espada
    r = m.folha('duelo', tom='washi')
    r.peca('m07', 'm07.jpg', 249, 40, ht=1000, tipo='sumi', chega=(c16 + 2, 20), entradas=[(0.5, 0.45)])
    c17 = corte(15004)
    m.plano(c16, c17, r, *empurra(1.0, 960, 540, c17 - c16))
    # depois que o personagem já disse, na própria página
    c18 = corte(15215)
    m.plano(c17, c18, g, *empurra(1.0, 960, 540, c18 - c17))

    # não tem saída limpa: o clímax ou o entendimento
    s = m.folha('saida', tom='washi')
    s.peca('climax', 'm07.jpg', 120, 170, wd=800, tipo='sumi', chega=(w('clímax') - 4, 20), entradas=[(0.5, 0.45)])
    s.peca('fiel', 'm10.jpg', 1000, 170 + (800 * 1614 / 2296 - 800 * 1131 / 1147) / 2, wd=800, tipo='sumi',
           chega=(w('fiel') - 4, 20), entradas=[(0.5, 0.5)])
    s.texto('copias', [corpo('82 milhões de cópias', 50)], 1000, 900, tinta='sumi1', chega=(w('82', 15470) - 3, 16))
    c19 = corte(15541)
    m.plano(c18, c19, s, *deriva(1.0, 940, 980, 540))
    return c19


# --------------------------------------------------------------------- #
#  K — FECHO: O PICANÇO                                0%               #
# --------------------------------------------------------------------- #
def fecho(m, ini):
    # a pintura volta: a tinta sobe pelo galho de novo, e fica até o fim
    f = pintura(m, 'fecho', chega=(ini + 2, 22), entradas=[(0.45, 0.75)], janela=(0, 0, 1, 0.75), plano='galho')
    m.plano(ini, corte(15726), f, *empurra(1.0, 960, 540, corte(15726) - ini))
    # um galho seco, um pássaro, uma lagarta: o detalhe, numa escala só
    passaro = no_koboku(0.415, 0.165)
    lagarta = no_koboku(0.46, 0.44)
    c1, c2 = corte(15726), corte(15824)
    m.plano(c1, c2, f, *empurra(1.75, (passaro[0] + lagarta[0]) / 2, (passaro[1] + lagarta[1]) / 2, c2 - c1))
    # três quartos do papel em branco. O galho à frente, o papel atrás,
    # dois por cento de deriva: mal se percebe
    c3 = corte(16106)
    m.plano(c2, c3, f, *empurra(1.0, 960, 540, c3 - c2), px={'fundo': [0, 0, 0], 'galho': [0, 0.02, 0]})
    m.plano(c3, M.FRAMES, f, *deriva(1.0, 1400, 1440, 540), px={'fundo': [0, 0, 0], 'galho': [0, -0.02, 0]})
    return M.FRAMES


# --------------------------------------------------------------------- #
#  A PARTITURA                                                          #
# --------------------------------------------------------------------- #
# Os pontos do AUDIO.md (frame, saturação). Cada virada cai no corte que
# abre o bloco dela, nunca no meio de um plano: os cortes vêm da pausa real
# da fala e às vezes ficam dezenas de frames antes da marca do documento
# (9442 "E o nome" é dito em 9380). O 40% da caverna drena em linha reta até
# o 12% do Inoue; depois do pico do kabuki a saturação nunca sobe.
PARTITURA_DOC = [(0, 0.0), (1384, 0.05), (2550, 0.10), (4458, 0.0), (4650, 0.35), (6726, 0.60), (8669, 0.80),
                 (9442, 1.0), (10392, 0.40), (12038, 0.12), (15532, 0.0)]


def partitura(m, ini):
    cortes = sorted({p['de'] for p in m.planos})

    def perto(f):
        return min(cortes, key=lambda c: abs(c - f))
    frames = [0, perto(1384), perto(2550), perto(4458), ini['E'], ini['F'], ini['G'], ini['H'], ini['I'],
              ini['J'], ini['K']]
    pts = [[f, sat, 1 if doc == 10392 else 0] for f, (doc, sat) in zip(frames, PARTITURA_DOC)]
    assert all(a[0] < b[0] for a, b in zip(pts, pts[1:])), pts
    pico = [p[0] for p in pts].index(ini['H'])
    assert all(a[1] >= b[1] for a, b in zip(pts[pico:], pts[pico + 1:])), 'a saturação subiu depois do pico'
    for (doc, _), p in zip(PARTITURA_DOC, pts):
        if doc != p[0]:
            print(f'  partitura: {doc} -> corte {p[0]}')
    return pts


def principal():
    papel, fibra = M.papel_e_fibra()
    m = M.Montagem()
    ini = {}
    fim = bloco_a(m)
    fim = bloco_b(m, fim)
    fim = bloco_c(m, fim)
    ini['E'] = fim
    fim = bloco_e(m, fim)
    ini['F'] = fim
    fim, _ = bloco_f(m, fim)
    ini['G'] = fim
    fim = bloco_g(m, fim)
    ini['H'] = fim
    fim = bloco_h(m, fim)
    fim = chamada(m, fim)
    ini['I'] = fim
    fim = bloco_i(m, fim)
    ini['J'] = fim
    fim = bloco_j(m, fim)
    ini['K'] = fim
    fecho(m, fim)
    m.escrever(papel, fibra, partitura(m, ini))


if __name__ == '__main__':
    principal()
