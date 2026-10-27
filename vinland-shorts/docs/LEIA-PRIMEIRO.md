# Vinland — quatro Shorts verticais

Canal **@MangaEm60**. Montar quatro Shorts **1080×1920, 30 fps** em
Remotion. Narração gravada, cortada e normalizada. As chapas impressas vêm
prontas, como **camadas com alfa**. Falta a câmera.

| | Short | mecanismo | duração | frames |
|---|---|---|---|---|
| 1 | A CONTAGEM | acumula | 26,03 s | 781 |
| 2 | O ANEL | atravessa | 42,05 s | 1261 |
| 3 | AS DUAS SAGAS | sobrepõe | 41,90 s | 1257 |
| 4 | A OFICINA | subtrai | 40,43 s | 1213 |

---

## A divisão de trabalho, e o erro que ela corrige

```
Python (feito)                    Remotion (a fazer)
──────────────────────────        ──────────────────────────
imprime cada chapa UMA vez   →    compõe as camadas
entrega PNG com alfa              move a câmera
                                  escala, profundidade, impacto
```

**Eu já tentei montar isso compondo frames em numpy e ficou estático.**
Três dos quatro não tinham câmera nenhuma: eram camadas aparecendo e
sumindo num quadro fixo. O problema não era a chapa, era não ter câmera.
Numpy não dá acesso a escala contínua, profundidade, nem impacto por
frame. É por isso que isto vai para o Remotion.

**A regra que não muda:** a prensa rodou uma vez por peça e está
congelada no PNG. Se qualquer textura for regerada por frame, o papel
ferve e entrega que é filtro. O papel não muda. **Só a câmera se move.**

---

## Vocabulário de movimento

Quatro movimentos. Nenhum deles é preset de editor.

### `batida` — o impacto da prensa
Escala de **1,18 → 1,00 em 3 frames**, parada dura. **Sem mola, sem
overshoot, sem bounce.** Uma prensa bate e para; ela não quica.

No mesmo instante, o quadro inteiro desloca **2 a 4 px** e volta em 2
frames. Direção alternando lado a lado, nunca sorteada. É a única tremida
permitida.

### `assentar` — a peça indo para o arquivo
A camada que sai do centro **viaja** até a posição de arquivo em 5 frames,
perdendo tinta de 1,0 para 0,30 no caminho. Nunca corta.

### `travessia` — velocidade constante
Linear, **sem easing em nenhuma ponta**. É uma medida, não um efeito. Se
der pra sentir aceleração, está errado.

### `recuo` — profundidade
Camada que sai de foco **não borra**: ela recua. Escala para 0,94 e tinta
para 0,45. Quem está lendo vem para 1,00.

---

## 1 · A CONTAGEM — 781 frames

**Pastas:** `1-contagem/` · papel em `comum/papel-socos.jpg`

```
num-001.png … num-100.png    o numeral da vez, grande, com alfa
arq-001.png … arq-100.png    o mesmo numeral pequeno, para o arquivo
posicoes.json                onde cada um assenta na grade 10×10
cartela.png                  VINLAND SAGA · CAPÍTULO 96
frase.png                    EU NÃO TENHO INIMIGOS, em ferrugem
```

**Sincronia, medida na narração:**

| frame | o quê |
|---|---|
| 0 | só o papel e a cartela |
| 207 | começa a contagem ("o Yukimura desenha a contagem") |
| 525 | o **100** cai, exatamente em "no fim" |
| 525–645 | página cheia, nada se move |
| 645 | "eu não tenho inimigos" — a frase |
| 714–781 | a pergunta |

**A câmera:**

- Cada numeral entra com **`batida`**. Noventa e cinco batidas em 10,6 s
  são ~9 por segundo: o impacto tem que ser curtíssimo ou vira vibração.
- O numeral anterior **`assenta`** na posição do `posicoes.json`.
- **A câmera recua conforme a página enche:** escala de **1,06 → 1,00**
  ao longo das cem batidas, linear. O quadro abre espaço para o acúmulo.
  Ninguém percebe acontecendo; aos cem, sente.
- Nos **cinco últimos** (frames 495–525) a batida fica mais lenta e mais
  pesada: 5 frames em vez de 3, deslocamento 5 px.
- Na frase: o arquivo inteiro **`recua`** para 0,26 de tinta enquanto a
  `frase.png` entra em 1,00 vindo de 1,08, com uma batida final.

---

## 2 · O ANEL — 1261 frames

**Pastas:** `2-anel/`

```
anel-9000.jpg    a chapa alta: 1080×9000, impressa uma vez
anel.json        posicao das 28 bordas e do marcador de 993
ano-0993.png … ano-1021.png    os 29 numerais do contador
regua.png        a linha de medicao fixa + o rotulo
```

**Sincronia:**

| frame | o quê |
|---|---|
| 0–660 | **quase parado.** Câmera de y=0 a y=60 |
| 660 | começa a **`travessia`** ("contaram para fora") |
| 660–915 | 28 bordas cruzam a linha. Um tique cada |
| 915 | **para seco** em 1021 |
| 915–1261 | parado, com empurrão lento |

**A câmera:**

- A chapa vive num plano com **`rotateX` de 5°** e `perspective: 2600`.
  A travessia ganha paralaxe real: a borda de baixo passa mais rápido que
  a de cima. É a chapa inclinada sob uma lente, não um scroll.
- **`travessia` linear**, sem easing nas pontas. A parada é um corte de
  velocidade, não uma desaceleração.
- Deriva lateral de **1,5% da largura** ao longo da travessia, para não
  ser scroll puro.
- O contador **corta**, não dá fade, e leva **1 px de solavanco** a cada
  troca.
