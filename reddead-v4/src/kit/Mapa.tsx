import React from 'react';
import cidades from '../data/cidades.json';
import dados from '../data/mapa.json';
import { c01, COR, mix, saiExpo } from './base';
import { O } from './tipos';

/**
 * O mapa dos Estados Unidos em traço, com câmera. As coordenadas são as da
 * chapa do pacote (2400 x 1350): a nação ocupa de x 322 a 2078 e de y 120 a
 * 1230. A linha de 1880, os cacos e os núcleos vêm do esquema do pacote.
 */
type Dados = { nacao: string; estados: string[]; linha_1880: number[]; cacos: number[][]; nucleos: number[][] };
export const MAPA = dados as unknown as Dados;
export const CIDADE = cidades as unknown as Record<string, [number, number]>;

export type Cam = { cx: number; cy: number; zoom: number };
export const CAM_EUA: Cam = { cx: 1200, cy: 675, zoom: 0.8 };
/** Ponto da chapa -> ponto da tela. */
export const proj = (cam: Cam, x: number, y: number): [number, number] => [(x - cam.cx) * cam.zoom + 960, (y - cam.cy) * cam.zoom + 540];
export const camMix = (a: Cam, b: Cam, t: number): Cam => ({ cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), zoom: a.zoom * Math.pow(b.zoom / a.zoom, t) });

export const MapaEUA: React.FC<{ cam?: Cam; desenho?: number; op?: number; estados?: number; cor?: string; children?: React.ReactNode }> = ({
  cam = CAM_EUA,
  desenho = 1,
  op = 1,
  estados = 0.38,
  cor = COR.creme,
  children,
}) => {
  const vb = `${(cam.cx - 960 / cam.zoom).toFixed(2)} ${(cam.cy - 540 / cam.zoom).toFixed(2)} ${(1920 / cam.zoom).toFixed(2)} ${(1080 / cam.zoom).toFixed(2)}`;
  return (
    <svg width={1920} height={1080} viewBox={vb} style={{ position: 'absolute', left: 0, top: 0 }}>
      <g opacity={op} fill="none" stroke={cor} strokeLinejoin="round">
        <g strokeWidth={1.1 / cam.zoom} strokeOpacity={estados * c01(desenho * 2.2 - 1.1)}>
          {MAPA.estados.map((d, k) => (
            <path key={k} d={d} />
          ))}
        </g>
        <path d={MAPA.nacao} strokeWidth={2.4 / cam.zoom} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(desenho)} />
      </g>
      {children}
    </svg>
  );
};

/** Curva entre dois pontos do mapa, que se desenha; devolve também a ponta. */
export const curva = (a: [number, number], b: [number, number], arco = 0.18) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: [number, number] = [mx + dy * arco, my - dx * arco];
  const em = (t: number): [number, number] => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  return { d: `M${a[0]},${a[1]} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0]},${b[1]}`, em };
};

export const Rota: React.FC<{ de: [number, number]; para: [number, number]; t: number; cam: Cam; cor?: string; arco?: number; larg?: number; ponta?: boolean; tracejada?: boolean }> = ({
  de,
  para,
  t,
  cam,
  cor = COR.vermelho,
  arco = 0.18,
  larg = 5,
  ponta = true,
  tracejada = false,
}) => {
  if (t <= 0) return null;
  const c = curva(de, para, arco);
  const p = c.em(c01(t));
  return (
    <g>
      {tracejada ? (
        <path d={c.d} fill="none" stroke={cor} strokeWidth={larg / cam.zoom} strokeLinecap="round" strokeDasharray={`${10 / cam.zoom} ${9 / cam.zoom}`} opacity={0.35} />
      ) : null}
      <path d={c.d} fill="none" stroke={cor} strokeWidth={larg / cam.zoom} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(t)} />
      {ponta && t < 1 && <circle cx={p[0]} cy={p[1]} r={9 / cam.zoom} fill="#fff" />}
    </g>
  );
};

/** Ponto de cidade no mapa (dentro do SVG): anel que pulsa e miolo. */
export const Ponto: React.FC<{ em: [number, number]; t: number; cam: Cam; f: number; cor?: string; raio?: number }> = ({ em, t, cam, f, cor = COR.vermelho, raio = 9 }) => {
  if (t <= 0) return null;
  const e = saiExpo(c01(t));
  const pulso = (f % 36) / 36;
  return (
    <g>
      <circle cx={em[0]} cy={em[1]} r={((raio + 26 * pulso) * e) / cam.zoom} fill="none" stroke={cor} strokeWidth={2.5 / cam.zoom} opacity={(1 - pulso) * 0.9} />
      <circle cx={em[0]} cy={em[1]} r={(raio * (2 - e)) / cam.zoom} fill={cor} opacity={e} />
    </g>
  );
};

/** Rótulo de cidade (HTML, por cima do mapa). */
export const Rotulo: React.FC<{ em: [number, number]; cam: Cam; t: number; texto: string; sub?: string; lado?: 'dir' | 'esq' | 'cima' | 'baixo'; tam?: number; cor?: string }> = ({
  em,
  cam,
  t,
  texto,
  sub,
  lado = 'dir',
  tam = 34,
  cor = COR.papel,
}) => {
  if (t <= 0) return null;
  const [x, y] = proj(cam, em[0], em[1]);
  const e = saiExpo(c01(t));
  const pos: React.CSSProperties =
    lado === 'dir'
      ? { left: x + 22, top: y - tam * 0.62 }
      : lado === 'esq'
        ? { right: 1920 - x + 22, top: y - tam * 0.62, textAlign: 'right' }
        : lado === 'cima'
          ? { left: x - 300, width: 600, top: y - tam * 1.9 - (sub ? tam * 0.8 : 0), textAlign: 'center' }
          : { left: x - 300, width: 600, top: y + 20, textAlign: 'center' };
  return (
    <div style={{ position: 'absolute', ...pos, opacity: e, transform: `translateY(${((1 - e) * 14).toFixed(2)}px)`, whiteSpace: 'nowrap' }}>
      <div style={{ ...O(tam, cor, 0.16), textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}>{texto}</div>
      {sub && <div style={{ ...O(tam * 0.56, COR.cinza, 0.24), marginTop: 2, textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>{sub}</div>}
    </div>
  );
};
