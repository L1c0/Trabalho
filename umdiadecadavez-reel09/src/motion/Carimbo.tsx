import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';
import {Sangramento} from '../texture/Sangramento';
import {Manuscrito} from './Manuscrito';

// CARIMBO à mão: um texto manuscrito com um círculo irregular desenhado a traço em volta,
// girado. O círculo passa um pouco do ponto de partida, como caneta fechando à mão.
// `pulsa`: num frame dado, cresce de leve e volta, uma vez só.
export const Carimbo: React.FC<{
  texto: string;
  x: number; // centro
  y: number;
  raio: number;
  tamanho: number;
  cor: string;
  inicio: number;
  pulsa?: number;
  semente?: string;
}> = ({texto, x, y, raio, tamanho, cor, inicio, pulsa, semente = 'carimbo'}) => {
  const frame = useCurrentFrame();
  if (frame < inicio) return null;
  const c = tempo.carimbo;
  const q = interpolate(frame, [inicio, inicio + c.desenho], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curvas.mao});
  const n = 48;
  const volta = 2 * Math.PI * 1.08; // passa do começo
  const pts = Array.from({length: n + 1}, (_, i) => {
    const a = -Math.PI * 0.6 + (volta * i) / n;
    const r = raio * (1 + 0.06 * Math.sin(a * 3 + random(semente) * 6) + (random(`${semente}-${i}`) - 0.5) * 0.03);
    return `${(r * 1.12 * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  });
  const pulso =
    pulsa === undefined ? 1 : 1 + c.pulsoEscala * Math.sin(Math.PI * interpolate(frame, [pulsa, pulsa + c.pulso], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${c.rotacao}deg) scale(${pulso})`}}>
      <Sangramento estilo={{position: 'absolute', left: 0, top: 0}}>
        <svg width={1} height={1} style={{position: 'absolute', overflow: 'visible'}}>
          <path d={`M${pts.join(' L')}`} fill="none" stroke={cor} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} />
        </svg>
      </Sangramento>
      <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -58%)'}}>
        <Manuscrito texto={texto} inicio={inicio + 6} tamanho={tamanho} cor={cor} semente={`${semente}-t`} falha />
      </div>
    </div>
  );
};
