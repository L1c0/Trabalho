# Vinland Saga — briefing de montagem

Canal **@MangaEm60**. Ensaio em vídeo, 7min55,8s, 1920×1080, 30fps.
Narração pronta e travada. Falta montar a imagem.

---

## 1. A decisão de arquitetura, e por que ela não é negociável

**Python faz a prensa. O Remotion move a câmera. Nessa ordem.**

O visual inteiro sai de uma simulação de impressão (`prensa/prensa.py`):
papel com tom irregular e fibra, chapa que entra torta, ganho de ponto,
mordida de borda, pressão desigual, falha de tinta em mancha.

Isso **não pode** virar filtro de CSS no Remotion. Filtro de CSS é
uniforme por definição, e uniformidade é exatamente o que entrega imagem
gerada. Já foi testado e descartado.

**A regra que faz ou quebra tudo: a prensa roda UMA VEZ por cartela,
nunca por frame.** Se a semente mudar a cada frame, o papel ferve — o
grão pisca, a mancha anda, a falha troca de lugar 30 vezes por segundo.
Grão fervendo é o sinal mais óbvio de ruído aplicado em camada de vídeo.

Papel de verdade não muda. Só a câmera se move.

```
prensa/*.py                        Remotion
──────────────────────────         ────────────────────────────
imprime a cartela em 1,16x    →    <Img> da cartela pronta
do frame, uma vez só               câmera: escala + pan lento
                                   revelação: máscara por cima
                                   de pixel JÁ impresso
```

A revelação de tinta não re-imprime nada: descobre pixel que já estava
lá, com uma máscara que avança por um campo irregular. `prensa/movimento.py`
tem a implementação de referência e o `vin-prensa.mp4` mostra o resultado.

---

## 2. A linha do tempo

`src/data/timeline.ts` é a fonte da verdade. Os oito cortes caem em pausa
real da leitura, medida por `silencedetect` a −38 dB / 0,40 s no áudio
**cru** (medir no normalizado não funciona: está 10 dB mais alto e o
limiar deixa de alcançar os vales).

```
bloco                      frame    tempo    dura    papel
1  THORFINN EXISTIU            0    0:00    59,4s   guerra   #B3ABA0
2  A FONTE / HAUKR          1781    0:59    77,5s   perda    #B8B1A6
3  O MUNDO É HISTÓRICO      4105    2:16    61,8s   ferro    #BFB8AD
4  CEM SOCOS                5960    3:18    37,6s   fazenda  #C6C0B4
5  TOLSTÓI / 1893           7089    3:56    38,0s   socos    #CDC7BB
6  GANDHI DISCORDA          8229    4:34    43,7s   baltico  #D6D1C6
7  1021                     9540    5:18    64,9s   neve     #E2DFD6
8  JUNTA AS DUAS PONTAS    11488    6:22    92,9s   broto    #EDECE7
                           14274    7:55    FIM
```

**O papel clareia do bloco 1 ao 8.** Ninguém percebe de um corte pro
outro; aos oito minutos, sente. É a tese do vídeo acontecendo no fundo da
tela sem ninguém narrar: o ensaio sai do registro do fracasso e chega na
pergunta.

**Frame 7042** — ele diz "eu não tenho inimigos". O lettering do balão
tem que largar exatamente aí. Sobram 47 frames até o bloco 5 entrar: a
frase cai e corta.

---

## 3. O que já existe

```
public/manga/        19 quadros tratados, balão esvaziado, 2x Lanczos
public/cartelas/     as 8 cartelas de bloco, já impressas
public/grafico/      g01-anel-993.png — os anéis e a contagem até 1021
public/audio/        narracao.flac (-16 LUFS)  trilha.flac (-31 LUFS)
prensa/              o módulo + as fontes + os scripts que geraram tudo
src/theme.ts         papel, cartela, cor, grade
src/lib/             Quadro.tsx, movimentos.ts
src/scenes/          SemInimigos.tsx, CemSocos.tsx  (prontas, conferidas)
src/data/timeline.ts
```

