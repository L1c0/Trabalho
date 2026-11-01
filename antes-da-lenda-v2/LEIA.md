# Antes da Lenda — abertura, versão 2 (3D)

1920×1080, 30 fps, 630 frames (21 s). O briefing está em
`docs/LEIA-PRIMEIRO.md`. `src/IntroScene.tsx`, `src/Root.tsx` e
`src/pos.json` vieram prontos e estão sem alteração.

**Pendente: o render.** Faltam os três vídeos do zip "PLANOS":
`planicie-188f.mp4`, `cidade-188f.mp4` e `mercado-188f.mp4`, com 188 frames
cada. Os clipes da v1 (`plano-*.mp4`, de 3,6 s, 3,6 s e 4,1 s) não servem:
a v2 usa 184, 141 e 188 frames dos planos. O `tratado.jpg` da v2 também
não bate com nenhum quadro do mercado da v1 (correlação máxima de 0,21);
ele vem de um momento depois do fim daquele clipe.

Já estão em `public/`:

- as 12 palavras, de t01 a t12, nos tamanhos do `pos.json`;
- o `tratado.jpg` da v2;
- o `papel.jpg` e a `trilha.mp3`, os dois iguais aos da v1;
- as fontes Playfair 600 e Playfair itálico 500, que o código não usa.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA. O passo 1 é
`--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle`. O passo 2 reduz por
Lanczos para 1920×1080, em x264 CRF 16 preset slow, yuv420p, com o áudio
copiado e faststart.
