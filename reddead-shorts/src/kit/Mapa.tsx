import React from 'react';
import cidades from '../data/cidades.json';
import dados from '../data/mapa.json';
import { c01, COR, H, mix, W } from './base';

/**
 * O mapa dos Estados Unidos em traço, com câmera. As coordenadas são as de
 * uma chapa de 2400 x 1350: a nação ocupa de x 322 a 2078 e de y 120 a 1230.
 * A linha de 1880, os cacos dela e os núcleos de povoamento vêm do mesmo
 * esquema usado no vídeo longo.
 */
type Dados = { nacao: string; estados: string[]; linha_1880: number[]; cacos: number[][]; nucleos: number[][] };
export const MAPA = dados as unknown as Dados;
export const CIDADE = cidades as unknown as Record<string, [number, number]>;

export type Cam = { cx: number; cy: number; zoom: number };
/** Ponto da chapa -> ponto da tela (a câmera olha para o centro, um pouco acima do meio). */
export const CENTRO: [number, number] = [W / 2, 860];
export const proj = (cam: Cam, x: number, y: number): [number, number] => [(x - cam.cx) * cam.zoom + CENTRO[0], (y - cam.cy) * cam.zoom + CENTRO[1]];
export const camMix = (a: Cam, b: Cam, t: number): Cam => ({ cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), zoom: a.zoom * Math.pow(b.zoom / a.zoom, t) });

export const MapaEUA: React.FC<{ cam: Cam; desenho?: number; op?: number; estados?: number; cor?: string; larg?: number; children?: React.ReactNode }> = ({
  cam,
  desenho = 1,
  op = 1,
  estados = 0.3,
  cor = COR.tinta,
  larg = 3,
  children,
}) => {
  const vb = `${(cam.cx - CENTRO[0] / cam.zoom).toFixed(2)} ${(cam.cy - CENTRO[1] / cam.zoom).toFixed(2)} ${(W / cam.zoom).toFixed(2)} ${(H / cam.zoom).toFixed(2)}`;
  return (
    <svg width={W} height={H} viewBox={vb} style={{ position: 'absolute', left: 0, top: 0 }}>
      <g opacity={op} fill="none" stroke={cor} strokeLinejoin="round">
        <g strokeWidth={1.2 / cam.zoom} strokeOpacity={estados * c01(desenho * 2.2 - 1.1)}>
          {MAPA.estados.map((d, k) => (
            <path key={k} d={d} />
          ))}
        </g>
        <path d={MAPA.nacao} strokeWidth={larg / cam.zoom} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(desenho)} />
      </g>
      {children}
    </svg>
  );
};

/** Curva entre dois pontos do mapa; devolve o desenho e a posição ao longo dela. */
export const curva = (a: [number, number], b: [number, number], arco = 0.18) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: [number, number] = [mx + dy * arco, my - dx * arco];
  const em = (t: number): [number, number] => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  return { d: `M${a[0]},${a[1]} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0]},${b[1]}`, em };
};
