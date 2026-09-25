import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/reel02';
import {LuzDoCelular, PalavrasDoCelular} from './paginas';

// Bloco: Pega o celular. Olha o saldo. Fecha. Olha de novo.
export const Celular: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('celular');
  return (
    <AbsoluteFill>
      <LuzDoCelular local={q} />
      <PalavrasDoCelular local={q} />
    </AbsoluteFill>
  );
};
