# Vinland — O Anel (refeito do zero)

Short vertical 1080×1920, 30 fps, 1266 frames (42,2 s), para o @MangaEm60.
Feito do zero a partir do pacote `vinland-anel-CODE.zip`, que substitui o
`2-anel/` anterior. O briefing está em `docs/LEIA-PRIMEIRO.md`. A legenda
sai de `docs/2-anel.srt`.

Uma seção de tronco se constrói na tela, anel por anel, numa tomada só.

## Como funciona

- **O disco** (`src/Disco.tsx`) é o compositor do LEIA-PRIMEIRO: um
  fragment shader em WebGL2 que, a cada frame, revela `chapa/disco.jpg`
  por um corte de limiar no mapa de anéis, sobre o papel ladrilhado.
  Câmera, limiar, casca e borda úmida saem da tabela do `timeline.json`
  (`src/tabela.ts`). Nada gera textura por frame.
- **A tipografia** (`src/Tipo.tsx`) são as peças de `tipo/`, só
  posicionadas.
- **A legenda** (`src/Legenda.tsx`) vem da .srt como está, em EB Garamond
  500, corpo 40, na faixa y=1380..1500.
- **O som** (`ferramentas/mixagem.py`) é narração + tiques + trilha somados
  direto, sem ducking, e normalizados em −16 LUFS / −1,5 dBTP.

## O que fica fora do git

`public/` e `out/`. Para regenerar:

1. Descompactar o `vinland-anel-CODE.zip` e copiar `anel/chapa/`,
   `anel/tipo/` e `anel/audio/` para `public/`. A EB Garamond 500 não vem
   nesse zip: `public/fontes/ebg-500.ttf` é a do pacote anterior do
   Vinland.
2. `python3 -m pip install numpy pillow`
3. `python3 -I ferramentas/mapa.py .` — o mapa de 16 bits em float32 (o
   navegador só decodifica PNG em 8 bits).
4. `python3 -I ferramentas/tipo.py .` e `python3 -I ferramentas/legenda.py .`
5. `python3 -I ferramentas/mixagem.py .`
6. `npm install` e `bash ferramentas/render.sh`.

## Onde a montagem mexe no que veio

- **Frame 965 da tabela.** A frente volta de 46,90 para 46,00 por um frame
  (o 28º anel some) e a escala salta 2,3%; no 966 tudo volta. Em toda a
  contagem a frente é 19 + (f − 676)/10,3214; só esse frame foge, no ponto
  em que a conta dá 28,0 redondo. Ele fica com o valor da fórmula, que é o
  mesmo do 966 (`src/tabela.ts`).
- **Transporte do shader.** O shader é o do LEIA-PRIMEIRO. Mudam três
  coisas:
  - o y da tela é invertido, porque o `gl_FragCoord` do WebGL sobe;
  - o mapa entra em float32 com filtro bilinear;
  - o papel usa REPEAT no lugar de `fract(uv)`. É a mesma conta, sem a
    emenda que o fract cria no mipmap.
- **Antisserrilhado.** As chapas têm mipmap e o canvas é desenhado em 2× e
  reduzido. Sem isso, a frente do limiar e as linhas finas do disco
  serrilham e fazem moiré quando a câmera recua até 0,27.
- **O que o LEIA não diz:**
  - As árvores entram e saem com a tinta subindo e descendo, linear, em
    `entra_frames` e `sai_frames`.
  - A cor da legenda é a da série: #2A2622 a 80%.
  - As marcas da régua aparecem conforme os anéis são contados (k = 1 a
    28).
  - `tipo/n-993.png` não é usado, porque o LEIA não o posiciona.

## Render

```
1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart
```
