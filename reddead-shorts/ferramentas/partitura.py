"""
A partitura dos efeitos sonoros: o que soa, quando e com que volume.

Cada efeito é (segundo do vídeo, nome, volume em dB, opções). O nome é o de
uma função de ferramentas/efeitos.py. Os tempos são tirados das palavras da
narração e dos cortes de cena, pelos mesmos atalhos que a imagem usa:

  T.vp('tabela')     o quadro em que a imagem reage à palavra "tabela"
  T.vc('data')       o corte para a cena "data"

Nas opções, `pos` põe o som à esquerda (-1) ou à direita (1), e `some` corta
o som nessa duração.
"""

FRASE_TURNER = 'In a recent bulletin\nof the Superintendent\nof the Census…'
Q = 1 / 30  # um quadro
MUSICA_S2 = 95.18  # o Short 2 entra num ataque forte da música, em 1:35


def s1(T):
    vp, vc = T.vp, T.vc
    e = []

    # --- abertura: a rua, o tiro, o meio-dia ---
    e += [
        (0.0, 'vento', -23, {'sem': 2, 'dur': 3.2}),
        (0.04, 'engatilha', -8, {'sem': 3}),
        (vp('tiroteio') - 0.85, 'subida', -17, {'sem': 4, 'dur': 0.85}),
        (vp('tiroteio'), 'tiro', -3.0, {'sem': 7}),
        (vp('tiroteio'), 'tinta', -13, {'sem': 2}),
        (vp('meio-dia'), 'sino', -15, {'sem': 5, 'base': 261.6, 'dur': 2.4}),
    ]

    # --- a tabela ---
    e += [(vc('tabela') - 0.03, 'sopro', -12, {'sem': 6, 'dur': 0.45, 'f0': 3400, 'f1': 280, 'de': 0.2, 'para': -0.4, 'pico_em': 0.35})]
    e += [(vc('tabela') + 0.05 + i * 0.04, 'tique', -23, {'sem': 20 + i, 'tom': 0.75 + 0.05 * i}) for i in range(9)]
    e += [
        (vp('tabela'), 'carimbo', -5.5, {'sem': 9}),
        (vp('tabela'), 'impacto', -11, {'sem': 3, 'dur': 0.9, 'grave': 58}),
    ]

    # --- a data ---
    e += [
        (vc('data') - 5 * Q, 'sopro', -14, {'sem': 8, 'dur': 0.42, 'f0': 240, 'f1': 2600}),
        (vp('20'), 'baque', -8, {'sem': 11, 'peso': 1.2}),
        (vp('abril'), 'baque', -10.5, {'sem': 12, 'peso': 0.85}),
        (vp('1891'), 'impacto', -6, {'sem': 13, 'grave': 44}),
        (vp('1891'), 'carimbo', -8, {'sem': 14}),
    ]

    # --- o boletim ---
    e += [
        (vc('boletim') - 0.03, 'papel', -13, {'sem': 15, 'dur': 0.42}),
        (vp('Washington'), 'datilografia', -16, {'sem': 16, 'texto': 'WASHINGTON, D. C.', 'cps': 34}),
        (vp('Washington') + 17 / 34 + 0.04, 'campainha', -22, {'sem': 17}),
        (vp('Censo'), 'tecla', -19, {'sem': 31}),
        (vp('Boletim'), 'baque', -11, {'sem': 18, 'peso': 0.9}),
    ]
    e += [(vp('Boletim') + i * 1.2 * Q, 'baque', -17, {'sem': 40 + i, 'peso': 0.55}) for i in range(1, 5)]
    e += [(vp('Extra') + i * 1.4 * Q, 'tecla', -19, {'sem': 50 + i}) for i in range(8)]
    e += [
        (vp('número'), 'tique', -17, {'sem': 19}),
        (vp('2'), 'pena', -15, {'sem': 20, 'dur': 0.42, 'tracos': 2}),
        (vp('“Distribuição') - 8 * Q, 'papel', -18, {'sem': 21, 'dur': 0.55}),
        (vp('“Distribuição'), 'baque', -18, {'sem': 22, 'peso': 0.5}),
        (vp('da'), 'baque', -19, {'sem': 23, 'peso': 0.5}),
        (vp('Segundo'), 'baque', -18, {'sem': 24, 'peso': 0.5}),
        (vp('Densidade”'), 'baque', -17, {'sem': 25, 'peso': 0.5}),
    ]
    e += [(vp('Densidade”') + (6 + i * 3) * Q, 'tique', -21, {'sem': 60 + i, 'tom': 0.7 + 0.09 * i}) for i in range(6)]
    e += [
        (vp('assinado') - 6 * Q, 'papel', -18, {'sem': 26, 'dur': 0.6}),
        (vp('Robert'), 'pena', -13.5, {'sem': 27, 'dur': 1.46, 'tracos': 10}),
        (vp('superintendente'), 'datilografia', -17, {'sem': 28, 'texto': 'Superintendent of Census.', 'cps': 30}),
    ]

    # --- documento de escritório: coluna, número, assinatura ---
    e += [
        (vc('escritorio'), 'sopro', -15, {'sem': 29, 'dur': 0.65, 'f0': 1900, 'f1': 240, 'de': 0.0, 'para': 0.0, 'pico_em': 0.3}),
        (vp('coluna'), 'impacto', -7, {'sem': 30, 'grave': 56, 'dur': 0.8}),
        (vp('coluna'), 'baque', -9, {'sem': 31}),
        (vp('número', 2), 'impacto', -7, {'sem': 32, 'grave': 64, 'dur': 0.7}),
        (vp('assinatura'), 'impacto', -6, {'sem': 33, 'grave': 50, 'dur': 1.1}),
        (vp('assinatura'), 'pena', -12, {'sem': 34, 'dur': 0.34, 'tracos': 3}),
    ]
    e += [(vp('número', 2) + (1 + i * 1.6) * Q, 'tique', -18, {'sem': 70 + i, 'tom': 1.0 + 0.06 * i}) for i in range(6)]

    # --- a linha da fronteira ---
    e += [
        (vc('linha') - 4 * Q, 'sopro', -13, {'sem': 35, 'dur': 0.36, 'f0': 300, 'f1': 3000, 'de': -0.8, 'para': 0.8}),
        (vc('linha'), 'zumbido', -25, {'sem': 36, 'dur': 2.5, 'nota': 49.0}),
        (vp('linha'), 'pena', -15, {'sem': 37, 'dur': 0.5, 'tracos': 1, 'pos': -0.5}),
        (vp('não', 2) - 0.7, 'subida', -16, {'sem': 38, 'dur': 0.7}),
        (vp('não', 2), 'corda', -4.5, {'sem': 39}),
        (vp('não', 2), 'impacto', -9, {'sem': 40, 'grave': 48}),
        (vp('não', 2) + 2 * Q, 'cacos', -12, {'sem': 41, 'dur': 0.95, 'quantos': 16}),
    ]

    # --- o mapa ---
    e += [
        (vc('mapa') - 5 * Q, 'sopro', -14, {'sem': 42, 'dur': 0.4, 'f0': 2800, 'f1': 320}),
        (vc('mapa'), 'pena', -20, {'sem': 43, 'dur': 0.75, 'tracos': 4}),
        (vp('recuou') - 8 * Q, 'sopro', -18, {'sem': 44, 'dur': 0.36, 'f0': 500, 'f1': 1500, 'de': 0.5, 'para': -0.5}),
        (vp('recuou') + 3 * Q, 'sopro', -19, {'sem': 45, 'dur': 0.34, 'f0': 1500, 'f1': 500, 'de': -0.5, 'para': 0.5}),
        (vp('deixou'), 'corda', -10, {'sem': 46}),
        (vp('deixou') + Q, 'cacos', -15, {'sem': 47, 'dur': 0.7, 'quantos': 12}),
    ]
    e += [(vp('deixou') + (4 + i * 0.9) * Q, 'estalinho', -22, {'sem': 80 + i, 'tom': 0.8 + 0.5 * ((i * 7) % 11) / 11}) for i in range(26)]
    e += [
        (vp('Dois'), 'baque', -9.5, {'sem': 48}),
        (vp('Dois') + 5 * Q, 'tique', -18, {'sem': 49}),
        (vp('Dois') + 10 * Q, 'tique', -17, {'sem': 50, 'tom': 1.15}),
        (vp('historiador') - 6 * Q, 'sopro', -16, {'sem': 51, 'dur': 0.8, 'f0': 300, 'f1': 1800, 'de': -0.9, 'para': 0.9, 'pico_em': 0.5}),
        (vp('Chicago') - 2 * Q, 'baque', -13, {'sem': 52, 'peso': 0.7}),
        (vp('lê') - 4 * Q, 'papel', -14, {'sem': 53, 'dur': 0.72}),
    ]

    # --- "está fechada" ---
    e += [
        (vc('fechada') - 4 * Q, 'sopro', -12, {'sem': 54, 'dur': 0.36, 'f0': 300, 'f1': 3200, 'de': 0.8, 'para': -0.8}),
        (vp('fechada') - 1.5, 'subida', -15, {'sem': 55, 'dur': 1.5}),
        (vp('fechada'), 'impacto', -5, {'sem': 56, 'grave': 42, 'dur': 2.0}),
        (vp('fechada'), 'carimbo', -5, {'sem': 57}),
    ]

    # --- as três tarjas ---
    e += [
        (vc('censura'), 'papel', -17, {'sem': 58}),
        (vp('número', 3) - 0.12, 'sopro', -18, {'sem': 59, 'dur': 0.2, 'f0': 600, 'f1': 2400, 'de': -0.6, 'para': 0.3}),
        (vp('número', 3), 'baque', -6.5, {'sem': 60, 'peso': 1.2}),
        (vp('data') - 12 * Q, 'sopro', -13, {'sem': 61, 'dur': 0.32, 'f0': 400, 'f1': 3600, 'de': -0.8, 'para': 0.8}),
        (vp('data'), 'baque', -6.5, {'sem': 62, 'peso': 1.2}),
        (vp('Porter', 2) - 16 * Q, 'sopro', -13, {'sem': 63, 'dur': 0.32, 'f0': 3600, 'f1': 400, 'de': 0.8, 'para': -0.8}),
        (vp('Porter', 2), 'baque', -5, {'sem': 64, 'peso': 1.45}),
        (vp('Porter', 2), 'impacto', -12, {'sem': 65, 'grave': 52, 'dur': 0.9}),
    ]

    # --- a citação, à máquina ---
    e += [
        (vc('citacao') - 5 * Q, 'sopro', -13, {'sem': 66, 'dur': 0.4, 'f0': 260, 'f1': 2800}),
        (vc('citacao') + Q, 'tinta', -15, {'sem': 67}),
        (vp('um', 3), 'datilografia', -14.5, {'sem': 68, 'texto': FRASE_TURNER, 'cps': 24}),
        (vp('recente') + 2 * Q, 'risco', -14, {'sem': 69, 'dur': 0.3}),
    ]
    e += [(vp('um', 3) + i / 24 + 0.03, 'campainha', -24, {'sem': 90 + i}) for i, ch in enumerate(FRASE_TURNER) if ch == '\n']

    # --- a montanha, 1899 ---
    e += [
        (vc('montanha') - 4 * Q, 'sopro', -13, {'sem': 71, 'dur': 0.36, 'f0': 300, 'f1': 3000, 'de': -0.8, 'para': 0.8}),
        (vc('montanha'), 'vento', -16, {'sem': 72, 'dur': 2.1}),
        (vc('raio') - 1.25, 'subida', -14.5, {'sem': 73, 'dur': 1.25}),
        (vp('1899'), 'trovao', -6.5, {'sem': 74, 'dur': 2.6}),
        (vp('1899'), 'impacto', -6, {'sem': 75, 'grave': 40, 'dur': 2.0}),
    ]

    # --- o atestado de óbito ---
    e += [
        (vc('atestado') - 5 * Q, 'sopro', -14, {'sem': 76, 'dur': 0.4, 'f0': 2800, 'f1': 300}),
        (vp('oito'), 'baque', -8.5, {'sem': 77}),
        (vp('assinado', 2) - 10 * Q, 'pena', -14, {'sem': 78, 'dur': 0.88, 'tracos': 7}),
        (vp('atestado') - 0.5, 'subida', -17, {'sem': 79, 'dur': 0.5}),
        (vp('atestado'), 'carimbo', -4, {'sem': 80}),
        (vp('atestado'), 'impacto', -7, {'sem': 81, 'grave': 46}),
        (vp('óbito'), 'sino', -12, {'sem': 82, 'base': 146.8, 'dur': 3.6}),
    ]
    e += [(vp('oito') + (3 + i * 1.55) * Q, 'tique', -20, {'sem': 100 + i}) for i in range(9)]

    # --- o fecho ---
    e += [
        (vc('fim') - 0.02, 'brilho', -15, {'sem': 83}),
        (vc('fim') - 0.3, 'sopro', -18, {'sem': 84, 'dur': 0.5, 'f0': 500, 'f1': 5000, 'de': 0, 'para': 0}),
    ]

    return {
        'musica_ini': 0.0,
        'musica_db': -13.5,
        'musica_pausa_db': 5.0,
        'musica_trechos': [
            (vp('tiroteio') - 0.1, vp('tiroteio') + 0.3, -24, 0.04, 0.3),     # a música some para o tiro estalar
            (vp('fechada') - 0.08, vp('fechada') + 0.5, -10, 0.05, 0.45),
            (vp('1899') - 0.08, vp('1899') + 0.7, -12, 0.05, 0.6),
            (vc('fim'), T.dur, 5.0, 0.35, 0.01),                              # o fecho: a música sobe
        ],
        'musica_fim': 0.7,
        'efeitos': e,
    }


