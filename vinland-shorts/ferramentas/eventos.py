#!/usr/bin/env python3
"""A partitura de cada Short, em frames, amarrada às palavras da narração.

O LEIA-PRIMEIRO dá as marcas, mas elas saíram das legendas entregues, que
estão até 1,5 s fora da fala (medido em palavras.py). A narração manda:
cada evento cai na palavra a que ele se refere. O Remotion (imagem) e a
mixagem (efeitos) leem o mesmo arquivo, então som e imagem não descolam.

Uso: python3 -I eventos.py <projeto>  ->  src/data/eventos.json
"""
import json
import os
import sys
import unicodedata

PROJ = sys.argv[1]
PAL = json.load(open(os.path.join(PROJ, 'src/data/palavras.json'), encoding='utf-8'))


def norm(p):
    p = unicodedata.normalize('NFD', p.lower())
    return ''.join(c for c in p if c.isalnum() and not unicodedata.combining(c))


def w(short, palavra, depois=0):
    """Frame (inteiro) em que a palavra começa a ser dita."""
    alvo = norm(palavra)
    for p in PAL[short]['palavras']:
        if p['de'] >= depois and norm(p['t']) == alvo:
            return int(round(p['de']))
    raise KeyError(f'{short}: {palavra!r} depois de {depois}')


def contagem():
    # 1 a 95: batida de 3 frames, uma a cada 3 frames (~10 por segundo); o
    # primeiro bate no "Yukimura desenha" e o 95º termina em 494. Os cinco
    # últimos são lentos e pesados: 5 frames, um a cada 6, e o 100 bate em
    # "no FIM".
    fim = w('1-contagem', 'fim')
    pesados = [fim - 6 * (4 - j) for j in range(5)]
    leves = [pesados[0] - 7 - 3 * (94 - j) for j in range(95)]
    imp = []
    for n in range(1, 101):
        pesado = n > 95
        i = pesados[n - 96] if pesado else leves[n - 1]
        b = 5 if pesado else 3
        # a chapa vai recebendo menos pressão: o deslocamento cai de 4 a 2 px
        d = 5.0 if pesado else 4.0 - 2.0 * (n - 1) / 94
        imp.append(dict(n=n, a=i - (b - 1), i=i, b=b, d=round(d, 2), lado=1 if n % 2 else -1))
    frase = w('1-contagem', 'eu', 600)
    for k, x in enumerate(imp):
        # assenta quando o próximo aparece (o 100 assenta quando a frase chega)
        prox = imp[k + 1]['a'] if k + 1 < len(imp) else frase - 2
        x['sai'] = max(prox, x['i'] + 1)
    return dict(frames=781, impactos=imp, frase=dict(a=frase - 2, i=frase, d=4.0),
                recuo=dict(ini=frase - 2, dur=8), camera=dict(ini=imp[0]['i'], fim=imp[-1]['i']))


def anel():
    """A câmera vai de y=0 a y=60 no trecho quase parado: a primeira borda
    chega na linha exatamente quando a travessia começa ("Então os
    pesquisadores..."). Daí anda em velocidade constante até a 28ª borda
    estar na linha, e para seco (915, no "vinte e OITO")."""
    ch = json.load(open(os.path.join(PROJ, 'src/data/chapas.json')))['anel']
    b, linha = ch['bordas'], ch['linha']
    ini, fim = w('2-anel', 'Então'), 915
    y_ini, y_fim = b[0] - linha, b[-1] - linha
    v = (y_fim - y_ini) / (fim - ini)
    tiques = [round(ini + (y - b[0]) / v, 3) for y in b]
    return dict(frames=1261, ini=ini, fim=fim, y_ini=y_ini, y_fim=y_fim, v=round(v, 5), linha=linha,
                tiques=tiques, deriva=0.015 * 1080, empurrao=dict(ini=fim, fim=fim + 330, ganho=0.03))


def sagas():
    s = '3-sagas'
    q = w(s, 'quarenta')
    o = w(s, 'outras', 450)
    return dict(frames=1257,
                esq60=w(s, 'sessenta'),
                dir140=dict(a=q - 21, l=q, dx=-468, dy=19),
                esqcred=w(s, 'Thorfinn', 380),
                dircred=dict(a=o - 21, l=o, dx=-468, dy=17),
                anos=w(s, 'duzentos'),
                haukr=w(s, 'Haukr'))


def oficina():
    s = '4-oficina'
    e = w(s, 'E', 770)
    saidas = [e + 15 * k for k in range(8)]
    return dict(frames=1213, saidas=saidas, rotulo=saidas[0], achados=saidas[-1], dur=14,
                fecho=w(s, 'A', 910), angulo=dict(ini=0, fim=e))


def main():
    ev = {'1-contagem': contagem(), '2-anel': anel(), '3-sagas': sagas(), '4-oficina': oficina()}
    json.dump(ev, open(os.path.join(PROJ, 'src/data/eventos.json'), 'w'), ensure_ascii=False, indent=1)
    c = ev['1-contagem']
    print('contagem: 1 bate em', c['impactos'][0]['i'], '| 95 em', c['impactos'][94]['i'], '| 100 em',
          c['impactos'][99]['i'], '| frase em', c['frase']['i'])
    print('anel:', ev['2-anel'])
    print('sagas:', {k: v for k, v in ev['3-sagas'].items() if k != 'frames'})
    print('oficina:', {k: v for k, v in ev['4-oficina'].items() if k != 'frames'})


if __name__ == '__main__':
    main()
