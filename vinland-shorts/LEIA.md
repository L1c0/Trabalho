# Vinland — quatro Shorts

Quatro verticais 1080×1920, 30 fps, para o @MangaEm60. O briefing está em
`docs/` (`LEIA-PRIMEIRO.md` explica o porquê; `vinland-shorts-POSTAR.md`
diz como publicar). As chapas vieram prontas, com alfa: aqui só existe
câmera.

| dia | composição | mecanismo | frames |
|---|---|---|---|
| 1 | `Dia1-Anel` | atravessa | 1261 |
| 2 | `Dia2-Contagem` | acumula | 781 |
| 3 | `Dia3-Sagas` | sobrepõe | 1257 |
| 4 | `Dia4-Oficina` | subtrai | 1213 |

## A fonte da verdade

Os `timeline.json` do pacote estão em `src/data/timeline/`. Cada
composição lê o seu: camadas, âncoras, posições, frames de entrada e
saída, efeitos, câmera. Nenhuma marca de frame é decidida no código, e a
mixagem põe os efeitos sonoros nos mesmos frames (o impacto de cada
batida, os `tiques_frames`, o pouso de cada desregistro, cada
`descolar_de`).

Um efeito "em n frames" ocupa n frames na tela contando as duas pontas: o
valor de partida no primeiro, o de chegada no n-ésimo (a batida de 3
frames mostra 1,18, 1,09 e 1,00, e o 1,00 é o impacto).

## O que fica fora do git

`public/` (chapas, papéis, narrações, mixagens) e `out/`. Para regenerar:

1. Descompactar o `vinland-shorts-CODE.zip` e copiar `1-contagem/`,
   `2-anel/`, `3-sagas/`, `4-oficina/`, `comum/` e `audio/` para `public/`,
   e `fontes/ebg-500.ttf` para `public/fontes/`. Os `timeline.json` já
   estão versionados em `src/data/timeline/`.
2. `python3 -m pip install numpy scipy pillow sherpa-onnx`
3. `python3 -I ferramentas/palavras.py . <modelo parakeet>` — tempo de cada
   palavra, para a legenda (já versionado em `src/data/palavras.json`).
4. `python3 -I ferramentas/preparar.py .` — mede as chapas, estende papéis
   e a chapa do anel com espelho.
5. `python3 -I ferramentas/legendas.py .` — legenda queimada e as .srt corrigidas.
6. `python3 -I ferramentas/mixagem.py .` — narração + efeitos.
7. `npm install` e `bash ferramentas/render.sh`.

## O que o JSON não diz, e o que foi feito

- **Legenda:** cada letra leva um halo do tom do próprio papel. As camadas
  do JSON passam pela faixa da legenda (as faixas pretas do anel, a última
  linha do arquivo e o numeral grande da contagem, a divisória das sagas),
  e a tinta escura apagava o texto. A legenda continua EB Garamond 500,
  corpo 40, #2A2622 a 80%, na faixa 1330–1430.
- **Anel:** para a chapa inclinada cobrir o quadro sem mudar de escala, ela
  é estendida com espelho (64 px). As faixas param de 1 a 5 px antes das
  bordas laterais; espelhadas, viravam um filete claro que a deriva trazia
  para dentro do quadro, então essa margem é trocada pelo espelho da tinta
  ao lado. A inclinação gira em torno da linha de medição (y=980), e a
  deriva de 1,5% corre entre o primeiro e o último tique.
- **Contagem:** o recuo do arquivo em 645 dura os 4 frames da batida da
  frase ("enquanto a frase entra") e usa a escala 0,94 do vocabulário de
  recuo; a tinta vai a 0,26, como o JSON pede.
- **Sagas e Oficina:** os empurrões do LEIA-PRIMEIRO (2% a cada 10 s nas
  sagas; 2% depois do fecho na oficina) não estão no JSON e foram mantidos.
- **Tremida** onde o JSON não dá `tremida_px` (a frase, o pouso de cada
  desregistro, o Haukr, o fecho): 3 px, a de uma batida comum, alternando
  o lado.
- **Sagas, profundidade:** os planos são os do JSON (translateZ 0 e −40 em
  perspective 2400). Com esses números a deriva de 2% separa as colunas em
  só 0,35 px ao longo dos 42 s; o que se vê da profundidade é a coluna da
  direita 1,6% menor e um pouco mais baixa.
- **Narração:** os frames do JSON caem no começo de cada frase falada, não
  na palavra (a "60" entra em "E elas discordam", o Haukr em "a cópia mais
  antiga", 3,5 s antes do nome dito). A legenda segue a fala medida.

## Render

```
1080×1920 · 30 fps · h264 · CRF 17 · yuv420p · faststart
```
