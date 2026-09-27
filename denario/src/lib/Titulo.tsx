import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores, escala, fontes} from '../theme';

// Titulo · Playfair, osso, médio. NUNCA gigante.
export const Titulo: React.FC<{texto: string; x: number; y: number; tamanho?: number; rotacao?: number; entra: number}> = ({texto, x, y, tamanho = escala.titulo, rotacao = 0, entra}) =>
  useCurrentFrame() >= entra ? (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rotacao}deg)`, fontFamily: fontes.titulo, fontWeight: 400, fontSize: tamanho, lineHeight: 1.05, color: cores.osso, whiteSpace: 'nowrap'}}>
      {texto}
    </div>
  ) : null;
