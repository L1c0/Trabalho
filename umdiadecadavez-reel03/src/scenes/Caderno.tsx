import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, R} from '../data';
import {Virada} from '../motion/Virada';
import {PaginaCaderno} from './paginas';

// Bloco: o papel entra · não era pra ninguém ler · MEDITAÇÕES
export const Caderno: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('caderno');
  return (
    <AbsoluteFill>
      <Virada inicio={q(R.caderno.virada)}>
        <PaginaCaderno local={q} />
      </Virada>
    </AbsoluteFill>
  );
};
