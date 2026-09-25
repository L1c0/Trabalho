import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/reel02';
import {NoBreuTexto} from './paginas';

// Bloco: Você acorda e o nó já tá lá. · HERO 1 no breu
export const NoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('noBreu');
  return (
    <AbsoluteFill>
      <NoBreuTexto local={q} />
    </AbsoluteFill>
  );
};
