# Antes da Lenda · Red Dead Redemption 2 — o vídeo longo

O vídeo tem 1920×1080 a 30 fps, com 22.470 quadros (12:29). Ele sai do
pacote `02062e03-reddead-PACOTE-CODE.zip` (`docs/PACOTE.json` e as 16
chapas) e da trilha `28c3e776-reddead-TRILHA-mixada.mp3`, que vira
`public/trilha.mp3` sem nenhuma alteração. A trilha tem 749,06 s e
−14,6 LUFS.

## Situação: faltam os 8 vídeos do jogo

Os clipes são trechos de gravações do jogo que não vieram no pacote. Eles
cobrem uns 6 dos 12 minutos. Cada arquivo vai em `public/clipes/` com o
nome exato:

| clipe | arquivo | trechos usados (s) |
|---|---|---|
| A | `1000417094.mp4` | 12–52,92 · 118–135,94 · 108–143,58 |
| B | `1000417101.mp4` | 20–46 |
| E | `142e74fe-1000417122.mp4` | 8–48 |
| F | `1000417129.mp4` | 96–108,2 · 0–40,26 · 41–52,74 · 60–116 |
| G | `292f4bb8-1000417136.mp4` | 2–24,12 |
| H | `1000414839.mp4` | 0–14 |
| I | `1000414840.mp4` | 0–11,2 |
| J | `1000414855.mp4` | 0–40,48 |

Até eles chegarem, `--sem-clipes` desenha um cartão no lugar de cada
clipe, com o arquivo e o trecho. Isso serve para conferir chapas, cortes
e trilha.

## Como a montagem segue o pacote

O pacote foi seguido assim:

- **Cortes.** O corte é seco, com 4 quadros de ganho de opacidade. A cena
  que sai continua por baixo durante esses quadros.
- **Chapas.** A janela de 1920×1080 desliza em linha reta de x=140 a
  x=340, no centro da altura, ao longo da cena. A chapa tem 2400×1350,
  então nunca amplia.
- **Clipes.** Não têm nenhum movimento extra. A cor do pacote é feita no
  Remotion, sobre o vídeo original. Assim, o projeto só precisa dos
  arquivos do jogo, sem versões tratadas. Os parâmetros são:
  - saturação 0,72 e contraste 1,07 (filtro CSS);
  - sombra quente: o preto sobe para `rgb(24,16,10)` (`lighten`), e
    luzes e meios-tons ficam como estão;
  - vinheta radial, até 42% de escuro nos cantos;
  - grão 5: o mesmo `grao.png` da abertura v3, andando a cada quadro, em
    overlay. A opacidade é 0,147, porque o ladrilho tem desvio 34, e
    34 × 0,147 dá desvio 5 em cinza médio.
- **`p12-fecho.jpg`.** Veio em 1920×1080, embora o JSON peça o deslize
  "na chapa de 2400×1350". Para deslizar, ela teria que ser ampliada, então
  fica parada. Se vier a versão de 2400×1350, basta trocar o arquivo e
  tirar a linha dela de `TAMANHO` em `src/Video.tsx`.
- **A alternativa em movimento da cena 3.** É o `1000417160.mp4`, 7 s em
  ping-pong. Não foi usada: o JSON deixa a chapa como padrão.

## Pendências do próprio pacote

- O pickup de áudio em 4:38: o boletim é de abril de 1891, oito anos
  antes, e não de 1890 nem "nove".
- Conferir de ouvido: John Swartz em 6:23 (não Schwartz), Butch em 6:29
  (não Bud) e Saint Denis em 8:43.
- O bloco 20 (7:37–8:38) pede 50 s dele em câmera. Hoje ele é coberto só
  pela chapa p11.
- A HUD do jogo está em modo dinâmico, não desligada: ela aparece e some
  sozinha.

## Quadros de conferência

`node ferramentas/quadros.mjs [--sem-clipes] 0 500 1016 …` grava os
quadros em `out/quadros/`.
