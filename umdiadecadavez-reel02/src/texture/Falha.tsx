import React from 'react';
import {textura} from '../theme';

// Falha da caneta: ruído que remove ~8% do traço em pontos aleatórios.
// Uso: <defs><FiltroFalha id="..." /></defs> e filter="url(#...)" no traço.
export const FiltroFalha: React.FC<{id: string}> = ({id}) => {
  const f = textura.falha;
  const k = 40; // corte quase binário
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={f.frequencia} numOctaves={f.oitavas} seed={f.semente} result="ruido" />
      <feColorMatrix
        in="ruido"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-k} 0 0 0 ${k * f.limiar}`}
        result="furos"
      />
      <feComposite in="SourceGraphic" in2="furos" operator="in" />
    </filter>
  );
};
