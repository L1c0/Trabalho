import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {Trelica, HeroUmaPalavraJaponesa} from './paginas';

// Bloco: gancho (⚠ só legenda) + HERO 1
export const Gancho: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('gancho');
  return (
    <AbsoluteFill>
      <Trelica local={q} />
      <HeroUmaPalavraJaponesa local={q} />
    </AbsoluteFill>
  );
};
