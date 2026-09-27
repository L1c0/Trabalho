import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaFecho} from './paginas';

// Bloco: descanso de verdade é chato · SEM MERECER · faixa (só IG)
export const Fecho: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('fecho');
  return (
    <AbsoluteFill>
      <PaginaFecho local={q} />
    </AbsoluteFill>
  );
};
