# Vagabond — ensaio em vídeo

Canal **@MangaEm60**. Ensaios sobre mangá com pesquisa real como
diferencial declarado.

Montar um vídeo de **9min11 (551,26 s · 16.538 frames), 1920×1080, 30 fps**,
em Remotion. Narração gravada, cortada e normalizada. Trilha e leito de
sala prontos. As batidas da fala estão mapeadas em número de frame. Falta a
imagem.

---

## Ordem de leitura

1. **`docs/vagabond-BRIEFING.md`** — a arquitetura. Fonte da verdade.
2. **`docs/vagabond-AUDIO.md`** — a partitura de cor em frames, e as 214
   falas com o frame de cada uma.
3. `docs/vagabond-roteiro.md` — o texto narrado.
4. `docs/vagabond-FONTES.md` — de onde veio cada afirmação, com nível de
   confiança. Serve pra montar a descrição do vídeo.

## Os quatro pacotes

| zip | conteúdo | destino |
|---|---|---|
| **1 PROJETO** (este) | briefings, ferramentas, fontes, provas | raiz |
| **2 ÁUDIO** | narração, trilha, leito, efeito | `public/audio/` |
| **3 GRAVURA · PINTURA · LUGAR · DOCUMENTO** | 15 peças | `public/` |
| **4 MANGÁ** | 15 páginas do Vagabond | `public/manga/` |

Descompacta os quatro na mesma raiz.

---

## Este vídeo não é o Vinland nem o Houseki

**Nada de prensa.** A `prensa.py` vai junto só porque o módulo de
tipografia dela é usado (`linha`, `caixa_tinta`, `fonte`, `reservar`). A
simulação de impressão **não entra**: Vinland é prensa, este é pincel.

O tratamento de imagem é `ferramentas/sumi-tratamento.py` — fibra de
washi, mordida úmida na borda do traço, pontos de branco e preto tirados
da própria peça.

**Ele também é o resgate de resolução.** Várias páginas vieram entre 700 e
1600 px. Medido: uma página de 768 px tratada em sumi aguenta a **largura
inteira do quadro** sem amolecer — ver `ferramentas/sumi-prova.jpg`. Mesmo
papel que a prensa fazia no Vinland.

> **Calibrar o grão.** A prova saiu entre 10,8 e 17,7 e o alvo da casa é
> **6 a 8**. O grão não está escalando com o tamanho de saída. Corrigir
> antes de tratar o material todo.

---

## As cinco regras que decidem o resultado

**1. A partitura de cor é a tese.** Doze viradas, todas já caídas em pausa
real medida, no `vagabond-AUDIO.md`. A saturação sobe de 0% até 100% no
pico do kabuki e **nunca mais sobe**. Drena e acaba em 0% no fecho. Isso
não é estética: é o vídeo saindo da lenda e chegando no homem.

**2. Nada de render sombreado.** 3D aqui é geometria e câmera: papel em
perspectiva e objeto em arame, só linha. Sem material, luz, reflexo,
sombra, bloom ou profundidade de campo.

**3. Profundidade é cara e rara.** `ferramentas/parallaxe.py` mostra o
movimento funcionando no tríptico. Mas foi **provado que não existe
separação automática**: exigindo conexão com a borda superior a máscara
zera; afrouxando, ela invade o mar. Em ukiyo-e o escuro é o contorno de
tudo. Toda máscara é recorte à mão. Reservar pra três momentos: a chegada
em Ganryūjima, a baleia, e o fecho no picanço. Nenhum plano passa de 13%
de ganho de escala.

**4. O resto é câmera paciente.** Empurrão de 4 a 7% em 8 a 14 segundos,
velocidade constante, sem easing. Corte de escala seco na mesma imagem. O
que faz parecer caro não é efeito, é paciência e enquadramento.

**5. Português com acento e cedilha, sempre**, e corpo/empilhamento saem
de `P.caixa_tinta()`, nunca do olho. As quatro fontes têm todos os glifos;
o acento sobe de 19 a 31 px em corpo 120, o que muda a altura da linha.

---

## Os dois cortes que carregam o vídeo

**Frame 9983 — espetáculo para vazio.** A baleia em 100% de saturação sai
e entra papel limpo para a chamada. Corte seco de cor cheia para branco,
coincidindo com a única quebra de tom do vídeo. O **carimbo** cai aqui
(`ferramentas/carimbo-hanko.py`, demonstrado em `vag-carimbo.mp4`): o
vermelhão aparece no instante em que toda a outra cor foi embora.

**Frame 15532 — o retorno.** O picanço volta e fica até o fim. Depois de
cinco minutos e meio sem a pintura, ela chega como prova e como alívio.

O picanço aparece na abertura, some, e só volta aqui. Usá-lo no meio
enfraquece os dois.

---

## Áudio, pronto e medido

```
narração  public/audio/vag-narracao.mp3    -16,0 LUFS   pico -1,5 dBFS
trilha    public/audio/vag-trilha.mp3      envelope que SEGUE a saturação
leito     public/audio/vag-leito-sala.mp3  -50,0 LUFS, 20 s, loop perfeito
```

**A trilha não toca o vídeo inteiro de propósito.** Ela é muda na abertura
cinza, entra a −44 LUFS com o Yoshikawa, chega a −30 no pico do kabuki,
drena para −56 no bloco do Inoue e fica muda de novo no fecho. A lenda tem
pulso; a prova tem silêncio. Somar as três direto, **sem ducking**, dá
**−16,0 LUFS / −1,5 dBTP** — conferido.

Os arquivos vieram em MP3 e não FLAC porque **a gravação original é MP3 de
128 kbps**: o teto de qualidade já estava posto na origem, e FLAC só
triplicava o tamanho preservando os artefatos do MP3.

---

## Pendências que não são da montagem

- **`p02-shomen-daruma-CONFIRMAR.jpg`** — a atribuição ao Musashi existe
  (o *Shōmen Daruma-zu* está na lista de obras dele), mas não foi
  confirmado que esta foto é daquela pintura. **Só usar se o acervo for
  nomeado.** Se não, cortar: o Koboku Meigekizu carrega o bloco sozinho.
- **`l04-monumento-CONFIRMAR.jpg`** — a foto parece memorial moderno. O
  Kokura hibun de 1654 é uma pedra alta e desgastada em Tamukeyama,
  Kitakyushu. **Não rotular como "a pedra de 1654" sem confirmar.**
- **Falta** capa de edição antiga do romance em japonês (temos a
  brasileira) e uma página manuscrita do Go Rin no Sho (a edição
  brasileira reproduz caligrafia na abertura e cobre parcialmente).
- **Legenda:** deixar o YouTube gerar, baixar o SRT e mandar pra correção.
  A automática erra todo nome próprio.

---

## Render

```
1920×1080 · 30 fps · h264 · CRF 16 · yuv420p · faststart
subir em 2560×1440
```

CRF baixo de propósito: aguada de tinta e papel vazio são o que mais sofre
com compressão, e o vídeo é feito de gradiente suave.
