# Antes da Lenda — abertura, versão 2 (3D)

1920×1080, 30 fps, 630 frames (21 s). O briefing está em
`docs/LEIA-PRIMEIRO.md`. `src/IntroScene.tsx`, `src/Root.tsx` e
`src/pos.json` vieram prontos e estão sem alteração.

**Pendente: o render.** Faltam dois itens do pacote:

1. **Os três vídeos do zip "PLANOS"**, cortes de 6,2 s cada. A v2 usa
   184, 141 e 188 frames dos planos; os da v1 têm 107, 107 e 122.
2. **O `tratado.jpg` da v2**, a face de trás da carta na virada. O da v1
   não casa com o mercado novo.

Já estão em `public/` as 12 palavras (t01 a t12, nos tamanhos do
`pos.json`), o `papel.jpg` e a `trilha.mp3`, os dois iguais aos da v1.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA. O passo 1 é
`--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle`. O passo 2 reduz por
Lanczos para 1920×1080, em x264 CRF 16 preset slow, yuv420p, com o áudio
copiado e faststart.
