#!/usr/bin/env python3
"""
Monta public/ e src/data/ a partir do pacote v3 e da trilha v2:

  python3 -I ferramentas/prepara-v3.py <pasta rd-v3> <trilha-v2.mp3>

O pacote fica intacto. O que este script faz:

1. Copia pecas/ (fundos e peças) para public/pecas/, o PACOTE.json para
   src/data/pacote.json e a trilha para public/trilha.mp3.
2. Separa do fundo o que agora precisa entrar sozinho, ou que estava
   estranho, e grava a camada à parte:
   - p01-abertura e p08-tabela: um tracinho creme solto sob a faixa. A peça
     de texto que viria depois dele (t05) está vazia. O tracinho sai.
   - p13-cartela: o mesmo tracinho abre "INSCREVA-SE", mas 17 px acima do
     meio da linha. Ele sai do fundo; o vídeo desenha outro, centrado.
   - p05-44anos: a barra vermelha 1899-1943 vira barra.png, para crescer na
     tela. No fundo fica o eixo cinza que ela cobria.
   - p06-boletim: o atlas passava por baixo das linhas da citação e das
     palavras grandes. Ele vira atlas.jpg, para entrar menor e mais à
     direita. Os dois sublinhados vermelhos viram sublinhado-1.png e -2.png,
     porque o primeiro cortava a linha de baixo da citação.
   - p06b-mapa: grava também _fundo-sem-atlas.jpg, para o esquema vetorial.
   O buraco é preenchido com o fundo liso de outra chapa, do mesmo gerador
   de grão e vinheta. A diferença de baixa frequência entre as duas chapas,
   medida em volta do buraco, é espalhada para dentro dele (membrana
   harmônica), para não deixar emenda.
3. Os letterings sobre o jogo (_sobre-jogo/gNN.png) estavam posicionados
   pelo topo da tinta, então os que têm acento ficavam mais baixos que os
   outros. Aqui eles são alinhados pela linha de base. Os de impacto ganham
   os cortes de cada letra, para entrarem uma a uma, 3 quadros entre elas,
   como as letras das chapas. Sai em src/data/sobre-jogo.json.
4. O mapa (mapa/eua-fronteira.svg) vira src/data/mapa.json.
5. Os textos novos do mapa (a nota "ESQUEMA" e os anos da linha) saem em
   PNG, na fonte das notas de rodapé (IBM Plex Mono, OFL, em
   ferramentas/fontes/), com posição em src/data/textos.json.
"""
import json
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
DADOS = RAIZ / 'src' / 'data'
DOADOR = 'p07-turner'  # chapa de fundo liso em toda a área usada
FONTE = RAIZ / 'ferramentas' / 'fontes' / 'ibm-plex-mono-latin-400-normal.woff2'

# letterings: linha de base de referência (a dos que não têm acento)
BASE_IMPACTO = 850  # y=760 + 91 de altura
BASE_TARJA = 934  # y=900 + 35 de altura


def le(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(np.float32)


def grava_jpg(a, p):
    Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8)).save(p, quality=95, subsampling=0)


def baixa(x, peso, sigma=10):
    """Desfoque só com os pixels de peso 1 (convolução normalizada)."""
    den = ndimage.gaussian_filter(peso, sigma)
    num = np.stack([ndimage.gaussian_filter(x[..., c] * peso, sigma) for c in range(3)], -1)
    return num / np.maximum(den, 1e-4)[..., None]


