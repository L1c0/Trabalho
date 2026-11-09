# Antes da Lenda · Red Dead Redemption 2 — o vídeo longo (v3)

O vídeo tem 1920×1080 a 30 fps, com 22.470 quadros (12:29). Ele sai de dois
arquivos:

- o pacote `1810bb4b-reddead-PACOTE-v3.zip`: PACOTE.json, coreografia,
  partitura de cor, as 16 chapas em fundo + peças, os 22 letterings sobre o
  jogo e o mapa vetorial;
- a trilha `a35cd317-reddead-TRILHA-v2.mp3`, que vira `public/trilha.mp3`
  sem nenhuma alteração. Ela tem 749,09 s, −15,4 LUFS e está alinhada à v1
  (deslocamento 0). O "silêncio absoluto" de 8:38–8:58 e do fecho, citado no
  pacote, é da música: a voz continua.

Os 13 clipes do jogo são os mesmos da v1: `public/clipes/cNN-X.mp4`, em que
NN é a cena e X é o clipe. As contagens de quadros estão em
`src/data/clipes.json`.

## Como montar do zero

```
python3 -I ferramentas/prepara-v3.py <pasta rd-v3 do pacote> <trilha-v2.mp3>
```

Esse comando monta `public/` (sem os clipes) e `src/data/`:

- copia as peças, a trilha e a fonte;
- separa do fundo o que agora entra sozinho (veja abaixo);
- alinha os letterings pela linha de base;
- converte o mapa.

## O que o pacote pede, e como ficou

- **Cortes.** O corte é seco, com 4 quadros de ganho de opacidade. A cena
  que sai continua por baixo durante esses quadros.
- **Chapas.** O fundo tem 2400×1350, e a janela de 1920×1080 fica no
  centro. Ao longo da cena, a chapa inteira faz o empurrão de escala de 1,00
  a 1,05 a partir do centro, em velocidade constante, sem easing. As peças
  entram nos quadros da coreografia (`entra_f_por_peca`): 8 quadros, sobem
  24 px e ganham opacidade, sem mola. As letras de impacto já vêm com 3
  quadros entre elas.
- **Clipes.** Não têm movimento extra. Recebem contraste 1,07, sombra quente
  (o preto sobe para `rgb(24,16,10)`), vinheta até 42% e grão 5. É o mesmo
  `grao.png` da v1, com opacidade 0,147.
- **Partitura de cor** (`src/cor.ts`). A saturação vai em % do original e a
  temperatura de −100 a +100. Entre viradas, interpola em linha reta; a
  virada seca troca num quadro só.
  - A temperatura funciona como balanço de branco: o quente sobe o vermelho
    e baixa o azul, e o frio faz o contrário.
  - Ela vale para a imagem: o jogo e o fundo das chapas, com as fotos (o
    atlas, a garrafa, a circular, o Arthur, a nevasca).
  - A tipografia, os gráficos (a barra, os sublinhados, o mapa) e as três
    chapas de identidade (a faixa vermelha: p01, p08 e p13) ficam fora, na
    cor original. Se entrassem, a abertura e a cartela final ficariam
    cinzas, e os vermelhos de "194", "44 ANOS", "1893" e "ENTÃO EU NÃO VOU
    USAR" virariam cinza.
  - A virada seca de 15553 ("a frase que eu não usei") foi para 15566, o
    corte. Em 15553 ela trocaria a cor da chapa p11 parada, 13 quadros antes
    do corte.
