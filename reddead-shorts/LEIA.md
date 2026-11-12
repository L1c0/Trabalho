# Red Dead Redemption 2 · dois Shorts em tinta

Dois Shorts narrados, em Remotion, 1080×1920 a 30 fps:

| Short | Tema | Duração | Narração |
| --- | --- | --- | --- |
| 1 · "Acabou numa tabela" | o boletim do censo de 20 de abril de 1891 | 54,9 s (1.647 quadros) | `originais/narracao-1.mp3` |
| 2 · "44 anos de nada" | a tuberculose e a estreptomicina | 52,3 s (1.568 quadros) | `originais/narracao-2.mp3` |

O visual é o dos cartazes do jogo: tinta preta sobre papel dourado, vermelho
ou creme. O vídeo de referência (um trecho de abertura em estilo de
créditos) serviu de norte para a linguagem, não foi copiado.

## Os takes viram tinta

O vídeo de takes do Arthur veio pequeno e escuro (848×478). Ampliado quatro
vezes para encher a tela vertical, ficaria borrado. Em vez disso, cada take
é convertido numa silhueta de tinta por `ferramentas/tinta.py`:

1. o brilho de cada ponto é comparado com o do fundo em volta (o máximo
   local, alisado); o que é bem mais escuro que o fundo vira tinta;
2. a conta é feita no quadro já ampliado e alisado, então a borda sai
   limpa, sem os blocos da compressão;
3. o resultado é um vídeo em tons de cinza (fundo branco, tinta preta).

No Remotion a silhueta entra por modo de mistura (`src/kit/Tinta.tsx`):
multiplica sobre o papel, entra em negativo sobre fundo escuro, ganha cor,
ou serve de janela para outra imagem (a mancha vermelha no peito do Short 2).

