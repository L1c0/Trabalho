# Vagabond — briefing de montagem

Canal **@MangaEm60**. Ensaio em vídeo, ~9 min, 1920×1080, 30 fps.
Roteiro escrito e verificado (`vagabond-roteiro.md`, fontes em
`vagabond-FONTES.md`). Narração ainda não gravada.

---

## 1. Por que este vídeo não é o Vinland

O Vinland é **prensa**: papel parado, tinta seca, chapa que entra torta,
câmera deslizando sobre superfície impressa. Aquilo serve a uma obra sobre
registro histórico, documento, saga escrita.

O Vagabond é **pincel**. O Inoue desenha com nanquim de verdade — a
mancha, o sangramento na fibra, o traço que seca e falha são a obra. E a
imagem que abre e fecha o vídeo, o *Koboku Meigekizu*, é tinta sobre papel
feita pela mão do próprio Musashi. É o mesmo meio, separado por
trezentos e oitenta anos.

Então a `prensa.py` **não entra aqui**. O que entra é tinta molhada.

Três decisões de arquitetura, nesta ordem de importância:

```
1  PARTITURA DE COR   a estrutura. A tese acontece na cor.
2  GRAMÁTICA DE TINTA  a transição. Sangramento, não revelação.
3  PROFUNDIDADE        raro, caro, reservado a três ou quatro momentos.
```

---

## 2. A partitura de cor

**É isto que carrega a tese, e ninguém precisa narrar.**

O roteiro conta camadas de invenção empilhadas sobre um homem: a pedra do
filho adotivo em 1654, o Niten-ki em 1776, o kabuki por volta de 1730, o
romance do Yoshikawa em 1935, o mangá em 1998. Quanto mais longe do homem,
mais espetáculo.

O material já vem assim. As quatro gravuras do Kuniyoshi e companhia são
**cor saturada**: baleias, salamandras gigantes, plateias, céu vermelho. O
*Koboku Meigekizu* é **cinza**, com três quartos do papel vazio.

Então o vídeo é uma curva de saturação:

| bloco do roteiro | saturação | o que domina a tela |
|---|---|---|
| a pintura, abertura | **0%** | *Koboku Meigekizu*, quase vazio |
| ele existiu / registros Hosokawa | 0–10% | papel, documento, tipografia |
| os sessenta duelos, pela mão dele | 10% | o texto do Go Rin no Sho |
| **"escreveu o final em duas frases"** | **0%** | volta ao cinza por um instante |
| o romance do Yoshikawa, 1935 | 35% | capa, jornal, a cor entrando |
| as fontes se contradizem | 60% | gravura de Ganryūjima |
| o remo, o atraso, o Niten-ki 1776 | 80% | a salamandra |
| o nome vem do kabuki, 1730 | **100%** | **a baleia** — pico absoluto |
| a caverna, o livro, o Dokkōdō | 45% → 15% | a cor drenando |
| o Inoue parou | 10% | quase cinza |
| **fecho: o picanço** | **0%** | o mesmo quadro da abertura |

A saturação **nunca sobe de volta depois do pico da baleia.** Ela drena e
não retorna. É o vídeo saindo da lenda e chegando no homem.

**O corte que é a tese inteira:** da baleia do Kuniyoshi, em cor cheia,
**direto** no picanço cinza. Corte seco, sem transição, sem fade. Duzentos
anos de invenção de um lado, a mão do homem do outro, em um quadro. Esse
corte vale mais que qualquer efeito do vídeo.

### Paleta

Tirada do material, não escolhida:

```
washi       #D9D4C6  envelhecido      →  #E8E4DA  limpo
sumi cheio  #1A1714   (nanquim não é preto puro: é quente diluído)
sumi diluído em cinco passos até #BDB8AE
vermelhão   #9E3B2E   o carimbo hanko — está em TODAS as peças, inclusive
                      no canto do Koboku Meigekizu
```

**O vermelhão é o único acento, e ele é real.** Nada de dourado, nada de
vermelho sangue. Quando o roteiro dá uma data, ela sai em vermelhão,
porque é a cor do selo que carimba um documento.

