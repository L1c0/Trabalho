import React from 'react';
import {useVideoConfig} from 'remotion';
import {tempo as T, textura} from '../theme';

// Grid de perspectiva em wireframe: o chão até o horizonte, linhas na cor do bloco.
// Anda sempre, devagar, em direção a quem assiste. `t` é o tempo do grid em frames
// (o Video desconta as pausas em que tudo para).
export const Grid: React.FC<{cor: string; t: number; fuga: {x: number; y: number}; opacidade?: number}> = ({
  cor,
  t,
  fuga,
  opacidade = textura.grid.opacidade,
}) => {
  const {width: W, height: H} = useVideoConfig();
  const g = textura.grid;
  const vx = fuga.x * W;
  const vy = fuga.y * H;
  const fase = (t / T.grid.quadrosPorLinha) % 1;
  // profundidade z: z = 1 é a base do quadro; y = horizonte + (H - horizonte) / z
  const horizontais: number[] = [];
  for (let k = 0; k < g.linhas; k++) {
    const z = k + 1 - fase;
    if (z <= 0.35) continue;
    const y = vy + (H - vy) / z;
    if (y <= H + 1) horizontais.push(y);
  }
  const abertura = W * 1.6; // largura do leque na base
  const raios = Array.from({length: g.raios + 1}, (_, i) => vx - abertura / 2 + (i / g.raios) * abertura);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: opacidade}}>
      <defs>
        {/* perto do horizonte o grid some: as linhas ficam densas demais para ler */}
        <linearGradient id="gridLonge" x1="0" y1={vy} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.35" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="gridMascara">
          <rect x={0} y={0} width={W} height={H} fill="url(#gridLonge)" />
        </mask>
      </defs>
      <g mask="url(#gridMascara)" stroke={cor} strokeWidth={g.espessura} fill="none">
        <line x1={0} x2={W} y1={vy} y2={vy} />
        {horizontais.map((y, i) => (
          <line key={i} x1={0} x2={W} y1={y} y2={y} />
        ))}
        {raios.map((x, i) => (
          <line key={`r${i}`} x1={vx} y1={vy} x2={x} y2={H} />
        ))}
      </g>
    </svg>
  );
};
