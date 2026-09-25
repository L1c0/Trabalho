import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {PaginaZen} from './paginas';

// Bloco: subtítulo e aviso (⚠ "toque no link" só legenda)
export const Cta: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('cta');
  return (
    <AbsoluteFill>
      <PaginaZen local={q} />
    </AbsoluteFill>
  );
};
