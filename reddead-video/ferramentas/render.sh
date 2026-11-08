#!/usr/bin/env bash
# Render do vídeo longo em 1x (1920x1080):
#   1. Remotion: x264 CRF 16 preset slow, yuv420p, matriz bt709. As chapas
#      saem pixel a pixel (a janela só desliza) e os clipes já são 1920x1080.
#   2. O vídeo é copiado sem recodificar. O áudio também é copiado, adiantado
#      nas 2048 amostras de priming que a edit list do AAC do Remotion não
#      desconta (sem isso, a trilha toca 42,7 ms atrasada). Faststart.
#   bash ferramentas/render.sh [--frames=a-b] [--gl=angle|swangle] [--passo2]
set -euo pipefail
cd "$(dirname "$0")/.."
gl=angle; passo1=1; quadros=(); sufixo=""
for a in "$@"; do
  case "$a" in
    --gl=*) gl="${a#--gl=}" ;;
    --passo2) passo1=0 ;;
    --frames=*) quadros=("$a"); sufixo="-${a#--frames=}" ;;
  esac
done
if [ "$passo1" = 1 ]; then
  npx remotion render src/index.ts RedDead "out/reddead-render$sufixo.mp4" --crf=16 --pixel-format=yuv420p \
    --x264-preset=slow --color-space=bt709 --concurrency=4 --gl="$gl" --timeout=120000 --log=error "${quadros[@]}"
fi
ffmpeg -hide_banner -loglevel error -y -i "out/reddead-render$sufixo.mp4" -itsoffset -0.042666667 -i "out/reddead-render$sufixo.mp4" \
  -map 0:v:0 -map 1:a:0 -c:v copy \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 \
  -c:a copy -movflags +faststart "out/reddead-master$sufixo.mp4"
echo "pronto: out/reddead-master$sufixo.mp4"
