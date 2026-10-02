import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {tempo} from '../theme';

// Como a luz apagando: máscara vertical de cima para baixo.
export const Apagar: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const frame = useCurrentFrame();
  const a = tempo.apagar;
  if (frame >= inicio + a.duracao) return null;
  const p = interpolate(frame, [inicio, inicio + a.duracao], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pos = -a.suave + p * (100 + a.suave);
  const img = `linear-gradient(to bottom, transparent ${pos}%, #000 ${pos + a.suave}%)`;
  return <AbsoluteFill style={p > 0 ? {maskImage: img, WebkitMaskImage: img} : undefined}>{children}</AbsoluteFill>;
};
