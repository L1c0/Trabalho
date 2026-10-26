# Vagabond — como o filme se monta

Ensaio de 9min11 (16.538 frames, 30 fps) para o @MangaEm60. Os briefings
estão em `docs/` (fonte da verdade: `vagabond-BRIEFING.md` e
`vagabond-AUDIO.md`).

Pincel, não prensa: a tinta **chega** no papel (campo geodésico com a borda
molhada escurecendo), a partitura de cor carrega a tese, e a profundidade
só aparece em três momentos.

## O que fica fora do git

`public/`, `originais/`, `out/` e `node_modules/` (mídia e gerados). Para
regenerar num ambiente novo:

1. Descompactar os quatro zips do pacote e copiar as peças para
   `originais/` **pelo conteúdo, não pelo nome** (os zips vieram com nomes
   trocados; o mapa está em `ferramentas/originais.md`).
2. `public/audio/` recebe os quatro arquivos de áudio do zip 2.
3. `python3 -m pip install numpy scipy pillow scikit-image opencv-python-headless sherpa-onnx`
4. `python3 -I ferramentas/palavras.py . <modelo parakeet>` (tempo de cada
   palavra; o JSON já está versionado em `src/data/palavras.json`).
5. `python3 -I ferramentas/planos.py` (trata as peças, gera campos e
   máscaras e escreve `src/data/montagem.json`).
6. `python3 -I ferramentas/mixagem.py .` (gera `public/audio/vag-mix.mp3`).
7. `npm install` e `node ferramentas/quadros.mjs <frames>` para conferir.

## Ferramentas

| arquivo | o que faz |
|---|---|
| `sumi.py` | washi periódico (grão calibrado), tratamento sumi e de cor, campo de chegada, tipo com mácron, pincelada com kasure, hanko |
| `montagem.py` | folhas, camadas e planos; cortes na pausa real da fala |
| `planos.py` | os blocos A a K, amarrados às palavras |
| `paralaxe.py` | os dois trípticos com máscara recortada à mão |
| `mixagem.py` | narração + trilha + leito, sem ducking |
| `pacote.py` | o pacote do master em zips de até 29 MiB |
| `entregues/` | as ferramentas que vieram no zip 1, como chegaram |

## Render

```
npx remotion render src/index.ts Vagabond out/vagabond-master-1440p.mp4 --scale=1.3333333333 --crf=16 --color-space=bt709 --timeout=120000
```
