import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaPilhas} from './paginas';

// Bloco: as duas pilhas · a segunda transborda · três riscos
export const BlocoPilhas: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('pilhas');
  return (
    <AbsoluteFill>
      <PaginaPilhas local={q} />
    </AbsoluteFill>
  );
};
