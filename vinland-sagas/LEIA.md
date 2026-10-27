# Vinland — As Duas Sagas (pacote novo)

Short vertical 1080×1920, 30 fps, 1258 frames (41,93 s), para o @MangaEm60.
Feito a partir do pacote `vinland-sagas-CODE.zip`, que substitui o `3-sagas/`
anterior. O briefing está em `docs/LEIA-PRIMEIRO.md` e a legenda em
`docs/3-sagas.srt`.

Uma página se compõe linha a linha. No Haukr, a página inteira duplica fora
de registro e desbota, e o nome carimba por cima em ferrugem.

## Como funciona

`src/Sagas.tsx` empilha os `<Img>` de quadro inteiro com a opacidade de cada
peça lida da tabela do `timeline.json`, frame a frame. Nada é composto por
pixel. A partir do frame 880, todas as peças visíveis são desenhadas outra
vez, deslocadas de (dx, dy), por baixo da camada normal. Essa cópia tem a
opacidade de `tinta_fantasma`, proporcional à de cada peça. A escala vai
num container que envolve tudo, papel incluído, em volta de (540, 860).

A legenda é EB Garamond 500, corpo 40, na faixa y=1480..1600. A cor é a da
série, #2A2622 a 80%, porque o LEIA não diz. O áudio é o `3-sagas.mp3` como
veio, já normalizado.

## Regenerar

1. Copiar as peças, `papel-sagas.jpg` e `audio/` do zip para `public/`.
   A EB Garamond 500 não vem no zip: `public/fontes/ebg-500.ttf` é a do
   pacote anterior do Vinland.
2. `python3 -I ferramentas/legenda.py .`
3. `npm install` e `bash ferramentas/render.sh`.

```
1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart
```
