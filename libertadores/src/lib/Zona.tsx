import React from 'react';
import {curvas, medidas} from '../theme';

// ZONA: polígono na cor do time a 18%, borda tracejada de 2 px a 45%. Entra em 12 quadros,
// crescendo de 94% a 100% a partir do centro. Sai em 8.
export const Zona: React.FC<{pontos: {X: number; Y: number}[]; cor: string; quadro: number; ate?: number}> = ({pontos, cor, quadro, ate}) => {
  const z = medidas.zona;
  if (quadro < 0) return null;
  const t = curvas.saida(Math.min(1, quadro / z.entrada));
  const saindo = ate === undefined ? 1 : Math.max(0, Math.min(1, (ate - quadro) / 8));
  const o = t * saindo;
  if (o <= 0) return null;
  const cx = pontos.reduce((s, p) => s + p.X, 0) / pontos.length;
  const cy = pontos.reduce((s, p) => s + p.Y, 0) / pontos.length;
  const e = z.escalaInicial + (1 - z.escalaInicial) * t;
  const d = pontos.map((p, i) => `${i ? 'L' : 'M'}${p.X.toFixed(1)},${p.Y.toFixed(1)}`).join(' ') + ' Z';
  return (
    <g transform={`translate(${cx},${cy}) scale(${e}) translate(${-cx},${-cy})`} opacity={o}>
      <path d={d} fill={cor} fillOpacity={z.preenchimento} stroke={cor} strokeOpacity={z.borda} strokeWidth={z.espessuraBorda} strokeDasharray="8 6" />
    </g>
  );
};
