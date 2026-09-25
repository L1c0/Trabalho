import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {PaginaZen} from './paginas';

// Bloco: papel limpo, hanko, Dinheiro Zen (⚠ sem legenda)
export const Zen: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('zen');
  return (
    <AbsoluteFill>
      <PaginaZen local={q} />
    </AbsoluteFill>
  );
};
