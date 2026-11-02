#!/usr/bin/env bash
# Versão para envio (abaixo de 30 MiB), feita do mesmo intermediário 2x do
# render.sh: x264 em duas passadas, na taxa que dá o tamanho pedido (28,5 MiB
# por padrão). Mesma redução Lanczos, mesmas etiquetas bt709, áudio copiado
# e adiantado em 2048 amostras (o priming do AAC, ver render.sh), faststart.
# O master do render.sh continua sendo o arquivo de referência.
#   bash ferramentas/envio.sh [MiB]  ->  out/antes-da-lenda-v3-envio.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
alvo="${1:-28.5}"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/intro-2x.mp4)
abr=$(ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of csv=p=0 out/intro-2x.mp4)
vbr=$(python3 -I -c "print(int(($alvo * 1048576 * 8 * 0.985 - $abr * $dur) / $dur / 1000))")
for passo in 1 2; do
  if [ "$passo" = 1 ]; then saida=(-an -f null /dev/null); else saida=(-c:a copy -movflags +faststart out/antes-da-lenda-v3-envio.mp4); fi
  ffmpeg -hide_banner -loglevel error -y -i out/intro-2x.mp4 -itsoffset -0.042666667 -i out/intro-2x.mp4 \
    -map 0:v:0 -map 1:a:0 -vf "scale=1920:1080:flags=lanczos" \
    -c:v libx264 -b:v "${vbr}k" -preset slow -pass "$passo" -passlogfile out/envio-2pass -pix_fmt yuv420p \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 "${saida[@]}"
done
rm -f out/envio-2pass-0.log out/envio-2pass-0.log.mbtree
echo "pronto: out/antes-da-lenda-v3-envio.mp4 (${vbr} kb/s de vídeo)"
