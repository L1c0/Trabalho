#!/usr/bin/env bash
# Renderiza os quatro Shorts: 1080x1920, 30 fps, h264, CRF 17, yuv420p,
# faststart (o Remotion já põe o moov na frente em h264).
#   bash ferramentas/render.sh [Dia1-Anel Dia2-Contagem ...]
set -euo pipefail
cd "$(dirname "$0")/.."
comps=("$@")
if [ ${#comps[@]} -eq 0 ]; then comps=(Dia1-Anel Dia2-Contagem Dia3-Sagas Dia4-Oficina); fi
for c in "${comps[@]}"; do
  nome="vinland-short-$(echo "$c" | tr 'A-Z' 'a-z')"
  npx remotion render src/index.ts "$c" "out/$nome.mp4" --codec=h264 --crf=17 --pixel-format=yuv420p \
    --color-space=bt709 --concurrency=4 --timeout=120000 --log=error
  echo "pronto: out/$nome.mp4"
done
