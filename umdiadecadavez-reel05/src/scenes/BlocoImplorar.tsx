import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaImplorar} from './paginas';

// Bloco: ESCOLHEU NÃO IMPLORAR · a parada · economizar força
export const BlocoImplorar: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('implorar');
  return (
    <AbsoluteFill>
      <PaginaImplorar local={q} />
    </AbsoluteFill>
  );
};
