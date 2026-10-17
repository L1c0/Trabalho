import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {papelNo} from './papel';

/**
 * PAPEL: o fundo de tela cheia. Lê o estado do papel no frame e interpola (ver papel.ts).
 * O grão vem por cima de tudo, em <Grao>.
 */
export const Papel: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor: papelNo(f)}}>{children}</AbsoluteFill>;
};