- Depois da parada: empurrão de **3% em 11 s**, constante.
- Os 22 segundos parados do começo **não são tempo morto.** São a tensão
  que faz a travessia significar alguma coisa. Resistir à vontade de
  animar ali.

---

## 3 · AS DUAS SAGAS — 1257 frames

**Pastas:** `3-sagas/` · papel em `comum/papel-sagas.jpg`

```
cabecalho.png  divisor.png
esq-60.png     dir-140.png
esq-credito.png  dir-credito.png
200-anos.png   haukr.png  (ferrugem)
```

**Este era o pior dos quatro.** Era tipo aparecendo num quadro fixo. O que
ele precisa é de **profundidade**, e ela não é enfeite: é o argumento.

**A câmera:**

- As duas colunas ficam em **planos diferentes**. A esquerda a
  `translateZ: 0`, a direita a `translateZ: -40`. Com `perspective: 2400`
  e uma **deriva lateral lenta de 2% ao longo dos 42 s**, elas se separam
  visivelmente. Duas fontes que não ocupam o mesmo plano.
- **Frame 282 — o desregistro.** A `dir-140` desce *em Z*: escala de
  **1,03 → 1,00** enquanto translada **−468 px em x e +19 px em y** em 21
  frames, e pousa com **`batida`**. Não é um deslocamento lateral: é uma
  chapa descendo e encostando.
- **Frame 432** — o mesmo com `dir-credito`, 17 px.
- **Frame 627** — `haukr` entra: as colunas inteiras **`recuam`** (0,94 de
  escala, 0,45 de tinta) e o nome vem de 1,08 para 1,00. A profundidade
  faz o trabalho que um fade faria mal.
- Entre os eventos, **empurrão de 2% a cada 10 s**. Nunca parado de todo.

---

## 4 · A OFICINA — 1213 frames

**Pastas:** `4-oficina/` · papel em `comum/papel-oficina.jpg`

```
casa-1.png … casa-8.png        cada construcao, camada propria
mascara-1.png … mascara-8.png  o ruido de descolamento de cada uma
casas.json                     posicao e tamanho
rotulo.png  achados.png  fecho.png  (ferrugem)
```

**A câmera:**

- A planta está **numa mesa**: `rotateX` de **11°** no frame 0,
  `perspective: 2200`. Ao longo dos 26 s de espera a câmera **sobe**, e o
  ângulo vai de 11° para **4°** — no fim estamos olhando de cima. O
  movimento é lento demais para ser notado e muda tudo.
- **Frame 777** (25,9 s): começam a sair, **uma a cada 15 frames**.
- Cada casa sai pela sua `mascara-N.png`: a tinta **descola em mancha**,
  não dá fade. A máscara avança como limiar sobre o ruído, em 14 frames.
  Junto, a camada **sobe 6 px** — a chapa sendo levantada.
- Quando a última sai (frame ~900), **segura o papel vazio por 18
  frames** antes do fecho. O vazio precisa de tempo; é ele o conteúdo.
- `fecho.png` entra com **`batida`** e a câmera dá um empurrão de 2%.

---

## Áudio

```
audio/1-contagem.mp3   audio/2-anel.mp3
audio/3-sagas.mp3      audio/4-oficina.mp3
```

Normalizados em **−16,0 LUFS / −1,5 dBFS** antes da codificação. Medidos
depois do MP3 a 192 kbps dão **−16,2 a −16,3 LUFS, pico −1,7**: o
codificador desloca essa fração. Está dentro da tolerância de qualquer
plataforma. **Não normalizar de novo** — renormalizar só empilha mais um
passo de ganho.

Vieram em MP3 e não FLAC porque a gravação original já é MP3: o teto de
qualidade estava posto na origem e FLAC só multiplicaria o tamanho
preservando os artefatos.

**Atenção ao sincronismo.** O MP3 carrega padding de codificação de uns
24 ms no início, e as durações medem 1 a 2 frames a mais que o FLAC de
origem. Os números de frame desta especificação saem do **FLAC**:

| | frames (FLAC) | duração MP3 |
|---|---|---|
| contagem | 781 | 26,09 s |
| anel | 1261 | 42,19 s |
| sagas | 1257 | 41,93 s |
| oficina | 1213 | 40,49 s |

Um frame de desvio é imperceptível em tudo aqui, inclusive na contagem a
nove batidas por segundo. Se preferir cravar, alinha pelo primeiro ataque
de voz em vez do início do arquivo.

**Efeitos a acrescentar**, da paleta da prensa:

| efeito | onde | pico |
|---|---|---|
| batida de chapa | cada numeral da contagem | −24 dBFS |
| tique de madeira | cada anel que cruza a linha | −22 dBFS |
| chapa pousando | os dois desregistros das sagas | −20 dBFS |
| papel levantando | cada casa que sai | −26 dBFS |

Ruído filtrado em banda estreita, nunca click digital. **Nada de whoosh,
riser ou impacto com sub-grave.**

Trilha e leito de sala: eu monto depois da montagem fechar.

---

## O que não fazer

- Regerar textura por frame. O papel está congelado no PNG.
- Mola, bounce, overshoot. A prensa bate e **para**.
- Tremida aleatória. Só na batida, 2 a 4 px, direção alternando.
- Borrar para simular profundidade. Profundidade é escala e tinta.
- Animar os 22 segundos parados do anel.
- Fade onde está escrito corte.
- Cormorant.

---

## Legenda e zona segura

Legenda queimada obrigatória: **EB Garamond 500, corpo 40**, entre
`y=1330` e `y=1430`, `#2A2622` a 80%.

Zona útil: `x` de 72 a 1008, `y` de 150 a 1540.

---

## Render

```
1080×1920 · 30 fps · h264 · CRF 17 · yuv420p · faststart
```
