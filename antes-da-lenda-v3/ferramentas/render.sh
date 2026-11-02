#!/usr/bin/env bash
# O render do LEIA-PRIMEIRO, em dois passos:
#   1. 3840x2160, CRF 14, yuv444p
#   2. Lanczos para 1920x1080, x264 CRF 16 preset slow, yuv420p, áudio copiado, faststart
# --color-space=bt709 e as etiquetas bt709 no passo 2 mantêm a mesma matriz
# de cor nos dois passos. GL: angle; se falhar na máquina, swangle.
#
# Atraso do áudio: o AAC que o Remotion grava começa com 2048 amostras de
# priming, e a edit list dele não as desconta. Sem correção, o som toca
# 42,7 ms atrasado, e o corte da música cai 1,3 frame depois do corte da
# imagem em 19,5 s. O passo 2 continua copiando o áudio (-c:a copy) e só
# adianta a trilha em 2048 amostras. Assim o muxer grava a edit list que pula
# o priming.
#   bash ferramentas/render.sh [angle|swangle]  ->  out/antes-da-lenda-v3.mp4
#   bash ferramentas/render.sh passo2           (só o passo 2, do out/intro-2x.mp4)
set -euo pipefail
cd "$(dirname "$0")/.."
gl="${1:-angle}"
if [ "$gl" != passo2 ]; then
  npx remotion render src/index.ts Intro out/intro-2x.mp4 --scale=2 --crf=14 --pixel-format=yuv444p \
    --color-space=bt709 --concurrency=4 --gl="$gl" --timeout=120000 --log=error
fi
ffmpeg -hide_banner -loglevel error -y -i out/intro-2x.mp4 -itsoffset -0.042666667 -i out/intro-2x.mp4 \
  -map 0:v:0 -map 1:a:0 -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a copy -movflags +faststart out/antes-da-lenda-v3.mp4
echo "pronto: out/antes-da-lenda-v3.mp4"
