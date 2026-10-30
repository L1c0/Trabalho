# A CONTAGEM — Short vertical, 1080×1920, 30 fps, 783 frames (26,09 s)

Canal **@MangaEm60**. Substitui o `1-contagem/` antigo. **Joga o antigo
fora**: as posições de lá colidiam entre si e vazavam pela direita do
quadro.

**Remotion. Sem shader.** Tudo aqui é `<Img>` posicionado em absoluto
dentro de um container com `transform`. Nada é composto por pixel.

---

## O que a peça faz

A página se **enche de cem marcas**. Cada soco é uma impressão separada,
com sua própria semente, e nenhuma substitui a anterior. A câmera recua
sem parar durante os 17 segundos da contagem, revelando que a página é
maior que o quadro. No fim a página está cheia, e as quatro palavras
entram por cima das cem marcas — que continuam lá, porque elas **são** o
argumento.

| frames | narração | tela |
|---|---|---|
| 0–60 | "No capítulo 96…" | o soco 1 já impresso, grande, em ferrugem |
| 60–478 | "…leva cem socos na cara" → "…imaginar inteiro" | socos 2 a 95, um a cada 4,45 frames |
| 478–518 | | os últimos cinco, mais lentos (8 frames cada) |
| 518–627 | "No fim o Thorfinn está destruído, de pé, e diz quatro palavras" | página cheia, parada |
| 627–695 | "eu não tenho inimigos" | a grade cai para 28% de tinta e a frase entra por cima |
| 708–767 | a pergunta | só legenda |

---

## A cena 3D — `ContagemScene.tsx`

O componente está pronto no pacote, junto com `Root.tsx`. Usa o
`timeline.json` direto. **Não reescreve a câmera.**

### Como o espaço está montado

A chapa é um plano real. Z = 0 é o papel. A tinta de cada soco fica
**5 a 13 px acima** do papel, em Z, como tinta de prensa senta na fibra.
Quando a câmera sai do eixo, você vê a paralaxe entre a tinta e o papel:
a página tem espessura. É sutil e é o que faz parecer objeto, não
camada do Photoshop.

Cada numeral **chega voando** de Z = 520 (perto da lente) e assenta na
página em 7 frames, com 3 frames de batida afundando 4 px. São cem socos
vindo na cara de quem assiste, um por vez. O 3D aqui faz o argumento.

### Como a velocidade da câmera foi calculada

A coluna `escala` do timeline é escala ortográfica — foi ela que eu
conferi quadro a quadro. Em perspectiva, um plano a distância `z` aparece
escalado por `P / (P − z)`. Invertendo:

```
z = P · (1 − 1/escala)        // P = 1400 (perspectiva)
```

Então o dolly em Z reproduz **exatamente** o enquadramento aprovado, só
que agora com profundidade de verdade. Não troca a fórmula.

O recuo é log-linear: velocidade de zoom constante ao longo dos 17
segundos da contagem. A órbita vai de −9° em Y e +6° em X até **zero**,
linear, e fica travada em zero no fecho — a página precisa fechar chapada
pra frase ser legível.

### O que NÃO entra, de propósito

Sem luz, material, sombra, rim light, bloom ou profundidade de campo.
Todos eles destroem a leitura de papel impresso, que é a identidade do
canal. A referência boa ("Fly by Day") também não usa nenhum: são planos
chapados em profundidade com câmera de verdade. É isso que a gente quer.

**Sem spring. Nenhum.** Esta peça é uma contagem — mola faz a imagem
respirar e vira efeito, quando o que a gente precisa é que pareça medida.
A única curva é `Easing.out(Easing.quad)` na chegada do soco, que
desacelera mas **não volta**: é impacto, não elástico.

### Camadas chapadas

`cartela.png`, `frase.png` e os `num-*.png` ficam **fora do 3D**.
Tipografia em perspectiva perde legibilidade, e num Short legibilidade
ganha de profundidade sempre.

---

## `timeline.json`

783 linhas em `quadros`:

```
frame  escala  cam_x  cam_y  k  tinta_grade  opac_frase
```

`k` é quantos socos já caíram (usa `Math.floor`). `tinta_grade` multiplica
a opacidade de **todos** os socos (vai a 0,28 no fecho). `escala`, `cam_x`
e `cam_y` alimentam o `transform` acima.

**Lê a tabela, não recalcula.** Ela é exatamente o que eu conferi quadro a
quadro.

Em `posicoes` estão os 100 socos com `x`, `y` na chapa de 1400×2100. Zero
colisões — verificado por par, os 4.950 pares. Não mexe nas posições.

Em `socos.frames` está o frame exato de cada soco. Cada um entra com
tinta cheia e **decai para 0,55 em 25 frames**:

```js
const tinta = (frame >= f0)
  ? (1.0 - 0.45 * Math.min(1, (frame - f0)/25)) * tintaGrade
  : 0;
```

Isso faz uma onda de tinta fresca atravessando a página. É o que diferencia
de uma grade que só aparece.

Em `heros` estão os cinco marcos (1, 25, 50, 75, 100) com o frame e a
duração do numeral grande. Eles são a âncora no meio da enxurrada — o olho
não conta cem, conta de vinte e cinco em vinte e cinco.

---

## Regras

- Recuo **log-linear**, velocidade de zoom constante. Sem easing, sem mola.
- A câmera **nunca para** durante a contagem. Se parar, vira slide.
- Prensa não roda por frame. Tudo já está impresso.
- Sem blur, bloom, sombra, profundidade de campo ou material PBR.
- Legenda queimada: EB Garamond 500, corpo 40, entre `y=1600` e `y=1720`
  (abaixo da grade, que acaba em 1450). Tempos em `1-contagem.srt`.
- Áudio: `audio/1-contagem.mp3`, −16 LUFS, já cortado. Sem trilha nesta peça.

---

## Render — a qualidade depende disto

Transformação 3D no Chrome **rasteriza o PNG no tamanho da tela**, então
renderizar direto em 1080 amolece a tinta. Renderiza no dobro e reduz:

```bash
npx remotion render Contagem out/contagem-2x.mp4 \
  --scale=2 --crf=14 --pixel-format=yuv444p \
  --concurrency=4 --gl=angle

ffmpeg -i out/contagem-2x.mp4 -vf "scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p \
  -c:a copy -movflags +faststart out/contagem.mp4
```

O `--scale=2` é o item que mais muda o resultado: a redução por Lanczos
devolve a nitidez do grão do papel que o 3D tinha comido. `yuv444p` no
passo intermediário evita que o vermelhão dos marcos sangre antes da
redução.

Se o `--gl=angle` der problema na máquina, tenta `--gl=swangle`
(software, mais lento e mais previsível).

- Confere no fim: 783 frames, 26,09 s, 1080×1920.
- Nada de "vídeo completo no canal" na tela.
