import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, R} from '../data';
import {Virada} from '../motion/Virada';
import {Lenda} from './paginas';

// Bloco: o papel entra · EPICTETO · pode ser lenda
export const BlocoLenda: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('lenda');
  return (
    <AbsoluteFill>
      <Virada inicio={q(R.lenda.virada)}>
        <Lenda local={q} />
      </Virada>
    </AbsoluteFill>
  );
};
