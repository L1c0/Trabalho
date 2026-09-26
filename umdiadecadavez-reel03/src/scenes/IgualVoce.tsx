import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaIgualVoce} from './paginas';

// Bloco: IGUAL VOCÊ · parado · ele tinha onde colocar · faixa
export const IgualVoce: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('igualVoce');
  return (
    <AbsoluteFill>
      <PaginaIgualVoce local={q} />
    </AbsoluteFill>
  );
};
