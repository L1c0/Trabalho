import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {curvas, tempo} from '../theme';

// O número aumenta de corpo — não de opacidade. A base fica parada.
export const Crescer: React.FC<{
  inicio: number;
  corpoInicial: number;
  corpoFinal: number;
  esquerda: number;
  base: number;
  estilo: React.CSSProperties;
  children: React.ReactNode;
  depois?: React.ReactNode;
}> = ({inicio, corpoInicial, corpoFinal, esquerda, base, estilo, children, depois}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  if (frame < inicio) return null;
  const corpo = interpolate(frame, [inicio, inicio + tempo.crescer.duracao], [corpoInicial, corpoFinal], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.corpo,
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda,
        bottom: height - base,
        display: 'flex',
        alignItems: 'flex-end',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{...estilo, fontSize: corpo, lineHeight: 0.9}}>{children}</span>
      {depois}
    </div>
  );
};
