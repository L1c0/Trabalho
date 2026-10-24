# Houseki — Shorts v2, sem lettering

Canal **@MangaEm60**. Quatro verticais 1080×1920, 30 fps. Áudio pronto e
travado. Falta montar a imagem.

Este documento **substitui** a parte visual do `SHORTS.md`. O que continua
valendo de lá: a zona segura, a ordem de publicação, os metadados, e o
princípio de que nenhum dos quatro é trailer.

---

## 1. O que muda, e por quê

O `SHORTS.md` original punha **lettering estático** como camada dominante:
a frase pousada no papel, parada, como no ensaio. Isso sai.

A razão está no próprio documento antigo: *"o ensaio é esparso porque tem
nove minutos para respirar; num feed de quarenta segundos, esparso lê como
vazio."* Frase parada em papel é a solução esparsa. No feed ela não segura.

**O que entra no lugar é tipografia cinética** — texto que entra, cresce e
**acumula** no ritmo da fala. Não é menos texto, é texto que se comporta
como fala. A especificação está no §4-bis.

**A legenda queimada continua**, e é outra coisa. A maioria assiste Short
mudo na primeira rolagem, e estes quatro são argumentos: *"a memória fica
na pedra de que o corpo é feito"* é uma afirmação, não uma imagem. Sem
legenda, quem está no mudo vê gema bonita e não entende por que ficar.

Como agora existe tipo cinético grande na tela, a legenda precisa sair do
caminho: **corpo 40** (era 64), EB Garamond 500, `#2A2622` a 80% de
opacidade, entre `y=1330` e `y=1430`. Ela é a faixa de serviço, não
elemento de design, e **nunca** divide o quadro com o tipo grande — quando
a tipografia cinética está no pico, a legenda fica só com a palavra
corrente.

**Não usar Cormorant.** O build dela põe o acento agudo e o circunflexo
acima da altura de maiúscula. Em português, palavra por palavra, isso
aparece em todo "é", "você" e "memória".

---

## 2. A regra do 3D

3D aqui significa **geometria e câmera**. Nunca render sombreado.

Isso não é birra de estilo, é a tese do canal. O diferencial declarado é
pesquisa e imagem real; render com material, luz e reflexo é o visual que
o olho já associa a imagem gerada, e entrega o contrário antes do clique.

Dois usos liberados, e só estes dois.

### 2.1 O papel em perspectiva — use em todos os quatro

A chapa impressa vive num plano dentro do espaço 3D. A câmera inclina o
plano de 6° a 14° e o "zoom" vira paralaxe de verdade: a borda próxima
cresce mais rápido que a distante, exatamente como papel se aproximando
de uma lente.

```tsx
// container
{ perspective: 2400, transformStyle: 'preserve-3d' }
// a chapa
{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px) scale(${s})`,
  transformOrigin: '50% 58%' }
