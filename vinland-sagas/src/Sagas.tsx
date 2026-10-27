import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import tl from './data/timeline.json';
import { Legenda } from './Legenda';

/**
 * AS DUAS SAGAS — 1080x1920, 30 fps, 1258 frames (docs/LEIA-PRIMEIRO.md).
 *
 * Uma página que se compõe linha a linha: <Img> de quadro inteiro
 * empilhados, com a opacidade de cada um lida da tabela do timeline.json
 * naquele frame (já multiplicada por tinta_base). Nada é composto por pixel.
 *
 * O desregistro: a partir do frame 880 todas as peças visíveis são
 * desenhadas outra vez, deslocadas de (dx, dy) e com opacidade
 * tinta_fantasma, por baixo da camada normal, que cai para 30%. Depois o
 * Haukr carimba por cima, em ferrugem. A escala (1,000 a 1,040, linear)
 * vai num container que envolve tudo, em volta de (540, 860).
 */
const T = tl as unknown as {
  camera: { centro: number[] };
  pecas: { n: string }[];
  colunas: string[];
  quadros: number[][];
};
const C = Object.fromEntries(T.colunas.map((c, i) => [c, i])) as Record<string, number>;
const PECAS = T.pecas.map((p) => p.n);
const [CX, CY] = T.camera.centro;

const Peca: React.FC<{ n: string; tinta: number }> = ({ n, tinta }) => (
  <Img src={staticFile(`${n}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: tinta }} />
);

export const Sagas: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.quadros[Math.min(f, T.quadros.length - 1)];
  const base = q[C.tinta_base];
  const fantasma = q[C.tinta_fantasma];
  // a cópia de cada peça: a opacidade dela relativa à tinta da página, vezes a tinta do fantasma
  const rel = base > 0 ? fantasma / base : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#CFCBC0' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${CX}px ${CY}px`, transform: `scale(${q[C.escala]})` }}>
        <Img src={staticFile('papel-sagas.jpg')} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }} />
        {fantasma > 0 && (
          <div style={{ position: 'absolute', inset: 0, transform: `translate(${q[C.dx]}px, ${q[C.dy]}px)` }}>
            {PECAS.map((n) => (q[C[n]] > 0 ? <Peca key={n} n={n} tinta={q[C[n]] * rel} /> : null))}
          </div>
        )}
        {PECAS.map((n) => (q[C[n]] > 0 ? <Peca key={n} n={n} tinta={q[C[n]]} /> : null))}
        {q[C.opac_haukr] > 0 && <Peca n="haukr" tinta={q[C.opac_haukr]} />}
      </div>
      <Legenda />
      <Audio src={staticFile('audio/3-sagas.mp3')} />
    </AbsoluteFill>
  );
};
