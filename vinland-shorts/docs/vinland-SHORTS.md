# Vinland — quatro Shorts

Verticais 1080×1920, 30 fps. Mesma prensa do ensaio, mesmas fontes.

**Nenhum dos quatro é trailer.** Cada um fecha sozinho. Nenhum diz
"vídeo completo no canal" — isso vai na descrição e no campo de vídeo
relacionado, nunca na tela.

---

## O princípio: quatro estruturas, não quatro temas

O que separa estes Shorts de qualquer outro canal não é a textura, é que
cada um tem um **mecanismo próprio** e eles são opostos entre si:

| | Short | o que a tela faz |
|---|---|---|
| 1 | A CONTAGEM | **acumula** — cem impressões que não se substituem |
| 2 | O ANEL | **atravessa** — uma tomada única, sem corte nenhum |
| 3 | AS DUAS SAGAS | **sobrepõe** — duas chapas fora de registro, colidindo |
| 4 | A OFICINA | **subtrai** — a página começa cheia e termina vazia |

Acumular e subtrair são inversos. Atravessar é o oposto de cortar.
Sobrepor é o único que usa o erro de impressão como argumento.

Se os quatro saíssem do mesmo molde, seriam quatro vezes o mesmo Short.

---

# 1 · A CONTAGEM — cerca de 33 s

**Já construído:** `vin-short-contagem.mp4`

> No capítulo 96 de Vinland Saga, o Thorfinn leva cem socos na cara. //
>
> Ele não revida nenhum. //
>
> O Yukimura desenha a contagem na página: dezessete, dezoito, dezenove. //
>
> E a contagem é o argumento. Não é uma surra dramática, é uma conta. //
>
> Cem é um número que você consegue imaginar inteiro. //
>
> No fim o Thorfinn está destruído, de pé, e diz quatro palavras: //
>
> eu não tenho inimigos. //
>
> Quantos você aguentaria antes de revidar?

**O mecanismo.** A folha é impressa **uma vez** e nunca muda. Os cem
numerais são cem impressões separadas, cada uma com a sua semente. O
numeral da vez entra grande e em tinta cheia; quando o próximo chega, ele
encolhe, cai para 30% de tinta e vai para a grade do arquivo. Aos cem a
página está coberta.

Do 1 ao 100 o corpo encolhe de 300 para 230, o ganho de tinta cai, a falha
quase dobra e o tremor da linha de base triplica. A chapa vai recebendo
menos pressão.

Cadência: os dez primeiros a 0,55 s; do 11 ao 70 a 0,22 s; do 71 ao 95 a
0,30 s; os cinco últimos a 0,85 s.

Marcos 1, 25, 50, 75 e 100 em ferrugem.

**A corrigir:** a primeira linha do arquivo encosta no rótulo "CAPÍTULO
96", e o terço de baixo fica vazio demais. Empurrar a grade uns 90 px
para baixo.

---

# 2 · O ANEL — cerca de 42 s

**Uma tomada só. Nenhum corte. Isso é a peça.**

> Em 993 o Sol soltou uma tempestade de partículas tão grande que ela
> ficou registrada em todas as árvores vivas do planeta ao mesmo tempo. //
>
> Um pico de carbono-14, no anel daquele ano. //
>
> Em L'Anse aux Meadows, na ponta norte da Terra Nova, tem madeira cortada
> por machado de metal. //
>
> Os nórdicos tinham machado de metal. Os habitantes do lugar, não. //
>
> Então os pesquisadores acharam o anel de 993 nessa madeira e contaram
> para fora, um anel por ano, até a casca. //
>
> Vinte e oito anéis. //
>
> Mil e vinte e um. //
>
> Não "por volta do ano mil". O ano exato em que a árvore caiu. //
>
> Que outra data da história antiga você sabe com essa precisão?

**O mecanismo.** A câmera atravessa uma seção de tronco, do anel de 993
para fora, em movimento **contínuo e de velocidade constante**, sem easing
e sem um único corte em 42 segundos.

Uma linha fixa de medição cruza a tela. Cada anel que passa por ela
acende um tique seco e incrementa um contador: `993 … 994 … 995`. Vinte e
oito tiques.

No vigésimo oitavo, o movimento **para seco** e o número fica: **1021**.

```
velocidade   constante, sem aceleração — é uma medida, não um efeito
contador     Anton, canto inferior, troca no instante do tique
marcação     o anel de 993 em ferrugem; os outros 27 em turfa
som          um tique por anel. Nada mais. Sem trilha até o 1021.
```

A trilha entra **só depois** que o movimento para, nos últimos 4 segundos.

**Por que isso é diferente.** O feed inteiro é feito de corte. Quarenta
segundos sem um corte, com velocidade constante, para o dedo por ser a
única coisa parada na rolagem. E a conta acontece na frente da pessoa:
ela vê os vinte e oito anéis passarem. A data não é afirmada, é
**contada**.

