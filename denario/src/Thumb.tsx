import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from './data';
import {Elemento} from './lib/Elemento';
import {Fundo} from './lib/Fundo';
import {Marca} from './lib/Marca';

// Thumb 16x9: a mesma colagem, parada. Margem de segurança de 10% nos dados.
export const Thumb: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    {V.thumb.elementos.map((e, i) => (
      <Elemento key={i} e={e} imagens={V.imagens} />
    ))}
    <Marca />
  </AbsoluteFill>
);
