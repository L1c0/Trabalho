# Antes da Lenda · Red Dead Redemption 2 — o vídeo longo (v4)

Refação completa do vídeo em Remotion. O vídeo tem 1920×1080 a 30 fps e
22.614 quadros (12:33,8). A narração e a música são as mesmas da v1
(`public/trilha.mp3`, 749,06 s, −14,6 LUFS); a imagem é toda nova.

## A estrutura

| Trecho | Quadros | O que é |
| --- | --- | --- |
| Vinheta | 0–131 (4,4 s) | Abertura de série, só com música: a linha vermelha acende, abre em "ANTES DA LENDA", a câmera mergulha na letra e a tela vira faixas de luz. |
| Silêncio | 132–173 (1,4 s) | Tela preta e silêncio de verdade, até a voz. |
| Vídeo | 174 em diante | A voz entra no quadro 174 (5,8 s). A trilha começa no quadro 144; o primeiro segundo dela já é silêncio. |

Todo o resto do vídeo está em tempo de trilha: o quadro do vídeo é o quadro
da trilha mais 144 (`B0` em `src/tempo.ts`).

## O que mudou em relação à v3

- **Abertura falada (0–52 s da trilha).** Em vez de chapas, tipografia
  cinética: cada frase tem o seu desenho e as palavras entram no instante em
  que são ditas.
- **Tudo sincronizado com a voz.** A narração foi transcrita com o tempo de
  cada palavra (`docs/palavras.txt`). Os letreiros usam esses tempos. Na v3,
  várias chapas entravam atrasadas ou fora da ordem da fala (o "194" aparecia
  7 s depois de dito; a lista de remédios vinha antes do "Nada").
- **Motion graphics no lugar das 16 chapas.** A neve de 1899 com o ano
  voltando no hodômetro; o contador da tuberculose com 194 riscos de
  contagem; a linha do tempo de 44 anos; o receituário datilografado; o
  boletim do censo; o mapa em que a linha de 1880 se quebra no tempo da
  citação; a frase que viaja de Washington a Chicago; a floresta que vira
  planilha; Fort Worth (o retrato, a vitrine, o detetive, as circulares de
  Nevada a Minnesota); a corrente de citações sem fonte; o retrato do
  "I'm afraid"; e o cartão final com a pergunta.
- **Clipes do jogo com letreiros dinâmicos.** Tarjas, palavras de impacto,
  carimbos, máquina de escrever e luz elétrica, sempre no tempo da fala. Cada
  clipe tem a sua cor (a de Saint Denis é fria; a do fim vai perdendo a cor).
- **Interface do jogo escondida.** Três trechos dos clipes mostravam menus do
  jogo. Cada um virou um cartão tipográfico (tempos da trilha): a roda de
  armas (4:31–4:34), o painel do cavalo (11:11–11:15) e o filtro laranja do
  começo do último clipe (11:18–11:21).

## O som

- `public/vinheta.mp3` (5 s): o som da abertura, feito por síntese em
  `ferramentas/vinheta-som.py` (duas batidas graves nos quadros 8 e 26 e uma
  subida em ré menor), com a música do vídeo junto. Depois de 4,37 s é
  silêncio absoluto.
- A música da vinheta é o trecho de 10:00 a 10:04 da trilha, onde não há voz.
  Como voz e música vieram mixadas num arquivo só, não existe a música
  separada. Se você tiver o arquivo da música, dá para refazer a vinheta com
  ele:
  `python3 -I ferramentas/vinheta-som.py <musica> <segundo de início> <ganho>`.
- `public/trilha.mp3`: a trilha mixada da v1, sem alteração.

## Como renderizar

```
npm install
node ferramentas/render.mjs
```

Sai `out/reddead-v4-master.mp4` (H.264 CRF 16, yuv420p, bt709, faststart).
`--crf=18` dá um arquivo menor, `--crf=12` a qualidade máxima,
`--frames=a-b` renderiza só um trecho e `--gl=swangle` resolve erro de GPU.

Quadros soltos para conferir, sem renderizar o vídeo:
`node ferramentas/quadros.mjs 500 3000 9000` (saem em `out/quadros`).

## O código

- `src/tempo.ts`: os quadros da vinheta, do silêncio e do início da trilha.
- `src/Video.tsx`: o roteiro de cenas (`CENAS`) e o áudio.
- `src/cenas/`: uma função por cena. `Vinheta`, `Abertura`, `Grafismos1`
  (neve e tuberculose), `Documento` (boletim, mapa, Turner, tabela),
  `FortWorth`, `SemFonte`, `Fim` (I'm afraid e cartão final) e
  `Jogadas1`–`Jogadas3` (os clipes do jogo).
- `src/kit/`: as peças. `Texto` (texto cinético, hodômetro, riscos),
  `Letreiro` (tarja, impacto, carimbo, máquina, luz elétrica), `Cena`
  (fundos, poeira, neve, grão, câmera), `Jogo` (clipe com cor e acabamento),
  `Mapa` (os EUA em traço, com câmera e rotas), `Pecas` (papel, setas,
  grades) e `Floresta` (a faixa vermelha da série).
- As fontes (Anton, Oswald, IBM Plex Mono e Source Serif 4, todas OFL) vão
  embutidas em `src/kit/fontes-dados.ts`. Nenhuma fonte é baixada no render.

## Pendências

- **Fala e fato não batem em dois pontos.** O áudio é o da narração e não foi
  alterado.
  - 4:42 do vídeo: a narração diz "em 1890, nove anos antes". O boletim é de 20 de
    abril de 1891. A tela mostra "Censo de 1890" e, em letra pequena, a
    referência certa (Extra Census Bulletin nº 2, 20 abr. 1891).
  - 6:40 do vídeo: a narração diz "dois sentados, três em pé". No retrato real de
    Fort Worth são três sentados e dois em pé. A ilustração mostra os cinco
    numa fileira só, sem afirmar nem uma coisa nem outra.
- **O retrato de Fort Worth é ilustração.** A foto real não veio no pacote; a
  tela avisa ("ilustração · o retrato original é de John Swartz, 1900"). Se
  você tiver a foto com licença de uso, dá para pôr no lugar.
- **Conferir de ouvido** (vieram do pacote anterior; tempos do vídeo novo):
  6:30 John Swartz, 6:34 Butch, 8:46 Saint Denis.
- **Tela final.** O lado direito do cartão final (12:19 em diante) está
  livre para os elementos de tela final do YouTube.
