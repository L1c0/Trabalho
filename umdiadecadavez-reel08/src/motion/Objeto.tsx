import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {curvas, tempo} from '../theme';
import {caminho, comprimento, reamostra, type Forma, type Traco} from './formas';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// OBJETO: um desenho de caneta que se faz traço a traço (stroke-dashoffset), na ordem dos
// traços, com a velocidade da mão. `pontilhado` desenha só o contorno, em pontos, parado.
export const Objeto: React.FC<{
  forma: Forma;
  x: number; // canto superior esquerdo da caixa
  y: number;
  lado: number;
  cor: string;
  inicio: number;
  duracao?: number;
  espessura?: number;
  opacidade?: number;
  pontilhado?: boolean;
}> = ({forma, x, y, lado, cor, inicio, duracao = tempo.objeto.desenho, espessura = tempo.objeto.traco, opacidade = 1, pontilhado}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (frame < inicio) return null;
  const p = pontilhado ? 1 : interpolate(frame, [inicio, inicio + duracao], [0, 1], {...clamp, easing: curvas.mao});
  // cada traço recebe uma fatia do tempo proporcional ao seu comprimento
  const comps = forma.map((t) => comprimento(t));
  const total = comps.reduce((a, b) => a + b, 0);
  let antes = 0;
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade}}>
      {forma.map((t, i) => {
        const de = antes / total;
        antes += comps[i];
        const q = Math.min(1, Math.max(0, (p - de) / (comps[i] / total)));
        if (q <= 0) return null;
        return (
          <path
            key={i}
            d={caminho(t, x, y, lado)}
            fill="none"
            stroke={cor}
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...(pontilhado ? {strokeDasharray: `0.1 ${espessura * 2.4}`} : {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - q})}
          />
        );
      })}
    </svg>
  );
};

// MORFOSE: um traço vira outro. Os dois são reamostrados no mesmo número de pontos e cada
// ponto caminha até o seu par, na curva do corpo. Sem fade.
export const Morfose: React.FC<{
  de: Traco;
  para: Traco;
  x: number;
  y: number;
  lado: number;
  cor: string;
  inicio: number;
  duracao?: number;
  espessura?: number;
}> = ({de, para, x, y, lado, cor, inicio, duracao = tempo.morfose.duracao, espessura = tempo.objeto.traco}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (frame < inicio) return null;
  const n = tempo.morfose.pontos;
  const a = reamostra(de, n);
  const b = reamostra(para, n);
  const t = interpolate(frame, [inicio, inicio + duracao], [0, 1], {...clamp, easing: curvas.corpo});
  const pts = a.map(([ax, ay], i) => [ax + (b[i][0] - ax) * t, ay + (b[i][1] - ay) * t] as const);
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={caminho(pts, x, y, lado)} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
