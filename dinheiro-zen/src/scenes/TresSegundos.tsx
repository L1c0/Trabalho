import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {PaginaIntervalo} from './paginas';

// Bloco: 欲 | 3·2·1 | 買 · HERO 4
export const TresSegundos: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('tresSegundos');
  return (
    <AbsoluteFill>
      <PaginaIntervalo local={q} />
    </AbsoluteFill>
  );
};
