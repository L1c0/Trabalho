#!/usr/bin/env bash
# Versão de envio (até ~28,5 MiB) de um Short renderizado: x264 em duas
# passadas a partir do master CRF 17, áudio copiado.
#   bash ferramentas/envio.sh out/vinland-short-dia3-sagas.mp4 [tune]
set -euo pipefail
cd "$(dirname "$0")/.."
src="$1"; tune="${2:-}"
nome="$(basename "$src" .mp4)"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
abr=$(ffprobe -v error -select_streams a -show_entries stream=bit_rate -of csv=p=0 "$src")
alvo=$((28 * 1024 * 1024 + 512 * 1024))
vbr=$(python3 -c "print(int(($alvo - $abr * $dur / 8 - 200000) * 8 / $dur / 1000))")
extra=(); [ -n "$tune" ] && extra=(-tune "$tune")
log="out/tmp/$nome-${tune:-padrao}"
ffmpeg -hide_banner -loglevel error -y -i "$src" -map 0:v -c:v libx264 -preset slow "${extra[@]}" -b:v "${vbr}k" \
  -pass 1 -passlogfile "$log" -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y -i "$src" -map 0:v -map 0:a -c:v libx264 -preset slow "${extra[@]}" -b:v "${vbr}k" \
  -pass 2 -passlogfile "$log" -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a copy -movflags +faststart "out/envio/$nome${tune:+-$tune}.mp4"
echo "out/envio/$nome${tune:+-$tune}.mp4  ${vbr}k  $(stat -c %s "out/envio/$nome${tune:+-$tune}.mp4") bytes"
