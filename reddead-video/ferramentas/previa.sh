#!/usr/bin/env bash
# Prévia para envio (até 30 MiB) a partir do master: 640x360 (Lanczos),
# x264 em duas passadas na taxa que dá o tamanho pedido (28,5 MiB por padrão)
# e áudio AAC de 80 kb/s estéreo. Serve para assistir e conferir; o vídeo
# bom é o master.
#   bash ferramentas/previa.sh [MiB]  ->  out/reddead-previa.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
alvo="${1:-28.5}"
src=out/reddead-master.mp4
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
vbr=$(python3 -I -c "print(int(($alvo * 1048576 * 8 * 0.985 - 80000 * $dur) / $dur / 1000))")
for passo in 1 2; do
  if [ "$passo" = 1 ]; then saida=(-an -f null /dev/null); else saida=(-c:a aac -b:a 80k -movflags +faststart out/reddead-previa.mp4); fi
  ffmpeg -hide_banner -loglevel error -y -i "$src" -vf "scale=640:360:flags=lanczos" \
    -c:v libx264 -b:v "${vbr}k" -preset slow -pass "$passo" -passlogfile out/previa -pix_fmt yuv420p \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 "${saida[@]}"
done
rm -f out/previa-0.log out/previa-0.log.mbtree
echo "pronto: out/reddead-previa.mp4 (${vbr} kb/s de vídeo)"
