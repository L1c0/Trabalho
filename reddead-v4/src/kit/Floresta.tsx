import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COR, H, rnd, W } from './base';

/**
 * A faixa vermelha da série, refeita em camadas: o céu vermelho, três
 * fileiras de pinheiros (longe, meio e perto) e a borda rasgada. Em camadas,
 * ela ganha paralaxe quando a câmera anda e os pinheiros balançam com o vento.
 *
 * O desenho segue o da faixa original: pinheiro feito de losangos empilhados,
 * mais largos na base.
 */
const pinheiro = (cx: number, base: number, alt: number, larg: number, niveis: number, sem: number) => {
  // desce pelo lado esquerdo, alternando ponta e reentrância, e sobe pelo direito
  const esq: [number, number][] = [];
  const dir: [number, number][] = [];
  for (let k = 0; k < niveis; k++) {
    const y0 = base - alt + (alt * k) / niveis;
    const y1 = base - alt + (alt * (k + 1)) / niveis;
    const ym = y0 + (y1 - y0) * 0.62;
    const w = (larg / 2) * ((k + 1) / niveis) * (0.86 + 0.28 * rnd(sem, k, 1));
    const wr = w * (0.42 + 0.16 * rnd(sem, k, 2));
    esq.push([cx - w, ym], [cx - wr, y1]);
    dir.push([cx + w * (0.9 + 0.2 * rnd(sem, k, 3)), ym], [cx + wr, y1]);
  }
  const pts: [number, number][] = [[cx, base - alt], ...esq, [cx - larg * 0.04, base + 6], [cx + larg * 0.04, base + 6], ...dir.reverse()];
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
};

type Fileira = { n: number; alt: [number, number]; larg: [number, number]; cor: string; base: number; sem: number; par: number };
const FILEIRAS: Fileira[] = [
  { n: 30, alt: [300, 520], larg: [130, 210], cor: 'rgba(96,10,8,0.62)', base: 700, sem: 1, par: 0.25 },
  { n: 26, alt: [220, 420], larg: [120, 200], cor: 'rgba(52,6,5,0.9)', base: 715, sem: 2, par: 0.55 },
  { n: 22, alt: [170, 360], larg: [110, 190], cor: '#140303', base: 730, sem: 3, par: 1 },
];

/** A borda de cima, rasgada. */
const rasgo = (y: number, sem: number, larg = W + 400) => {
  const pts = [`-200,-200`];
  const passos = 90;
  for (let i = 0; i <= passos; i++) {
    const x = -200 + (larg * i) / passos;
    pts.push(`${x.toFixed(1)},${(y + (rnd(i, sem) - 0.5) * 34 + (rnd(i, sem, 2) > 0.8 ? 18 : 0)).toFixed(1)}`);
  }
  pts.push(`${larg - 200},-200`);
  return pts.join(' ');
};

/**
 * `camX` desloca as fileiras em paralaxe (px da fileira da frente).
 * `topo` e `base` são os limites da faixa na tela; fora dela é preto.
 */
export const Floresta: React.FC<{ f: number; camX?: number; topo?: number; base?: number; brilho?: number; vento?: number }> = ({
  f,
  camX = 0,
  topo = 40,
  base = 640,
  brilho = 1,
  vento = 1,
}) => {
  const alt = base - topo;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: topo, width: W, height: alt, overflow: 'hidden' }}>
        {/* o céu */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 75% 85% at 50% 38%, rgba(232,24,18,${brilho}) 0%, rgba(196,16,13,${brilho}) 38%, rgba(120,9,8,${brilho}) 78%, rgba(60,5,5,${brilho}) 100%)`,
          }}
        />
        <svg width={W} height={alt} viewBox={`0 ${700 - alt + 30} ${W} ${alt}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          {FILEIRAS.map((fl, k) => (
            <g key={k} transform={`translate(${(-camX * fl.par).toFixed(2)} 0)`}>
              {Array.from({ length: fl.n }, (_, i) => {
                const cx = -200 + ((W + 400) * (i + rnd(i, fl.sem, 7) * 0.9)) / fl.n;
                const h = fl.alt[0] + (fl.alt[1] - fl.alt[0]) * rnd(i, fl.sem, 8);
                const w = fl.larg[0] + (fl.larg[1] - fl.larg[0]) * rnd(i, fl.sem, 9);
                const balanco = Math.sin(f * 0.035 * (0.7 + rnd(i, fl.sem, 10)) + i * 1.3) * 0.9 * vento * (0.5 + fl.par * 0.5);
                return (
                  <polygon
                    key={i}
                    points={pinheiro(cx, fl.base, h, w, 5 + Math.floor(rnd(i, fl.sem, 11) * 3), i * 13 + fl.sem)}
                    fill={fl.cor}
                    transform={`skewX(${balanco.toFixed(3)})`}
                    style={{ transformOrigin: `${cx}px ${fl.base}px`, transformBox: 'view-box' as const }}
                  />
                );
              })}
            </g>
          ))}
          {/* o chão escurece */}
          <rect x={-200} y={690} width={W + 400} height={200} fill="#0b0202" />
        </svg>
        {/* a borda rasgada de cima */}
        <svg width={W} height={alt} viewBox={`0 0 ${W} ${alt}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <polygon points={rasgo(26, 5)} fill={COR.preto} transform={`translate(${(-camX * 0.1).toFixed(2)} 0)`} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)' }} />
      </div>
    </AbsoluteFill>
  );
};

export const FAIXA = { topo: 40, base: 640, H };
