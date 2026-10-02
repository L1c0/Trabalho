import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {Breu} from './paginas';

// Bloco: UM DOS MAIS RICOS DE ROMA · a roupa surrada · NÃO ERA HUMILDADE · ERA TREINO (no breu)
export const BlocoBreu: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('breu');
  return (
    <AbsoluteFill>
      <Breu local={q} />
    </AbsoluteFill>
  );
};