### O vocabulário de movimento (`src/lib/movimentos.ts`)

Quatro movimentos, cada um tirado de uma coisa da obra. **Não acrescentar
preset de editor.** Parallax lento com screen shake aleatório é o visual
que todo canal do nicho usa, e esse canal vende o oposto.

- **sulco** — o arado. Linha reta, velocidade constante, SEM easing.
- **golpe** — o soco contado. Um pulso por soco, na cadência, decaindo
  soco a soco porque ele vai aguentando. É a única tremida do vídeo.
- **têmpera** — ferro quente na água. O contraste bate de chapado pra duro.
- **broto** — máscara que cresce de baixo, lenta, sem overshoot. Só no fecho.
- **empurrão** — 3,5% em 8 segundos. Se der pra ver o zoom, está grande demais.

---

## 4. Regras duras

**Quadro de mangá só entra sobre papel claro.** As PNGs são cinza com
papel branco e entram em `mixBlendMode: multiply` — o branco da página
vira o tom de papel da cena e só a tinta sobra, sem moldura e sem
recorte. Sobre base escura ou meio-tom isso achata o traço e a tela fica
cor de barro. Testado. Por isso `Quadro` só aceita tons de `papel`,
nunca de `cartela`.

**O preto trabalha nas cartelas de tipo**, que é onde ele é bom. A
cartela 4 é vazada: a tinta cobre a folha e a letra fica em reserva, então
a falha acontece em volta da letra e o branco sai riscado sem nenhum
filtro de distress.

**Nada de dourado.** Nada de vermelho sangue — o acento é ferrugem
`#7A3B22`, ferro que parou de ser arma. Nada de serifa com degradê e
brilho atrás.

**Tipografia:** EB Garamond (display e corpo), Oswald (rótulos, tracking
alto), Anton (numerais e vazados). **Não usar Cormorant** — o build dela
põe os acentos de agudo e circunflexo acima da altura de maiúscula, e o
roteiro é em português. Já foi trocada por causa disso.

**Grão:** desvio padrão local de luminância, filtro de média 5×5, escala
0–255, entre **6 e 8** em área lisa de papel. Medir, não estimar.

---

## 5. O que montar, bloco a bloco

Cada bloco abre com sua cartela (`public/cartelas/bloco-N.jpg`), que entra
por revelação de tinta e segura 2 a 3 segundos antes do primeiro plano.

**1 · THORFINN EXISTIU** (59,4s) — as sagas, Vinland, a briga, três anos,
a volta pra Islândia. Usar `v17-navios`, `v15b-leif-retrato`,
`v16-familia-capa`.

**2 · A FONTE / HAUKR** (77,5s) — bloco tipográfico. É aqui que a prensa
rende mais: compor as duas sagas em conflito como tipo. "SESSENTA HOMENS"
contra "CENTO E QUARENTA", lado a lado, uma apagando a outra.

**3 · O MUNDO É HISTÓRICO** (61,8s) — o que Yukimura inventou contra o que
manteve. Pede retratos de personagem. **Faltam assets** (ver §7).

**4 · CEM SOCOS** (37,6s) — o pico. `v07-arrancando-toco`,
`v08-maos-na-terra`, depois a cena `CemSocos` com a contagem, e fecha com
`SemInimigos`: a câmera entra no balão, escala 3,6, e as quatro palavras
caem no frame 7042.

**5 · TOLSTÓI / 1893** (38,0s) — tipográfico. O ano em ferrugem.

**6 · GANDHI DISCORDA** (43,7s) — a cartela já é duas colunas, porque a
discordância é o layout. Segurar nela boa parte do bloco.

**7 · 1021** (64,9s) — `g01-anel-993.png` animado: a régua conta os 28
anéis um a um, do marcado até a casca. Fecha na cartela do 1021.

**8 · JUNTA AS DUAS PONTAS** (92,9s) — retorno ao `v07-arrancando-toco`
(o campo arado dos dois lados), depois `v18-painel-final`, e a pergunta.
O movimento **broto** só aqui.

