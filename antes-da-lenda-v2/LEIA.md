# Antes da Lenda — abertura, versão 2 (3D)

1920×1080, 30 fps, 630 frames (21 s). O briefing está em
`docs/LEIA-PRIMEIRO.md`. `src/IntroScene.tsx`, `src/Root.tsx` e
`src/pos.json` vieram prontos e estão sem alteração.

Os vídeos vieram do `INTRO-COMPLETO.zip`, com 188 frames cada. O resto do
zip é idêntico ao que já estava aqui. O `tratado.jpg` bate com o quadro
183 do mercado, sem zoom (correlação 0,76). A virada começa no quadro 186.

## O que a montagem mudou no `IntroScene.tsx` (marcado com `[montagem]`)

Tempos, câmera, grade e posições ficaram como vieram. Três correções:

- **A virada não fica preta.** O plano do mercado termina no 512, porque
  o clipe tem 188 frames, e o giro vai de 511 a 529. Do 513 ao 520 a face
  da frente girava vazia. Uma `<Freeze>` segura o último quadro do
  mercado até a carta virar.
- **A carta recua no ato 2.** Estava `rotateY(giro) translateZ(-recuo)`.
  Depois do giro de 180°, o eixo Z da carta aponta para a câmera, então a
  carta crescia em vez de recuar e, passado o valor da perspectiva, sumia
  atrás da câmera. Agora é `translateZ(-recuo) rotateY(giro)`.
- **A pilha fica atrás da carta.** Sem `preserve-3d` no pai, as camadas se
  empilham pela ordem do DOM. A pilha vinha depois da carta e cobria o
  tratado com retângulos de papel. Agora ela vem antes.

## Observação

Com os números do pacote, as folhas da pilha ficam escondidas atrás da
carta: pela profundidade, elas são menores que ela, e a rotação de 0,9° a
2,1° não basta para aparecerem. O ato 2 lê como a folha impressa
recuando para o escuro.

A `trilha.mp3` é provisória (LEIA): é faixa comercial, serve só para
teste.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA. O passo 1 é
`--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle`. O passo 2 reduz por
Lanczos para 1920×1080, em x264 CRF 16 preset slow, yuv420p, com o áudio
copiado e faststart. A única adição é a matriz bt709 nos dois passos.
