# Houseki — quatro Shorts verticais

Canal **@MangaEm60**. Ensaios em vídeo sobre mangá, com pesquisa real como
diferencial declarado.

A tarefa: montar **quatro Shorts 1080×1920, 30 fps**, em Remotion. A
narração está gravada, cortada e normalizada. A trilha, o leito de sala e
os efeitos estão prontos. As batidas da fala estão mapeadas em número de
frame. Falta a imagem.

---

## Ordem de leitura

1. **`docs/houseki-SHORTS-V2.md`** — o briefing. É a fonte da verdade.
2. **`docs/houseki-shorts-AUDIO.md`** — duração, frames e a tabela de
   batidas de cada Short, com a fala que começa em cada frame.
3. `prensa/LEIA.md` — a API do módulo de impressão.
4. `docs/SHORTS-v1-ANTIGO.md` — **substituído** na parte visual pelo V2.
   Continua valendo para zona segura, ordem de publicação e metadados.

## Os quatro pacotes

| zip | o que tem | onde vai |
|---|---|---|
| **1 PROJETO** (este) | briefings, `src/`, `prensa/` + fontes, configs, provas | raiz |
| **2 NARRAÇÃO** | os quatro FLAC de voz | `public/audio/shorts/` |
| **3 TRILHA** | trilha, leito de sala, dois efeitos | `public/audio/shorts/` |
| **4 IMAGENS** | as 11 chapas nomeadas no briefing + a fosfofilita | `public/` |

Descompacta os quatro na mesma raiz; os caminhos internos já batem.

---

## As cinco regras que decidem o resultado

**1. A prensa roda uma vez por peça, nunca por frame.** Se a semente mudar
a cada frame, o papel ferve: o grão pisca, a mancha anda, a falha troca de
lugar 30 vezes por segundo. Grão fervendo é o sinal mais óbvio de ruído
aplicado em camada de vídeo. Papel de verdade não muda — só a câmera se
move. O Python imprime; o Remotion move.

**2. Nada de render sombreado.** 3D aqui é geometria e câmera: papel em
perspectiva e objeto em arame, só linha. Sem material, luz, reflexo,
sombra, bloom ou profundidade de campo. O canal vende pesquisa e imagem
real; render com material entrega o contrário antes do clique. Detalhes no
§2 do briefing.

**3. Português com acento e cedilha, sempre.** As quatro fontes têm todos
os glifos. As provas em `prova/tipo-*.jpg` estão **sem acento** — foi
pressa minha na geração, não é limitação de fonte, e não deve ser copiado.
Ver `prova/fontes-acentos.jpg` e o §4-bis.

**4. Corpo e empilhamento saem de `P.caixa_tinta()`, nunca do olho.** A
caixa métrica da fonte não é onde a tinta está — no Anton ela é muito
maior que o olho do numeral. Estimando no olho eu colidi um rótulo com um
numeral e estourei uma margem. O código corrigido está em
`prova/tipo-referencia.py`.

**5. Um movimento por batida, e silêncio entre eles.** As batidas estão em
frames no `houseki-shorts-AUDIO.md`. Entre dois movimentos a imagem fica
parada de verdade — é a parada que faz o próximo ser sentido. Denso não é
agitado.

---

## O que está pendente e não é culpa da montagem

- **A licença da foto de fosfofilita** (`public/mineral/`) ainda não foi
  confirmada no Wikimedia Commons. A peça tratada está pronta, mas **não
  publicar** antes do autor e da licença estarem na descrição do vídeo.
- **A régua de Mohs do §5.4 ainda não faz trabalho.** Na prova estática os
  ticks não correspondem às posições do 3,5 e do 10. Em movimento isso tem
  que ser resolvido: a régua se desenha, os ticks aparecem conforme a linha
  passa, e só então o marcador e o número entram. Primeiro a régua existe,
  depois ela mede.

## Render

```
1080×1920 · 30 fps · h264 · CRF 16 · yuv420p · faststart
```

CRF baixo de propósito: grão e traço fino são as duas coisas que mais
sofrem com compressão, e são justamente o ativo aqui.
