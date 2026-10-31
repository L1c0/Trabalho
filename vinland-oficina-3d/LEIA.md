# Vinland — A Oficina, 3D (pacote novo)

Short vertical 1080×1920, 30 fps, 1215 frames (40,49 s), para o
@MangaEm60. Feito a partir do pacote `6c1b83d7-vinland-oficina-CODE.zip`,
que substitui os dois pacotes anteriores da Oficina; o projeto
`vinland-oficina/` é o do pacote anterior. O briefing está em
`docs/LEIA-PRIMEIRO.md`, e a legenda vem de `docs/4-oficina.srt`.

As oito construções de turfa estão de pé, em linha sobre o papel. A
câmera sobe, e elas afundam no chão uma a uma, deixando a marca. No fim
resta o terraço vazio e a frase.

## O que é do pacote e o que é da montagem

- `src/OficinaScene.tsx`, `src/of-camera.json` e `src/of-geo.json` vieram
  no pacote. A conta da câmera não foi mexida ("não reprojeta a câmera").
- **Uma correção na cena.** O `<perspectiveCamera makeDefault>` do pacote
  não vira a câmera do render: `makeDefault` é do `<PerspectiveCamera>` do
  drei, não existe no elemento do three-fiber. Assim como veio, o canvas
  desenhava pela câmera padrão dele, em (0, 0, 5), no nível do chão. As
  casas apareciam enormes e cortadas, e do frame 700 em diante quase nada
  aparecia. A correção registra essa mesma câmera como a padrão do
  canvas, com `useThree().set({camera})`. Está marcada com `[montagem]`.
- `src/Oficina.tsx` junta a cena, a legenda queimada e o áudio. A cena
  não traz os dois, e o LEIA pede os dois.
- `src/Root.tsx` registra essa composição. O Root original está em
  `docs/Root-do-pacote.tsx`.
- `src/Legenda.tsx`: EB Garamond 500, corpo 44, centrada, topo em
  y=1420, entrelinha 1,2. A cor é a da série, #2A2622 a 80%, porque o LEIA
  não diz. A EB Garamond 500 não vem no zip; é a do pacote anterior.
- O áudio é o `4-oficina.mp3` como veio (−16,3 LUFS), sem trilha.
- Dependências: `@remotion/three` 4.0.286, `@react-three/fiber` 9.1.2 e
  `three` 0.175.0.

## Render

`bash ferramentas/render.sh` segue a receita do LEIA:

1. `--scale=2 --crf=14 --pixel-format=yuv444p --gl=angle` (2160×3840);
2. redução por Lanczos para 1080×1920, x264 CRF 17 preset slow, yuv420p,
   áudio copiado, faststart.

A única adição é `--color-space=bt709` no passo 1, com as etiquetas bt709
no passo 2.

`node ferramentas/quadros.mjs 0 556 …` gera quadros soltos em 2× para
conferência.

## Observação

`tsc` acusa três erros de tipo no `OficinaScene.tsx` do pacote. Nenhum
muda o render:

- uma diretiva `@ts-expect-error` que não é usada;
- a prop `makeDefault`, que não existe no elemento;
- `cam.achados.deslocar_y`, que não existe no JSON. A placa de achados
  fica desligada (opacidade 0 em todos os frames) e nunca é desenhada.
