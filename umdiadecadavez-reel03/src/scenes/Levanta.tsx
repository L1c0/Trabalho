import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaLevanta} from './paginas';

// Bloco: LEVANTA. · as três linhas à mão · SE CONVENCIA · todo dia
export const Levanta: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('levanta');
  return (
    <AbsoluteFill>
      <PaginaLevanta local={q} />
    </AbsoluteFill>
  );
};
