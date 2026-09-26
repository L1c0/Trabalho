import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';

// Traço de esfero atravessando a palavra, 8 frames, tremor vertical de ±2 px.
// Vai dentro de um container inline-block com a palavra (ocupa 100% da largura dele).
export const Risco: React.FC<{inicio: number; tamanho: number; larguraEstimada: number; cor: string; semente: string}> = ({
  inicio,
  tamanho,
  larguraEstimada,
  cor,
  semente,
}) => {
  const frame = useCurrentFrame();
  const r = tempo.risco;
  if (frame < inicio) return null;
  const p = interpolate(frame, [inicio, inicio + r.duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.mao,
  });
  const w = larguraEstimada;
  const meio = tamanho * 0.55;
  const pontos = Array.from({length: r.amostras + 1}, (_, i) => {
    const x = -0.03 * w + (i / r.amostras) * 1.06 * w;
    const y = meio + (random(`${semente}-${i}`) * 2 - 1) * r.tremor;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${tamanho}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', left: 0, top: 0, width: '100%', height: tamanho, overflow: 'visible'}}
    >
      <path
        d={`M${pontos.join(' L')}`}
        fill="none"
        stroke={cor}
        strokeWidth={r.espessura * tamanho}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};
