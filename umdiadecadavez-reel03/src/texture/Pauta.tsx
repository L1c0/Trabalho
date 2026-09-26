import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {cores, textura} from '../theme';

// A linha azul do caderno, a cada 78 px. Sempre presente quando o fundo é papel.
export const Pauta: React.FC<{opacidade?: number}> = ({opacidade = textura.pauta.opacidade}) => {
  const {width, height} = useVideoConfig();
  const p = textura.pauta;
  const linhas = Array.from({length: Math.floor(height / p.passo)}, (_, i) => (i + 1) * p.passo);
  return (
    <AbsoluteFill style={{opacity: opacidade}}>
      <svg width={width} height={height}>
        {linhas.map((y) => (
          <line key={y} x1={0} x2={width} y1={y} y2={y} stroke={cores.pauta} strokeWidth={p.espessura} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
