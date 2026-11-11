#!/usr/bin/env python3
"""
Embute as fontes no projeto: lê os .woff2 de ferramentas/fontes/ e grava
src/kit/fontes-dados.ts com cada arquivo em base64.

As fontes vão dentro do código para o render não depender de carregar
arquivo de fonte pela rede: na v3, um carregamento desses travou uma aba do
render. São as famílias das chapas originais (Fontsource, licença OFL; as
licenças estão na mesma pasta).

  python3 -I ferramentas/fontes.py
"""
import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FONTES = [
    # arquivo, família no CSS, peso, estilo
    ('anton-latin-400-normal.woff2', 'RD Anton', 400, 'normal'),
    ('oswald-latin-400-normal.woff2', 'RD Oswald', 400, 'normal'),
    ('oswald-latin-500-normal.woff2', 'RD Oswald', 500, 'normal'),
    ('oswald-latin-600-normal.woff2', 'RD Oswald', 600, 'normal'),
    ('oswald-latin-700-normal.woff2', 'RD Oswald', 700, 'normal'),
    ('ibm-plex-mono-latin-400-normal.woff2', 'RD Mono', 400, 'normal'),
    ('ibm-plex-mono-latin-500-normal.woff2', 'RD Mono', 500, 'normal'),
    ('source-serif-4-latin-400-italic.woff2', 'RD Serif', 400, 'italic'),
    ('source-serif-4-latin-600-italic.woff2', 'RD Serif', 600, 'italic'),
]
linhas = ['// Gerado por ferramentas/fontes.py. Não editar à mão.', 'export const FONTES_DADOS = [']
for arq, familia, peso, estilo in FONTES:
    b64 = base64.b64encode((RAIZ / 'ferramentas' / 'fontes' / arq).read_bytes()).decode()
    linhas.append(f"  {{ familia: '{familia}', peso: {peso}, estilo: '{estilo}', b64: '{b64}' }},")
linhas.append('] as const;')
(RAIZ / 'src' / 'kit' / 'fontes-dados.ts').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
print('src/kit/fontes-dados.ts:', sum(len(l) for l in linhas) // 1024, 'KB,', len(FONTES), 'fontes')
