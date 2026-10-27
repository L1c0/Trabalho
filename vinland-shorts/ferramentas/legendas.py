#!/usr/bin/env python3
"""As legendas: o texto das .srt entregues, no tempo da fala medida.

Cada legenda entra 1 frame antes da primeira palavra dela e sai quando a
próxima entra (ou 24 frames depois da última palavra, se a pausa for longa).
A quebra de linha é refeita para a legenda queimada: duas linhas
equilibradas, de preferência na pontuação, nunca deixando artigo ou
preposição pendurado no fim da primeira.

Saídas:
  src/data/legendas.json        a legenda queimada
  out/legendas/<short>.srt      as .srt com o tempo corrigido, para subir
Uso: python3 -I legendas.py <projeto>
"""
import json
import os
import sys

from PIL import ImageFont

PROJ = sys.argv[1]
FPS = 30
FONTE = ImageFont.truetype(os.path.join(PROJ, 'fontes/ebg-500.ttf'), 40)
CURTA = 720                    # px: até aqui cabe numa linha só
LARGA = 900                    # px: nenhuma linha passa disso (zona útil: 936)
PENDURADAS = {'o', 'a', 'os', 'as', 'de', 'do', 'da', 'dos', 'das', 'e', 'em', 'um', 'uma', 'que', 'por', 'no',
              'na', 'nos', 'nas', 'ao', 'com', 'se', 'para', 'só', 'mais', 'sobre', 'não', 'todas', 'todos', 'duas',
              'você', 'quando', 'entre', 'pela', 'pelo', 'já'}
NOMES = {'1-contagem': 'dia2-contagem', '2-anel': 'dia1-anel', '3-sagas': 'dia3-sagas', '4-oficina': 'dia4-oficina'}


def larg(t):
    return FONTE.getlength(t)


def quebrar(texto):
    if larg(texto) <= CURTA:
        return [texto]
    ps = texto.split(' ')
    melhor = None
    for k in range(1, len(ps)):
        l1, l2 = ' '.join(ps[:k]), ' '.join(ps[k:])
        if max(larg(l1), larg(l2)) > LARGA:
            continue
        # em "caracteres": 17 px por caractere, mais ou menos
        nota = abs(larg(l1) - larg(l2)) / 17
        if l1[-1] in '.,:;?!':
            nota -= 20
        if ps[k - 1].lower().strip('"“') in PENDURADAS:
            nota += 18
        if melhor is None or nota < melhor[0]:
            melhor = (nota, [l1, l2])
    return melhor[1] if melhor else [texto]


def tempo(f):
    ms = int(round(f / FPS * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def main():
    pal = json.load(open(os.path.join(PROJ, 'src/data/palavras.json'), encoding='utf-8'))
    saida = {}
    os.makedirs(os.path.join(PROJ, 'out/legendas'), exist_ok=True)
    for sid, v in pal.items():
        cues = []
        for k, c in enumerate(v['cues']):
            ps = [p for p in v['palavras'] if p['cue'] == k]
            cues.append(dict(de=ps[0]['de'] - 1, ult=ps[-1]['ate'], linhas=quebrar(' '.join(c['linhas']))))
        for k, c in enumerate(cues):
            prox = cues[k + 1]['de'] if k + 1 < len(cues) else v['frames']
            c['ate'] = min(prox, c['ult'] + 24) if prox - c['ult'] > 24 else prox
            c['de'] = round(max(0, c['de']), 1)
            c['ate'] = round(c['ate'], 1)
            del c['ult']
        saida[sid] = cues
        with open(os.path.join(PROJ, 'out/legendas', NOMES[sid] + '.srt'), 'w', encoding='utf-8') as f:
            for k, c in enumerate(cues):
                f.write(f"{k + 1}\n{tempo(c['de'])} --> {tempo(c['ate'] - 1)}\n" + '\n'.join(c['linhas']) + '\n\n')
        print(sid, round(max(larg(l) for c in cues for l in c['linhas'])), 'px na linha mais longa')
        for c in cues:
            print(f"   {c['de']:6.1f}-{c['ate']:6.1f}  " + ' / '.join(c['linhas']))
    json.dump(saida, open(os.path.join(PROJ, 'src/data/legendas.json'), 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
