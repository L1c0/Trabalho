import React from 'react';
import {paleta} from '../theme';
import {useProjetor} from './formato';

// O CAMPO DESENHADO. SVG, nunca imagem. Medidas oficiais em metros (105 x 68).
const C = 105;
const L = 68;
const LISTRAS = 14;
const MARGEM_M = 3; // o gramado passa 3 m das linhas

// 3% mais claro que o campo
const clarear = (hex: string, f: number) =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) + f * (255 - parseInt(hex.slice(i, i + 2), 16))).toString(16).padStart(2, '0')).join('');

export const Gramado: React.FC = () => {
  const {p, pxPorMetro} = useProjetor();
  const m = (xm: number, ym: number) => p({x: xm / C, y: ym / L});
  const poli = (pts: [number, number][]) =>
    pts.map(([x, y], i) => {
      const q = m(x, y);
      return `${i ? 'L' : 'M'}${q.X.toFixed(1)},${q.Y.toFixed(1)}`;
    }).join(' ') + ' Z';
  const ret = (x0: number, y0: number, x1: number, y1: number) => poli([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
  const linha = (x0: number, y0: number, x1: number, y1: number) => {
    const [a, b] = [m(x0, y0), m(x1, y1)];
    return `M${a.X.toFixed(1)},${a.Y.toFixed(1)} L${b.X.toFixed(1)},${b.Y.toFixed(1)}`;
  };
  const ponto = (x: number, y: number, r: number) => {
    const q = m(x, y);
    return <circle cx={q.X} cy={q.Y} r={r} fill={paleta.linhas} />;
  };
  const [ga0, ga1] = [(L - 40.32) / 2, (L + 40.32) / 2]; // grande área
  const [pa0, pa1] = [(L - 18.32) / 2, (L + 18.32) / 2]; // pequena área
  const [g0, g1] = [(L - 7.32) / 2, (L + 7.32) / 2]; // gol
  const traco = {fill: 'none', stroke: paleta.linhas, strokeWidth: 2};
  const listra = clarear(paleta.campo, 0.03);
  const passo = (C + 2 * MARGEM_M) / LISTRAS;
  const centro = m(C / 2, L / 2);

  return (
    <g>
      <path d={ret(-MARGEM_M, -MARGEM_M, C + MARGEM_M, L + MARGEM_M)} fill={paleta.campo} />
      {Array.from({length: LISTRAS}, (_, i) =>
        i % 2 ? <path key={i} d={ret(-MARGEM_M + i * passo, -MARGEM_M, -MARGEM_M + (i + 1) * passo, L + MARGEM_M)} fill={listra} /> : null,
      )}
      <path d={ret(0, 0, C, L)} {...traco} />
      <path d={linha(C / 2, 0, C / 2, L)} {...traco} />
      <circle cx={centro.X} cy={centro.Y} r={9.15 * pxPorMetro} {...traco} />
      {ponto(C / 2, L / 2, 3)}
      {[0, 1].map((lado) => {
        const x = (d: number) => (lado ? C - d : d);
        return (
          <g key={lado}>
            <path d={poli([[x(0), ga0], [x(16.5), ga0], [x(16.5), ga1], [x(0), ga1]])} {...traco} />
            <path d={poli([[x(0), pa0], [x(5.5), pa0], [x(5.5), pa1], [x(0), pa1]])} {...traco} />
            <path d={poli([[x(0), g0], [x(-2), g0], [x(-2), g1], [x(0), g1]])} {...traco} />
            {ponto(x(11), L / 2, 3)}
          </g>
        );
      })}
    </g>
  );
};
