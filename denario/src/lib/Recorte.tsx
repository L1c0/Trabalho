import React from 'react';
import type {Imagem} from '../data/tipos';
import {Peca} from './Peca';

// PNG com alfa, colado sobre o fundo. Rotação entre -4° e +4°.
export const Recorte: React.FC<{imagem: Imagem; x: number; y: number; largura: number; rotacao: number; entra: number; zoom?: boolean; origemZoom?: string}> = (p) => (
  <Peca {...p} recortada />
);
