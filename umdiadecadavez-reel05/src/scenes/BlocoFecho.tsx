import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaFecho} from './paginas';

// Bloco: sobra só a pilha limpa · ESCOLHE UMA E LARGA · faixa (só IG)
export const BlocoFecho: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('fecho');
  return (
    <AbsoluteFill>
      <PaginaFecho local={q} />
    </AbsoluteFill>
  );
};
