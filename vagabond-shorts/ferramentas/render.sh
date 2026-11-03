#!/usr/bin/env bash
# Render dos Shorts em 1x, um a um.
#   1. Remotion em 1080x1920, x264 CRF 16 preset slow, yuv420p, matriz bt709.
#      A folha e as peças de tipo saem pixel a pixel. Os planos vêm reduzidos
#      com Lanczos (ferramentas/planos.py), então não há o que ganhar em 2x,
#      que custaria quatro vezes o tempo.
#   2. O vídeo é copiado sem recodificar. O áudio também é copiado, adiantado
#      nas 2048 amostras de priming que a edit list do AAC do Remotion não
#      desconta (sem isso, o som toca 42,7 ms atrasado). Faststart.
#   bash ferramentas/render.sh [S1 S2 S3 S4] [--gl=angle|swangle] [--passo2]
set -euo pipefail
cd "$(dirname "$0")/.."
gl=angle
passo1=1
ids=()
for a in "$@"; do
  case "$a" in
    --gl=*) gl="${a#--gl=}" ;;
    --passo2) passo1=0 ;;
    *) ids+=("$a") ;;
  esac
done
[ ${#ids[@]} -eq 0 ] && ids=(S1 S2 S3 S4)
nome() {
  case "$1" in
    S1) echo vagabond-s1-sessenta-e-zero ;;
    S2) echo vagabond-s2-o-passaro ;;
    S3) echo vagabond-s3-o-que-nunca-existiu ;;
    S4) echo vagabond-s4-o-remo ;;
  esac
}
for id in "${ids[@]}"; do
  if [ "$passo1" = 1 ]; then
    npx remotion render src/index.ts "$id" "out/$id-render.mp4" --crf=16 --pixel-format=yuv420p --x264-preset=slow \
      --color-space=bt709 --concurrency=4 --gl="$gl" --timeout=120000 --log=error
  fi
  ffmpeg -hide_banner -loglevel error -y -i "out/$id-render.mp4" -itsoffset -0.042666667 -i "out/$id-render.mp4" \
    -map 0:v:0 -map 1:a:0 -c:v copy \
    -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 \
    -c:a copy -movflags +faststart "out/$(nome "$id").mp4"
  echo "pronto: out/$(nome "$id").mp4"
done
