import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, fontes} from '../theme';

// PESO · a palavra cresce de corpo (font-size, não escala), lentamente, ao longo de vários segundos.
export const Peso: React.FC<{texto: string; de: number; duracao: number; corpoInicial: number; corpoFinal: number; cor: string}> = ({
  texto,
  de,
  duracao,
  corpoInicial,
  corpoFinal,
  cor,
}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const corpo = interpolate(frame, [de, de + duracao], [corpoInicial, corpoFinal], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.peso,
  });
  return <div style={{fontFamily: fontes.lettering, fontSize: corpo, lineHeight: 1, color: cor, whiteSpace: 'nowrap'}}>{texto}</div>;
};
