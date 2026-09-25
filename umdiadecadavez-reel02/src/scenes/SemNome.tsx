import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/reel02';
import {PaginaCaderno} from './paginas';

// Bloco: Medo sem nome é pior. · HERO 5 manuscrito + risco
export const SemNome: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('semNome');
  return (
    <AbsoluteFill>
      <PaginaCaderno local={q} />
    </AbsoluteFill>
  );
};