---

## 3. A gramática de tinta

### Sangramento, não revelação

No Vinland a tinta é **descoberta**: uma máscara avança sobre pixel que já
estava impresso. Aqui ela **chega**: a tinta entra no papel úmido e se
espalha pela fibra.

A diferença que decide se funciona é a **borda molhada**. Tinta de verdade
acumula pigmento na frente do avanço — a borda fica mais escura que o
miolo. Sem isso é limpeza de tela; com isso é aquarela.

```
campo de chegada t(x,y) = distância geodésica a partir do ponto de
  entrada da tinta, com o custo modulado por ruído multi-oitava
  (a fibra do papel: a tinta corre mais rápido em alguns caminhos)

no quadro T:  tinta  = t < T
              borda  = |t - T| < w     → escurece 18 a 26%
              miolo  = t < T - w       → densidade normal
```

Entre 14 e 22 frames do nada ao completo. Mais rápido que isso vira
transição de editor.

### Kasure — o pincel seco

Quando o pincel fica sem tinta ele deixa estrias no traço. É a assinatura
visual do Inoue e está no *Koboku Meigekizu*, no galho longo que desce.

Onde o traço do mangá já tem kasure, **não mexer**. Onde o vídeo gera
traço novo (um sublinhado, uma seta, um colchete), ele tem que ter kasure
também, senão denuncia que é vetor.

### Profundidade por densidade, não por desfoque

Em sumi-e, longe é aguada clara e perto é tinta cheia. **Nada de
profundidade de campo**. Se um plano precisa recuar, ele recua diluindo,
não borrando.

---

## 4. Profundidade: raro e caro

A prova (`vag-parallaxe.mp4`) mostra o movimento funcionando no tríptico
de Ganryūjima. Mas ela também provou uma coisa negativa que decide o
planejamento:

**Não existe separação automática.** Testado: exigindo que a máscara de
primeiro plano esteja ligada à borda superior, ela zera — os galhos não
formam componente conectada. Afrouxando o limiar, ela invade o mar. Em
ukiyo-e o escuro é o contorno de *tudo*: mar, quimono, cabelo, traço. Toda
máscara de profundidade é **recorte à mão**.

Consequência: profundidade é recurso de virada, não padrão. Três momentos,
no máximo quatro:

1. **A chegada em Ganryūjima** — os galhos de pinheiro à frente, os dois
   lutadores, a plateia nos barcos, o mar, a faixa vermelha ao fundo.
2. **A baleia** — o tríptico do Kuniyoshi tem o animal ocupando o quadro
   inteiro e o Musashi minúsculo nas costas dele. A separação é óbvia e o
   efeito é o pico do vídeo.
3. **O fecho no picanço** — aqui a profundidade é quase nula de propósito:
   o galho à frente, o papel vazio atrás, e dois por cento de deriva. Mal
   se percebe, e é isso que faz o vazio respirar.

Limites: nenhum plano passa de **13% de ganho de escala** no movimento
inteiro, e a deriva horizontal fica abaixo de 3,5% da largura. Se der pra
ver que é paralaxe, está exagerado.

### O resto do vídeo é câmera paciente

Olhando os frames do vídeo de referência de novo: o Buda e o prato de
porcelana são **empurrão lento sobre imagem chapada**, sem separação
nenhuma. O que faz aquilo parecer caro não é profundidade, é paciência e
enquadramento.

```
empurrão   4 a 7% em 8 a 14 segundos, velocidade constante, sem easing
deriva     lateral lenta, nunca diagonal
corte de escala  cortes secos na mesma imagem em escalas diferentes —
                 aberto, detalhe, aberto. Gramática de livro, não de timeline.
```

---

## 5. Tipografia

Mesmas fontes do canal: **EB Garamond** (display e corpo), **Oswald**
(rótulos, tracking 0,22em), **Anton** (numerais e datas). Não trocar.

**Mas o peso muda.** No Vinland o Anton carrega. Aqui o assunto é um livro
e um pincel, não uma prensa — então a **EB Garamond carrega** e o Anton
aparece só em data e número: 1645, 1654, 1776, 327, onze anos.

