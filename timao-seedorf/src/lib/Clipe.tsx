import React, {useCallback, useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, getRemotionEnvironment, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Clipe as DadosDoClipe} from '../data/edit';
import {edit} from '../data/edit';
import {movimento} from '../data/movimento';
import {aplicarPilha} from '../fx/Pilha';
import {flicker} from '../fx/Flicker';
import {parametrosNo} from '../fx/parametros';
import {pulso} from '../fx/Pulso';
import {blocos, fx} from '../theme';
import {existe} from './existe';

export type ClipeNoTempo = DadosDoClipe & {ate: number; indice: number};

// A velocidade do clipe: a do bloco (ou a própria, no reuso), desacelerada só o necessário
// quando o material não cobre o espaço dele nessa velocidade.
export const velocidadeDo = (c: ClipeNoTempo, fps: number) => {
  const base = c.velocidade ?? blocos[c.bloco].velocidade;
  return Math.min(base, (c.duracao * fps) / (c.ate - c.de));
};

// UM CLIPE: OffthreadVideo com playbackRate, zoom lento (entrando ou saindo, alternado),
// recorte para 9:16 pelo `foco`, e a pilha de efeitos aplicada quadro a quadro num canvas.
export const Clipe: React.FC<{c: ClipeNoTempo}> = ({c}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const ultimo = useRef<CanvasImageSource | null>(null);
  const global = c.de + frame;
  const espaco = c.ate - c.de;
  const taxa = velocidadeDo(c, fps);
  const arquivo = `${c.pasta}/${c.id}.mp4`;

  const desenhar = useCallback(
    (img: CanvasImageSource) => {
      ultimo.current = img;
      const ctx = canvas.current?.getContext('2d', {willReadFrequently: true});
      if (!ctx) return;
      const sw = (img as HTMLImageElement).naturalWidth || (img as HTMLVideoElement).videoWidth || 1920;
      const sh = (img as HTMLImageElement).naturalHeight || (img as HTMLVideoElement).videoHeight || 1080;
      // zoom lento: 100% → máx (entrando) ou máx → 100% (saindo), alternando a cada clipe
      const zmax = blocos[c.bloco].zoom;
      const u = espaco > 1 ? frame / (espaco - 1) : 0;
      const z = c.indice % 2 === 0 ? 1 + (zmax - 1) * u : zmax - (zmax - 1) * u;
      const escala = z * (c.recorte?.escala ?? 1);
      // recorte que cobre o quadro de saída (16:9 inteiro ou a fatia 9:16)
      const aspecto = width / height;
      const [bw, bh] = aspecto < sw / sh ? [sh * aspecto, sh] : [sw, sw / aspecto];
      const [cw, ch] = [bw / escala, bh / escala];
      const foco = c.recorte?.foco ?? (aspecto < 1 ? c.foco : 0.5);
      const cx = Math.min(sw - cw / 2, Math.max(cw / 2, foco * sw));
      ctx.drawImage(img, cx - cw / 2, (sh - ch) / 2, cw, ch, 0, 0, width, height);
      const quadro = ctx.getImageData(0, 0, width, height);
      const mov = movimento[c.id] ?? [];
      const borrao = taxa < fx.blur.limiarVelocidade ? (mov[Math.min(mov.length - 1, Math.floor(frame * taxa))] ?? 0) : 0;
      aplicarPilha(quadro, {frame: global, p: parametrosNo(global), borrao, brilho: flicker(global, fps) * pulso(global, edit.pulsos)});
      ctx.putImageData(quadro, 0, 0);
    },
    [c, frame, global, espaco, taxa, width, height, fps],
  );

  // o <Img> do OffthreadVideo refaz o carregamento quando o callback muda; com um callback
  // estável ele só recarrega quando chega um quadro novo, e lê os parâmetros do frame atual
  const atual = useRef(desenhar);
  atual.current = desenhar;
  const aoQuadro = useCallback((img: CanvasImageSource) => atual.current(img), []);

  // no Studio, um quadro de vídeo repetido (câmera lenta) não dispara onVideoFrame:
  // redesenha a partir do último para o grão e o zoom continuarem andando
  useLayoutEffect(() => {
    if (!getRemotionEnvironment().isRendering && ultimo.current) desenhar(ultimo.current);
  }, [desenhar]);

  if (!existe(arquivo)) return null;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(arquivo)} playbackRate={taxa} muted onVideoFrame={aoQuadro} style={{position: 'absolute', width: 2, height: 2, opacity: 0}} />
      <canvas ref={canvas} width={width} height={height} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