```

Custa quase nada e muda tudo, porque **continua sendo a imagem impressa**.
A identidade sobrevive inteira e o movimento deixa de ser transform de
escala.

Limites: `rotateX` e `rotateY` nunca passam de 14°. Acima disso o texto da
gravura distorce e lê como slide de apresentação. E o plano nunca gira
sozinho em eixo contínuo — ele **assenta**, chega numa posição e para.

### 2.2 Objeto em arame — só onde a geometria é o argumento

Via `@remotion/three`. **Só linha**: sem material, sem luz, sem sombra,
sem textura. Tem que parecer figura de tratado do século XVIII desenhada a
bico de pena, não objeto renderizado.

```
cor da linha   #14120E sobre papel claro
espessura      constante, 2px em 1080 de largura — não varia com a distância
sem            MeshStandardMaterial, PBR, HDRI, sombra, DOF, bloom, vidro, metal
```

Dois lugares, e os dois são conteúdo:

- **O navio de Teseu**, construído tábua a tábua. As tábuas somem e
  reaparecem; depois um segundo casco se monta com as velhas. Isso é o
  paradoxo em geometria, que nenhuma foto consegue mostrar.
- **O cristal de fosfofilita**, forma monoclínica, girando devagar. É
  verificável: a fosfofilita cristaliza no sistema monoclínico, e a forma
  em arame mostra isso.

Em qualquer outro lugar, 3D é enfeite. Não põe.

---

## 3. Som

A paleta de efeitos sai do mesmo lugar que a visual: **papel e prensa.**
Nada de whoosh, riser, impacto com sub-grave ou reverso. Esses três são o
equivalente sonoro do parallax com screen shake — todo editor tem, e o
ouvido reconhece na hora.

| efeito | onde | fonte |
|---|---|---|
| virada de página | troca de chapa | `public/audio/papel.mp3` e o arquivo do Freesound |
| batida de prensa | assentamento do plano 3D | thump curto + farfalhar, montável |
| pedra na pedra | só no Pedra | — |
| tique seco | cada marca da régua de Mohs | — |

**Três regras:**

1. **Efeito nunca cai na batida da música.** Cai nas batidas da narração,
   que já estão mapeadas em frames no `houseki-shorts-AUDIO.md`. Som
   sincronizado com a trilha transforma o ensaio em edit.
2. **Pico de efeito em −20 dBFS**, bem abaixo da voz. Efeito mais alto que
   a narração num ensaio lê como barato.
3. **No máximo um efeito por batida**, e não em todas. Se as oito batidas
   tiverem som, nenhuma tem peso. Quatro ou cinco por Short.

### Mix, já pronta e medida

```
narração   public/audio/shorts/<n>.flac          -16,0 LUFS   pico -1,5 dBFS
trilha     public/audio/shorts/trilha-<n>.flac   -31,0 LUFS
leito      public/audio/shorts/leito-sala.flac   -50,0 LUFS   20s, loop perfeito
```

Soma direto, **sem ducking**. Conferido nos quatro: dá **−15,9 LUFS /
−1,5 dBTP**. O leito é sintético e exatamente periódico — pode repetir à
vontade, não tem clique na emenda.

---

## 4. Densidade

As batidas da narração estão mapeadas em frames, sete a nove por Short.
**Uma batida, um evento visual.** Sem o lettering, o evento tem que ser
outra coisa: troca de chapa, mudança de recorte, a câmera assentando numa
nova inclinação, uma linha se desenhando, a rajada parando seco.

Entre dois eventos a imagem fica **parada de verdade**. É a parada que faz
o próximo ser sentido. Denso não é agitado: são oito coisas distintas em
quarenta segundos, cada uma clara, com silêncio entre elas.

**Primeiro frame completo.** O feed julga em meio segundo. Short que abre
em papel vazio perde antes de começar.

---

## 4-bis. Tipografia cinética

Adaptado de uma referência que o canal trouxe (reels de tipografia
narrada). O mecanismo dela é bom; a embalagem não serve. Fica o mecanismo.

### Os três registros

A força está no **contraste brutal de corpo dentro de uma frase só**.

| registro | fonte | corpo | papel na frase |
|---|---|---|---|
| **rótulo** | Oswald, caixa alta, tracking 0,22em | 38–44 | o que isto é. Fica no topo, raramente muda |
| **conectivo** | EB Garamond 500 | 46–52 | a parte que liga. Baixo contraste, quase sussurro |
| **carga** | Anton | 190–420 | a palavra ou número que é o argumento |

Um quadro tem **no máximo uma carga**. Duas cargas competindo é o mesmo
erro de pôr som em todas as batidas.

### A frase acumula, não troca

O conectivo entra e **fica**. A carga entra embaixo dele. Quando a frase
avança, o conjunto inteiro sobe alguns pixels e o novo pedaço entra por
baixo. O olho lê um bloco crescendo, não slides se substituindo.

A limpeza de tela só acontece na troca de batida grande — e aí é corte
seco, nunca fade.

### Entrada: revelação por tinta, não animação

O tipo **não** sobe, não dá fade, não entra letra por letra. Ele é
impresso: a máscara de ruído da `prensa` revela a tinta em manchas, 10 a
14 frames. Já está implementado em `prensa/movimento.py`.

É o único jeito de o tipo entrar sem parecer preset de editor.

### Tipo grande precisa manchar

**Corrigido a partir da primeira prova.** Anton em corpo 200+ saiu com
miolo chapado e borda nítida — leu como vetor, não como impressão. Área
sólida grande nunca entinta uniforme numa prensa de verdade.

Para carga acima de corpo 150: `falha` entre **0,70 e 0,85** e `ganho`
entre 0,60 e 0,66. O miolo tem que deixar papel aparecer em manchas
irregulares. Abaixo de corpo 80 vale o padrão (`falha` 0,45).

### Acento e cedilha, sempre

**Nunca escrever sem acento, nem em teste.** As quatro fontes do projeto
têm todos os glifos do português e nenhuma tem o defeito da Cormorant:

| fonte | glifos PT | acento acima da maiúscula, em corpo 120 |
|---|---|---|
| Anton | todos | +28 px |
| EB Garamond 500 | todos | +19 px |
| EB Garamond 700 | todos | +21 px |
| Oswald | todos | +31 px |
| ~~Cormorant~~ | todos | **+70 px** — por isso saiu |

Consequência prática: **uma linha acentuada é 19 a 31 px mais alta** (em
corpo 120; proporcional acima disso). "PEDAÇO" ocupa mais vertical que
"PEDACO". Por isso o empilhamento tem que sair de `caixa_tinta()` e nunca
de passo fixo — ver abaixo.

### Nunca escolher corpo no olho

**O outro defeito da primeira prova**, e o mais caro: eu escolhi corpo a
olho e empilhei as linhas em passos fixos de `y`. Resultado: o rótulo em
ferrugem entrou por cima do numeral num quadro, e uma linha estourou a
margem direita no outro.

A caixa métrica da fonte **não** é onde a tinta está — no Anton ela é
muito maior que o olho do numeral. Use `P.caixa_tinta()`:

```python
corpo = busca_binaria(maior corpo cuja caixa_tinta caiba na coluna)
y_proxima_linha = caixa_tinta(linha_anterior)[3] + respiro
```

Medido assim, três linhas de Anton numa coluna de 888 px fecham em
**corpo 200**. Estimado no olho, eu tinha posto 206 e estourou.

### O gráfico de unidades

**O melhor achado da referência, e o que mais serve a este canal.** Em vez
de escrever o número, desenhe as unidades e deixe a pessoa contar.

```
quadrícula de 28 a 32px, passo 46 a 50px
jitter de ±1,5px por unidade — grade perfeita entrega render
tinta turfa para o conjunto
tinta ferrugem para o subconjunto que o argumento marca
desregistro de 2px entre as duas chapas
```

As unidades **se desenham em rajada**, cinco a oito por segundo, e param
secas quando a narração chega no número. Depois a ferrugem entra por cima,
de uma vez.

Onde usar, e só aqui:

- **Leviatã** — a multidão do corpo do gigante. Fecha em "quantas pessoas
  você consegue contar aí?", e a pessoa realmente pode contar.
- **Navio** — as tábuas. As velhas em ferrugem, as novas em turfa,
  trocando uma a uma.
- **Memória** — as peças do corpo da Phos. As perdidas saem da grade.
- **Pedra** — a escala Mohs como dez unidades, com a 3,5 e a 10 marcadas.

### O que fica de fora da referência

| na referência | por que não |
|---|---|
| fundo amarelo | é marca pessoal dela. A nossa é papel, turfa e ferrugem |
| recorte com contorno branco de adesivo e sombra | põe a figura **em cima** da página. A prensa existe para a figura ser **impressa na** página — é literalmente o defeito que ela foi construída para evitar |
| rabisco de morcego, presas desenhadas | registro de comédia. O nosso é catálogo de museu |
| sans grotesca genérica | já temos Anton, Oswald e EB Garamond, e eles são a identidade |

A **anotação** sobrevive, traduzida: círculo que marca, linha que aponta,
colchete que agrupa. Gráfico que só enfeita denuncia na hora.

---

## 5. Short a Short

As tabelas de frames estão no `houseki-shorts-AUDIO.md`. Aqui vai o que
cada batida mostra.

### 1 · O LEVIATÃ — 32,77 s · 983 frames

`classico/c03-leviata.png` é 2208×3521. Aguenta o Short inteiro sozinho, e
é isso que ele deve fazer.

O Short é **uma única aproximação contínua**, do frontispício inteiro até
dentro da armadura, onde dá pra contar as pessoas. Com o plano em
perspectiva, a aproximação ganha paralaxe e deixa de ser zoom.

A batida de "Agora chega perto" (frame 280) é onde a velocidade muda.
Antes disso a câmera anda devagar o bastante pra parecer parada. Esse
contraste é o Short inteiro — não desperdiça acelerando antes.

Na última batida (frame 915) a câmera para dentro do corpo do gigante e
**não volta**. A pergunta fica sobre a multidão.

### 2 · O NAVIO — 44,91 s · 1347 frames

Quatro chapas e um objeto em arame.

A primeira metade é chapa: `c01-navio-exekias` (o vaso), `c10-teseu-minotauro`,
`c02-busto-plutarco` na batida dos gregos, `c11-hobbes` na batida do
"mil e seiscentos anos depois" (frame 726).

A segunda metade é o navio em arame, e é o pico do Short. A construção
acompanha a narração: as tábuas trocam uma a uma enquanto ele fala em
trocar; na pergunta do Hobbes, as tábuas velhas se juntam ao lado e formam
o segundo casco. Os dois ficam na tela juntos em "um tem a forma, o outro
tem a matéria" (frame 963), lado a lado, idênticos.

Na pergunta final, os dois continuam lá. Nenhum dos dois é destacado.

### 3 · A MEMÓRIA — 34,20 s · 1026 frames

Vinte quadros disponíveis em `manga/`. Use como **cartas físicas** no
espaço: cada troca de corpo é uma carta saindo e outra entrando no lugar,
no mesmo plano, com a batida de prensa.

A sequência de perdas (frames 513 a 625, só 3,7 segundos para três frases)
é a **rajada**: cinco ou seis quadros a cinco por segundo, e aí **para
seco** no torso e segura. As perdas acumulam rápido demais pra processar,
e aí o silêncio. É o movimento mais forte do conjunto e ele só funciona
porque tudo em volta está calmo.

Peças: `m01-pernas-agata`, `m03b-doacao-cabeca`, `m04b-olho-perola`,
`m05-cabeca-escorrendo` (2108×3110, aguenta aproximação), `m08a-estilhaco-rosto`,
`m23-figura-minuscula`.

O papel deriva de cor uma vez por perda, como no ensaio. Ninguém vai saber
dizer por quê, mas a sensação de contaminação chega.

### 4 · A PEDRA — 38,63 s · 1159 frames

O mais fraco em material e o que mais ganha com 3D.

A régua de Mohs, girada pra coluna: 1 em cima, 10 embaixo, marcadores
saindo pra direita, um tique seco em cada marca conforme ela se desenha.
Primeiro a régua existe, depois ela mede — nessa ordem. O 3,5 e o 10
entram grandes.

O cristal de fosfofilita em arame entra na batida do nome (frame 293) e
gira devagar, meia volta ao longo do Short, parando na pergunta.

**Falta foto de mineral de verdade** — ver §7.

---

## 6. O que não fazer

- Render sombreado, material PBR, HDRI, reflexo, vidro, metal, bloom,
  profundidade de campo
- `rotateX`/`rotateY` acima de 14°, ou plano girando em eixo contínuo
- Whoosh, riser, impacto com sub-grave, som reverso
- Efeito sonoro na batida da música
- Efeito sonoro acima de −20 dBFS
- Som em todas as batidas
- Tirar a legenda queimada
- Cormorant
- Parallax aleatório, screen shake, glitch, light leak, partícula,
  lens flare, texto letra por letra, seta piscando
- Fazer os quatro saírem do mesmo molde

Os itens da última linha existem como preset em todo editor do mundo, e é
exatamente por isso que o olho reconhece. O que faz o material parecer
caro é ele não se parecer com o de ninguém.

---

## 7. O que falta

**Foto de fosfofilita de verdade.** É a única lacuna real, e o `SHORTS.md`
já tinha apontado: *"O que falta é mineral."* Trinta e oito segundos sobre
um mineral real, sem uma foto dele, é o ponto fraco do conjunto. Ideal:
um espécime de fosfofilita (de preferência de Potosí) e um diamante bruto,
pro contraste de dureza. Acervo de museu ou Wikimedia Commons com licença
confirmada.

Se não aparecer foto licenciada, o cristal em arame cobre — mas cobre
pior, porque desenho prova menos que espécime.

Fora isso, **o material está completo.**
