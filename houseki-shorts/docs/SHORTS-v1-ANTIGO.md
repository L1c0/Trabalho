# Quatro Shorts — Mangá em 60

Verticais 1080×1920, 30fps. Mesma identidade visual do ensaio: papel,
tinta quente, Cormorant. Mesmos arquivos de `public/`.

**A regra que decide tudo:** nenhum destes é trailer. Cada um fecha
sozinho. Nenhum diz "vídeo completo no canal", nenhum manda o
espectador embora. O feed de Shorts pune conteúdo que existe para
despachar quem está assistindo.

Quem quiser mais vai procurar. É só isso que um Short precisa provocar.

---

## Ordem de publicação

Um por dia, nesta ordem, começando **dois dias depois** do ensaio ir ao ar.

```
1. O LEVIATÃ        alcance máximo, não precisa saber nada de mangá
2. O NAVIO          alcance alto, filosofia pura
3. A MEMÓRIA        o que converte inscrito: mostra o que o canal faz
4. A PEDRA          o mais curto, melhor retenção
```

Os dois primeiros atraem gente de fora. Os dois últimos convertem quem
chegou. Invertendo a ordem, você converte um público que ainda não veio.

---

## Zona segura — 1080×1920

A interface do Shorts cobre parte da tela. Nada de texto ou rosto fora
desta caixa:

```
topo       120px     relógio e sistema
base       380px     título, canal, barra de progresso
direita    160px     curtir, comentar, compartilhar
esquerda    60px

caixa útil   x de 60 a 920   ·   y de 120 a 1540
```

O texto vive entre `y=380` e `y=1100`. Imagem pode sangrar para fora da
caixa; texto e qualquer coisa que precise ser lida, não.

---

## 1. O LEVIATÃ — 40s

**Peças:** `c03-leviata` do começo ao fim. Mais nada.

O Short inteiro é o zoom que já existe no ensaio, refeito em vertical.
Começa na gravura inteira e termina dentro da armadura do gigante, onde
dá para contar as pessoas.

> Olha essa gravura de 1651. É a capa do Leviatã, do Thomas Hobbes.
>
> Um gigante coroado sobre uma cidade, com uma espada numa mão e um
> báculo na outra.
>
> Agora chega perto.
>
> O corpo dele inteiro é feito de gente. Centenas de pessoas pequenas,
> de costas, olhando para a cabeça.
>
> Nenhuma delas é o gigante. Juntas, são.
>
> Quatro anos depois dessa gravura, o mesmo Hobbes escreveu a versão
> mais cruel do paradoxo do Navio de Teseu.
>
> Faz sentido. Ele passou a vida pensando em coisas feitas de partes.

**O corte que importa:** em "agora chega perto", o zoom acelera. Antes
disso ele é lento o bastante para parecer parado. Esse contraste é o
Short inteiro.

---

## 2. O NAVIO — 45s

**Peças:** `c01-navio` · `c10-teseu` · `c03-leviata` · papel vazio

> Esse navio não tem nenhuma peça original. E ainda assim pode ser o
> mesmo navio.
>
> Os atenienses guardaram o navio em que Teseu voltou de Creta, como
> monumento. Só que madeira apodrece. Cada tábua estragada eles trocavam
> por uma nova.
>
> Até não sobrar nenhuma das originais.
>
> E os filósofos gregos se dividiram em dois grupos. Uns diziam que
> continuava sendo o mesmo navio. Outros, que já era outra coisa usando
> o mesmo nome.
>
> Mil e seiscentos anos depois, Thomas Hobbes piorou tudo. E se alguém
> tivesse recolhido cada tábua velha e montado um segundo navio com
> elas?
>
> Um tem a forma. O outro tem a matéria.
>
> Qual dos dois é o navio de Teseu?
>
> Não existe resposta certa. Existe escolha sobre o que você acha que
> faz uma coisa ser ela mesma.

---

## 3. A MEMÓRIA — 45s

**O que mais converte inscrito.** É o único dos quatro que mostra
explicitamente o que este canal faz: pegar um mangá e levar a sério.

