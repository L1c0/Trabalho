# Houseki no Kuni — ensaio em vídeo, 9 minutos

Projeto Remotion. 1920x1080, 30fps. Ensaio filosófico sobre o Navio de
Teseu, montado em cima do mangá da Haruko Ichikawa.

Narração em português já gravada, em `public/audio/`. **A narração manda
em tudo** — ela entra no frame 0 e vai até o fim, e todo corte do filme
cai numa pausa dela.

---

## A ideia central, em uma frase

**O papel é o Phos.**

O fundo do filme não é "um fundo bege bonito". Ele começa no verde da
fosfofilita e vai sendo contaminado pela cor de cada material que entra
no corpo da personagem — ágata, ouro, lápis, pérola, prata, mercúrio —
até chegar num neutro sem cor nenhuma no bloco final.

Está tudo em `src/theme.ts`, na constante `papel`.

Ninguém vai reparar. Todo mundo vai sentir. Se você fizer só isso certo,
o filme funciona.

A transição entre dois estados **nunca é um corte**. É interpolação lenta
de 90 a 150 frames, atravessando o bloco inteiro.

---

## Estilo de edição: livro, não vídeo

Isto aqui não é motion graphics. É **paginação**.

- Cada elemento fica na tela de **4 a 9 segundos**. Nada pisca.
- **Corte seco entre tudo.** Sem transição, sem fade, sem wipe.
- Movimento permitido: **um só** — deriva lenta de escala, de 100% a
  103% ao longo de um plano inteiro. Nada mais.
- **Vazio é conteúdo.** Existem momentos de papel vazio com narração por
  cima. Eles são obrigatórios. Não preencha.
- Nada é centralizado. A margem esquerda é a espinha (240px), a direita
  respira (180px).

**PROIBIDO:** spring, bounce, parallax, partícula, flash, glitch, blur de
transição, zoom rápido, kenburns agressivo, texto que entra letra por
letra, barra de progresso, qualquer coisa que pulse na batida.

Se você está em dúvida se um movimento é demais, é demais.

---

## O preto é racionado

`cor.tinta` (`#221F1B`) é o preto padrão do filme — preto quente, nunca
puro.

`cor.preto` (`#000000`) pode aparecer em **exatamente três momentos**,
marcados em `src/data/timeline.ts`. Em nenhum outro lugar. Se usar em um
quarto, os três perdem o efeito.

---

## Instalar

```bash
npm create video@latest houseki     # template "Blank"
cd houseki
npm i @remotion/google-fonts
```

Copie `src/` e `public/` por cima.

```bash
npx remotion studio
```

---

## Estrutura

```
public/
  manga/      21 quadros, PB opaco, balões já esvaziados
  classico/   10 pranchas, CINZA + ALFA (ver aviso abaixo)
  audio/      narração e trilha
src/
  theme.ts            cor, fonte, escala, grade, o papel
  data/assets.ts      catálogo de todas as peças, com nota de uso
  data/timeline.ts    a montagem, frame a frame
  lib/                os componentes
  Ensaio.tsx          encadeia
  Root.tsx            a composição
```

### AVISO sobre `public/classico/`

Esses 10 arquivos são **LA (cinza + alfa)**. Eles **não têm cor**.

A cor é aplicada pelo componente `<Tingido>`, que mapeia o cinza no
gradiente `cor.tinta → papel atual`. É isso que faz uma prancha do século
XVII acompanhar a mudança de cor do papel ao longo do filme.

Se você jogar um desses num `<Img>` cru, sai cinza morto e errado.

Os 21 de `public/manga/` são opacos e normais.

---

## Os componentes

Tamanhos e posições são **obrigatórios**, não sugestões. O erro clássico
aqui é deixar tudo pequeno demais e o filme virar PowerPoint.

### `<Papel>`
Fundo de tela cheia. Lê o estado atual de `papel` e interpola. Por cima
de tudo, inclusive do papel vazio, uma camada de grão regenerada a cada
frame — grão estático vira textura e aparece.

**A força do grão tem um número, não uma porcentagem.** Numa área de
papel vazio, o desvio padrão local da luminância (depois de remover a
tendência com um filtro de média 5x5) tem que ficar **entre 6 e 8** na
escala 0–255. Abaixo de 3 o papel fica morto e as imagens parecem
coladas por cima dele; acima de 10 vira chuvisco. Meça, não estime.

### `<Painel>` — para os quadros de mangá
Desenha o quadro com uma moldura de 2px em `cor.tinta` e 20px de respiro
branco interno.

Ocupa **55% a 78% da altura da tela**. Um quadro de mangá menor que isso
não se lê. Posição alternando entre três âncoras ao longo do filme:
esquerda-alta, direita-baixa, centro-alto. Nunca duas seguidas na mesma.

Para os arquivos muito estreitos (`phosVertical`, 932x2922) use a
altura total menos as margens e deixe a largura cair onde cair.

### `<Tingido>` — para gravura e prancha
Recebe uma peça de `classico/`, aplica o duotone contra o papel atual,
e desenha **sem moldura nenhuma**. Gravura pousa direto no papel;
prancha flutua com a borda já esfumada no arquivo.

