import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, reel02 as R} from '../data/reel02';
import {Virada} from '../motion/Virada';
import {PaginaCaderno} from './paginas';

// Bloco: Ele tinha medo de verdade. · virada + HERO 4
export const Medo: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('medo');
  return (
    <AbsoluteFill>
      <Virada inicio={q(R.medo.virada)}>
        <PaginaCaderno local={q} />
      </Virada>
    </AbsoluteFill>
  );
};
