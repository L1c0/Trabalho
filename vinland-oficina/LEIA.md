# Vinland — A Oficina (pacote novo)

Short vertical 1080×1920, 30 fps, 1215 frames (40,49 s), para o @MangaEm60.
Feito a partir do pacote `vinland-oficina-CODE.zip`, que substitui o
`4-oficina/` anterior. O briefing está em `docs/LEIA-PRIMEIRO.md` e a
legenda em `docs/4-oficina.srt`.

A planta do sítio está inteira no primeiro frame. Cada construção some
quando a narração diz que eles foram embora, e no fim resta o papel com a
frase.

## Como funciona

`src/Oficina.tsx` lê a tabela do `timeline.json` frame a frame: a
opacidade de terreno, rótulo, achados e fecho, e o limiar de cada
construção. As construções saem pela máscara, não por fade. `src/Descola.tsx`
sobe o limiar 1 − v sobre a máscara (0..255), só dentro da caixa de cada
construção, e a tinta descola em manchas. Isso é um canvas 2D, não shader.
A borda do limiar tem 4 níveis de largura, só para não serrilhar.

As máscaras são ruído genérico, sem estrutura por construção, então a
k-ésima a sair usa `mascara-k`.

Os achados descem 260 px (`achados.deslocar_y`). A escala vai num container
em volta de (540, 840). O áudio é o `4-oficina.mp3` como veio (−16,3 LUFS).

## Onde a montagem se afasta do LEIA-PRIMEIRO

- **Faixa da legenda: 1500..1620, não 1420..1530.** Com o deslocamento de
  260 px que o JSON manda, a lista de achados ocupa y 1319..1474 e chega a
  1489 com a escala da câmera. Na faixa pedida, a legenda caía em cima da
  segunda linha da lista, justamente quando repete o texto dela. Em
  1500..1620, a legenda fica logo abaixo da lista.
- A cor da legenda é a da série, #2A2622 a 80%, porque o LEIA não diz.
- A EB Garamond 500 não vem no zip. É a do pacote anterior do Vinland.

## Regenerar

1. Copiar as peças, as máscaras, `papel.jpg` e `audio/` do zip para
   `public/`, e a fonte para `public/fontes/`.
2. `python3 -I ferramentas/legenda.py .`
3. `npm install` e `bash ferramentas/render.sh`.

```
1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart
```
