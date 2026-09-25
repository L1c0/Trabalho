import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/reel02';
import {PaginaCaderno} from './paginas';

// Bloco: Escreve o pior. Com detalhe. · pauta em foco, três linhas à mão
export const Escreve: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('escreve');
  return (
    <AbsoluteFill>
      <PaginaCaderno local={q} />
    </AbsoluteFill>
  );
};