def preenche(alvo, buraco, doador, suave=10):
    """Troca o buraco por fundo liso: doador + membrana da diferença."""
    fora = ~ndimage.binary_dilation(buraco, iterations=6)
    dif = baixa(alvo, fora.astype(np.float32)) - baixa(doador, fora.astype(np.float32))
    # membrana harmônica numa grade 8x menor: fora do buraco vale a diferença
    # medida; dentro, a média dos vizinhos (Laplace), até assentar
    f = 8
    h, w = buraco.shape
    hh, ww = (h + f - 1) // f, (w + f - 1) // f
    pad = np.zeros((hh * f, ww * f), bool)
    pad[:h, :w] = ndimage.binary_dilation(buraco, iterations=12)
    dentro = pad.reshape(hh, f, ww, f).any(axis=(1, 3))
    grade = np.zeros((hh * f, ww * f, 3), np.float32)
    grade[:h, :w] = dif
    m = grade[f // 2::f, f // 2::f].copy()
    m[dentro] = m[~dentro].mean(axis=0)
    ys, xs = np.nonzero(dentro)
    y0, y1, x0, x1 = max(ys.min() - 2, 0), min(ys.max() + 3, hh), max(xs.min() - 2, 0), min(xs.max() + 3, ww)
    sub, msk = m[y0:y1, x0:x1], dentro[y0:y1, x0:x1]
    for _ in range(4000):
        viz = (np.roll(sub, 1, 0) + np.roll(sub, -1, 0) + np.roll(sub, 1, 1) + np.roll(sub, -1, 1)) / 4
        sub[msk] = viz[msk]
    m[y0:y1, x0:x1] = sub
    memb = np.stack([ndimage.zoom(m[..., c], f, order=1)[:h, :w] for c in range(3)], -1)
    novo = doador + memb
    # rampa suave para fora do buraco
    dist = ndimage.distance_transform_edt(~buraco)
    alfa = np.clip(1 - dist / max(suave, 1), 0, 1)[..., None]
    return alvo * (1 - alfa) + novo * alfa


def vermelho(a):
    return (a[..., 0] - np.maximum(a[..., 1], a[..., 2])) > 25


def limpa_fundos(V):
    pecas = PUB / 'pecas'
    doador = le(V / 'pecas' / DOADOR / '_fundo.jpg')

    # p01 e p08: o tracinho creme solto (270-341 x 944-947), na área preta.
    # Na p13 ele sai também: lá ele abre "INSCREVA-SE", mas 17 px acima do meio
    # da linha. O vídeo desenha um no lugar certo (src/Video.tsx).
    for n in ('p01-abertura', 'p08-tabela', 'p13-cartela'):
        a = le(V / 'pecas' / n / '_fundo.jpg')
        buraco = np.zeros(a.shape[:2], bool)
        buraco[940:952, 264:348] = True
        grava_jpg(preenche(a, buraco, np.roll(a, 160, axis=1), suave=4), pecas / n / '_fundo.jpg')

    # p05-44anos: a barra vermelha (380-1983 x 872-891) sai do fundo; o eixo
    # cinza que ela cobria (y 880-883) é redesenhado com o mesmo brilho do
    # trecho visível à direita (1990-2015) sobre o grão do fundo
    n = 'p05-44anos'
    a = le(V / 'pecas' / n / '_fundo.jpg')
    Image.fromarray(a[870:894, 378:1986].astype(np.uint8)).save(pecas / n / 'barra.png')
    buraco = ndimage.binary_dilation(vermelho(a), iterations=2)
    buraco[:868] = False
    buraco[896:] = False
    buraco &= ~(a.min(axis=2) > 90)  # os marcadores brancos de 1899 e 1943
    b = preenche(a, buraco, doador, suave=3)
    fundo_eixo = np.concatenate([a[864:872, 1990:2016], a[894:902, 1990:2016]]).mean(axis=(0, 1))
    for y in range(876, 888):
        desvio = a[y, 1990:2016].mean(axis=0) - fundo_eixo
        if desvio.mean() > 2:
            b[y, 380:1984] += desvio
    grava_jpg(b, pecas / n / '_fundo.jpg')

    # p06-boletim: o atlas (1012-2078 x 226-1038) e os dois sublinhados
    n = 'p06-boletim'
    a = le(V / 'pecas' / n / '_fundo.jpg')
    # o 1o sublinhado passava por cima da borda esquerda do atlas (x 1006-1057):
    # ali a borda é refeita interpolando as linhas de cima e de baixo
    atlas = a[220:1045, 1006:2085].copy()
    risco = np.zeros(atlas.shape[:2], bool)  # só na faixa do sublinhado: o atlas tem vermelho próprio
    risco[205:226, :64] = ndimage.binary_dilation(vermelho(atlas[205:226, :64]), iterations=2)
    for x in np.nonzero(risco.any(axis=0))[0]:
        ys = np.nonzero(risco[:, x])[0]
        y0, y1 = ys.min() - 1, ys.max() + 1
        for y in range(y0 + 1, y1):
            t = (y - y0) / (y1 - y0)
            atlas[y, x] = atlas[y0, x] * (1 - t) + atlas[y1, x] * t
    grava_jpg(atlas, pecas / n / 'atlas.jpg')
    for k, (y0, y1, x0, x1, larg) in enumerate([(429, 440, 338, 1060, 741), (491, 502, 338, 702, 336)], 1):
        rec = a[y0:y1, x0:x1]
        alfa = np.clip((rec[..., 0] - np.maximum(rec[..., 1], rec[..., 2]) - 10) / 110, 0, 1)
        nucleo = rec[alfa > 0.9].mean(axis=0)
        rgba = np.zeros(rec.shape[:2] + (4,), np.float32)
        rgba[..., :3] = nucleo
        rgba[..., 3] = alfa * 255
        im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
        # o 1o vai até o fim da linha da citação (x 1078); o 2o até "to be" (x 673)
        im = im.resize((larg, im.height), Image.LANCZOS) if k == 1 else im.crop((0, 0, larg, im.height))
        im.save(pecas / n / f'sublinhado-{k}.png')
    # o buraco inclui o brilho que a foto deixa em volta (60 px acima dela,
    # 25 à esquerda, 35 à direita), senão ele fica como um risco claro
    buraco = np.zeros(a.shape[:2], bool)
    buraco[166:1049, 987:2114] = True
    buraco |= ndimage.binary_dilation(vermelho(a), iterations=2) & (np.arange(a.shape[0])[:, None] < 520)
    grava_jpg(preenche(a, buraco, doador, suave=16), pecas / n / '_fundo.jpg')

    # p06b-mapa: um fundo sem o atlas (617-1966 x 206-1235) nem o brilho dele
    n = 'p06b-mapa'
    a = le(V / 'pecas' / n / '_fundo.jpg')
    buraco = np.zeros(a.shape[:2], bool)
    buraco[146:1248, 592:2002] = True
    grava_jpg(preenche(a, buraco, doador, suave=16), pecas / n / '_fundo-sem-atlas.jpg')


def faixa(alfa):
    """Linhas da caixa-alta: as que têm ao menos 30% da tinta da linha mais cheia."""
    cob = alfa.sum(axis=1)
    linhas = np.nonzero(cob >= 0.3 * cob.max())[0]
    return int(linhas.min()), int(linhas.max())


def cortes(alfa, minimo=2):
    """Colunas de tinta separadas por pelo menos uma coluna vazia: uma letra cada."""
    col = (alfa > 30).any(axis=0)
    out, ini = [], None
    for x, c in enumerate(col):
        if c and ini is None:
            ini = x
        elif not c and ini is not None:
            out.append([ini, x])
            ini = None
    if ini is not None:
        out.append([ini, len(col)])
    # junta fiapos (pingos, acentos soltos) ao vizinho
    juntos = []
    for c in out:
        if juntos and (c[1] - c[0] < minimo * 3):
            juntos[-1][1] = c[1]
        else:
            juntos.append(c)
    return juntos


def letterings(V):
    cor = json.loads((V / 'coreografia.json').read_text(encoding='utf-8'))
    saida = []
    for g in cor['sobre_jogo']:
        im = Image.open(V / 'pecas' / '_sobre-jogo' / g['arq']).convert('RGBA')
        alfa = np.asarray(im)[..., 3].astype(np.float32)
        topo, base = faixa(alfa)
        alvo = BASE_IMPACTO if g['classe'] == 'impacto' else BASE_TARJA
        item = {k: g[k] for k in ('id', 'arq', 'cena', 'frame', 'classe', 'texto', 'x', 'w', 'h')}
        item['y'] = alvo - base
        item['y_pacote'] = g['y']
        if g['classe'] == 'impacto':
            item['letras'] = cortes(alfa)
        saida.append(item)
    (DADOS / 'sobre-jogo.json').write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding='utf-8')
    for s in saida:
        if s['y'] != s['y_pacote']:
            print(f"  {s['id']} {s['texto']}: y {s['y_pacote']} -> {s['y']}")


