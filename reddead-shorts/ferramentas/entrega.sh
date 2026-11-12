#!/usr/bin/env bash
# Cópias de entrega dos Shorts, com até 29,3 MiB cada (cabem em qualquer envio).
# A imagem sai do master e é recodificada em duas passadas, na taxa que enche
# esse tamanho; o som sai direto da mixagem (public/audio/shortN.wav), em AAC
# a 320 kb/s, para não comprimir duas vezes.
#   bash ferramentas/entrega.sh  ->  out/entrega/reddead-short-N-<nome>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/entrega
limite_bits=$((293 * 8 * 1048576 / 10))
nome() {
  case "$1" in
    1) echo acabou-numa-tabela ;;
    2) echo 44-anos-de-nada ;;
  esac
}
for n in 1 2; do
  origem="out/Short$n-master.mp4"
  [ -f "$origem" ] || continue
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$origem")
  # taxa de vídeo = (limite - som - 1,5% de folga para o contêiner) / duração
  taxa=$(python3 -I -c "print(int(($limite_bits * 0.985 / $dur - 320000) / 1000))")
  saida="out/entrega/reddead-short-$n-$(nome "$n").mp4"
  log="out/entrega/passada-$n"
  ffmpeg -hide_banner -loglevel error -y -i "$origem" -map 0:v:0 -c:v libx264 -preset slow -b:v "${taxa}k" -pass 1 -passlogfile "$log" -an -f null /dev/null
  ffmpeg -hide_banner -loglevel error -y -i "$origem" -i "public/audio/short$n.wav" -map 0:v:0 -map 1:a:0 \
    -c:v libx264 -preset slow -b:v "${taxa}k" -pass 2 -passlogfile "$log" \
    -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 320k -shortest -movflags +faststart "$saida"
  rm -f "$log"*
  echo "$saida: $(du -h "$saida" | cut -f1), vídeo a ${taxa} kb/s"
done
