import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, reel02 as R} from '../data/reel02';
import {Virada} from '../motion/Virada';
import {PaginaSeneca} from './paginas';

// Bloco: Sêneca · o papel entra (virada) · HERO 3
export const Seneca: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('seneca');
  return (
    <AbsoluteFill>
      <Virada inicio={q(R.seneca.virada)}>
        <PaginaSeneca local={q} />
      </Virada>
    </AbsoluteFill>
  );
};
