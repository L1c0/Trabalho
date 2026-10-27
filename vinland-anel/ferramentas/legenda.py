#!/usr/bin/env python3
"""A legenda queimada sai de docs/2-anel.srt como está: texto, quebras e
tempos (o LEIA-PRIMEIRO: as quebras já estão medidas nas pausas reais da
gravação). Aqui só se converte para JSON.

Uso: python3 -I legenda.py <projeto>  ->  src/data/legenda.json
"""
import json
import os
import re
import sys

PROJ = sys.argv[1]
texto = open(os.path.join(PROJ, 'docs/2-anel.srt'), encoding='utf-8-sig').read().replace('\r\n', '\n')


def seg(t):
    h, m, s = t.replace(',', '.').split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


cues = []
for bloco in re.split(r'\n\s*\n', texto.strip()):
    ls = bloco.split('\n')
    de, ate = (seg(x.strip()) for x in ls[1].split('-->'))
    linhas = [x.strip() for x in ls[2:] if x.strip()]
    cues.append(dict(de=de, ate=ate, linhas=linhas))
    assert all(len(x) <= 36 for x in linhas), linhas
json.dump(cues, open(os.path.join(PROJ, 'src/data/legenda.json'), 'w'), ensure_ascii=False, indent=1)
print(len(cues), 'cartelas; maior linha', max(len(x) for c in cues for x in c['linhas']), 'caracteres')
