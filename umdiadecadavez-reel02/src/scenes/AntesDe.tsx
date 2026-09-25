import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, reel02 as R} from '../data/reel02';
import {Apagar} from '../motion/Apagar';
import {NoBreuTexto, AntesDeTexto} from './paginas';

// Bloco: Antes de qualquer coisa acontecer. · HERO 2 + apagar
export const AntesDe: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('antesDe');
  return (
    <AbsoluteFill>
      <Apagar inicio={q(R.antesDe.apagar)}>
        <NoBreuTexto local={q} />
        <AntesDeTexto local={q} />
      </Apagar>
    </AbsoluteFill>
  );
};
