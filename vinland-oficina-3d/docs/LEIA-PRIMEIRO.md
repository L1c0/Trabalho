# A OFICINA — Short vertical 3D, 1080×1920, 30 fps, 1215 frames (40,49 s)

Canal **@MangaEm60** · L'Anse aux Meadows.

**Substitui integralmente os dois pacotes anteriores.** O primeiro tinha
oito pastilhas arredondadas idênticas, que é falso. O segundo tinha a
planta certa mas chapada, com 4,5% de escala em 40 segundos — isso não é
câmera, é um slide. Este é 3D de verdade.

**Remotion + `@remotion/three`.** O componente já vai escrito:
`OficinaScene.tsx` e `Root.tsx`. **Não reprojeta a câmera.**

---

## O que a peça faz

Parede de turfa tem altura, e turfa abandonada **afunda de volta no
chão**. É literalmente o que a arqueologia acha no sítio: depressões no
terreno. Então as construções não somem por fade — elas **baixam até o
chão e deixam a marca**. A câmera sobe junto e termina no alto, olhando
pra um terraço vazio.

O desaparecer é o argumento: *eles foram embora em ordem, esvaziaram tudo
e não deixaram ninguém para trás.*

| frames | narração | tela |
|---|---|---|
| 0 | "…tem oito construções de turfa" | as oito de pé; a câmera baixa, enquadrando as moradias |
| 0–700 | | a câmera sobe de 26° para 38° e **o forno entra em quadro** |
| 556–769 | "E eles foram embora em ordem" | as oito afundam, uma a cada 26,6 frames, na ordem B C A E D G F J |
| 760 | | o rótulo sai |
| 779 | "A terra prometida era uma oficina" | a frase imprime sobre o terraço vazio |
| 1214 | | câmera a 62°, olhando de cima: só as marcas no chão |

---

## O espaço

`of-geo.json` traz a geometria em coordenadas de planta:

```
A, D, F    salões (edifícios longos de várias salas), parede 48 de altura
B, C, E, G cabanas, parede 34
J          a cabana do forno, em ferrugem, do outro lado do riacho
terreno    borda_a, borda_b (o terraço) e riacho
```

Mundo 3D: `X = planta.x − 582`, `Z = planta.y − 840`, **Y para cima**.

Três conjuntos de moradia — cada um um salão grande com sua cabana —
alinhados num terraço curvo; o complexo de ferro separado, do outro lado
do riacho, no braço mais perto do mar.

> **Ressalva de honestidade.** Isto é um **esquema declarado** da
> disposição do sítio, não o decalque de uma planta de escavação. Certo e
> verificável: são oito construções; são três conjuntos de salão + cabana
> alinhados num terraço curvo; o complexo de ferro fica separado, do
> outro lado do riacho. As medidas exatas **não** são levantamento. Nada
> na tela, na narração ou na descrição afirma que são.

---

## A câmera — já resolvida, frame a frame

`of-camera.json`, 1215 entradas:

```json
{"f":0, "olho":[x,y,z], "alvo":[x,y,z], "desloca":[dx,dy],
 "alt":{"A":1.0,…}, "marca":{"A":0.2,…},
 "rotulo":1.0, "achados":0.0, "fecho":0.0}
```

**Como foi calculada.** A câmera orbita em azimute 138°→164° e sobe em
elevação 26°→62°, linear, sem easing. Para cada frame a **distância** é
resolvida por busca binária até a projeção de todas as construções caber
em 880 × 1120 px; o resultado é então recentrado com `desloca`, em
pixels de tela.

Isso garante que **nada vaza da zona segura em nenhum frame** — foi
verificado, não estimado. Por isso vem pronto: não refaz a conta.

`desloca` entra por `camera.setViewOffset(1080, 1920, -dx, -dy, 1080, 1920)`,
que é a forma exata de deslocar o quadro sem distorcer a perspectiva.

**O enquadramento muda de alvo no meio.** Até o frame 250 ele cabe só as
**moradias**; até o 700 migra para **todas as oito**. É por isso que o
forno entra em quadro conforme a câmera sobe, em vez de estar lá desde o
começo competindo com as casas.

### `alt` e `marca`

`alt[id]` é o fator de altura da parede: 1 de pé, 0 afundada.
`marca[id]` é a opacidade da depressão no chão.

O contorno **externo** no chão fica sempre, fraco — é a base da parede.
O contorno **interno** só aparece conforme a turfa afunda: essa é a
**revelação** da peça, o que sobrou depois que foram embora. Não inverte
essa ordem; sem isso as construções leem como banheiras de vidro.

---

## O que NÃO entra, de propósito

- **Nenhuma luz na cena.** Nenhum material além de `LineBasicMaterial`.
- Sem sombra, bloom, profundidade de campo, névoa ou ambient occlusion.
- Sem spring, sem easing. A subida é linear.
- **A placa `achados.png` não entra.** Ela colide com a legenda queimada
  e repete o texto que a narração já diz. Está desligada no JSON
  (`achados: 0.0` em todos os frames). O arquivo vai junto só por
  histórico.

É desenho de reconstrução arqueológica: só linha sobre papel.

---

## Camadas chapadas

`rotulo.png` e `fecho.png` ficam **fora do 3D**, em cima do canvas.
Tipografia em perspectiva perde legibilidade, e num Short legibilidade
ganha de profundidade sempre.

**Legenda queimada:** EB Garamond 500, corpo 44, centrada, topo em
`y=1420`. Tempos em `4-oficina.srt`, 9 cartelas. Já conferido: nenhuma
passa de 887 px de largura, dentro da caixa útil de 936.

---

## Render — a qualidade depende disto

Linha fina em 3D serrilha feio. Renderiza no dobro e reduz:

```bash
npx remotion render Oficina out/oficina-2x.mp4 \
  --scale=2 --crf=14 --pixel-format=yuv444p \
  --concurrency=4 --gl=angle

ffmpeg -i out/oficina-2x.mp4 -vf "scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p \
  -c:a copy -movflags +faststart out/oficina.mp4
```

O `--scale=2` é o item que mais muda o resultado: reduzir por Lanczos faz
o antialiasing das linhas que o canvas sozinho não dá. Se `--gl=angle`
falhar, usa `--gl=swangle`.

Áudio: `audio/4-oficina.mp3`, já cortado e normalizado. Sem trilha.

Confere no fim: **1215 frames, 40,49 s, 1080×1920.**