---

## 6. Áudio

```
narração   public/audio/narracao.flac    -16,0 LUFS   -1,6 dBTP   LRA 2,4
trilha     public/audio/trilha.flac      -31,0 LUFS  -15,1 dBTP   LRA 5,4
```

Somar as duas direto, **sem ducking** — 15 LU de separação já resolve, e
compressor de sidechain num ensaio narrado bombeia de um jeito que o
ouvido pega.

A trilha veio do Suno (3min40) e foi montada em leito de 7min56. São
quatro segmentos com cruzamento de potência constante de 8s, emendados
nos vales de energia da própria música (82s, 127s, 204s) e com pontos de
entrada diferentes a cada passada — material repete, cadência não. Os
cruzamentos caem em 2:06, 4:16 e 6:26 e foram medidos: não abrem buraco.

Cruzamento em cosseno, não linear: somar dois sinais descorrelacionados
em rampa linear derruba 3 dB no meio e se ouve como furo.

**Ela sai em dois momentos, e é pra isso que ela existe:**

| frames | o quê |
|---|---|
| 7004 – 7100 | a frase do capítulo 96, em silêncio absoluto |
| 14104 – 14274 | "e você, continuaria?" |

Os fades já estão gravados no arquivo. Não mexer.

Mix final conferida: somando as duas e limitando a −1,6 dBTP dá
**−15,9 LUFS / −1,6 dBTP / LRA 2,3**. É o alvo.

---

## 7. O que falta, e não dá pra inventar

**O material de imagem está completo.** 30 quadros de mangá, 1 foto,
1 gráfico, 8 cartelas.

No bloco 3, `v19-sweyn` cobre "Sweyn e Harald" numa imagem só: são dois
nomes numa respiração, dentro de uma lista, e trocar de plano entre eles
chamaria mais atenção do que não trocar.

**Resolução dos retratos.** Vários vieram de fontes pequenas (o pior,
`v14-thorkell`, com 429px). Sem prensa eles aguentariam 22% a 37% da
largura do frame. **Com prensa, testei a 65% e a cota de malha continua
nítida** — ganho de tinta, mordida e grão fazem o upscale ler como
impressão, não como JPEG mole. A única exceção é `v04b-thorfinn-escudo`,
com 235px de origem: só funciona pequeno, com tipo ao lado.

**L'Anse aux Meadows** está em `foto/h01-lanse-aux-meadows.png`, como
chapa, na mesma prensa que o mangá. **A licença ainda precisa ser
confirmada** — Wikimedia Commons em CC ou Parks Canada em domínio
público.

**Nenhuma imagem gerada por IA.** O diferencial declarado do canal é
pesquisa; imagem gerada anuncia o contrário antes do clique.

---

## 8. Render

```
1920×1080 · 30fps · h264 · CRF 16 · yuv420p · faststart
```

CRF baixo de propósito: grão e traço fino são as duas coisas que mais
sofrem com compressão, e são justamente o ativo aqui.

**Subir em 1440p.** O YouTube só entrega VP9 com bitrate decente acima de
1080p, e o grão desse vídeo come bitrate. Renderizar em 2560×1440 e deixar
o YouTube reduzir fica melhor do que entregar 1080p e ver o grão virar
bloco.

---

## 9. O que não fazer

- Rodar a prensa por frame (o papel ferve)
- Recriar a textura com filtro de CSS (fica uniforme)
- Pôr quadro de mangá sobre fundo escuro (vira barro)
- Acrescentar parallax, screen shake aleatório, glitch, light leak
- Trocar as fontes
- Usar dourado ou vermelho sangue
- Centralizar texto por padrão — a grade é esquerda 240, direita 180,
  topo 190, base 170, e o alinhamento varia de propósito entre cartelas
- Deixar as oito cartelas saírem do mesmo molde. Elas já são diferentes
  de propósito: template é a outra metade do que entrega imagem gerada,
  junto com o grão uniforme.