def texto(txt, tam, espaco, cor, saida):
    """Escreve uma linha em IBM Plex Mono (letra a letra, com espaçamento) e
    recorta na tinta. Devolve o PNG e quantos px abaixo do topo dele começa a
    caixa-alta (para alinhar pela altura das maiúsculas, como as notas)."""
    f = ImageFont.truetype(str(FONTE), tam)
    asc, desc = f.getmetrics()
    larg = int(sum(f.getlength(c) for c in txt) + espaco * len(txt)) + 8
    im = Image.new('RGBA', (larg, asc + desc + 8), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    x = 2
    for c in txt:
        dr.text((x, 4), c, font=f, fill=tuple(cor) + (255,))
        x += f.getlength(c) + espaco
    caixa = im.getbbox()
    topo_maiuscula = 4 + f.getbbox('E')[1]
    im.crop(caixa).save(saida)
    return {'w': caixa[2] - caixa[0], 'h': caixa[3] - caixa[1], 'maiuscula': topo_maiuscula - caixa[1]}


def textos():
    """Os textos novos do mapa, no padrão das notas de rodapé das chapas
    (IBM Plex Mono 25 px, espaçamento 2,1, cinza 140,136,128) e o ano da
    linha, em vermelho. Saem prontos em PNG, como as outras peças."""
    pasta = PUB / 'pecas' / 'p06b-mapa'
    out = {
        'nota_esquema': texto('ESQUEMA · LINHA E NÚCLEOS ILUSTRATIVOS · GEOGRAFIA: US-ATLAS 3.0.1, MERIDIANO 99° W',
                              25, 2.1, (140, 136, 128), pasta / 'nota-esquema.png'),
        'ano_1880': texto('1880', 30, 3, (205, 18, 15), pasta / 'ano-1880.png'),
        'ano_1890': texto('1890', 30, 3, (205, 18, 15), pasta / 'ano-1890.png'),
    }
    (DADOS / 'textos.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
    print('  ', out)


def mapa(V):
    ns = '{http://www.w3.org/2000/svg}'
    r = ET.parse(V / 'mapa' / 'eua-fronteira.svg').getroot()
    por_id = {e.get('id'): e for e in r.iter() if e.get('id')}
    num = lambda s: [float(v) for v in re.findall(r'-?\d+\.?\d*', s)]
    out = {
        'nacao': por_id['nacao-contorno'].get('d'),
        'estados': [e.get('d') for e in r.iter(ns + 'path') if (e.get('id') or '').startswith('uf-')],
        'linha_1880': num(por_id['linha-1880'].get('d')),
        'cacos': [num(por_id[f'caco-{k:02d}'].get('d')) for k in range(12)],
        'nucleos': [[float(por_id[f'nucleo-{k:02d}'].get(a)) for a in ('cx', 'cy', 'r')] for k in range(26)],
    }
    (DADOS / 'mapa.json').write_text(json.dumps(out, separators=(',', ':')), encoding='utf-8')
    print(f"  mapa: {len(out['estados'])} estados, {len(out['cacos'])} cacos, {len(out['nucleos'])} núcleos")


def main():
    V, trilha = Path(sys.argv[1]), Path(sys.argv[2])
    if (PUB / 'pecas').exists():
        shutil.rmtree(PUB / 'pecas')
    shutil.copytree(V / 'pecas', PUB / 'pecas')
    if (PUB / 'fontes').exists():
        shutil.rmtree(PUB / 'fontes')
    shutil.copy(trilha, PUB / 'trilha.mp3')
    shutil.copy(V / 'PACOTE.json', DADOS / 'pacote.json')
    print('fundos...')
    limpa_fundos(V)
    print('letterings...')
    letterings(V)
    print('mapa...')
    mapa(V)
    print('textos do mapa...')
    textos()
    print('pronto')


if __name__ == '__main__':
    main()
