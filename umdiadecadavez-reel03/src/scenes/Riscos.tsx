import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaRiscos} from './paginas';

// Bloco: e o que ele escrevia era · VOCÊ CONSEGUE, ACREDITE (riscadas)
export const Riscos: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('riscos');
  return (
    <AbsoluteFill>
      <PaginaRiscos local={q} />
    </AbsoluteFill>
  );
};
