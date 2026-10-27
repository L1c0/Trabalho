#!/usr/bin/env bash
# Render do Anel como o LEIA-PRIMEIRO pede: 1080x1920, 30 fps, h264, CRF 18,
# yuv420p, faststart (o Remotion já põe o moov na frente em h264).
# O compositor é WebGL2: --gl=swangle roda o shader sem GPU.
#   bash ferramentas/render.sh  ->  out/vinland-anel.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
npx remotion render src/index.ts Anel out/vinland-anel.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p \
  --color-space=bt709 --gl=swangle --concurrency=4 --timeout=120000 --log=error
echo "pronto: out/vinland-anel.mp4"
