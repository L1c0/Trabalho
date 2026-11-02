# ANTES DA LENDA — abertura · Red Dead Redemption 2

**Remotion.** 1920×1080 · 30 fps · **690 frames (23,0 s)**.
`IntroScene.tsx` e `Root.tsx` já vão escritos. **Não refaz a cor, o
áudio, nem os tempos.**

Os `.tsx` vão para `src/`, todo o resto para `public/`.

---

## Muita coisa já vem pronta no arquivo. Não refaz.

| já está no arquivo | não faz no Remotion |
|---|---|
| a **cor de cada ambiente**, vinheta e halação | nada de filtro de cor |
| o **"ATRAVESSA" atrás do Arthur** (`planicie-texto.mp4`) | não compõe esse texto |
| o **áudio inteiro**, com o corte da música no lugar | não mexe em volume |
| o corte que mata a legenda queimada da cutscene | não dá zoom nela |

O Remotion faz: os cortes, a tipografia dos outros planos, a virada, o
grão e o letterbox. Só isso.

---

## A peça

**ATO 1 — a lenda (f0–511).** Onze planos, corte a cada 1 a 1,5 s, todos
na batida. Cada ambiente tem a sua cor:

```
planície   âmbar de crepúsculo
cidade     noite fria, verde-azulada
mercado    ouro contra sombra fria
nascer     frio em cima, quente no horizonte
close      quente e fechado
```

**A tipografia é tingida na cor do ambiente onde está.** Caixa alta em
Montserrat 600 com entrelinha larga; as palavras de ligação em Pinyon
Script. É o contraste da referência.

**O terceiro plano é o truque da peça.** "ATRAVESSA" se escreve letra a
letra e **o Arthur passa na frente das letras**. Extraí a silhueta dele
quadro a quadro — a figura vem colada na sombra do chão, então eu meço a
largura linha a linha e corto onde ela explode: o corpo tem 50 px, a
sombra tem 300. Isso já está assado no `planicie-texto.mp4`.

**f511 — A VIRADA.** Corte seco para a mesma cena em nanquim sobre
washi. A lenda vira registro. Segura 2,5 s. Grão medido: 7,4.

**f585 — A MÚSICA MORRE.** Corte seco, sem fade. Entra o close do
Arthur, e ele diz *"I'm afraid"* em 20,5 s. A legenda **ESTOU COM MEDO**
imprime e fica.

**f690 — acaba** com a legenda na tela e o ambiente rodando. É a deixa
pra narração entrar por cima, sem emenda. Não põe fade nem preto no fim.

---

## A grade

120 BPM, batida no frame 4, uma a cada 15 frames.

```
f4    EM 1899                f304  AVISOU
f64   um homem               f364  o bando
f124  [plano do ATRAVESSA]   f409  TUDO QUE VOCÊ SABE
f169  uma terra              f454  foi escrito
f199  QUE JÁ TINHA ACABADO   f484  DEPOIS
f274  ninguém                f511  A VIRADA
                             f585  a música morre
                             f615  ESTOU COM MEDO
                             f690  fim
```

Conferido por script: todo plano cabe no arquivo de origem, e nenhuma
palavra vaza da caixa útil (x 140–1780, y 150–930).

**Sem mola.** Corte seco, palavra entra em 4 frames com 1,5% de escala e
para. Spring faz a imagem respirar e lê como efeito.

---

## Letterbox e grão

Letterbox **2.39:1** — barras pretas de 104 px em cima e embaixo, por
cima de tudo. Elas também cobrem o que sobrar de legenda do jogo.

`grao.png` é um ladrilho de 512 px **sem emenda** (conferido: o salto na
junção é 37 contra média 36). Anda a cada frame, `mix-blend-mode:
overlay`, opacidade 0,17. Não aumenta: grão forte destrói o encode.

---

## A trilha é provisória

O áudio saiu do vídeo de referência, que usa faixa comercial. **Teste e
só teste.** Antes de publicar, troca por licenciada em 120 BPM e me
avisa pra eu remontar o `audio-intro.mp3` — o corte da música em 19,5 s
tem que continuar caindo no lugar.

A fala do Arthur é diálogo do jogo sobre ambiente, **sem trilha por
baixo** (medido: achatamento espectral cai de 0,71 para 0,545, que é voz
sobre ruído). Risco de reivindicação bem menor que o da música.

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

Confere no fim: **690 frames, 23,0 s**, a virada em 17,03 s, a música
morrendo em 19,5 s e a fala em 20,5 s.
