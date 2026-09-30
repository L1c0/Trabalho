import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {Breu} from './paginas';

// Bloco: ELE TINHA TRÊS COISAS (no breu). A lista vem na camada dos objetos.
export const BlocoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <Breu local={q} />
    </AbsoluteFill>
  );
};
