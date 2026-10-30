# Vinland — A Contagem (pacote novo)

Short vertical 1080×1920, 30 fps, 783 frames (26,09 s), para o @MangaEm60.
Feito a partir do pacote `vinland-contagem-CODE.zip`, que substitui o
`1-contagem/` anterior. O briefing está em `docs/LEIA-PRIMEIRO.md`, e a
legenda vem de `docs/1-contagem.srt`.

A página se enche de cem socos, e a câmera recua sem parar. No fim, as
quatro palavras entram por cima das cem marcas.

## O que é do pacote e o que é da montagem

- `src/ContagemScene.tsx` e `src/timeline.json` vieram no pacote e estão
  **sem nenhuma alteração** ("não reescreve a câmera").
- `src/Contagem.tsx` junta a cena, a legenda queimada e o áudio. A cena
  não traz os dois, e o LEIA pede os dois.
- `src/Root.tsx` registra essa composição. O Root original está em
  `docs/Root-do-pacote.tsx`.
- `src/Legenda.tsx` usa EB Garamond 500, corpo 40, na faixa y=1600..1720,
  com o texto e os tempos da .srt como estão. A cor é a da série,
  #2A2622 a 80%, porque o LEIA não diz.
- A EB Garamond 500 não vem no zip. `public/fontes/ebg-500.ttf` é a do
  pacote anterior do Vinland.
- O áudio é o `1-contagem.mp3` como veio (−16,3 LUFS), sem trilha.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA:

1. `--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle` (2160×3840);
2. redução por Lanczos para 1080×1920, x264 CRF 17 preset slow, yuv420p,
   áudio copiado, faststart.

A única adição é `--color-space=bt709` no passo 1, com as etiquetas bt709
no passo 2, para os dois passos usarem a mesma matriz de cor.

`node ferramentas/quadros.mjs 0 518 …` gera quadros soltos em 2× para
conferência.

## Observações sobre o pacote

- A coluna `k` da tabela volta de 96 para 95,1 no frame 479. A cena não
  lê `k`: os socos entram por `socos.frames`. Nada aparece na tela.
- A chapa 3D tem o próprio papel, e o fundo chapado tem outro. Os dois
  são o mesmo `papel.jpg`, mas em escalas diferentes. Onde a borda da
  chapa entra no quadro (no começo, perto do soco 1, e no fecho, quando a
  página encolhe a 0,64), dá para ver a borda dela no papel. Isso vem da
  cena como entregue.
