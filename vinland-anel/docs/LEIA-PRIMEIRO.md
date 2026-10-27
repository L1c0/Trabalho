# O ANEL — Short vertical, 1080×1920, 30 fps, 1266 frames (42,2 s)

Canal **@MangaEm60**. Este arquivo substitui integralmente o pacote
`2-anel/` anterior. **Joga o antigo fora.** A chapa de lá (`anel-9000.jpg`)
era madeira simulada e saiu como código de barras; esta é uma seção de
tronco desenhada, e o Short inteiro foi reconstruído em cima dela.

---

## O que a peça faz

Uma seção de tronco se **constrói na tela**, anel por anel, enquanto a
narração conta. Não é câmera passeando por cima de uma foto: o objeto não
existe no primeiro frame e existe no último, e a construção **é** o
argumento — os pesquisadores acharam o anel de 993 e contaram para fora
até a casca; a tela faz exatamente isso, vinte e oito vezes, na frente de
quem assiste.

**Uma tomada. Nenhum corte em 42 segundos.** Isso é a peça. Se aparecer um
corte, a peça morreu.

| frames | narração | tela |
|---|---|---|
| 0–8 | (silêncio) | o anel de 993 sozinho, em ferrugem, grande |
| 8–262 | "…registrada em todas as árvores vivas do planeta" | mais doze anéis de 993, de outras árvores, entram em ritmo acelerando e vazam pelas bordas |
| 262–280 | | os doze saem; sobra o nosso |
| 280–415 | "Um pico de carbono-14, no anel daquele ano" | empurrão de 4,8% de escala |
| 415–543 | "…madeira cortada por machado de metal" | a madeira desenha **para dentro**, do 993 até a medula |
| 556–612 | "Os nórdicos tinham machado de metal" | a câmera recua e o **contorno da casca** aparece |
| 612–650 | "Os habitantes do lugar, não" | parado no vão vazio entre o 993 e a casca — a pergunta desenhada |
| 650–676 | (pausa) | mergulho de volta até a borda do 993 |
| **676–965** | "…contaram para fora, um anel por ano, até a casca" | **a contagem**: 28 anéis, 10,32 frames cada |
| 965–987 | "Vinte e oito anéis" | para seco. O contador bate **28** |
| 987 | "Mil e vinte e um" | o **28 vira 1021** no mesmo lugar, na mesma fonte |
| 1061–1139 | "O ano exato em que a árvore caiu" | recuo de 19%; o disco inteiro com as 28 marcas |
| 1153–1266 | a pergunta | parado |

O numeral grande conta **anéis** durante a contagem e **vira a data** na
frase 7. É a conta se transformando em ano na frente da pessoa. Não troca
essa ordem.

---

## O mecanismo: um limiar, não 29 imagens

`chapa/mapa-anel.png` é um PNG de **16 bits em cinza**. O valor de cada
pixel é a **coordenada contínua de anel** daquele ponto: 0 na medula,
18→19 é o anel de 993, 46→47 é o de 1021, acima de 47 é casca, e
`49.0` é o topo da escala.

Revelar "até o ano N" é um corte de limiar nessa imagem. Nada é recortado
à mão, os contornos tortos saem certos de graça, e a frente avança
contínua em vez de pular de anel em anel.

A prensa rodou **uma vez** para fazer `chapa/disco.jpg`. Não rode nada por
frame: é isso que faz o papel ferver.

### Compositor (fragment shader)

```glsl
uniform sampler2D uDisco, uPapel;   // 2600×2600
uniform sampler2D uMapa;            // 2600×2600, 16 bits
uniform vec2  uCentroChapa;         // geometria.json -> centro
uniform float uEscala, uCY;         // timeline.json, por frame
uniform float uInterno, uFrente;    // idem
uniform float uCascaOp;             // idem
uniform float uContando;            // 0 ou 1
const float LADO = 2600.0, TOPO = 49.0, SUAVE = 0.06;

void main() {
  vec2 tela = gl_FragCoord.xy;                       // y para baixo
  vec2 p = (tela - vec2(540.0, uCY)) / uEscala + uCentroChapa;
  vec2 uv = p / LADO;

  // papel ladrilhado — papel.jpg nao tem emenda, repete limpo
  vec3 papel = texture2D(uPapel, fract(uv)).rgb;

  bool fora = p.x < 0.0 || p.x >= LADO || p.y < 0.0 || p.y >= LADO;
  float m   = texture2D(uMapa, uv).r * TOPO;

  float vis = clamp((m - uInterno)/SUAVE, 0.0, 1.0)
            * clamp((uFrente - m)/SUAVE, 0.0, 1.0);

  if (uCascaOp > 0.0) {
    float casca = uCascaOp
                * clamp((m - 47.0)/SUAVE, 0.0, 1.0)
                * clamp((48.2 - m)/SUAVE, 0.0, 1.0)
                * clamp((1140.0 - tela.y)/40.0, 0.0, 1.0);  // nao cruza a regua
    vis = max(vis, casca);
  }
  if (fora) vis = 0.0;

  vec3 disco = texture2D(uDisco, uv).rgb;
  // borda umida: a tinta adensa na frente que avanca
  float molha = clamp(1.0 - abs(m - uFrente)/0.45, 0.0, 1.0)
              * step(m, uFrente) * uContando;
  disco *= (1.0 - 0.21 * molha);

  gl_FragColor = vec4(mix(papel, disco, vis), 1.0);
}
```

