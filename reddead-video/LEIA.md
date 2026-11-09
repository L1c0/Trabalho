# Antes da Lenda · Red Dead Redemption 2 — o vídeo longo

O vídeo tem 1920×1080 a 30 fps, com 22.470 quadros (12:29). Ele sai do
pacote `02062e03-reddead-PACOTE-CODE.zip` (`docs/PACOTE.json` e as 16
chapas) e da trilha `28c3e776-reddead-TRILHA-mixada.mp3`, que vira
`public/trilha.mp3` sem nenhuma alteração. A trilha tem 749,06 s e
−14,6 LUFS.

## Os clipes

Os clipes chegaram já cortados por cena, em `rd-clipes-1de7` a `7de7`:
são 13 arquivos `cNN-X.mp4`, em que NN é a cena e X é o clipe. Todos têm
1920×1080, 30 fps constantes e nenhum áudio.

Cada arquivo tem exatamente os quadros da sua cena. Quatro deles têm um
quadro a mais, por arredondamento. As contagens estão em
`src/data/clipes.json`. A cena toca o arquivo do começo, e nos 3 quadros
da dissolução seguinte segura o último quadro.

`--sem-clipes` desenha um cartão no lugar de cada clipe, com o arquivo de
origem e o trecho.

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

## Entrega

O master de 12:29 passa de 3 GB, e o envio aceita no máximo 30 MiB por
arquivo. Por escolha sua, a entrega tem duas partes:

- **A prévia.** `bash ferramentas/previa.sh` gera um arquivo de até
  30 MiB: 640×360, x264 em duas passadas, áudio AAC de 80 kb/s. Ela sai
  da cópia de conferência feita aqui (`bash ferramentas/render.sh
  --rapido`, com x264 veryfast e CRF 18, que só serve para isso).
- **O pacote de render.** `python3 -I ferramentas/pacote.py
  ferramentas/LEIA-PRIMEIRO-pacote.txt` gera 6 zips de até 29 MiB, com o
  projeto, as chapas, a trilha e os 13 clipes. No outro computador:
  - `npm ci`;
  - `node ferramentas/render.mjs`, que roda em Windows, macOS e Linux.
    Faz o master em x264 CRF 16 preset slow e acerta o atraso do AAC com
    o ffmpeg que vem com o Remotion.

  Testei o pacote do zero: descompactei os 6 zips numa pasta vazia, rodei
  `npm ci` e rendi trechos com `render.mjs`. O resultado sai em
  1920×1080, com a cor etiquetada bt709 e o áudio.

O tamanho do master em CRF 16, medido nos trechos, é de cerca de 3,5 GB:

- os clipes rendem cerca de 26 Mb/s;
- as chapas rendem cerca de 52 Mb/s, porque a janela que desliza sobre
  o grão impresso muda todos os pixels a cada quadro.

Com `--crf=18`, o arquivo fica com uns 2,7 GB (medido nos mesmos
trechos: 30% a menos).
