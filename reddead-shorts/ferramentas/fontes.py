#!/usr/bin/env python3
"""
Embute as fontes no projeto: lê os .woff2 de ferramentas/fontes/ e grava
src/kit/fontes-dados.ts com cada arquivo em base64. O render não carrega
fonte pela rede. Todas são livres (Fontsource; as licenças estão na pasta).

  python3 -I ferramentas/fontes.py
"""
import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FONTES = [
    # arquivo, família no CSS, peso, estilo
    ('anton-latin-400-normal.woff2', 'RS Anton', 400, 'normal'),
    ('oswald-latin-500-normal.woff2', 'RS Oswald', 500, 'normal'),
    ('oswald-latin-700-normal.woff2', 'RS Oswald', 700, 'normal'),
    ('cinzel-latin-400-normal.woff2', 'RS Cinzel', 400, 'normal'),
    ('cinzel-latin-700-normal.woff2', 'RS Cinzel', 700, 'normal'),
    ('old-standard-tt-latin-400-normal.woff2', 'RS Doc', 400, 'normal'),
    ('old-standard-tt-latin-400-italic.woff2', 'RS Doc', 400, 'italic'),
    ('old-standard-tt-latin-700-normal.woff2', 'RS Doc', 700, 'normal'),
    ('special-elite-latin-400-normal.woff2', 'RS Maquina', 400, 'normal'),
    ('pinyon-script-latin-400-normal.woff2', 'RS Assina', 400, 'normal'),
    ('alfa-slab-one-latin-400-normal.woff2', 'RS Slab', 400, 'normal'),
]
linhas = ['// Gerado por ferramentas/fontes.py. Não editar à mão.', 'export const FONTES_DADOS = [']
for arq, familia, peso, estilo in FONTES:
    b64 = base64.b64encode((RAIZ / 'ferramentas' / 'fontes' / arq).read_bytes()).decode()
    linhas.append(f"  {{ familia: '{familia}', peso: {peso}, estilo: '{estilo}', b64: '{b64}' }},")
linhas.append('] as const;')
(RAIZ / 'src' / 'kit' / 'fontes-dados.ts').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
print('src/kit/fontes-dados.ts:', sum(len(l) for l in linhas) // 1024, 'KB,', len(FONTES), 'fontes')
