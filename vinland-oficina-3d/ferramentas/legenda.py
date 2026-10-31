#!/usr/bin/env python3
"""A legenda queimada sai da .srt de docs/ como está: texto, quebras e
tempos. Aqui só se converte para JSON.

Uso: python3 -I legenda.py <projeto>  ->  src/data/legenda.json
"""
import glob
import json
import os
import re
import sys

PROJ = sys.argv[1]
(srt,) = glob.glob(os.path.join(PROJ, 'docs/*.srt'))
texto = open(srt, encoding='utf-8-sig').read().replace('\r\n', '\n')


def seg(t):
    h, m, s = t.replace(',', '.').split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


cues = []
for bloco in re.split(r'\n\s*\n', texto.strip()):
    ls = bloco.split('\n')
    de, ate = (seg(x.strip()) for x in ls[1].split('-->'))
    cues.append(dict(de=de, ate=ate, linhas=[x.strip() for x in ls[2:] if x.strip()]))
json.dump(cues, open(os.path.join(PROJ, 'src/data/legenda.json'), 'w'), ensure_ascii=False, indent=1)
print(os.path.basename(srt), len(cues), 'cartelas')
