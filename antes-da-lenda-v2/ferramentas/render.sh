#!/usr/bin/env bash
# O render do LEIA-PRIMEIRO, em dois passos:
#   1. 3840x2160, CRF 14, yuv444p
#   2. Lanczos para 1920x1080, x264 CRF 16 preset slow, yuv420p, áudio copiado, faststart
# --color-space=bt709 e as etiquetas bt709 no passo 2 mantêm a mesma matriz
# de cor nos dois passos. GL: angle; se falhar na máquina, swangle.
#   bash ferramentas/render.sh [angle|swangle]  ->  out/antes-da-lenda-v2.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
gl="${1:-angle}"
npx remotion render src/index.ts Intro out/intro-2x.mp4 --scale=2 --crf=14 --pixel-format=yuv444p \
  --color-space=bt709 --concurrency=4 --gl="$gl" --timeout=120000 --log=error
ffmpeg -hide_banner -loglevel error -y -i out/intro-2x.mp4 -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a copy -movflags +faststart out/antes-da-lenda-v2.mp4
echo "pronto: out/antes-da-lenda-v2.mp4"
