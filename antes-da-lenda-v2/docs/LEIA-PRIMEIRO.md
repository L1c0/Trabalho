# ANTES DA LENDA — abertura (versão 2, 3D)

**Remotion.** 1920×1080 · 30 fps · **630 frames (21 s)**.
Substitui a vinheta de 10,5 s. `IntroScene.tsx` e `Root.tsx` já vão
escritos. **Não reprojeta a câmera nem os tempos.**

---

## São dois zips. Descompacta os dois na mesma pasta.

| zip | conteúdo | tamanho |
|---|---|---|
| **1 · PROJETO** (este) | componente, 12 palavras impressas, quadro tratado, cartela, papel, trilha, fontes | ~5 MB |
| **2 · PLANOS** | os três vídeos já cortados (6,2 s cada) | ~27 MB |

Os `.tsx` vão para `src/`, todo o resto para `public/`.
Os vídeos **já estão cortados e em 30 fps**: `startFrom` é zero.

**Confere antes de renderizar.** Os três têm que ter **188 frames
(6,267 s)** cada. Se algum tiver 3,6 s ou 4,1 s, é da v1 — apaga e usa
os `*-188f.mp4`. O componente pede 184 frames da planície, 141 da cidade
e 188 do mercado; com os clipes da v1 a imagem trava antes do corte.

```
ffprobe -v error -show_entries stream=nb_frames -of csv=p=0 planicie-188f.mp4
```

---

## Dois atos

**ATO 1 — A LENDA (f0–511).** Três planos do jogo, cortes rápidos, e as
palavras vivendo **em profundidade**: cada uma tem o seu Z e a câmera faz
dolly de 0 a 340, então elas passam umas pelas outras em velocidades
diferentes. Isso é paralaxe de verdade, não escala fingida.

Maiúsculas em **Playfair Display 600**; as palavras de ligação em
**Playfair itálico 500**. Esse contraste de textura é o que a referência
usa e é o que faz o lettering parecer composto por alguém.

**f511 — A VIRADA.** O acento mais forte da faixa cai aqui (17,02 s). O
quadro inteiro é uma **carta de duas faces**: gira 180° em Y, e a face de
trás é a mesma imagem impressa em nanquim sobre washi. A lenda vira
registro, girando. É o momento da peça.

**ATO 2 — O REGISTRO (f511–630).** A câmera recua e a folha impressa
vira **uma de muitas**, empilhadas em profundidade, levemente
desalinhadas. Em **19,44 s** ela despenca pro fundo e o quadro **fecha em
preto** sobre o acento de 19,82 s. Meio segundo de preto, e o vídeo
começa.

**Não tem cartela de marca, de propósito.** Logo de canal aos 22 s é o
canal falando de si antes de ter entregado nada. A assinatura já está na
virada do frame 511 — o jogo virando gravura impressa diz "antes da
lenda" sem escrever o nome. Depois disso, o melhor que pode acontecer é
escuro e a primeira frase.

**A vinheta termina em preto**, então o corte pro conteúdo é só
concatenar. A trilha cai a zero junto com a imagem: o vídeo começa limpo.

---

## A grade

**120 BPM, batida no frame 4** — uma a cada 15 frames. As doze palavras
entram todas em cima de batida. Conferido por script: nenhuma fora do
grid, nenhuma sobrevive à virada.

```
f4    EM 1899              f334  ninguém
f64   um homem             f364  AVISOU
f109  ATRAVESSA            f409  o bando
f139  uma terra            f454  TUDO QUE VOCÊ SABE
f199  QUE JÁ TINHA         f469  foi escrito
f229  ACABADO              f499  DEPOIS
                           f511  A VIRADA     (17,02 s)
cortes: f184 cidade        f595  A CARTELA    (19,82 s)
        f325 mercado       f660  fim          (22,0 s)
```

As três últimas frases entram em 57 frames — é aceleração proposital
entrando no drop.

**Se trocar a faixa, me avisa.** Eu remapeio a grade. Mover a virada pra
fora do acento mata a peça.

---

## Detalhes de implementação que já morderam

- **`<Sequence>` rebaseia o relógio.** Dentro dela, `useCurrentFrame()`
  começa em 0 no início daquele plano. Por isso o empurrão de zoom não
  recebe o frame do corte. Se passar frame absoluto, os planos 2 e 3
  ficam sem empurrão.
- **`backfaceVisibility: 'hidden'` nas duas faces da carta**, e a de trás
  com `rotateY(180deg)` própria. Sem isso as duas aparecem ao mesmo tempo
  no meio do giro e vira sopa.
- As palavras ficam num `AbsoluteFill` com `transformStyle: 'preserve-3d'`
  **fora** da carta — senão giram junto com ela na virada.
- **Posições verificadas por script**: nenhuma palavra vaza da caixa útil
  (x 150–1770, y 120–960) e nenhum par que coexiste se sobrepõe. Foram
  7 pares testados. Não mexe nas posições do `pos.json`.

---

## Sem mola

Nenhum spring, nenhum easing elástico, em lugar nenhum. Dolly linear,
giro linear, recuo linear. Palavra entra em 5 frames com 1,5% de escala e
**para seca**.

Mola faz a imagem respirar e lê como efeito. Aqui tem que ler como chapa
batendo no papel.

---

## A trilha é provisória

`trilha.mp3` saiu do vídeo de referência, que usa faixa comercial.
**Teste e só teste.** Publicar assim toma reivindicação de Content ID ou
strike. Antes de subir, troca por licenciada em 120 BPM e me avisa pra eu
recalcular a fase.

---

## Render

```bash
npx remotion render Intro out/intro-2x.mp4 \
  --scale=2 --crf=14 --pixel-format=yuv444p \
  --concurrency=4 --gl=angle

ffmpeg -i out/intro-2x.mp4 -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  -c:a copy -movflags +faststart out/intro.mp4
```

Confere no fim: **630 frames, 21,0 s, 1920×1080**, a virada em 17,02 s
e preto total em 19,82 s.