**Peças:** `m01-pernas-agata` · `m03b-doacao-cabeca` · `m04b-olho-perola`
· `m05-cabeca-escorrendo` · `m23-figura-minuscula`

> Nesse mangá a memória não fica no cérebro. Fica na pedra de que o
> corpo é feito.
>
> A protagonista é uma gema. Quando ela perde uma parte do corpo numa
> luta, colocam outra no lugar, de outro mineral.
>
> E a lembrança que estava ali vai embora junto com a peça antiga.
>
> Ela perdeu as pernas. Esqueceu uma amiga.
>
> Perdeu os braços. Perdeu a cabeça inteira. Perdeu os dois olhos.
>
> Cada troca levou um pedaço do passado dela.
>
> No fim, o que sobrou do corpo original é um torso.
>
> E a pergunta que o mangá nunca faz em voz alta: em que momento ela
> parou de ser ela?

**O papel muda de cor junto**, como no ensaio: verde da fosfofilita no
começo, e a cada perda citada ele deriva uma vez. Sete trocas em 45
segundos, rápidas. Ninguém vai saber dizer por quê, mas a sensação de
contaminação chega.

---

## 4. A PEDRA — 35s

O mais curto, e por isso o de melhor retenção. Use a régua de Mohs que
já está construída, girada para vertical.

**Peças:** componente `<Regua>` · `m01-pernas-agata`

> A autora escolheu, para a protagonista de um mangá sobre perder o
> corpo pedaço por pedaço, a pedra mais frágil que existe.
>
> Fosfofilita. Dureza três e meio na escala Mohs.
>
> Diamante é dez, o máximo.
>
> Colecionador trata espécime de fosfofilita como se fosse de vidro.
>
> E os melhores cristais vieram de uma mina em Potosí, na Bolívia, que
> não produz mais. O que existe é o que já foi tirado.
>
> Ela não escolheu uma pedra bonita para protagonista.
>
> Escolheu uma que quebra se você olhar com força.

**Na vertical a régua vira coluna:** 1 em cima, 10 embaixo, marcadores
saindo para a direita. O 3,5 e o 10 entram grandes, como no ensaio.

---

## Produção

**Narração:** gere os quatro no mesmo lugar e com a mesma voz do ensaio.
Mesmo tratamento depois: −16 LUFS, pico em −1,5 dBTP.

**Trilha:** reaproveite a `trilha1.mp3`. Trechos diferentes para cada
Short, a −31 LUFS como no ensaio. Nada novo precisa ser gerado.

**Leito de sala:** entra também, mesmo nível. Em Short ele importa mais
do que no ensaio — o feed é barulhento e o silêncio total soa como áudio
quebrado.

**Legenda queimada:** obrigatória. A maioria assiste sem som. Palavra por
palavra, Cormorant 600, 64px, centralizada, entre `y=1150` e `y=1400` —
abaixo do texto principal e acima da interface. Essa é a única coisa
destes Shorts que não existe no ensaio.

**Primeiro frame:** tem que estar completo. O feed julga em meio segundo,
e um Short que abre em papel vazio perde antes de começar.

---

## Metadados

Título do Short é o gancho, não o assunto. Até 60 caracteres.

```
1   Essa gravura de 1651 é feita de gente
2   Esse navio não tem nenhuma peça original
3   Nesse mangá a memória fica guardada no corpo
4   A pedra mais frágil do mundo virou protagonista
```

Descrição: uma linha, e só. Hashtags: duas, nunca três.

```
1   #filosofia #historia
2   #filosofia #teseu
3   #manga #houseki
4   #manga #geologia
```

Não ponha `#shorts`. Não faz nada há anos e ocupa espaço.

---

## O que não fazer

Nenhum dos quatro termina com "assiste o vídeo completo". Nenhum tem
seta piscando, zoom brusco ou corte na batida. A identidade do canal
aqui é a mesma do ensaio: corte seco, respiro, uma coisa por vez.

Um Short calmo no meio de um feed agitado para o dedo por ser diferente.
Um Short agitado no meio de um feed agitado é mais um.

