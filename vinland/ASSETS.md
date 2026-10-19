# Vinland Saga — estado do material

19 peças de mangá tratadas + 1 gráfico. Tudo em `public/`.

Tratamento aplicado em todas: recorte do quadro, balão esvaziado
(contorno mantido, texto em inglês removido), marca de scan e número de
página apagados, 2× Lanczos, contraste de traço.

---

## Entregue

### Fecho da obra
| arquivo | capítulo | nota |
|---|---|---|
| `v18-painel-final` | **220** | a mão sobre o trigo brotando. Cortei a coluna de texto em inglês da direita, por isso a manga fica aparada. |
| `v16-familia-capa` | arco Vinland, 200+ | Thorfinn cobrindo uma mulher encapuzada. **Não confirmei se é Gudrid.** |

### Abertura
| arquivo | capítulo | nota |
|---|---|---|
| `v17-navios` | **1** | a legenda "later they would come to be known as the Vikings" ficou vazia, pronta pro lettering em português. |

### Morte do Askeladd — cap. 54
| arquivo | capítulo | nota |
|---|---|---|
| `v05-askeladd-morte` | **54** | "Ei... Askel..." — o rosto do Thorfinn. É o plano que tira a vingança da mesa. |
| `v05b-askeladd-queda` | **54** | o painel largo, a queda. |

### Morte de Bjorn — anterior, não confundir
| arquivo | capítulo | nota |
|---|---|---|
| `v06-thorfinn-olhos` | ~52–54 | Thorfinn de olhos arregalados. Serve pro pós-Askeladd. |
| `v05c-bjorn-morrendo` | ~52–54 | o moribundo. Cena anterior, outro personagem. |
| `v06b-bjorn-arrependido` | ~52–54 | "por que eu não fui com o Thors?" — plantada boa, mas não confirmei a identidade. |

### Personagens — bloco 3
| arquivo | nota |
|---|---|
| `v03-askeladd-close` | o "Hmm." Balão esvaziado. Melhor resolução dos retratos novos. |
| `v03b-askeladd-sorrindo` | o sorriso. Pequeno: 389px de origem. |
| `v02-thors` | ver acima. 635px de origem, a melhor dos retratos pequenos. |
| `v13-canute` | rei, falando de imposto. Arco tardio. |
| `v14-thorkell` | o riso. Origem de 429px, a menor de todas. |
| `v01-thorfinn-crianca` | criança, rosto sujo, olhando pra trás. |
| `v04-thorfinn-cacador` | adolescente, "eu sou o caçador". Cortei a marca do mangareader no topo. |
| `v04b-thorfinn-escudo` | de pé com escudo. **235px de origem**, só serve pequeno. |
| `v02-thors` | o pai, carregando o carneiro. Fazendeiro na Islândia. |
| `v19-sweyn` | o rei de coroa, mão erguida. Cap. 44. Cortei a faixa do título em inglês no topo. Cobre "Sweyn e Harald" numa imagem só. |

### Fazenda de escravo
| arquivo | capítulo | nota |
|---|---|---|
| `v07-arrancando-toco` | 58–80 | Thorfinn de machado no toco. |
| `v08-maos-na-terra` | 58–80 | as mãos na pedra. Painel largo, bom pra paneamento lateral. |
| `v08b-cesto-de-pedra` | 58–80 | o cesto cheio. Detalhe de apoio. |
| `v09-mata-einar-ao-longe` | 58–80 | Einar pequeno no meio das árvores. |
| `v09b-einar-pergunta` | 58–80 | o rosto do Einar. Balão vazio. |

### Os cem socos — o eixo do vídeo
| arquivo | capítulo | nota |
|---|---|---|
| `v10-cem-socos` | **96** | página inteira. **Mantive os números 17! 18! 19!** — numeral não é inglês, e a contagem é o argumento. |
| `v10b-soco-detalhe` | **96** | a faixa de baixo, o punho e os dois rostos. |
| `v11-sem-inimigos` | **96** | ele de pé, destruído, balão vazio. **É a imagem do vídeo.** Guarda pra thumb também. |

### Báltico, desarmado
| arquivo | capítulo | nota |
|---|---|---|
| `v12-corrente-desarmado` | 100–166 | a corrente passando. |
| `v12c-atras-do-mastro` | 100–166 | no navio, gritando. |
| `v12b-thorfinn-retrato` | 100+ | retrato limpo, adulto. |
| `v15-mao-no-ombro` | ? | dois homens. **Não identifiquei.** |
| `v15b-leif-retrato` | ? | o barbudo no navio. **Acho que é o Leif, não confirmei.** |

### Foto
| arquivo | nota |
|---|---|
| `h01-lanse-aux-meadows` | 1720×1290. Virou chapa, não foto dessaturada: curva em S pra tirar o céu do cinza chapado e abrir a textura da turfa. Imprime na mesma prensa que o mangá. **Confirmar a licença.** |

### Gráfico
| arquivo | nota |
|---|---|
| `g01-anel-993` | 1920×1080. Os anéis, o de 993 pesado, a régua contando 28 até 1021. Substitui a foto recusada. Fonte: Kuitems et al., Nature, 2021. |

---

## Não falta nada

30 quadros de mangá, 1 foto, 1 gráfico, 8 cartelas.

**Harald não é necessário.** O roteiro diz "Sweyn e Harald existiram" —
os dois nomes numa respiração só, dentro de uma lista. O plano do Sweyn
cobre a frase inteira. Harald aparece pouquíssimo na obra, achar um
quadro limpo dele dá trabalho e não muda nada na tela: ninguém vai
reparar que a imagem não trocou entre dois nomes ditos em dois segundos.

---

## Resolução dos retratos novos

Vieram de fontes pequenas. **Isso importa menos do que parece**, porque a
prensa muda a conta: ganho de tinta, mordida e grão fazem o upscale ler
como impressão, não como JPEG mole.

Testei o pior caso (`v14-thorkell`, 429px de origem) impresso a 35%, 50%
e 65% da largura do frame. **A 65% a cota de malha ainda está nítida.**

| limite | |
|---|---|
| sem prensa | 22% a 37% da largura, conforme a peça |
| **com prensa** | **até 65%, medido** |

A exceção é `v04b-thorfinn-escudo`, com 235px de origem: essa só funciona
pequena, em composição com tipo ao lado.

---

## Recusado

**Anéis de árvore (foto):** marca d'água do 123RF em toda a imagem. É
banco de imagem licenciado. Substituída pelo `g01-anel-993`, que mostra
o que a foto não mostrava: o pico de carbono-14 não é visível a olho, é
medida.

**Ponta de flecha:** é a ponta de Mörigen, Suíça, Idade do Bronze
tardia, cerca de 800 a.C., acervo do Museu de História de Berna, foto de
Thomas Schüpbach. Mil e oitocentos anos antes dos viquingues e do outro
lado do Atlântico. Direito autoral não declarado.

**Vila colorida:** é Quidi Vidi, perto de St. John's, cerca de 400 km de
L'Anse aux Meadows. Fora de lugar e fora da identidade do canal.

**L'Anse aux Meadows (casas de turfa):** é o lugar certo e a foto é boa.
Não consegui verificar a licença desse arquivo. Tem versão em Creative
Commons no Wikimedia Commons e foto de domínio público do Parks Canada.
Pega de lá antes de usar.
