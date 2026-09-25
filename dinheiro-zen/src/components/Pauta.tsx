import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {cores, curvas, motion} from '../theme';

export type Linha = {x1: number; y1: number; x2: number; y2: number};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Pauta riscada com régua: linha a linha, velocidade constante, do ponto 1 ao ponto 2.
export const Pauta: React.FC<{linhas: readonly Linha[]; inicio: number; espessura: number}> = ({
  linhas,
  inicio,
  espessura,
}) => {
  const frame = useCurrentFrame();
  const p = motion.pauta;
  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%">
      {linhas.map((l, i) => {
        const t0 = inicio + i * p.intervalo;
        const t = interpolate(frame, [t0, t0 + p.traco], [0, 1], {...clamp, easing: curvas.linear});
        if (t <= 0) return null;
        return (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x1 + (l.x2 - l.x1) * t}
            y2={l.y1 + (l.y2 - l.y1) * t}
            stroke={cores.koshi}
            strokeWidth={espessura}
          />
        );
      })}
    </svg>
  );
};