---

# O sistema de três camadas

Para os Shorts e qualquer vertical. O ensaio é esparso porque tem nove
minutos para respirar; num feed de quarenta segundos, esparso lê como
vazio. Isto é a mesma identidade, com densidade.

## As três camadas

```
FOTO        meio-tom completo, grão, profundidade
GRÁFICO     só linha. Zero tom, espessura constante, nada de preenchimento
LETTERING   chapado. Sem contorno, sem sombra, sem gradiente
```

**A regra que faz funcionar:** cada camada num registro diferente. Se as
três tiverem o mesmo peso visual, vira sopa. Em cada quadro **uma domina**
e as outras duas servem.

```
v1 Leviatã    FOTO domina       gráfico aponta, lettering ancora
v2 Navio      FOTO + GRÁFICO    o anel de medição e o vaso dividem
v3 Memória    LETTERING domina  a linha das seis trocas é o gráfico
v4 Pedra      GRÁFICO domina    a régua é o conteúdo
```

## A camada de foto você já tem

As pranchas clássicas são fotografias de objetos reais: o vaso grego, o
busto romano, a estátua, o vajra. Só estavam tratadas como prancha chapada.
Para vertical, suba o contraste e deixe o meio-tom aparecer — é isso que
separa foto de ilustração.

**O que falta é mineral.** Fosfofilita, ágata, lápis, cinábrio, pérola,
diamante, fotografados de verdade. É a única categoria de imagem real que
o projeto não tem, e é a que mais renderia em vertical.

## Nunca empilhe lettering sobre foto cheia

Erro que eu cometi na primeira versão do quadro do Leviatã: texto grande em
cima de uma gravura cheia de hachura não lê. Ou a foto ocupa a parte de
cima e o texto vive em papel limpo embaixo, com um filete separando, ou o
texto vai num vazio real da imagem. Nunca por cima do detalhe.

## O gráfico tem que fazer trabalho

Círculo que marca, linha que liga, régua que mede, nó que conta. Gráfico
que só enfeita denuncia na hora.

A mobília técnica sai de graça e é o que dá cara de catálogo: marcas de
corte nos quatro cantos da zona segura, rótulo em caixa alta com
entreletra de 0,22em, filete fino embaixo do rótulo, procedência no topo
("PRANCHA I · LONDRES 1651").

## Em movimento

Cada camada entra de um jeito e só um:

```
FOTO        já está em cena no primeiro frame. Deriva de escala, 100% a 103%
GRÁFICO     a linha se desenha, da origem para a ponta, em 12 a 18 frames
LETTERING   corta e aparece. Sem fade, sem subir, sem letra por letra
```

O gráfico se desenhando é o único movimento vistoso do sistema, e é por
isso que ele funciona: tudo em volta está parado.

---

# Vocabulário de movimento

Oito movimentos, todos tirados do processo de impressão. Nenhum deles é
preset. É daí que vem o dinamismo sem o vídeo virar igual a todo mundo.

Os quatro primeiros estão demonstrados em `motion-vocabulario.mp4`.

## 1. Revelação por tinta
O lettering não aparece, não sobe, não dá fade. Ele é **impresso**: um
campo de ruído suave serve de máscara e a tinta surge em manchas
orgânicas, como papel absorvendo. 34 frames do nada ao completo.

É o movimento mais bonito do conjunto e o que menos parece efeito.

## 2. Desregistro
Pulsos de 2 a 3 frames em que a chapa escura escorrega de 6 a 11px na
horizontal, e volta. É o erro de registro de uma impressão de duas
chapas. Três ou quatro pulsos ao longo de um Short, nunca mais.

Usa como pontuação: um pulso no instante da palavra mais dura da frase.

## 3. Rajada de pranchas
Seis imagens a cinco por segundo, e aí **para seco** na última e segura
por dois segundos. O contraste entre a rajada e a parada é o movimento.

É o jeito certo de fazer a lista das seis trocas: as perdas acumulando
rápido demais para processar, e aí o silêncio.

