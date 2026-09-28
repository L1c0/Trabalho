import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {Breu} from './paginas';

// Bloco: o dono gostava de torturar · a linha entorta e quebra · EU AVISEI (no breu)
export const BlocoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <Breu local={q} />
    </AbsoluteFill>
  );
};
