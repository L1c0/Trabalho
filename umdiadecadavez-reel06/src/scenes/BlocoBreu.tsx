import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {Breu} from './paginas';

// Bloco: um pastor achou um anel · era só girar na mão · e o que ele fez (no breu)
export const BlocoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <Breu local={q} />
    </AbsoluteFill>
  );
};
