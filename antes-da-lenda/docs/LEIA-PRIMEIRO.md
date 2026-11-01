# ANTES DA LENDA — vinheta de abertura

**Remotion.** 1920×1080 · 30 fps · **315 frames (10,5 s)**.
`IntroScene.tsx` e `Root.tsx` já vão escritos. Não reprojeta a câmera nem
os tempos.

---

## Você precisa colocar os três vídeos

Eles não cabem no zip. Renomeia os seus arquivos e põe em `public/`:

| seu arquivo | renomear para |
|---|---|
| `1000414855.mp4` (planície) | `plano-planicie.mp4` |
| `1000414840.mp4` (cidadezinha) | `plano-cidade.mp4` |
| `1000414839.mp4` (mercado) | `plano-mercado.mp4` |

Os pontos de entrada já estão no código: 22 s, 16 s e 3,5 s. Não mexe.

---

## O que a vinheta faz

Três planos em ordem: **planície vazia → cidadezinha com lampião →
mercado com luz elétrica**. É a fronteira fechando, em ordem, em dez
segundos. Uma frase atravessa os três cortes:

> TUDO QUE VOCÊ SABE · FOI ESCRITO · DEPOIS

No frame 214 a imagem **congela** e vira nanquim sobre washi — a lenda
virando registro. A cartela imprime em cima.

A frase é invariante: serve pra qualquer vídeo do canal. Só os três
planos trocam. **Isto é um molde, não uma peça única.**

---

## A grade — é isso que faz parecer edit

Medi a faixa: **120 BPM, com a batida caindo no frame 4.** Logo, batida a
cada 15 frames: 4, 19, 34, 49, 64, 79…

Toda palavra entra **em cima de uma batida**:

```
f4    TUDO          f64   corte -> cidadezinha
f19   QUE           f79   FOI
f34   VOCÊ          f94   ESCRITO
f49   SABE          f139  corte -> mercado
f154  DEPOIS        f214  congela + nanquim
f273  A CARTELA     <- primeiro acento forte da faixa (9,1 s)
```

O frame 273 não é escolha de gosto: é onde a música bate. Se você mudar a
faixa, **me avisa que eu remapeio a grade** — mover a cartela pra fora do
acento mata a vinheta.

**Sem mola em lugar nenhum.** A palavra entra em 4 frames, com 2% de
escala, e para seco. Spring faz a imagem respirar e lê como efeito; aqui
tem que ler como batida de chapa.

---

## A trilha é provisória

`trilha.mp3` foi extraída do vídeo de referência, que por sua vez usa uma
faixa comercial. **Serve pra teste e só pra teste.** Publicar assim toma
reivindicação de Content ID ou strike. Antes de subir, troca por faixa
licenciada no mesmo andamento (120 BPM) e me avisa pra eu recalcular a
fase da batida.

---

## Detalhes que importam

- **Zoom de 1,085** em todos os planos. Além de dar empurrão, ele joga
  pra fora do quadro o contador **"60 FPS" queimado no canto** do clipe
  da planície. Não reduz esse valor.
- O empurrão é **linear**, 3,5% em 90 frames. Sem easing.
- `tratado.jpg` é o quadro do mercado já passado no tratamento sumi:
  fibra de washi, mordida úmida na borda do traço, pontos de branco e
  preto tirados da própria imagem. Grão medido: 10,8 — acima do alvo de
  6–8 da casa, mas o alvo foi calibrado pra página de mangá; em imagem
  fotográfica esse valor está certo.
- As palavras são PNG já impressos na prensa, com mordida, falha e
  micro-desregistro. **Não compõe texto em tempo de render** e não usa
  Cormorant.

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

Confere no fim: **315 frames, 10,5 s, 1920×1080**, e a cartela entrando
em 9,1 s.