## 4. Linha que mede
O gráfico se desenha da origem para a ponta em 12 a 18 frames, os ticks
aparecem conforme a linha passa por eles, e só depois o marcador e o
número entram. Ordem importa: primeiro a régua existe, depois ela mede.

## 5. Corte de escala
Não é zoom. São cortes secos na mesma imagem em escalas diferentes —
aberto, detalhe, mais aberto. Gramática de cinema e de livro, não de
timeline. Três cortes em dois segundos dão mais energia que qualquer
zoom suave.

## 6. Retícula viva
A trama de pontos do mangá regenerada a cada frame, com deslocamento de
sub-pixel. O desenho fica parado e a textura respira. Quase invisível, e
é o que impede a imagem de parecer um JPEG colado.

## 7. Entrelinha que fecha
O lettering entra com entrelinha 1,35 e fecha para 0,92 em 20 frames. As
linhas se aproximam até virarem bloco. Tipografia se movendo como
tipografia, não como objeto voando.

## 8. Troca de chapa
Na mudança de cor do papel, as duas cores não fazem crossfade: a nova
entra por cima pela mesma máscara de ruído da revelação por tinta. A cor
é reimpressa, não dissolvida.

---

## A regra que impede virar sopa

**Um movimento por batida de narração.** Não dois.

Num Short de 40 segundos cabem seis a oito batidas, então cabem seis a
oito movimentos. Parece pouco escrito assim, e na tela é denso — porque
cada um é distinto dos outros e nenhum se repete em seguida.

Entre um movimento e outro, a imagem fica parada de verdade. É a parada
que faz o próximo movimento ser sentido.

## O que continua proibido

Spring, bounce, overshoot, parallax, glitch digital, light leak,
partícula, lens flare, chroma aberration animada, corte na batida da
música, texto letra por letra, seta piscando, zoom rápido.

Não é birra. Todos esses existem como preset em todo editor do mundo, e
é exatamente por isso que o olho reconhece na hora. O que faz o seu
material parecer caro é ele não se parecer com o de ninguém.

---

# Chamada para ação

A regra não é "sem CTA". É **sem CTA que quebra a coisa**. Existe
diferença, e o lugar certo muda por formato.

## Nos Shorts: devolva a pergunta

Nenhum deles diz "assiste o vídeo completo". O que cada um faz é
terminar numa pergunta que a pessoa tem opinião. Pergunta gera
comentário, comentário é o sinal mais forte que um Short pode mandar, e
quem comenta costuma olhar o canal.

Entra como última fala, depois do fim do argumento, com um respiro
antes:

```
1  LEVIATÃ    "Quantas pessoas você consegue contar aí?"
2  NAVIO      "Qual dos dois você acha que é o navio?"
3  MEMÓRIA    "Se você esquecesse tudo, ainda seria você?"
4  PEDRA      "Que outra obra esconde ciência de verdade assim?"
```

A do Navio é a mais forte: é uma pergunta de dois mil anos que ninguém
resolveu, e qualquer pessoa tem lado.

Na tela, a pergunta aparece em lettering, sozinha no papel, e **fica até
o último frame**. O Short faz loop, então ela volta a aparecer junto com
o gancho. Essa repetição é de graça.

## No vídeo longo: o colofão

O filme acaba no frame 15671, em preto, com "e não existe um você".
Isso não se toca.

Mas depois dele entram **300 frames** — dez segundos — que não são o
filme, são a ficha de catálogo que o fecha:

```
15671  o papel volta do preto em 20 frames, estado neutro
15691  entra, na margem esquerda, corpo 30, caixa alta espaçada:

         HOUSEKI NO KUNI
         HARUKO ICHIKAWA · 2012 – 2024

       e embaixo, em cor.fraco, corpo 26:

         MANGÁ EM 60

15971  fim
```

Mudo. Sem trilha, sem leito.

**É aqui que a tela final mora.** Dez segundos de papel calmo é tempo de
sobra para um único botão de inscrever, e ele não atropela nada — o
filme já acabou dez segundos atrás.

Catálogo de museu fecha com colofão. O vídeo passa a fechar também.
