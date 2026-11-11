#!/usr/bin/env bash
# Emenda as partes do render de conferência (out/partes/pNN.mp4) e põe o áudio:
# a vinheta desde o quadro 0 e a trilha a partir do quadro 144 (4,8 s), muda
# até 0,93 s e aberta em dois quadros, como no vídeo. O vídeo é copiado sem
# recodificar.
#   bash ferramentas/junta.sh  ->  out/reddead-v4-conferencia.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
: > out/partes/lista.txt
for p in out/partes/p[0-9][0-9].mp4; do echo "file '$(basename "$p")'" >> out/partes/lista.txt; done
ffmpeg -hide_banner -loglevel error -y -i public/vinheta.mp3 -i public/trilha.mp3 -filter_complex \
  "[0:a]aresample=48000,apad[a0];[1:a]aresample=48000,afade=t=in:st=0.9333:d=0.0667,adelay=4800|4800[a1];[a0][a1]amix=inputs=2:normalize=0:duration=longest,atrim=0:753.8[a]" \
  -map "[a]" -c:a aac -b:a 256k out/partes/audio.m4a
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i out/partes/lista.txt -i out/partes/audio.m4a \
  -map 0:v:0 -map 1:a:0 -c:v copy \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1 \
  -c:a copy -shortest -movflags +faststart out/reddead-v4-conferencia.mp4
echo "pronto: out/reddead-v4-conferencia.mp4"
