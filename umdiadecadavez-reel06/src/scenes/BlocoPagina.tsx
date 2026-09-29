import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco, R} from '../data';
import {Virada} from '../motion/Virada';
import {Pagina} from './paginas';

// Bloco: a página entra · PLATÃO · SE NINGUÉM TE VISSE · VOCÊ AINDA SERIA BOM? · a parada
export const BlocoPagina: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('pagina');
  return (
    <AbsoluteFill>
      <Virada inicio={q(R.pagina.virada)}>
        <Pagina local={q} />
      </Virada>
    </AbsoluteFill>
  );
};
