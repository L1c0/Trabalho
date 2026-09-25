import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {motion} from '../theme';

// Saída de cena: a tinta afunda no papel.
export const Absorcao: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const frame = useCurrentFrame();
  const opacidade = interpolate(frame, [inicio, inicio + motion.absorcao], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity: opacidade}}>{children}</AbsoluteFill>;
};