Peça base: `public/grafico/g01-anel-993.png`, refeito em vertical e com
resolução para a travessia inteira.

---

# 3 · AS DUAS SAGAS — cerca de 40 s

**Tipografia pura. Nenhuma imagem.**

> Tudo que a gente sabe sobre a viagem dos nórdicos para a América vem de
> duas sagas islandesas. //
>
> E elas discordam em quase tudo. //
>
> Uma diz sessenta homens. A outra diz cento e quarenta. //
>
> Uma dá ao Thorfinn o crédito por coisas que a outra atribui a outras
> pessoas. //
>
> As duas foram escritas mais de duzentos anos depois dos fatos. //
>
> E a cópia mais antiga que sobrou de uma delas foi feita por um homem
> chamado Haukr Erlendsson, //
>
> que dizia descender do Thorfinn. //
>
> Quando a gente diz que a história desmente Vinland, está citando um
> texto que já foi mexido por alguém que queria contar uma história
> melhor. //
>
> Em quem você acredita quando as duas fontes são a única coisa que existe?

**O mecanismo.** A tela é dividida em duas colunas. A da esquerda imprime
a Saga dos Groenlandeses, a da direita a Saga de Erik o Vermelho, em EB
Garamond.

Quando a narração chega num ponto de discordância, **a segunda chapa desce
fora de registro**, deslocada de 14 a 22 px, e os dois textos colidem. Onde
eles discordam, a tinta sobrepõe e a palavra fica ilegível.

```
SESSENTA HOMENS        CENTO E QUARENTA
     ↓ a segunda chapa desce 18px deslocada
     ███ ilegível ███
```

O desregistro já está no vocabulário de movimento do canal como pontuação.
Aqui ele **é o conteúdo**: duas chapas que não batem são duas fontes que
não batem.

No fecho, o nome **HAUKR ERLENDSSON** entra em ferrugem, sozinho, sobre as
duas colunas borradas — a mão que mexeu.

---

# 4 · A OFICINA — cerca de 36 s

**A página começa cheia e termina em branco.**

> Em L'Anse aux Meadows tem oito construções de turfa. //
>
> Não é uma cidade. É menos do que uma aldeia. //
>
> E o que os arqueólogos acharam dentro delas foi quase nada: //
>
> ferramenta de carpintaria, rebite de barco, restos de ferro trabalhado. //
>
> Material de conserto. //
>
> O lugar pode nunca ter sido a colônia que as sagas descrevem. Pode ter
> sido uma estação de reparo, um ponto de apoio para seguir viagem. //
>
> E eles foram embora em ordem. Esvaziaram tudo e não deixaram ninguém
> para trás. //
>
> A terra prometida era uma oficina. //
>
> O que você faria com um lugar que não deu certo: ficava, ou arrumava o
> barco e seguia?

**O mecanismo.** A planta das oito construções é impressa inteira no
primeiro frame — a tela já está cheia quando o Short começa, o que é
obrigatório no feed.

A cada construção que a narração menciona, **uma some**. Não é fade: é a
chapa sendo retirada, com a tinta descolando do papel pela mesma máscara
de ruído da revelação, rodando ao contrário.

Ao chegar em "foram embora em ordem", as últimas somem uma a uma, em
sequência. No fim resta **papel vazio** com uma linha só.

**Por que isso é o oposto do Short 1.** Lá a página enche; aqui ela
esvazia. Num feed onde tudo aparece, uma coisa que desaparece prende por
contraste. E é verdadeiro: eles levaram tudo embora.

---

## Produção, para os quatro

**Narração:** grava os quatro na mesma sessão, mesma voz, mesmo
microfone. Cerca de 2min30 no total. Lê devagar. A última frase de cada um
é uma pergunta — lê mais devagar ainda e deixa morrer.

**Áudio:** eu corto, normalizo em −16 LUFS, mapeio as batidas em frame e
monto trilha e leito, como nos outros.

**Efeitos:** a paleta vem da prensa. Batida de chapa, farfalhar de papel,
tique de medição. Nunca whoosh, riser ou impacto com sub-grave. Pico em
−20 dBFS, no máximo cinco por Short, e **nunca na batida da música**.

**Legenda queimada:** obrigatória. EB Garamond 500, corpo 40, entre
`y=1330` e `y=1430`. **Não usar Cormorant** — o acento sobe acima da
maiúscula.

**Zona segura:** topo 120, base 380, direita 160, esquerda 60. Caixa útil
`x` de 72 a 1008, `y` de 150 a 1540.

**Ordem de publicação:** O ANEL, A CONTAGEM, AS DUAS SAGAS, A OFICINA.
O anel abre porque é o fato mais surpreendente e não exige saber nada de
mangá — é o que atrai de fora. A contagem vem em segundo porque é a mais
bonita. Os dois últimos convertem quem já chegou.
