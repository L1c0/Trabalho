import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data';
import {PaginaCelular} from './paginas';

// Bloco: 40 MINUTOS · a luz da tela · trocar um cansaço por outro
export const Celular: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('celular');
  return (
    <AbsoluteFill>
      <PaginaCelular local={q} />
    </AbsoluteFill>
  );
};
