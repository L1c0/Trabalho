import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fx} from '../theme';

// 5 · VINHETA. Radial, começando em 62% do raio; a intensidade vem do bloco
// (30% na queda, 22% no meio, 16% na glória).
export const Vinheta: React.FC<{intensidade: number}> = ({intensidade}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse farthest-corner at 50% 50%, rgba(0,0,0,0) ${fx.vinheta.inicio * 100}%, rgba(0,0,0,${intensidade}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);
