import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores, escala, fontes} from '../theme';

// Numero · Playfair, ouro velho, grande. Uso raro.
export const Numero: React.FC<{texto: string; x: number; y: number; tamanho?: number; rotacao?: number; entra: number}> = ({texto, x, y, tamanho = escala.numero, rotacao = 0, entra}) =>
  useCurrentFrame() >= entra ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${rotacao}deg)`,
        fontFamily: fontes.titulo,
        fontWeight: 700,
        fontSize: tamanho,
        lineHeight: 1,
        color: cores.ouro,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'lining-nums',
      }}
    >
      {texto}
    </div>
  ) : null;
