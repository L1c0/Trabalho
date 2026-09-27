import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {tempo} from '../theme';

// RISCO · traço na cor do bloco atravessando a palavra, com tremor vertical de ±2 px.
// Vai dentro de um container posicionado junto com a palavra (ocupa 100% da largura dele).
export const Risco: React.FC<{de: number; cor: string; tamanho: number; semente: string}> = ({de, cor, tamanho, semente}) => {
  const frame = useCurrentFrame();
  const r = tempo.risco;
  if (frame < de) return null;
  const p = interpolate(frame, [de, de + r.duracao], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pontos = Array.from({length: r.amostras + 1}, (_, i) => {
    const x = -2 + (i / r.amostras) * 104;
    const y = 50 + ((random(`${semente}-${i}`) * 2 - 1) * r.tremor * 100) / tamanho;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const id = `risco-${semente.replace(/[^a-zA-Z0-9]/g, '')}`;
  // a caixa é esticada (preserveAspectRatio none): a espessura fica em px com non-scaling-stroke
  // e o traço é revelado por um recorte horizontal, não por dash (que se distorceria)
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      <defs>
        <clipPath id={id}>
          <rect x={-10} y={-100} width={10 + p * 110} height={300} />
        </clipPath>
      </defs>
      <path
        d={`M${pontos.join(' L')}`}
        clipPath={`url(#${id})`}
        fill="none"
        stroke={cor}
        strokeWidth={r.espessura * tamanho}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>
  );
};
