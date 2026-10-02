import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {Breu} from './paginas';

// Bloco: NINGUÉM DIGERIU DIREITO · A VIDA NÃO É CURTA · A GENTE ENCURTA ELA (no breu)
export const BlocoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <Breu local={q} />
    </AbsoluteFill>
  );
};
