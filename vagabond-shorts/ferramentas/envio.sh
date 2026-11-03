#!/usr/bin/env bash
# Versão para envio (abaixo de 30 MiB) de um Short cujo master passou disso:
# x264 em duas passadas, na taxa que dá o tamanho pedido (28,5 MiB por padrão),
# feita do mesmo intermediário 2x do render.sh. Mesma redução Lanczos, mesmas
# etiquetas bt709, áudio copiado e adiantado nas 2048 amostras de priming,
# faststart. O master continua sendo o arquivo de referência.
#   bash ferramentas/envio.sh S1 [MiB]  ->  out/<nome>-envio.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
id="$1"
alvo="${2:-28.5}"
case "$id" in
  S1) nome=vagabond-s1-sessenta-e-zero ;;
  S2) nome=vagabond-s2-o-passaro ;;
  S3) nome=vagabond-s3-o-que-nunca-existiu ;;
  S4) nome=vagabond-s4-o-remo ;;
  *) echo "uso: bash ferramentas/envio.sh S1|S2|S3|S4 [MiB]"; exit 1 ;;
esac
src="out/$id-2x.mp4"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
abr=$(ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of csv=p=0 "$src")
vbr=$(python3 -I -c "print(int(($alvo * 1048576 * 8 * 0.985 - $abr * $dur) / $dur / 1000))")
for passo in 1 2; do
  if [ "$passo" = 1 ]; then saida=(-an -f null /dev/null); else saida=(-c:a copy -movflags +faststart "out/$nome-envio.mp4"); fi
  ffmpeg -hide_banner -loglevel error -y -i "$src" -itsoffset -0.042666667 -i "$src" \
    -map 0:v:0 -map 1:a:0 -vf "scale=1080:1920:flags=lanczos" \
    -c:v libx264 -b:v "${vbr}k" -preset slow -pass "$passo" -passlogfile "out/envio-$id" -pix_fmt yuv420p \
    -colorspace bt709 -color_primaries bt709 -color_trc bt709 "${saida[@]}"
done
rm -f "out/envio-$id-0.log" "out/envio-$id-0.log.mbtree"
echo "pronto: out/$nome-envio.mp4 (${vbr} kb/s de vídeo)"
