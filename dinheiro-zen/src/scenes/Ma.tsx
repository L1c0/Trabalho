import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {Trelica, KanjiMa} from './paginas';

// Bloco: "Ma." · HERO 2 kakijun 間
export const Ma: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('ma');
  return (
    <AbsoluteFill>
      <Trelica local={q} />
      <KanjiMa local={q} />
    </AbsoluteFill>
  );
};
