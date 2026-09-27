import React from 'react';
import type {Imagem} from '../data/tipos';
import {Peca} from './Peca';

// Jornal, anúncio, cédula: entra cortado pela borda, rotação até 8°.
export const Documento: React.FC<{
  imagem: Imagem;
  x: number;
  y: number;
  largura: number;
  rotacao: number;
  entra: number;
  zoom?: boolean;
  origemZoom?: string;
  quadro?: {x: number; y: number; w: number; h: number};
}> = (p) => <Peca {...p} />;