RECEITA = 'Paciente: A. Morgan\nMal: tuberculose\nAno: 1899'


def s2(T):
    vp, vc = T.vp, T.vc
    e = []

    # --- a tosse ---
    tosse = vp('tossir')
    e += [
        (0.0, 'zumbido', -26, {'sem': 1, 'dur': 2.6, 'nota': 49.0}),
        (vp('1899') - Q, 'impacto', -6, {'sem': 2, 'grave': 46}),
        (vp('1899') - Q, 'baque', -9, {'sem': 3, 'peso': 1.2}),
        (tosse, 'tosse_surda', -8.5, {'sem': 4}),
        (tosse, 'tinta', -12, {'sem': 5}),
        (vp('medicina') - 2 * Q, 'papel', -18, {'sem': 6}),
        (vp('ocidental'), 'tique', -20, {'sem': 7}),
        (vp('inteira'), 'tique', -19, {'sem': 8, 'tom': 0.85}),
        (vp('nada'), 'impacto', -5, {'sem': 9, 'grave': 42}),
        (vp('nada'), 'tinta', -12, {'sem': 10}),
    ]
    # o coração: uma batida a cada 27 quadros, junto com o pulso da mancha
    k = 0
    while tosse + (6.75 + 27 * k) * Q < vc('tratamento') - 0.3:
        e.append((tosse + (6.75 + 27 * k) * Q - 0.02, 'coracao', -15.5, {'sem': 20 + k}))
        k += 1

    # --- o tratamento ---
    e += [
        (vc('tratamento') - 4 * Q, 'sopro', -13, {'sem': 11, 'dur': 0.36, 'f0': 300, 'f1': 3000, 'de': -0.8, 'para': 0.8}),
        (vp('ruim'), 'baque', -7.5, {'sem': 12, 'peso': 1.2}),
        (vp('é', 2) - 3 * Q, 'risco', -13, {'sem': 13, 'dur': 0.26}),
        (vp('existia'), 'carimbo', -4.5, {'sem': 14}),
        (vp('existia'), 'impacto', -9, {'sem': 15, 'grave': 50}),
        (vp('tratamento', 2), 'risco', -12, {'sem': 16, 'dur': 0.3}),
    ]

    # --- a receita ---
    e += [
        (vc('receita') - 5 * Q, 'sopro', -14, {'sem': 17, 'dur': 0.4, 'f0': 2800, 'f1': 300}),
        (vc('receita'), 'pena', -15, {'sem': 18, 'dur': 0.45, 'tracos': 3}),
        (vc('receita') + 10 * Q, 'datilografia', -16, {'sem': 19, 'texto': RECEITA, 'cps': 30}),
    ]
    e += [(vc('receita') + (34 + i * 3) * Q, 'tique', -22, {'sem': 40 + i, 'tom': 0.8}) for i in range(5)]
    e += [(vc('receita') + 10 * Q + i / 30 + 0.03, 'campainha', -25, {'sem': 46 + i}) for i, ch in enumerate(RECEITA) if ch == '\n']
    for i, cena in enumerate(('ar', 'leite', 'carne', 'repouso', 'cavalgada')):
        e.append((vc(cena), 'baque', -8.5, {'sem': 50 + i, 'peso': 1.1}))
    e += [
        (vc('ar'), 'vento', -11, {'sem': 55, 'dur': 1.0, 'some': 0.98}),
        (vc('ar') - 2 * Q, 'sopro', -15, {'sem': 56, 'dur': 0.5, 'f0': 400, 'f1': 2600, 'de': -0.7, 'para': 0.7}),
        (vc('leite') + Q, 'gole', -12, {'sem': 57}),
        (vc('leite') + 2 * Q, 'vidro', -17, {'sem': 58}),
        (vc('carne') + Q, 'cutelo', -6.5, {'sem': 59}),
        (vc('repouso') + Q, 'suspiro', -13, {'sem': 60}),
        (vc('cavalgada'), 'galope', -9.5, {'sem': 61, 'dur': 1.85, 'de': -0.8, 'para': 0.3}),
    ]

    # --- andar a cavalo ---
    e += [
        (vc('cavalo') - 4 * Q, 'sopro', -13, {'sem': 62, 'dur': 0.36, 'f0': 300, 'f1': 3000, 'de': 0.8, 'para': -0.8}),
        (vc('cavalo'), 'galope', -12, {'sem': 63, 'dur': 1.3, 'de': 0.3, 'para': 0.8}),
        (vp('andar'), 'carimbo', -4, {'sem': 64}),
        (vp('andar'), 'impacto', -6, {'sem': 65, 'grave': 44}),
        (vp('andar') + 2 * Q, 'trovao', -9.5, {'sem': 66, 'dur': 2.0}),
    ]

    # --- os 194 ---
    t0, t1 = vp('194'), T.v(23.6)
    e += [(vc('mortes') - 5 * Q, 'sopro', -14, {'sem': 67, 'dur': 0.4, 'f0': 2600, 'f1': 300})]
    e += [(t0 + (t1 - t0) * (1 - (1 - i / 22) ** (1 / 1.6)), 'tique', -19, {'sem': 70 + i, 'tom': 0.75 + 0.02 * i}) for i in range(1, 22)]
    e += [
        (t1, 'impacto', -6, {'sem': 95, 'grave': 40}),
        (t1, 'sino', -13, {'sem': 96, 'base': 130.8, 'dur': 3.2}),
        (vp('ano'), 'baque', -9, {'sem': 97}),
        (vp('ano'), 'sino', -17, {'sem': 98, 'base': 196.0, 'dur': 2.0}),
    ]

    # --- o remédio ---
    e += [
        (vc('remedio') - 5 * Q, 'sopro', -14, {'sem': 99, 'dur': 0.4, 'f0': 300, 'f1': 2800}),
        (vc('remedio') + 2 * Q, 'pena', -17, {'sem': 100, 'dur': 1.3, 'tracos': 6}),
        (vc('remedio') + 16 * Q, 'vidro', -15, {'sem': 101}),
        (vc('remedio') + 30 * Q, 'gole', -16, {'sem': 102}),
        (vp('estreptomicina'), 'impacto', -9, {'sem': 103, 'grave': 54, 'dur': 0.9}),
        (vp('isolada') - 2 * Q, 'tique', -18, {'sem': 104}),
    ]
    e += [(vp('estreptomicina') + i * 2.2 * Q, 'baque', -14, {'sem': 110 + i, 'peso': 0.6}) for i in range(14)]
    a0, a1 = vp('1943'), T.v(36.22)
    e += [(a0 + (a1 - a0) * (1 - (1 - i / 24) ** (1 / 2.2)), 'tique', -19, {'sem': 130 + i, 'tom': 0.9 + 0.015 * i}) for i in range(1, 24)]
    e += [
        (a1, 'baque', -7, {'sem': 160, 'peso': 1.2}),
        (a1 + Q, 'campainha', -17, {'sem': 161}),
        (vp('44'), 'impacto', -7, {'sem': 162, 'grave': 48}),
        (vp('44'), 'baque', -9, {'sem': 163}),
        (vp('testada') + 4 * Q, 'tique', -16, {'sem': 164}),
        (vp('testada') + 4 * Q, 'papel', -19, {'sem': 165}),
    ]

    # --- 44 anos de nada ---
    desce = vp('primeira') - 6 * Q
    e += [
        (vc('nada') - 4 * Q, 'sopro', -13, {'sem': 166, 'dur': 0.36, 'f0': 300, 'f1': 3000, 'de': -0.8, 'para': 0.8}),
        (vc('nada'), 'zumbido', -22, {'sem': 167, 'dur': vc('preto') - vc('nada'), 'nota': 46.2}),
        (desce, 'sopro', -9.5, {'sem': 168, 'dur': 0.95, 'f0': 220, 'f1': 4200, 'de': 0.0, 'para': 0.0, 'pico_em': 0.55}),
        (desce + 22 * Q, 'vidro', -14, {'sem': 169}),
        (desce + 22 * Q, 'baque', -12, {'sem': 170, 'peso': 0.9}),
        (vc('visao'), 'sopro', -14, {'sem': 171, 'dur': 0.36, 'f0': 3200, 'f1': 300, 'de': 0, 'para': 0, 'pico_em': 0.35}),
        (vp('44', 2), 'impacto', -5, {'sem': 172, 'grave': 44}),
        (T.v(45.16) - Q, 'tique', -15, {'sem': 173, 'tom': 0.7}),
        (vp('nada', 2) - 0.78, 'subida', -13, {'sem': 174, 'dur': 0.78}),
        (vp('nada', 2), 'queda', -6.5, {'sem': 175, 'dur': 1.5}),
    ]
    e += [(desce + (3 + i * 1.05) * Q, 'tique', -21, {'sem': 180 + i, 'tom': 1.2 - 0.02 * i}) for i in range(20)]
    # o coração: devagar na viagem, mais depressa quando a linha inteira aparece, e para no "nada"
    tt, k = vc('nada') + 0.25, 0
    while tt < vp('nada', 2) - 0.25:
        e.append((tt, 'coracao', -14.5 if tt > vc('visao') else -16.5, {'sem': 210 + k}))
        tt += 0.56 if tt > vc('visao') else 0.82
        k += 1

    # --- o buraco ---
    e += [
        (vc('buraco') - Q, 'sopro', -16, {'sem': 240, 'dur': 0.5, 'f0': 500, 'f1': 2200}),
        (vc('buraco'), 'vento', -17, {'sem': 241, 'dur': 3.8}),
        (vp('ele', 3) - 4 * Q, 'sopro', -12.5, {'sem': 242, 'dur': 1.15, 'f0': 2600, 'f1': 180, 'de': 0, 'para': 0, 'pico_em': 0.5}),
        (vp('buraco'), 'impacto', -5, {'sem': 243, 'grave': 36, 'dur': 2.4}),
        (vp('buraco'), 'queda', -10, {'sem': 244, 'dur': 1.6}),
    ]

    # --- o fecho ---
    e += [
        (vc('fim') - 0.02, 'brilho', -15, {'sem': 245}),
        (vc('fim') - 0.3, 'sopro', -18, {'sem': 246, 'dur': 0.5, 'f0': 500, 'f1': 5000, 'de': 0, 'para': 0}),
    ]

    return {
        'musica_ini': MUSICA_S2,
        'musica_db': -13.5,
        'musica_pausa_db': 5.0,
        'musica_trechos': [
            (vp('andar') - 0.08, vp('andar') + 0.5, -10, 0.05, 0.45),
            (vp('nada', 2) - 0.07, vc('buraco') - 0.15, -70, 0.05, 0.6),     # no "nada", silêncio
            (vc('fim'), T.dur, 5.0, 0.35, 0.01),
        ],
        'musica_fim': 0.7,
        'efeitos': e,
    }


SHORTS = {1: s1, 2: s2}
