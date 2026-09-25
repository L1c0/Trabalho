import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/reel02';
import {PaginaTamanho} from './paginas';

// Bloco: Ruim. Mas com tamanho. · crescer, "é isto. só isto.", faixa
export const Tamanho: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('tamanho');
  return (
    <AbsoluteFill>
      <PaginaTamanho local={q} />
    </AbsoluteFill>
  );
};