Pranchas de retrato ocupam **45% a 60% da altura**. O Leviatã é a
exceção: começa em 70% e sobe até 150% ao longo de 14 segundos (frames
2060 a 2480 — o `timeline.ts` manda), com a gravura **sangrando para
fora da tela nos quatro lados** no fim do movimento e o torso do gigante
um pouco acima do centro. Nenhuma faixa de papel sobrando em volta: a
150% o espectador tem que se sentir *dentro* da gravura, não olhando
para ela. É o único zoom longo do filme, e é o que revela que a armadura
dele é feita de gente.

O arquivo do Leviatã tem 1379x2200, mas foi ampliado de uma fonte de
960px — o teto real de detalhe é mais baixo do que a contagem de pixels
sugere. Confira que os bonecos da armadura continuam legíveis no fim do
movimento; se não estiverem, reduza o alvo de 150% para 130% em vez de
abrir mão do sangramento.

### `<Regua>` — a escala de Mohs
Componente, não imagem. Régua horizontal de 1 a 10, margem esquerda em
240, largura até 1680, linha de base em y=640.

Marcadores em: cinábrio 2,25 · fosfofilita 3,5 · lápis 5,25 · ágata 6,75
· diamante 10. Fosfofilita e diamante em `cor.tinta` com haste alta e
rótulo em caixa; os outros três em `cor.fraco`, haste baixa, caixa baixa.

Os números **3,5** e **10** entram em corpo 72 acima dos marcadores,
contando de 0 até o valor em 20 frames. Os outros três não têm número.

Rodapé em `cor.fraco`, corpo 26, na margem esquerda:
*"a pérola não entra na escala: não é mineral. aragonita colada com
proteína, feita por um animal."*

Existe um mockup de referência: `mockup-mohs.png`.

### `<Tres>` — o tríptico das três espécies
Três peças lado a lado, entrando **uma por vez** conforme a narração
nomeia cada uma:

```
carne  →  admirabilis
osso   →  elenco        (a única imagem colorida do filme)
alma   →  descida
```

Cada uma com seu rótulo em caixa alta, corpo 30, entreletra 0.22em,
abaixo da imagem. Largura de 28% da tela cada, com 4% de intervalo.

### `<Citacao>`, `<TituloBloco>`, `<Grao>`
Texto em Cormorant, alinhado à esquerda na margem de 240. Título de bloco
em corpo 64, sozinho no papel vazio por 3 a 4 segundos. São sete ao longo
do filme e funcionam como metrônomo.

---

## Áudio

```
public/audio/narracao.mp3    8min42 · 15.671 frames · −15,8 LUFS · −1,8 dBTP
```

Entra no frame 0 e vai até o fim. **Já está tratada e já está no tempo
certo** — normalizada, limitada, e com os dois silêncios inseridos. Não
reprocesse, não corte, não acelere.

```
public/audio/leito.mp3       leito de sala, −50 LUFS, roda o filme inteiro
public/audio/trilha1.mp3     149s, entra no frame 59
public/audio/trilha2.mp3     190s, entra no frame 4750
public/audio/trilha3.mp3     97s,  entra no frame 10491
public/audio/papel.mp3       1,1s, nas sete cartelas de bloco
```

**Todos já estão no nível final de mixagem.** Toque tudo com volume 1.0
e não aplique ganho, ducking nem compressão — a mixagem está feita. A
tabela completa, com frame de entrada e duração de cada um, está em
`timeline.ts`, na constante `som`.

O **leito de sala** é o arquivo que ninguém lembra de fazer e é o que faz
os silêncios funcionarem. Ele roda sempre, abaixo do limiar consciente, e
**sai junto nos dois silêncios absolutos**. Sem esse chão de ar, silêncio
digital soa como falha de arquivo e o espectador acha que o vídeo travou.

**A trilha sai por completo no frame 13399** (início do bloco anatta).
Os últimos 75 segundos são só a voz, o leito e um som de papel.

**Os dois silêncios absolutos já estão dentro do mp3** — frames
10438–10492 e 15454–15502. Eles não existiam na gravação; foram
inseridos na edição. Não preencha com nada, nem com trilha, nem com
ambiente.

Uma observação: o LRA da narração é 3,0, bem abaixo dos 5–9 de uma fala
natural. O arquivo veio de um processo de "aprimoramento" que já tinha
achatado a dinâmica antes de chegar aqui, e isso não se recupera. Não
tente comprimir mais — só pioraria.

---

## Entrega

`npx remotion studio` e me diga a URL.

Antes de renderizar o filme inteiro, renderize **três trechos** para
aprovação — os intervalos estão no fim de `timeline.ts`:

1. a abertura, para eu ver o papel verde e o primeiro quadro
2. o zoom do Leviatã, que é o plano mais arriscado do filme
3. o bloco do anatta, para eu ver o papel já neutro

Se o papel sair bege-amarelado em vez de verde na abertura, o problema é
que alguém "arrumou" a cor achando que estava errada. Não está. É
fosfofilita.

---

## Direitos

Os 21 quadros são do mangá da Haruko Ichikawa, uso em ensaio com
comentário próprio. As 10 pranchas clássicas são domínio público.

Nenhum quadro de mangá pode ficar em cena sozinho, sem narração por
cima, por mais de 4 segundos. Os dois silêncios absolutos caem em papel
vazio ou em imagem abstrata, nunca em cima de um quadro.

---

Os quatro Shorts estão em `SHORTS.md` e `src/data/shorts.ts`.
