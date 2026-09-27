import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from '../data';
import {corDoBloco, escala} from '../theme';
import {Cartela} from '../lib/Cartela';
import type {Local} from './comum';

// 5 · A prática, em três linhas.
export const Pratica: React.FC<{q: Local}> = ({q}) => (
  <AbsoluteFill>
    <Cartela de={q(V.pratica.cartela.de)} linhas={V.pratica.cartela.linhas} cor={corDoBloco.azul} x={escala.margem} y={420} />
  </AbsoluteFill>
);
