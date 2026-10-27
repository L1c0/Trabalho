# A OFICINA — Short vertical, 1080×1920, 30 fps, 1215 frames (40,49 s)

Canal **@MangaEm60**. Substitui o `4-oficina/` antigo. **Joga o antigo fora**
— lá as oito construções eram oito pastilhas arredondadas idênticas, o que
é falso: o sítio tem planta publicada.

**Remotion. Sem shader.**

---

## O que a peça faz

A planta do sítio está **inteira no primeiro frame** (exigência do feed).
A cada construção que a narração menciona ir embora, **uma some**. No fim
resta papel vazio com uma linha só. É o oposto do Short da contagem, onde
a página enche — e é verdadeiro: eles levaram tudo.

| frames | narração | tela |
|---|---|---|
| 0 | "…tem oito construções de turfa" | a planta completa + rótulo |
| 247 | "ferramenta de carpintaria, rebite de barco…" | a lista de achados entra |
| 556–769 | "E eles foram embora em ordem" | as oito somem, uma a cada 26,6 frames, na ordem B C A E D G F J |
| 760 | | o rótulo sai |
| 779 | "A terra prometida era uma oficina" | a frase imprime no papel vazio |
| 842–1090 | a pergunta | só legenda |

---

## A planta

```
A, D, F   salões (edifícios longos de várias salas)
B, C, E, G cabanas
J         a cabana do forno, em ferrugem, do outro lado do riacho
terreno.png  a borda do terraço e o riacho
```

Três conjuntos de moradia — cada um um salão grande com sua cabana —
alinhados e igualmente espaçados num terraço curvo; o complexo de ferro
separado, do outro lado do riacho, no braço do terraço mais perto do mar.
Parede de turfa desenhada em linha dupla, que é a convenção de planta
para parede espessa.

> **Ressalva de honestidade.** Isto é um **esquema declarado** da
> disposição do sítio, não o decalque de uma planta de escavação. O que
> está certo e é verificável: são oito construções; são três conjuntos de
> salão + cabana alinhados num terraço curvo; o complexo de ferro fica
> separado, do outro lado do riacho. As medidas exatas e as coordenadas
> **não** são levantamento. Nada na tela, na narração ou na descrição
> afirma que são.

---

## `timeline.json`

1215 linhas em `quadros`:

```
frame  escala  terreno  rotulo  achados  fecho  c-B c-C c-A c-E c-D c-G c-F c-J
```

As colunas são opacidade por frame. Lê a tabela, não recalcula.

**A saída não é fade.** `mascara-1..8.png` são máscaras de ruído de quadro
inteiro, em cinza. Some cada construção por **limiar subindo** sobre a
máscara — a tinta descola em manchas, como chapa sendo arrancada do papel.
A coluna de opacidade é o valor do limiar, de 1 a 0.

**`achados.png` colide com a planta** na posição original (y 1059–1214,
em cima dos edifícios). Desenha com `translateY(+260px)`. Já está no JSON
em `achados.deslocar_y`.

`escala` 1,000 → 1,045 linear, `transformOrigin: '540px 840px'`. Deriva
lenta, sem easing, sem mola.

---

## Regras

- Frame 0 **já está cheio**. Não começa vazio.
- Prensa não roda por frame.
- Sem blur, bloom, sombra, profundidade de campo ou material PBR.
- Legenda queimada: EB Garamond 500, corpo 40, entre `y=1420` e `y=1530`.
  Tempos em `4-oficina.srt`.
- Áudio: `audio/4-oficina.mp3`, já cortado. Sem trilha.
- Render: `1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart`.
- Nada de "vídeo completo no canal" na tela.
