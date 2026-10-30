#!/usr/bin/env bash
# O render do LEIA-PRIMEIRO, em dois passos. A transformação 3D do Chrome
# rasteriza o PNG no tamanho da tela; renderizar no dobro e reduzir por
# Lanczos devolve a nitidez da tinta e do grão do papel.
#   1. 2160x3840, CRF 14, yuv444p (o vermelhão dos marcos não sangra)
#   2. Lanczos para 1080x1920, x264 CRF 17 preset slow, yuv420p, áudio copiado, faststart
# --color-space=bt709 e as etiquetas bt709 no passo 2 mantêm a mesma matriz
# de cor nos dois passos. GL: angle; se falhar na máquina, swangle (LEIA).
#   bash ferramentas/render.sh [angle|swangle]  ->  out/vinland-contagem.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
gl="${1:-angle}"
npx remotion render src/index.ts Contagem out/contagem-2x.mp4 --scale=2 --crf=14 --pixel-format=yuv444p \
  --color-space=bt709 --concurrency=4 --gl="$gl" --timeout=120000 --log=error
ffmpeg -hide_banner -loglevel error -y -i out/contagem-2x.mp4 -vf "scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a copy -movflags +faststart out/vinland-contagem.mp4
echo "pronto: out/vinland-contagem.mp4"
