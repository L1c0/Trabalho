# Antes da Lenda — vinheta de abertura

1920×1080, 30 fps, 315 frames (10,5 s). O briefing está em
`docs/LEIA-PRIMEIRO.md`. `src/IntroScene.tsx`, `src/Root.tsx` e
`src/pos.json` vieram prontos.

Três planos em ordem (planície, cidadezinha, mercado), e a frase TUDO QUE
VOCÊ SABE · FOI ESCRITO · DEPOIS entrando nas batidas da faixa. No frame
214 a imagem congela e vira nanquim, e em 273 (9,1 s) a cartela imprime.

## O que a montagem mudou no `IntroScene.tsx` (marcado com `[montagem]`)

- **Pontos de entrada.** Os três clipes chegaram já cortados nos pontos
  de entrada, com 3,6 s, 3,6 s e 4,1 s. O `tratado.jpg` bate com o
  primeiro quadro do mercado (correlação 0,82; nenhum outro passa de
  0,31), e esse é o quadro de 3,5 s do original. Por isso `comecaEm` é 0
  nos três; com 660, 480 e 105, eles abririam depois do fim.
- **Empurrão.** Dentro de uma `<Sequence>`, o `useCurrentFrame()` já conta
  do começo dela, então `de` é 0 nos três planos. Com `de={CORTE_2}` e
  `de={CORTE_3}`, a cidadezinha e o mercado ficavam parados em 1,085, sem
  os 3,5% em 90 frames que o LEIA descreve.

O resto está como veio: grade, tempos, zoom de 1,085, palavras, congela,
nanquim e cartela.

## Observações

- O `tratado.jpg` foi feito do primeiro quadro do mercado, sem zoom. A
  imagem congela no último quadro do plano, com zoom de 1,114. Então a
  virada para nanquim (214 a 221) é uma fusão entre dois momentos
  diferentes, não a mesma imagem virando tinta. Para casar as duas, o
  quadro congelado exato sai em `out/quadro-congelado-213.png`: é só
  passar no tratamento e trocar o `tratado.jpg`.
- A `trilha.mp3` é provisória (LEIA): é faixa comercial e serve só para
  teste. A vinheta sai em −22,7 LUFS com ela. A faixa licenciada precisa
  de nível e da fase da batida recalculada.
- A fonte Playfair Display 600 que veio junto não é usada: as palavras são
  PNG já impressos.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA. O passo 1 é
`--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle`. O passo 2 reduz por
Lanczos para 1920×1080, em x264 CRF 16 preset slow, yuv420p, com o áudio
copiado e faststart. A única adição é a matriz bt709 nos dois passos.
