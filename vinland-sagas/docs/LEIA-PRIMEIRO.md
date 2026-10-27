# AS DUAS SAGAS — Short vertical, 1080×1920, 30 fps, 1258 frames (41,93 s)

Canal **@MangaEm60**. Substitui o `3-sagas/` antigo. **Joga o antigo fora.**

**Remotion. Sem shader.** São `<Img>` de quadro inteiro, empilhados, com
opacidade por frame. Nada é composto por pixel.

---

## O que a peça faz

Uma página se **compõe linha a linha**, como um documento sendo batido:
os nomes das duas sagas, depois sessenta contra cento e quarenta, depois
quem levou o crédito, depois os duzentos anos de distância. Quando a
narração chega no Haukr, **a página inteira duplica fora de registro** e
desbota — a fonte que sobrou é uma cópia, e a cópia não bate. Aí o nome
dele carimba por cima, em ferrugem.

O defeito do pacote antigo era que todas as peças entravam ao mesmo tempo
e ficavam uma em cima da outra. Aqui cada uma tem frame de entrada.

| frames | narração | tela |
|---|---|---|
| 0 | (abre) | os dois cabeçalhos e o filete já impressos |
| 249 / 300 | "Uma diz sessenta homens. A outra, cento e quarenta." | SESSENTA HOMENS, depois CENTO E QUARENTA |
| 401 / 470 | "…crédito por coisas que a outra atribui a outras pessoas" | THORFINN FEZ / OUTROS FIZERAM |
| 614 | "…mais de duzentos anos depois dos fatos" | 200 ANOS DEPOIS DOS FATOS |
| 880 | "…a cópia mais antiga que sobrou" | **desregistro**: a página toda duplica |
| 927 | "…Haukr Erlendsson" | HAUKR ERLENDSSON em ferrugem, por cima |
| 1152–1247 | a pergunta | só legenda |

---

## `timeline.json`

1258 linhas em `quadros`:

```
frame  escala  tinta_base  tinta_fantasma  dx  dy  opac_haukr
       cabecalho  divisor  esq-60  dir-140  esq-credito  dir-credito  200-anos
```

As sete últimas colunas são a opacidade de cada peça **naquele frame**, já
multiplicadas por `tinta_base`. Usa direto.

**O desregistro.** A partir do frame 880, desenha **outra vez** todas as
peças visíveis, deslocadas de `(dx, dy)`, com opacidade `tinta_fantasma`,
**por baixo** da camada normal. A camada normal cai para 30%. É isso que
faz a página ficar difícil de ler no momento exato em que a narração diz
que o texto foi mexido.

```jsx
<AbsoluteFill style={{background:`url(papel-sagas.jpg)`}}>
  <div style={{transform:`translate(${dx}px, ${dy}px)`}}>
     {pecas.map(p => <Img src={p} style={{opacity: op[p]*fantasmaRel}} />)}
  </div>
  {pecas.map(p => <Img src={p} style={{opacity: op[p]}} />)}
  <Img src="haukr.png" style={{opacity: opacHaukr}} />
</AbsoluteFill>
```

A `escala` (1,000 → 1,040 linear ao longo do Short) vai num container que
envolve tudo, com `transformOrigin: '540px 860px'`. É deriva lenta, não
efeito. Sem easing, sem mola.

---

## Regras

- O frame 0 **já está cheio** (cabeçalho + filete). Não começa vazio.
- Nenhuma peça entra antes do frame da tabela. Era esse o bug.
- Prensa não roda por frame. Tudo já está impresso.
- Sem blur, bloom, sombra, profundidade de campo ou material PBR. O
  desregistro é deslocamento e opacidade, **não** é blur.
- Legenda queimada: EB Garamond 500, corpo 40, entre `y=1480` e `y=1600`.
  Tempos em `3-sagas.srt`.
- Áudio: `audio/3-sagas.mp3`, já cortado e normalizado. Sem trilha.
- Render: `1080×1920 · 30 fps · h264 · CRF 18 · yuv420p · faststart`.
- Nada de "vídeo completo no canal" na tela.
