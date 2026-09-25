import React from 'react';
import {AbsoluteFill} from 'remotion';
import {inicioDoBloco} from '../data/roteiro';
import {KanjiKakeibo} from './paginas';

// Bloco: HERO 6 kakijun 家計簿
export const Kakeibo: React.FC = () => {
  const q = (f: number) => f - inicioDoBloco('kakeibo');
  return (
    <AbsoluteFill>
      <KanjiKakeibo local={q} />
    </AbsoluteFill>
  );
};
