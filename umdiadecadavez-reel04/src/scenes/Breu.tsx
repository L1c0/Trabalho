import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {BreuTexto} from './paginas';

// Bloco: deitei pra descansar · levantei pior · PREGUIÇOSO riscado (no breu)
export const Breu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <BreuTexto local={q} />
    </AbsoluteFill>
  );
};
