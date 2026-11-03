# ANTES DA LENDA — Shorts de Vagabond · material para montar

**Remotion.** 1080×1920 · 30 fps.

| id | título | quadros | duração |
|---|---|---|---|
| S1 | SESSENTA E ZERO | 1729 | 57,6 s |
| S2 | O PÁSSARO | 1294 | 43,1 s |
| S3 | O QUE NUNCA EXISTIU | 1619 | 54,0 s |
| S4 | O REMO | 1482 | 49,4 s |

Toda a imagem já vem pronta e enquadrada. **Não reenquadra nada e não
inventa câmera.**

---

## >>> A REGRA MAIS IMPORTANTE DESTE PACOTE <<<

**NADA DE CÂMERA 3D. Nada de `rotateX`, `rotateY`, `perspective`,
`translateZ`, paralaxe ou `preserve-3d`.**

Eu tentei isso e saiu bugado. O enquadramento aqui já está assado nas
imagens; o que o Remotion precisa fazer é 2D e simples.

**O movimento que eu quero, e só ele:**

1. **Empurrão dentro do plano.** Cada `*-p*.jpg` tem **1350×2400**, que é
   1,25× do quadro. Mostra a 1080×1920 e, ao longo do plano, cresce de
   `1.00` para `1.05` ou desliza até 60 px. Como a imagem é maior que o
   quadro, isso **nunca amplia um pixel**.
2. **Corte seco entre planos**, com 4 quadros de ganho de opacidade. Sem
   dissolve longo.
3. **Entrada de cada peça de tipo:** 5 a 8 quadros, deslocamento de 20 px
   e opacidade. Sem mola, sem elástico, sem overshoot.
4. **A folha de papel não mexe** além de um empurrão de 2 a 3% ao longo
   do trecho. Ela é uma página, não um objeto no espaço.

Se bater dúvida entre fazer mais ou fazer menos: faz menos.

---

## O que tem na pasta

```
s1.mp3 … s4.mp3        a narração, já cortada e normalizada em −14 LUFS
s{n}-cena.json         a linha do tempo: quando entra cada plano e cada trecho de papel
s{n}-p*.jpg            os PLANOS DE IMAGEM, 1350×2400, já tratados
s{n}-l*.png            as LEGENDAS dos planos, com alfa
papel/s{n}-folha.jpg   a folha impressa (só o papel, sem tinta)
papel/s{n}-pos.json    a posição e o tamanho de cada peça na folha
papel/s{n}/*.png       as PEÇAS DE TIPO, recortadas da impressão, com alfa
```

### Como o papel funciona

A prensa rodou **uma vez por folha**. Cada peça em `papel/s{n}/` é um
recorte daquela impressão única, levando junto o alfa da densidade real
de tinta daquele pedaço.

Então: desenha `folha.jpg` e compõe as peças por cima, cada uma na posição
que o `pos.json` manda. Elas voltam a formar exatamente a impressão
original.

**Não imprime peça por peça e não põe camada de ruído por cima.** Se cada
peça tivesse a sua própria passada de prensa, cada uma teria o seu grão e
a sua mancha, e o papel ferveria quando elas entrassem uma a uma. Grão
fervendo a 30 quadros por segundo é o tell mais óbvio que existe. O grão
(medido: 6,96) já está impresso na folha.

### Como ler o `cena.json`

```json
"planos": [ [entra, sai, "plano", "legenda ou null", "o que é"] ],
"papel":  [ [entra, sai, "o que é"] ]
```

Os dois cobrem **100% da duração** de cada Short, sem buraco. A legenda
entra sobre o plano, no canto inferior esquerdo (x=135), em cima de uma
tarja de papel `rgba(205,199,187,0.93)` — a gravura é colorida e tinta
escura sumiria em cima dela.

---

## A ordem de entrada das peças de papel

Cada trecho de papel em `cena.json` cobre uma faixa de quadros. Dentro
dela, as peças entram **de cima para baixo na folha**, distribuídas pela
faixa, com 2 quadros entre letras do mesmo bloco e 8 a 14 quadros entre
blocos. Peça cujo id começa com:

