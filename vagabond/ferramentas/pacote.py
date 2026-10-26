#!/usr/bin/env python3
"""O pacote do master: só o que o filme usa, em zips de até 29 MiB.

Junta o projeto Remotion (src, configuração, package-lock) e, de public/,
apenas os arquivos que src/data/montagem.json referencia (papel, fibra,
peças, versões em cor, campos de chegada, máscaras) mais a mixagem. Nada
de originais nem de ferramentas: no computador de quem renderiza, o
Remotion só compõe.

Os arquivos são distribuídos entre as partes do maior para o menor, sempre
na parte mais vazia que ainda caiba; cada zip descompacta sozinho na mesma
pasta vagabond/ (a ordem não importa).

Uso: python3 -I pacote.py <projeto> <pasta de saída> <LEIA-PRIMEIRO.txt> [CHAVE=valor ...]
     (as chaves preenchem __CHAVE__ no LEIA-PRIMEIRO: LUFS, TP, GRAO)
"""
import json
import os
import sys
import zipfile

PROJ, SAIDA, LEIA = sys.argv[1], sys.argv[2], sys.argv[3]
VALORES = dict(a.split('=', 1) for a in sys.argv[4:])
LIMITE = 29 * 1024 * 1024
RAIZ_ZIP = 'vagabond'


def arquivos():
    fixos = ['package.json', 'package-lock.json', 'remotion.config.ts', 'tsconfig.json']
    for base, _, nomes in os.walk(os.path.join(PROJ, 'src')):
        for n in nomes:
            fixos.append(os.path.relpath(os.path.join(base, n), PROJ))
    m = json.load(open(os.path.join(PROJ, 'src/data/montagem.json'), encoding='utf-8'))
    pub = {m['papel']['src'], m['fibra']['src'], 'audio/vag-mix.mp3'}
    for f in m['folhas'].values():
        for c in f['camadas']:
            for k in ('src', 'cor', 'campo', 'alfa'):
                if c.get(k):
                    pub.add(c[k])
    lista = [(a, os.path.join(PROJ, a)) for a in fixos] + [('public/' + a, os.path.join(PROJ, 'public', a))
                                                          for a in sorted(pub)]
    falta = [a for a, c in lista if not os.path.exists(c)]
    if falta:
        raise SystemExit('faltam arquivos: ' + ', '.join(falta))
    return lista


def main():
    lista = arquivos()
    grandes = [(a, os.path.getsize(c)) for a, c in lista if os.path.getsize(c) > LIMITE - 64 * 1024]
    if grandes:
        raise SystemExit(f'arquivo maior que uma parte: {grandes}')
    lista.sort(key=lambda ac: -os.path.getsize(ac[1]))
    partes = []                                   # [bytes, [(arcname, caminho)]]
    for a, c in lista:
        t = os.path.getsize(c) + 200
        livre = [p for p in partes if p[0] + t <= LIMITE - 64 * 1024]
        if livre:
            p = min(livre, key=lambda p: p[0])
        else:
            p = [0, []]
            partes.append(p)
        p[0] += t
        p[1].append((a, c))
    n = len(partes)
    os.makedirs(SAIDA, exist_ok=True)
    for velho in os.listdir(SAIDA):
        if velho.startswith('vagabond-parte-') and velho.endswith('.zip'):
            os.remove(os.path.join(SAIDA, velho))
    pecas = sum(1 for a, _ in lista if a.startswith('public/pecas/'))
    texto = open(LEIA, encoding='utf-8').read().replace('__N__', str(n)).replace('__PECAS__', str(pecas))
    for k, v in VALORES.items():
        texto = texto.replace(f'__{k}__', v)
    if '__' in texto:
        raise SystemExit('LEIA-PRIMEIRO com lacuna: ' + texto[texto.index('__') - 20:texto.index('__') + 20])
    for i, (_, itens) in enumerate(partes, 1):
        nome = os.path.join(SAIDA, f'vagabond-parte-{i:02d}-de-{n:02d}.zip')
        with zipfile.ZipFile(nome, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            if i == 1:
                # quebra de linha do Windows: o Bloco de Notas abre direito
                z.writestr(f'{RAIZ_ZIP}/LEIA-PRIMEIRO.txt', texto.replace('\r\n', '\n').replace('\n', '\r\n'))
            for a, c in sorted(itens):
                # jpg/png/mp3 já vêm comprimidos: guardar sem recomprimir
                tipo = zipfile.ZIP_STORED if a.endswith(('.jpg', '.png', '.mp3')) else zipfile.ZIP_DEFLATED
                z.write(c, f'{RAIZ_ZIP}/{a}', compress_type=tipo)
        print(f'{os.path.basename(nome)}  {os.path.getsize(nome) / 2 ** 20:5.1f} MiB  {len(itens)} arquivos')
    print(f'{n} partes, {len(lista)} arquivos')


if __name__ == '__main__':
    main()
