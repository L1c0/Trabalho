import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {PaginaCaderno} from './paginas';

// Bloco: APP riscado → CADERNO + quatro perguntas
export const Caderno: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('caderno');
  return (
    <AbsoluteFill>
      <PaginaCaderno local={q} />
    </AbsoluteFill>
  );
};
