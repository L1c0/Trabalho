import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cores, fx} from '../theme';
import {rgba} from './cor';

// 10 · VAZAMENTO DE LUZ. Só na glória: luz quente entrando pela borda direita, a opacidade
// subindo e descendo entre 0 e 14% num período de 7 s. Lento demais para ser notado.
export const Vazamento: React.FC<{intensidade: number}> = ({intensidade}) => {
  const frame = useCurrentFrame();
  if (intensidade <= 0) return null;
  const v = fx.vazamento;
  const op = (v.maximo * (1 - Math.cos((2 * Math.PI * frame) / v.periodo))) / 2;
  return (
    <AbsoluteFill
      style={{
        opacity: op * intensidade,
        mixBlendMode: 'screen',
        background: `radial-gradient(ellipse 60% 90% at 105% 45%, ${rgba(cores.quente, 1)} 0%, ${rgba(cores.quente, 0.5)} 40%, ${rgba(cores.quente, 0)} 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};
