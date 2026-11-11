import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile } from 'remotion';
import quadrosDosClipes from '../data/clipes.json';
import { H, W } from './base';
import { Barras, Grao, Vinheta } from './Cena';

/**
 * Um clipe do jogo com o acabamento de cinema: cor, sombra quente, vinheta,
 * grão e barras 2,39:1. A câmera pode aproximar (`zoom`) e deslocar o
 * quadro; os letterings entram por cima, como `children`.
 */

/** Clipes que começam alguns quadros adiante, segurando esse quadro no início. */
const INICIO: Record<string, number> = {
  // Os 19 primeiros quadros eram outro plano, com um menu do jogo na tela, e
  // depois vinha um mergulho no preto até o quadro 31.
  'c04-B.mp4': 32,
};

/** Remendos: uma caixa recebe a imagem do próprio clipe deslocada, com borda suave. */
const REMENDO: Record<string, { x: number; y: number; w: number; h: number; de_dy: number }> = {
  // o contador "62 FPS" da gravação, no canto de cima à direita
  'c17-J.mp4': { x: 1800, y: 0, w: 100, h: 32, de_dy: 34 },
};

export type Cor = { sat: number; temp: number; contraste?: number; brilho?: number };

/** Matriz 4x5 do feColorMatrix: saturação (luma Rec. 709) e depois temperatura. */
export const matrizDeCor = ({ sat, temp }: Cor) => {
  const s = sat;
  const t = temp;
  const L = [0.2126, 0.7152, 0.0722];
  const ganho = [1 + 0.08 * t, 1 + 0.015 * t, 1 - 0.1 * t];
  const desloc = [0.01 * t, 0, -0.01 * t];
  const linhas = [0, 1, 2].map((i) => [...[0, 1, 2].map((j) => (L[j] * (1 - s) + (i === j ? s : 0)) * ganho[i]), 0, desloc[i]]);
  return [...linhas, [0, 0, 0, 1, 0]].map((l) => l.map((v) => v.toFixed(5)).join(' ')).join(' ');
};

export const FiltroCor: React.FC<{ id: string; cor: Cor }> = ({ id, cor }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
    <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feColorMatrix type="matrix" values={matrizDeCor(cor)} />
    </filter>
  </svg>
);

type Props = {
  /** arquivo em public/clipes */
  arq: string;
  /** quadro dentro do clipe */
  k: number;
  /** quadro global, para o grão */
  f: number;
  id: string;
  cor?: Cor;
  zoom?: number;
  /** ponto para onde o zoom aproxima, em % */
  foco?: [number, number];
  dx?: number;
  dy?: number;
  barras?: number;
  escurece?: number;
  clipes?: boolean;
  children?: React.ReactNode;
};

export const Jogo: React.FC<Props> = ({ arq, k, f, id, cor = { sat: 0.86, temp: 0.18 }, zoom = 1, foco = [50, 50], dx = 0, dy = 0, barras = 1, escurece = 0, clipes = true, children }) => {
  const total = (quadrosDosClipes as Record<string, number>)[arq];
  const q = Math.max(Math.min(Math.round(k), total - 1), INICIO[arq] ?? 0);
  const rem = REMENDO[arq];
  const video = (extra?: React.CSSProperties) => (
    <Freeze frame={q}>
      <OffthreadVideo src={staticFile(`clipes/${arq}`)} muted style={{ width: W, height: H, filter: `contrast(${cor.contraste ?? 1.08}) brightness(${cor.brilho ?? 1})`, ...extra }} />
    </Freeze>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <FiltroCor id={id} cor={cor} />
      <AbsoluteFill
        style={{
          transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${zoom.toFixed(5)})`,
          transformOrigin: `${foco[0]}% ${foco[1]}%`,
        }}
      >
        {clipes ? (
          <AbsoluteFill style={{ filter: `url(#${id})` }}>
            {video()}
            {rem && (
              <div
                style={{
                  position: 'absolute',
                  left: rem.x,
                  top: rem.y,
                  width: rem.w,
                  height: rem.h,
                  overflow: 'hidden',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%)',
                }}
              >
                {video({ position: 'absolute', left: -rem.x, top: -rem.y - rem.de_dy })}
              </div>
            )}
            {/* sombra quente: o preto sobe para um marrom escuro */}
            <AbsoluteFill style={{ backgroundColor: 'rgb(24,16,10)', mixBlendMode: 'lighten' }} />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ background: 'linear-gradient(135deg, #3a332c, #1d1a17)', color: '#d8cbb8', fontFamily: 'monospace', fontSize: 40, padding: 160 }}>
            {arq} · quadro {q}
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {escurece > 0 && <AbsoluteFill style={{ backgroundColor: '#000', opacity: escurece }} />}
      <Vinheta forca={0.46} />
      <Grao f={f} forca={0.14} />
      {children}
      <Barras aberta={barras} />
    </AbsoluteFill>
  );
};
