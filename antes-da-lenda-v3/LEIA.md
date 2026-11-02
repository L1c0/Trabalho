# Antes da Lenda — abertura, versão 3 (Red Dead Redemption 2)

1920×1080, 30 fps, 690 frames (23,0 s). O briefing está em
`docs/LEIA-PRIMEIRO.md`. `src/IntroScene.tsx`, `src/Root.tsx` e
`src/pos.json` vieram prontos e estão sem alteração. Cor, áudio e tempos
são os do pacote.

## As quatro palavras que não vieram

O `pos.json` pede onze palavras, mas o pacote trouxe só sete PNGs (w01 a
w07). Faltavam quatro:

- w08, "TUDO QUE VOCÊ SABE";
- w09, "foi escrito";
- w10, "DEPOIS";
- w11, "ESTOU COM MEDO", a legenda da fala.

As quatro foram feitas aqui por `ferramentas/palavras.py`, no padrão
medido nas sete que vieram:

- o PNG tem o tamanho exato do `pos.json`, com recorte rente à tinta e
  cor chapada;
- a caixa alta é Montserrat 600 com espaço largo entre as letras, e a
  ligação é Pinyon Script;
- as letras vão uma a uma, sem kerning, desenhadas em 4× e reduzidas com
  filtro bilinear.

Essa receita foi conferida refazendo as sete originais
(`python3 -I ferramentas/palavras.py conferir`):

- a maciez da borda fica entre 91% e 96% da delas;
- o corpo que dá o tamanho delas fica a até 1,5 px do `pos.json`.

As quatro novas fecham a medida do `pos.json` com o corpo a no máximo
0,3 px do pedido (60,9, 111,1, 132,0 e 74,3). O espaço entre letras fica
entre 0,44 e 0,54 em; nas originais, vai de 0,45 a 0,49 em.

As tintas são as três que as originais usam:

| peça | plano | tinta |
|---|---|---|
| w08 | planície | creme `F8F0E2`, a da w02, também na planície |
| w09 | cidade | fria `D8E9EE`, a da w03 e da w04 |
| w10 | mercado | ouro `FAE8C4`, a da w05 e da w06 |
| w11 | close do Arthur | creme `F8F0E2` |

A cor da w11 é escolha da montagem. O LEIA diz que o close é "quente e
fechado", e nenhuma peça entregue está nesse plano. Ficou o creme da
abertura (w01). Se as peças originais aparecerem, basta pô-las em
`public/` por cima destas, porque o tamanho é o mesmo.

As fontes estão em `ferramentas/fontes/`. São do Fontsource 5.1.0, sob
licença OFL, e as licenças vão junto. Os PNGs ficam fora do git, como o
resto da mídia, e o script os refaz.

## Trilha

O `audio-intro.mp3` vai como veio (−14,9 LUFS). O LEIA avisa que a música
é provisória: é faixa comercial e serve só para teste. Antes de publicar,
ela tem que ser trocada, e o corte em 19,5 s tem que continuar no lugar.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA e gera
`out/antes-da-lenda-v3.mp4`:

1. `--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle`;
2. redução por Lanczos para 1920×1080, em x264 CRF 16 preset slow,
   yuv420p, com o áudio copiado e faststart.

A única adição é a matriz bt709 nos dois passos.

`node ferramentas/quadros.mjs 412 458 488 619` gera quadros soltos em 2×
para conferência.
