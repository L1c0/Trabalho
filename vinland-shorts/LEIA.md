# Vinland — quatro Shorts

Quatro verticais 1080×1920, 30 fps, para o @MangaEm60. O briefing está em
`docs/` (`LEIA-PRIMEIRO.md` é a fonte da verdade; `vinland-shorts-POSTAR.md`
diz como publicar). As chapas vieram prontas, com alfa: aqui só existe
câmera.

| dia | composição | mecanismo | frames |
|---|---|---|---|
| 1 | `Dia1-Anel` | atravessa | 1261 |
| 2 | `Dia2-Contagem` | acumula | 781 |
| 3 | `Dia3-Sagas` | sobrepõe | 1257 |
| 4 | `Dia4-Oficina` | subtrai | 1213 |

## O que fica fora do git

`public/` (chapas, papéis, narrações, mixagens) e `out/`. Para regenerar:

1. Descompactar o `vinland-shorts-CODE.zip` e copiar `1-contagem/`,
   `2-anel/`, `3-sagas/`, `4-oficina/`, `comum/` e `audio/` para `public/`,
   e `fontes/ebg-500.ttf` para `public/fontes/`.
2. `python3 -m pip install numpy scipy pillow sherpa-onnx`
3. `python3 -I ferramentas/palavras.py . <modelo parakeet>` — tempo de cada
   palavra (já versionado em `src/data/palavras.json`).
4. `python3 -I ferramentas/preparar.py .` — mede as chapas, estende os papéis.
5. `python3 -I ferramentas/eventos.py .` — os eventos de cada Short, nas palavras.
6. `python3 -I ferramentas/legendas.py .` — legenda queimada e as .srt corrigidas.
7. `python3 -I ferramentas/mixagem.py .` — narração + efeitos.
8. `npm install` e `bash ferramentas/render.sh`.

## Onde este projeto se afasta do LEIA-PRIMEIRO, e por quê

- **As marcas de frame** do documento saíram das legendas entregues, que
  estão até 1,5 s fora da fala. A narração manda: cada evento cai na palavra
  a que se refere (`ferramentas/eventos.py` diz qual).
- **Contagem:** a última linha do arquivo (91 a 100) caía na faixa da
  legenda (y 1330–1430). As linhas se aproximam; a primeira fica onde está.
- **Anel:** as faixas escuras da chapa apagavam a legenda. A chapa atravessa
  numa janela até y=1300; a legenda fica numa faixa de papel embaixo.
- **Sagas:** com perspective 2400 e translateZ −40, a deriva de 2% separa as
  colunas em 0,35 px — invisível. A coluna funda anda 35% da deriva da da
  frente (14 px de separação em 42 s). A divisória termina em y=1250, acima
  da faixa da legenda.
- **Oficina:** o rótulo sai com a primeira casa e os achados com a última,
  para sobrar o papel vazio que o documento pede antes do fecho.

## Render

```
1080×1920 · 30 fps · h264 · CRF 17 · yuv420p · faststart
```
