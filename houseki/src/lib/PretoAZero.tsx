import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {fim} from '../data/componentes';
import {pretoFinal} from './papel';

/**
 * O TERCEIRO PRETO no quadro: enquanto o papel vai a preto puro, o preto do quadro desce a
 * zero nos mesmos 20 frames, com a mesma curva. Níveis lineares: o ponto preto vai de 0 até
 * `fim.pretoDoQuadro`, o branco fica onde está (altas luzes preservadas).
 *
 * Em CSS: brightness(1/(1+b)) e depois contrast((1+b)/(1-b)) dá exatamente (x - b)/(1 - b),
 * sem estourar no meio do caminho (o brilho vem antes, então nada passa de 1).
 */
export const PretoAZero: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const f = useCurrentFrame() + inicio;
  const b = (fim.pretoDoQuadro / 255) * pretoFinal(f);
  return <AbsoluteFill style={{filter: b > 0 ? `brightness(${1 / (1 + b)}) contrast(${(1 + b) / (1 - b)})` : undefined}}>{children}</AbsoluteFill>;
};
