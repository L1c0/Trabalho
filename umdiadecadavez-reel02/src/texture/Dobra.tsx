import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cores, textura} from '../theme';

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Papel real nunca é plano: gradiente diagonal, 3% mais escuro de um lado.
export const Dobra: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(${textura.dobra.angulo}deg, ${rgba(cores.breu, 0)} 0%, ${rgba(cores.breu, textura.dobra.escurece)} 100%)`,
    }}
  />
);

export {rgba};
