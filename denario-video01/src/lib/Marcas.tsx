import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {cores, escala, fontes} from '../theme';

// Micro-tipografia nos cantos (corpo 14, #666): código do vídeo, timecode, nome do bloco,
// e a barra de progresso fina na base.
const timecode = (frame: number, fps: number) => {
  const s = Math.floor(frame / fps);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(frame % fps)}`;
};

export const Marcas: React.FC<{codigo: string; bloco: string; total: number}> = ({codigo, bloco, total}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const texto: React.CSSProperties = {
    position: 'absolute',
    fontFamily: fontes.texto,
    fontWeight: fontes.peso.texto,
    fontSize: escala.marca,
    letterSpacing: '0.12em',
    color: cores.marca,
    fontVariantNumeric: 'tabular-nums',
  };
  const m = 40;
  return (
    <>
      <div style={{...texto, left: m, top: m}}>{codigo}</div>
      <div style={{...texto, right: m, top: m}}>{timecode(frame, fps)}</div>
      <div style={{...texto, right: m, bottom: m}}>{bloco}</div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: (frame / (total - 1)) * width, backgroundColor: cores.marca}} />
    </>
  );
};
