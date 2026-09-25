import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {Trelica, KanjiMa, HeroAPausa} from './paginas';

// Bloco: "A pausa." · HERO 3 + silêncio visual
export const Pausa: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('pausa');
  return (
    <AbsoluteFill>
      <Trelica local={q} />
      <KanjiMa local={q} />
      <HeroAPausa local={q} />
    </AbsoluteFill>
  );
};