- **Letterings sobre o jogo** (`src/Letreiros.tsx`). Entram no quadro da
  coreografia, como as peças. Os de impacto entram letra a letra, 3 quadros
  entre elas. O pacote não diz quando saem, então ficou assim:
  - dois letterings da mesma cena com até 8 s entre eles formam um par: o
    impacto fica em cima da tarja ("VINTE ANOS DE OFÍCIO" / "E O OFÍCIO É
    SER BANDIDO"), e os dois saem juntos 5 s depois do segundo;
  - se sobra menos de 2,5 s até o corte, o lettering fica até o corte;
  - a saída é só opacidade, em 8 quadros.
- **Mapa** (cena 14, `src/Mapa.tsx`). O SVG ocupa a chapa inteira e
  passaria por cima do atlas e da legenda. Então a cena tem dois tempos:
  1. o atlas, com a legenda e a nota de rodapé dele;
  2. aos 6,3 s, o atlas sai e o esquema entra, reduzido a 74% para caber
     acima da legenda.
  No esquema, a linha de 1880 se desenha em 40 quadros. Depois ela some, e
  os 12 cacos aparecem. Os 26 núcleos estalam um a um, 3 quadros entre eles.
  A linha ganha o ano (1880, depois 1890). A nota de rodapé passa a dizer
  "ESQUEMA · LINHA E NÚCLEOS ILUSTRATIVOS · GEOGRAFIA: US-ATLAS 3.0.1,
  MERIDIANO 99° W", na fonte das notas (IBM Plex Mono).
- **A alternativa em movimento da cena 3** (`1000417160.mp4`) não foi usada.
  O pacote deixa a chapa como padrão.

## O que estava estranho e mudou

- **p05b-remedios.** "CAVALGADA VIGOROSA" caía em cima da nota de rodapé, e
  "SANATÓRIO" ficava mais perto da linha de baixo que as outras: o acento
  empurrava a linha. A lista subiu 60 px e "SANATÓRIO" mais 13.
- **p06-boletim.**
  - O atlas passava por baixo do fim das linhas da citação ("the", "by",
    "can"). Agora ele é uma camada própria, a 78% e mais à direita.
  - O primeiro sublinhado vermelho cortava a linha de baixo. Os dois
    sublinhados agora ficam sob as suas linhas e se desenham logo depois
    delas.
  - As palavras grandes subiram 40 px: "LINHA DE FRONTEIRA" caía em cima da
    nota de rodapé.
- **p06b-mapa.** A legenda e a nota de rodapé, claras, ficavam sobre o papel
  claro do atlas e não se liam. Uma sombra suave sob elas resolve, e sai
  junto com o atlas.
- **p05-44anos.** A barra de 1899 a 1943 já estava inteira antes dos anos
  aparecerem. Agora ela cresce de 1899 a 1943 enquanto os anos entram
  (5674–5790). No fundo ficou o eixo cinza que ela cobria.
- **p01-abertura e p08-tabela.** Havia um tracinho creme solto sob a faixa:
  a peça de texto que viria depois dele está vazia. Ele saiu.
- **p13-cartela.** O tracinho de "INSCREVA-SE" ficava 17 px acima do meio da
  linha. Agora fica centrado e entra com ela.
- **p11-sem-fonte.** "ENTÃO EU NÃO VOU USAR" estava colado na linha de cima e
  desceu 18 px.
- **Letterings com acento.** Eles vinham posicionados pelo topo da tinta,
  então "VINTE ANOS DE OFÍCIO" ficava 25 px mais baixo que "ELE AUMENTA O
  VOLUME". Agora todos se alinham pela linha de base.
- **Clipe da cena 4** (`c04-B`).
  - Problema: os 19 primeiros quadros eram outro plano, com um menu do jogo
    na tela. Depois vinha um mergulho no preto até o quadro 31. Era a queda
    de brilho em 1:20 que a v1 apontou.
  - Correção: o clipe segura o quadro 32 durante esse primeiro segundo; a
    imagem ali está parada.
- **Clipe da cena 17** (`c17-J`). Ele tinha o contador da gravação ("62
  FPS") no canto de cima, à direita, do começo ao fim. Uma caixa de 100×32
  px recebe o céu de logo abaixo, do próprio clipe, com borda suave.

Os fundos alterados são gravados por `prepara-v3.py`, e o pacote original
fica intacto. Para preencher o buraco, o script usa o fundo liso de outra
chapa, do mesmo gerador de grão e vinheta. A diferença de baixa frequência
medida em volta do buraco é espalhada para dentro dele, então não fica
emenda.

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

`node ferramentas/quadros.mjs [--sem-clipes] 300 2780 9110 …` grava os
quadros em `out/quadros/`.

## Entrega

O master tem cerca de 1,7 GB, e o envio aceita no máximo 30 MiB por
arquivo. A entrega tem duas partes:

- **A prévia.** `bash ferramentas/previa.sh` gera um arquivo de até
  30 MiB: 640×360, x264 em duas passadas, áudio AAC de 80 kb/s. Ela sai da
  cópia de conferência feita aqui (`bash ferramentas/render.sh --rapido`,
  com x264 veryfast e CRF 18, que só serve para isso).
- **O pacote de render.** `python3 -I ferramentas/pacote.py
  ferramentas/LEIA-PRIMEIRO-pacote.txt` gera os zips
  `reddead-v3-parte-NN-de-NN.zip`, de até 29 MiB cada. O nome é diferente
  do pacote da v1, para os dois não se misturarem na mesma pasta. No outro
  computador:
  - `npm install`;
  - `node ferramentas/render.mjs`, que roda em Windows, macOS e Linux.
    Faz o master em x264 CRF 16 preset slow e acerta o atraso do AAC com o
    ffmpeg que vem com o Remotion.

Testei o pacote do zero:
- descompactei os 6 zips numa pasta vazia;
- rodei `npm ci`;
- rendi sete trechos com `render.mjs`.

O resultado sai em 1920×1080, com a cor etiquetada bt709 e o áudio.

O tamanho do master em CRF 16, medido nesses trechos, é de cerca de 1,7 GB:
- as chapas rendem de 9 a 16 Mb/s;
- os clipes rendem de 11 a 28 Mb/s.

É menos da metade da v1. O empurrão de escala parte do centro e mexe poucos
pixels por quadro, então comprime muito melhor que o deslize da v1, que
reamostrava a chapa inteira a cada quadro.

Com `--crf=18`, o master fica com cerca de 1,2 GB. Aqui, com 4 núcleos, os
trechos renderam a 4–6 quadros por segundo, o que dá cerca de 1h20 para o
vídeo inteiro.