| prefixo | o que é | como entra |
|---|---|---|
| `r*` | rótulo (Oswald, caixa alta) | letra a letra, 2 quadros de passo |
| `n*` | número de impacto (Anton) | dígito a dígito, 4 quadros de passo |
| `s*` | frase em serifa | varredura da esquerda, 10 quadros |
| `v*` `x*` | traço de contagem (só S1) | risca de cima pra baixo, 4 quadros |
| `eixo` `t*` `a*` `m*` | a régua do tempo (só S4) | eixo varre de cima, marcas estalam |
| `prancha` `colchete` | a pintura e o colchete (só S2) | ganho de escala de 1,04, 16 quadros |
| `fim` | a cartela | por último, sempre |

**S1 tem uma coisa especial.** Os 60 traços de contagem entram um a um ao
longo do trecho. Depois, **48 deles saem** e sobram 12 — que são duas
contagens inteiras mais dois traços soltos. Os que ficam:

```
v000 v001 v002 v003 x00   v010 v011 v012 v013 x01   v020 v021
```

Os outros 48 saem escalonados de 2 em 2 quadros, com 14 quadros de
opacidade cada. Isso tem que acontecer **antes** da peça `n12` entrar.
Se sobrar 10 em vez de 12, a narração vira mentira.

---

## O estilo, em seis regras

Tirado do `theme.ts` dos Shorts de Houseki, que é a casa.

1. **O fundo é PAPEL, sempre.** Nunca escuro, nunca cartão flutuando.
2. **Uma família por função:** Anton no impacto, Oswald no rótulo (caixa
   alta, entreletra 0,19), EB Garamond na serifa minúscula. **Nada de
   Playfair** — contraste alto demais, lê como capa de revista.
3. **Ferrugem `#7A3B22` é a única cor**, e entra em no máximo um elemento
   por Short. No S3 é a palavra GANRYŪ.
4. **Margem esquerda 135 é a espinha.** Nada é centralizado, nunca.
5. **Corpo de texto em escala de livro.** Se o espectador tem que apertar
   o olho, ótimo: é o que ele faz com um livro.
6. **Preto puro é proibido.** A tinta é `#14120E`.

---

## O que eu conferi (e o que isso evitou)

- **Nenhum plano amplia.** Todos os 15 saem de pixel que existe na fonte,
  entre 0,32× e 0,99×. A primeira versão tinha 13 de 14 ampliando, uma
  delas 3,4× — ia entregar mingau.
- **Cobertura de 100%** da duração nos quatro, sem buraco. A versão
  anterior do S4 rodava 30% da narração com a tela muda, incluindo um
  trecho de 10,7 segundos seguidos.
- **Os tempos vêm das fronteiras de fala medidas no mp3**, não de
  estimativa. Na versão anterior o "164" entrava 88 quadros antes de ele
  dizer "cento e sessenta e quatro".
- **Nenhuma peça de tipo vaza da caixa útil** (x 72–1008, y 150–1540).
- **Áudio:** os quatro em −14 LUFS / −1,5 dBTP, e a duração bate
  quadro a quadro com a composição, folga zero.

---

## Duas coisas pra confirmar antes de publicar

**1 · A ficha da gravura.** `s4-p*.jpg` saem de um tríptico de época do
duelo em Ganryūjima (3840×1950) que veio do pacote do vídeo longo **sem
ficha**. Antes de publicar é preciso saber o artista e a data, pra
creditar. Eu não credito o que não sei.

**2 · O arquivo `l04-monumento-CONFIRMAR.jpg` não é um monumento.** É uma
página de mangá. Eu quase entreguei ela legendada como "Monumento de
Kokura". Está fora deste pacote. Se você tiver uma foto confirmada do
monumento de Kokura, ela entra no S1, no trecho da segunda fonte.

---

## Trilha

**Estes quatro estão sem música**, só a narração. A diretriz da casa é
música mais a voz, sem efeito sonoro. Quando a faixa licenciada chegar,
eu remonto o áudio e reajusto os tempos — os números de quadro deste
pacote estão amarrados nas pausas da fala, então não dá pra trocar o mp3
sem me avisar.
