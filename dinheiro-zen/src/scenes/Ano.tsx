import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {PaginaAno} from './paginas';

// Bloco: HERO 5 1904 + enso
export const Ano: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('ano');
  return (
    <AbsoluteFill>
      <PaginaAno local={q} />
    </AbsoluteFill>
  );
};