Data sempre em **vermelhão**, nunca em preto.

**Acento e cedilha sempre.** As quatro fontes têm todos os glifos; o
excesso de altura do acento fica entre 19 e 31 px em corpo 120, bem
diferente dos 70 da Cormorant. Mas isso muda a altura da linha, então
empilhamento sai de `caixa_tinta()`, nunca de passo fixo.

---

## 6. As imagens que existem, e o que cada uma é

**Cinco das seis são lenda. Uma é prova.** Isso não é problema: é o vídeo.

| arquivo | o que é | uso |
|---|---|---|
| tríptico Ganryūjima, 3840×1950 | ukiyo-e séc. XIX. Musashi saltando, plateia em barcos. Cartuchos: 宮本無三四 e 佐々木岸柳 | bloco das fontes que se contradizem. **Leva profundidade.** |
| baleia, tríptico 3200×1559 | Kuniyoshi. Musashi minúsculo nas costas do animal | **pico de saturação. Leva profundidade.** |
| salamandra, 1620×2356 | Kuniyoshi, série *Honchō Suikoden*. Caverna entre Echizen e Mino | bloco do Niten-ki |
| monge com espelho, 687×1024 | Kuniyoshi. Pequena — só em plano fechado | bloco do Yoshikawa |
| **Koboku Meigekizu, 885×2048** | **a única feita pela mão do Musashi** | **abertura e fecho** |

Nos cartuchos ele aparece como **宮本無三四**, a grafia teatral, não a
histórica. Isso é o kabuki virando imagem, e vale uma marcação na tela
quando o roteiro chega no nome.

### Resolução do Koboku Meigekizu

885×2048 parece pouco mas não é, porque a pintura é vertical (125,5 × 54,3
cm) e num quadro de 1080 de altura ela entra pela altura: 2048 → 1080 é
**redução**, não ampliação.

O limite é o detalhe: ampliar no picanço sozinho só aguenta cerca de
**1,9×** antes de amolecer. O fecho tem que ser composto sabendo disso —
o plano fechado no pássaro é o mais apertado que o vídeo pode dar.

---

## 7. O que falta

Nada disso dá pra inventar:

- **Páginas do Vagabond.** Não chegou nenhuma ainda. Precisa de: Musashi
  jovem, o Kojirō do Inoue, Ichijōji, o duelo na ilha, o arco da fazenda,
  e uma página do fim (cap. 327 ou perto).
- **Reigandō**, a caverna onde ele escreveu, e as figuras de pedra do
  Ungan-zenji.
- **O monumento de Kokura**, a pedra de 1654.
- **Uma página de cópia manuscrita do Go Rin no Sho.**
- **Capa de edição antiga do romance do Yoshikawa.**
- **Ganryūjima hoje.**

Licença confirmada antes de usar, em todas. Pintura de 1600 é domínio
público, mas a *foto* da pintura às vezes não é.

- **Narração.** O roteiro tem 1.346 palavras, mesmo tamanho do Vinland.

---

## 8. O que não fazer

- Usar a `prensa.py`. Este vídeo é pincel, não prensa.
- Deixar a saturação subir de novo depois do pico da baleia.
- Transição no corte da baleia para o picanço. É corte seco. É a tese.
- Profundidade de campo, desfoque gaussiano para simular distância.
- Paralaxe acima de 13% de ganho, ou visível.
- Parallax aleatório, screen shake, glitch, light leak, partícula, lens
  flare, texto letra por letra, seta piscando.
- Dourado. Vermelho sangue. O acento é o vermelhão do carimbo.
- Traço gerado sem kasure.
- Tipo sem acento.
- Empilhar linha por passo fixo de `y`.

---

## 9. Render

```
1920×1080 · 30 fps · h264 · CRF 16 · yuv420p · faststart
subir em 2560×1440
```

CRF baixo de propósito: aguada de tinta e papel vazio são as duas coisas
que mais sofrem com compressão — banding em gradiente suave aparece na
hora, e o vídeo é feito de gradiente suave.
