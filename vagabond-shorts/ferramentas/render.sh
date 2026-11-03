#!/usr/bin/env bash
# Render dos Shorts, um a um, em dois passos (a receita da casa):
#   1. 2160x3840 (--scale=2), CRF 14, yuv444p, matriz bt709, x264 veryfast
#      (é só o intermediário; o encode final é slow);
#   2. Lanczos para 1080x1920, x264 CRF 16 preset slow, yuv420p, etiquetas
#      bt709, áudio copiado, faststart.
# O AAC que o Remotion grava começa com 2048 amostras de priming que a edit
# list dele não desconta (o som tocaria 42,7 ms atrasado). O passo 2 copia o
# áudio como está e só o adianta nessas amostras; o muxer grava a edit list
# que pula o priming.
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
    npx remotion render src/index.ts "$id" "out/$id-2x.mp4" --scale=2 --crf=14 --pixel-format=yuv444p \
      --color-space=bt709 --x264-preset=veryfast --concurrency=4 --gl="$gl" --timeout=120000 --log=error
  fi
  ffmpeg -hide_banner -loglevel error -y -i "out/$id-2x.mp4" -itsoffset -0.042666667 -i "out/$id-2x.mp4" \
    -map 0:v:0 -map 1:a:0 -vf "scale=1080:1920:flags=lanczos" \
    -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a copy -movflags +faststart "out/$(nome "$id").mp4"
  echo "pronto: out/$(nome "$id").mp4"
done
