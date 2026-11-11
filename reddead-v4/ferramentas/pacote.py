#!/usr/bin/env python3
"""
O pacote de render: o projeto inteiro em zips de até 29 MiB, para renderizar
o master noutro computador.

Vai tudo o que o render usa: o projeto Remotion (com as fontes embutidas no
código), as artes, o grão, os 13 clipes do jogo, a trilha e o som da vinheta.
Não vai node_modules (o `npm install` instala) nem out/. Os arquivos são
distribuídos do maior para o menor, sempre na parte mais vazia que ainda
caiba. Cada zip descompacta sozinho na mesma pasta reddead-v4/, e a ordem
não importa. O LEIA-PRIMEIRO.txt vai em todas as partes.

  python3 -I ferramentas/pacote.py <LEIA-PRIMEIRO.txt>  ->  out/pacote/reddead-v4-parte-NN-de-NN.zip
"""
import os
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LIMITE = 29 * 1024 * 1024
FOLGA = 64 * 1024  # cabeçalhos do zip e o LEIA-PRIMEIRO
PASTA = 'reddead-v4'
PREFIXO = 'reddead-v4-parte'  # nome diferente dos pacotes anteriores, para não misturar na mesma pasta


def arquivos():
    fixos = ['package.json', 'package-lock.json', 'remotion.config.ts', 'tsconfig.json', 'LEIA.md',
             'ferramentas/render.mjs', 'ferramentas/quadros.mjs', 'docs/narracao.txt', 'docs/palavras.txt']
    lista = [RAIZ / f for f in fixos]
    lista += sorted((RAIZ / 'src').rglob('*.*'))
    pub = RAIZ / 'public'
    lista += sorted((pub / 'arte').glob('*.*')) + sorted((pub / 'clipes').glob('*.mp4'))
    lista += [pub / 'trilha.mp3', pub / 'vinheta.mp3', pub / 'grao.png']
    faltam = [f for f in lista if not f.is_file()]
    if faltam:
        raise SystemExit('faltam arquivos: ' + ', '.join(str(f.relative_to(RAIZ)) for f in faltam))
    return [(f.relative_to(RAIZ).as_posix(), f) for f in lista]


def main():
    leia = Path(sys.argv[1]).read_text(encoding='utf-8')
    itens = sorted(arquivos(), key=lambda a: -a[1].stat().st_size)
    partes = []
    for rel, f in itens:
        t = f.stat().st_size
        if t > LIMITE - FOLGA:
            raise SystemExit(f'{rel} sozinho passa de 29 MiB')
        cabem = [p for p in partes if p['tam'] + t <= LIMITE - FOLGA]
        if cabem:
            p = min(cabem, key=lambda p: p['tam'])
        else:
            p = {'tam': 0, 'itens': []}
            partes.append(p)
        p['itens'].append((rel, f))
        p['tam'] += t
    saida = RAIZ / 'out' / 'pacote'
    saida.mkdir(parents=True, exist_ok=True)
    for velho in saida.glob('reddead-*parte-*.zip'):
        velho.unlink()
    n = len(partes)
    total = 0
    for k, p in enumerate(partes, 1):
        nome = saida / f'{PREFIXO}-{k:02d}-de-{n:02d}.zip'
        with zipfile.ZipFile(nome, 'w') as z:
            z.writestr(f'{PASTA}/LEIA-PRIMEIRO.txt', leia, compress_type=zipfile.ZIP_DEFLATED)
            for rel, f in sorted(p['itens']):
                midia = f.suffix.lower() in ('.mp4', '.mp3', '.jpg', '.png', '.woff2')
                z.write(f, f'{PASTA}/{rel}', compress_type=zipfile.ZIP_STORED if midia else zipfile.ZIP_DEFLATED)
        total += len(p['itens'])
        print(f'{nome.name}: {len(p["itens"])} arquivos, {os.path.getsize(nome) / 1048576:.1f} MiB')
    print(f'{total} arquivos no pacote (sem contar o LEIA-PRIMEIRO de cada parte)')


if __name__ == '__main__':
    main()
