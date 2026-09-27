import React from 'react';
import type {Imagem} from '../data/tipos';
import {Peca} from './Peca';

// Foto inteira, recortada por retângulo ou círculo (`quadro` escolhe o trecho da foto).
// O zoom lento acontece dentro do recorte: a moldura fica parada.
export const Cena: React.FC<{
  imagem: Imagem;
  x: number;
  y: number;
  largura: number;
  rotacao: number;
  entra: number;
  zoom?: boolean;
  origemZoom?: string;
  quadro?: {x: number; y: number; w: number; h: number};
  forma?: 'retangulo' | 'circulo';
}> = (p) => <Peca {...p} />;
