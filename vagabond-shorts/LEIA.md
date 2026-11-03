# Vagabond — os quatro Shorts

São quatro Shorts verticais 1080×1920, a 30 fps, para o @MangaEm60. Saem
do pacote `c56addfc-vagabond-SHORTS-MATERIAL.zip`. O briefing está em
`docs/LEIA-PRIMEIRO.md`, e as notas do autor estão em
`docs/vagabond-SHORTS-O-QUE-FALTA.md` e `docs/vagabond-SHORTS-TITULOS.md`.

| id | título | quadros | arquivo |
|---|---|---|---|
| S1 | SESSENTA E ZERO | 1729 (57,6 s) | `out/vagabond-s1-sessenta-e-zero.mp4` |
| S2 | O PÁSSARO | 1294 (43,1 s) | `out/vagabond-s2-o-passaro.mp4` |
| S3 | O QUE NUNCA EXISTIU | 1619 (54,0 s) | `out/vagabond-s3-o-que-nunca-existiu.mp4` |
| S4 | O REMO | 1482 (49,4 s) | `out/vagabond-s4-o-remo.mp4` |

## O que é do pacote e o que é da montagem

Tudo o que aparece na tela veio pronto: os planos, as legendas, as folhas
e as peças de tipo. O pacote não trouxe código, então a montagem é toda
daqui:

- `src/Short.tsx` desenha.
- `ferramentas/agenda.py` calcula quando cada peça entra e onde a folha
  está, e grava `src/data/agenda.json`.
- `ferramentas/tempos.json` diz em que quadro cada grupo de blocos começa.

Tudo é 2D, como o LEIA manda. Não há 3D, perspectiva nem paralaxe.

- **Planos.** A imagem de 1350×2400 é mostrada a 1080×1920 e cresce de
  1,00 para 1,05 ao longo do plano. No máximo ela chega a 0,84 do pixel
  original e nunca amplia. O corte é seco, com 4 quadros de ganho de
  opacidade.
- **Legenda.** Fica em x=135, sobre a tarja `rgba(205,199,187,0.93)`, com
  a base em y=1528. Entra 6 quadros depois do corte e leva 6 quadros, com
  20 px de subida e opacidade.
- **Papel.** É a folha impressa com as peças por cima, cada uma na
  posição do `pos.json`, sem camada de ruído. As entradas seguem a tabela
  do LEIA:
  - `r*` e a cartela entram letra a letra, com passo de 2 quadros;
  - `n*` e GANRYŪ entram dígito a dígito, com passo de 4;
  - as duas fazem isso em 6 quadros, com 20 px de subida, sem mola;
  - `s*` entram por varredura da esquerda, em 10 quadros;
  - os traços são riscados de cima para baixo, em 4 quadros, um a cada 8;
  - o eixo do S4 varre de cima em 100 quadros, e as marcas estalam
    quando a varredura passa por elas;
  - a pintura e o colchete do S2 entram com escala de 1,04 para 1, em 16
    quadros.

  Entre blocos do mesmo grupo há 10 quadros.
- **Os 12 traços do S1.** Os outros 48 saem de 2 em 2 quadros, com 14
  quadros de opacidade, do último para o primeiro. A saída termina em
  f1492, antes do n12, que entra em f1537. Ficam exatamente os 12 da lista
  do LEIA.

## A folha desce com a escrita (escolha sua)

As folhas são mais altas que a tela: 3560, 4260, 3300 e 3700 px, contra
1920. Por isso a folha fica parada enquanto as peças entram e só desliza
na vertical quando a próxima peça cairia abaixo da caixa útil. O deslize
leva de 14 a 40 quadros, com aceleração e freio, sem mola.

Quando a folha volta depois de um plano, ela já volta na altura certa.
Isso é um corte, não um deslize.

O deslize também leva em conta os grupos seguintes, para mexer menos. Mas
não faz isso se um bloco já escrito ficasse reduzido a uma tira no topo
da tela.

`agenda.py` confere duas coisas:
- toda peça de tipo entra dentro da caixa útil (x 72–1008, y 150–1540);
- nenhuma peça entra durante um deslize.

Ao todo são três ou quatro deslizes por Short.

Há três consequências do tamanho das folhas:

- **A cartela do S1.** Ela só cabe na caixa com 186 px de papel abaixo do
  fim da folha. Esse papel é a própria folha espelhada, em branco.
- **Os 12 traços e o 12, no S1.** Quando o 12 entra, os 12 traços estão no
  alto da tela, acima da caixa: juntos, eles ocupam 1436 px, e a caixa
  tem 1390. Quando a cartela entra, os traços saem por cima.
- **A pintura do S2.** Ela tem 1512 px de altura e não cabe na caixa. Fica
  com o título dentro da caixa, e o pé dela desce até y=1802.

## Os tempos

Não houve transcrição da narração: huggingface.co, de onde viriam os
modelos, está bloqueado no proxy. Por isso, o quadro de cada grupo foi
estimado pelas pausas da fala, de 120 ms ou mais, e pela ordem da folha.

Os números estão em `ferramentas/tempos.json`. Para ajustar um grupo,
basta mudar o número e rodar `python3 -I ferramentas/agenda.py`. A
cascata, os deslizes e a conferência são refeitos sozinhos.

## O que veio e não é usado

- O `s3-cena.json` não usa `s3-p3.jpg` nem `s3-l2.png` ("A IDADE, O NOME,
  A ORIGEM: TUDO MUDA"). Os dois vieram no pacote.
- Algumas peças inteiras não estão no `pos.json` (`r1.png`, `n60.png`,
  `fim.png`, `g00`–`g11` etc.). As peças usadas são as recortadas.

## O que continua pendente (é do pacote, não da montagem)

- A ficha da gravura do S4 (artista e data), como o LEIA avisa.
- Uma foto confirmada do monumento de Kokura, para o S1.
- A trilha: os quatro saem só com a narração. Quando a música chegar, os
  tempos mudam.
- Os três pickups de narração do `O-QUE-FALTA`. São opcionais.

## Render

`bash ferramentas/render.sh [S1 S2 S3 S4]` renderiza em 1x: 1080×1920,
x264 CRF 16, preset slow, yuv420p, matriz bt709. É a receita do Houseki.

- A folha, as peças de tipo e as legendas saem pixel a pixel.
- Os planos são reduzidos uma vez, com Lanczos, para 1134×2016, o tamanho
  no fim do empurrão (`ferramentas/planos.py`). Assim, o Chrome só os
  reamostra entre 0,95x e 1x, e a retícula do mangá não vira moiré.
- O render em 2x, com redução depois, levaria quatro vezes mais tempo
  (cerca de 3 horas para os quatro) sem ganho: a folha já sai exata em 1x.

Depois do render, o vídeo é copiado sem recodificar, com faststart. O
áudio também é copiado, adiantado nas 2048 amostras de priming que o AAC do
Remotion não desconta. Sem isso, o som tocaria 42,7 ms atrasado.

`bash ferramentas/envio.sh S1` faz a versão abaixo de 30 MiB, da mesma
saída do Remotion. `node ferramentas/quadros.mjs --comp=S1 0 160 …` gera
quadros soltos para conferência.