Os planos estão em `ferramentas/takes.json`, com o trecho do vídeo de takes,
o enquadramento e o limiar de cada um. Oito entram nos Shorts: rua, revolver,
lua, morro, raio, coldre, busto e acampa (floresta, lua2 e sol ficaram de
fora na montagem). O único plano em cores é o pôr do sol do fecho ("Mais um
amanhã"), um corte direto do vídeo de takes.

## O som

`ferramentas/mixagem.py` monta o áudio de cada Short:

- **Narração.** Perde o silêncio do começo (0,80 s no Short 1 e 0,68 s no
  Short 2), sobe de −27 para −15,7 LUFS e passa por um compressor leve.
- **Música.** A instrumental enviada (`originais/musica.mp3`), por baixo da
  voz. Abre 5 dB nas pausas da fala e some onde a partitura pede (no tiro do
  Short 1 e no "nada" do Short 2). O Short 1 usa o começo da faixa; o Short 2
  entra em 1:35.
- **Efeitos sonoros.** Todos feitos por síntese em `ferramentas/efeitos.py`
  (tiro, engatilhar, carimbo, máquina de escrever, pena, sino, trovão,
  galope, coração, vidro, sopros de transição e outros). Não há arquivo de
  banco de sons.
- **Partitura.** `ferramentas/partitura.py` diz o que soa e quando. Os
  tempos saem dos mesmos arquivos que a imagem usa (as palavras de
  `src/data/sN.ts` e os cortes de `src/sN/tempo.ts`), então o carimbo bate no
  som no mesmo quadro em que bate na tela.

O conjunto sai em −14 LUFS, limitado em −3 dBTP. A folga é para a
compressão AAC: nas batidas secas (o tiro, as tarjas, o "1899" do Short 2)
ela cria picos de até 3 dB. Nos vídeos finais, com som AAC a 320 kb/s, o
pico fica em −2,5 dBTP no Short 1 e −0,5 dBTP no Short 2.

## Como refazer

Os arquivos de mídia não vão para o repositório. Com os quatro originais em
`originais/` (`takes.mp4`, `narracao-1.mp3`, `narracao-2.mp3`, `musica.mp3`):

```
npm install
python3 -I ferramentas/tinta.py        # os takes em tinta  -> public/takes/
python3 -I ferramentas/papel.py        # papel e manchas    -> public/
python3 -I ferramentas/mixagem.py 1 2  # o som              -> public/audio/
node ferramentas/render.mjs            # os dois Shorts     -> out/ShortN-master.mp4
bash ferramentas/entrega.sh            # cópias de até 29 MiB -> out/entrega/
```

O pôr do sol em cores sai deste comando:

```
ffmpeg -ss 0.10 -i originais/takes.mp4 -t 9.2 -an \
  -vf "fps=30,crop=269:478:236:0,scale=1080:1920:flags=lanczos,gblur=sigma=2.2" \
  -c:v libx264 -preset slow -crf 17 -g 12 -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart public/takes/sol-cor.mp4
```

`src/data/takes.json` guarda o tamanho e o número de quadros de cada vídeo
de `public/takes` e `public/tinta`; se um take mudar, ele precisa ser
atualizado. `python3 -I ferramentas/fontes.py` só é preciso se as fontes
mudarem. Python precisa de numpy, scipy, opencv e pillow; o ffmpeg precisa
estar instalado.

Quadros soltos, sem renderizar o vídeo:
`node ferramentas/quadros.mjs Short1 0 300 900` (saem em `out/quadros`).

## O código

- `src/data/s1.ts`, `s2.ts`: a narração palavra por palavra, com o tempo de
  cada uma, já dividida em blocos de legenda. O asterisco marca o bloco que
  a cena mostra como letreiro (a legenda não repete).
- `src/s1/`, `src/s2/`: as cenas de cada Short e o seu relógio (`tempo.ts`).
- `src/kit/`: as peças. `Tinta` (takes e manchas), `Cena` (papel, câmera,
  brasas, sol, pincelada de corte), `Texto` (texto cinético, hodômetro),
  `Legenda`, `Pecas` (carimbo, máquina de escrever, assinatura, tarja),
  `Mapa` (os EUA em traço), `Fecho`.
- As fontes (Anton, Oswald, Cinzel, Old Standard TT, Special Elite, Pinyon
  Script e Alfa Slab One) são livres e vão embutidas no código.

## O que está na tela e de onde vem

- **Boletim.** "Extra Census Bulletin No. 2 · Distribution of Population
  According to Density: 1890 · April 20, 1891 · Robert P. Porter,
  Superintendent of Census", como diz a narração. A página é uma
  reconstituição tipográfica, não um fac-símile.
- **Tabela.** As seis faixas (menos de 2, 2 a 6, 6 a 18, 18 a 45, 45 a 90,
  90 ou mais habitantes por milha quadrada) são as classes de densidade do
  censo. Os números das casas são decorativos: mudam a cada três quadros e
  não representam dado nenhum.
- **Citação.** "In a recent bulletin of the Superintendent of the Census…" é
  a abertura do ensaio de Frederick Jackson Turner, lido em Chicago em 12 de
  julho de 1893.
- **Mapa.** A linha de 1880 e os núcleos de povoamento são um esquema, o
  mesmo do vídeo longo.
- **Short 2.** A "receita" (Paciente: A. Morgan) é encenação. Os números
  são os da narração: 194 mortes por 100 mil habitantes ao ano, a
  estreptomicina isolada em 1943 e testada em pacientes em 1944.

## Pendências

- **Música.** A faixa é a canção original do jogo. O YouTube costuma
  reconhecer esse tipo de faixa e pode reivindicar o vídeo.
- **"Um historiador de Chicago".** Turner era professor em Wisconsin; o
  ensaio é que foi lido em Chicago. A tela diz "Chicago, 12 de julho de
  1893", que vale para os dois sentidos. O áudio não foi alterado.
- **Ouvir uma vez.** A mixagem foi conferida por medição (volume, pico,
  equilíbrio entre voz, música e efeitos), não de ouvido.