O recorte da casca em `tela.y < 1140` existe porque sem ele o contorno
passa por trás do número e da régua e vira sujeira. Já testei com e sem.

---

## `timeline.json`

1266 linhas, uma por frame, em `quadros`. Colunas:

```
frame  escala  cy  interno  frente  casca_op  aneis_contados  contando
```

**Lê a tabela, não recalcula.** Ela já é exatamente o que eu renderizei e
conferi quadro a quadro. As fórmulas estão em `marcos` só para você
entender o porquê, não para refazer a conta.

Sem easing, sem spring, sem mola em lugar nenhum. Os recuos são lineares
em log da escala (velocidade de zoom constante); a contagem trava a
escala na frente que avança — por isso a câmera acelera nos anos largos e
desacelera nos estreitos. Isso é a madeira falando, não um efeito. Não
suaviza.

---

## Tipografia — tudo já impresso, é só posicionar

Peças em `tipo/`, PNG com alfa, já passadas na prensa. **Não compõe texto
em tempo de render**, e não usa Cormorant em lugar nenhum (o acento sobe
acima da maiúscula).

```
rot-lugar.png     topo, centrado em x=540, y=165   (a partir do frame 431)
n-1 … n-28        numeral grande, canto esquerdo x=150, base em y=1255
n-1021            idem, a partir do frame 987
rot-aneis.png     à direita do numeral, x = 150 + largura + 30, base y=1248
rot-ano.png       substitui rot-aneis a partir do frame 987
regua-base.png    x=150, y=1306   (a partir do frame 676)
tique.png         marca k em x = regua.marcas_x[k], base y=1314
tique-5.png       nos múltiplos de 5, em ferrugem
regua-998 … 1018  rótulo abaixo da marca, y=1320
arvore-1 … 12     posições e frames de entrada/saída em timeline.json
```

**A régua está na escala da chapa.** O espaçamento entre as marcas é a
largura de cada anel **nesta seção desenhada** — por isso 1004–1006
aparecem apertados e 1008–1012 abertos. Não normaliza para espaçamento
igual: a régua tem que bater com o disco.

> **Ressalva de honestidade.** As larguras dos anéis são uma série
> plausível que eu gerei, **não** as medições do material de L'Anse aux
> Meadows. Esta peça é um **diagrama declarado** — uma seção de tronco
> desenhada à geometria real da dendrocronologia —, na mesma categoria do
> `g01-anel-993.png` do ensaio, e não uma fotografia simulada de madeira.
> O que é verificável e está certo: o ano do pico de carbono-14 (993), a
> contagem (28 anéis) e a data resultante (1021), de Kuitems et al.,
> *Nature*, 2021. **Nenhum texto na tela, na descrição ou na narração
> afirma que as larguras são medidas.** Se alguém perguntar, a resposta é
> essa.

**Legenda queimada:** EB Garamond 500, corpo 40, entre `y=1380` e
`y=1500`. Texto e tempos em `2-anel.srt`, 17 cartelas, nenhuma linha passa
de 36 caracteres. As quebras já estão medidas nas pausas reais da
gravação — usa como está.

---

## Áudio

```
audio/2-anel.mp3        narração, 42,192 s
audio/anel-tiques.mp3   28 tiques + a parada seca. Mudo até 22,87 s
audio/anel-trilha.mp3   lofi. Mudo até 34,2 s, entra depois que o movimento para
```

Soma os três **direto, sem ducking**, depois normaliza em −16 LUFS / −1,5
dBTP. Conferido: dá −16,0. Os tiques caem exatamente no fechamento de cada
anel, nos frames `676 + k × 10,32`.

Sem whoosh, sem riser, sem impacto de sub-grave. Pico de efeito em −20 dBFS.

---

## Render

```
1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart
```

CRF baixo porque o quadro é papel com grão fino e gradiente de tinta — é
o que mais sofre com compressão. O primeiro frame já está cheio (o anel de
993 grande), que é a exigência do feed.

---

## O que não fazer

- Não cortar. Nenhum corte, em nenhum ponto.
- Não rodar a prensa por frame.
- Não pôr blur, bloom, profundidade de campo, sombra ou material PBR.
- Não acelerar nem suavizar a contagem para ficar "mais fluida".
- Não trocar a régua por espaçamento igual.
- Não pôr "vídeo completo no canal" na tela. Isso vai na descrição.
