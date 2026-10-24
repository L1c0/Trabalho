import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Plano, inclina, type Assenta } from '../lib/Plano';
import { Legenda } from '../lib/Legenda';
import { meta } from '../lib/pecas';
import { C, R, Som } from '../lib/montagem';

/**
 * 3 · A MEMÓRIA — 1026 frames.
 *
 * Um plano só, o papel do Phos: começa no verde da fosfofilita e, a cada
 * perda dita, a cor nova é reimpressa por cima pela máscara de ruído (ágata,
 * ouro, lápis, pérola). Os quadros são cartas físicas no mesmo plano: entram
 * deslizando e assentam, com a batida da prensa. A sequência de perdas é a
 * rajada (V2 §5.3): uma carta na primeira perda, outra na segunda, e na
 * terceira seis a cinco por segundo — e aí para seco no torso e segura.
 *
 * O torso é a figura em unidades (§4-bis: "as peças do corpo; as perdidas
 * saem da grade"): cada quadrado é uma peça do corpo. O que foi trocado
 * fica vazado; o que sobrou do corpo original é o tronco, e a ferrugem
 * entra por cima dele em "o que sobrou do corpo original".
 */

type Vez = { carta: string; de: number; ate: number; entra?: boolean };
const VEZES: Vez[] = [
  { carta: 'carta-m08a', de: 0, ate: 148 },
  { carta: 'carta-m01', de: 452, ate: 516, entra: true },
  { carta: 'carta-m08a', de: 516, ate: 542 },
  { carta: 'carta-m05', de: 542, ate: 589 },
  // a rajada: seis a cinco por segundo, e para no 625
  { carta: 'carta-m03b', de: 589, ate: 595 },
  { carta: 'carta-m04b', de: 595, ate: 601 },
  { carta: 'carta-m01', de: 601, ate: 607 },
  { carta: 'carta-m08a', de: 607, ate: 613 },
  { carta: 'carta-m05', de: 613, ate: 619 },
  { carta: 'carta-m04b', de: 619, ate: 625 },
  { carta: 'carta-m23', de: 782, ate: 934, entra: true },
];

const Cartas: React.FC = () => {
  const f = useCurrentFrame();
  const v = VEZES.find((x) => f >= x.de && f < x.ate);
  if (!v) return null;
  const m = meta(v.carta);
  // a carta entra deslizando no mesmo plano e assenta (12 frames, sem passar do ponto)
  const dx = v.entra
    ? interpolate(f, [v.de, v.de + 12], [1100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: (t) => 1 - Math.pow(1 - t, 3),
      })
    : 0;
  return (
    <Img
      src={staticFile(`pecas/${v.carta}.jpg`)}
      style={{ position: 'absolute', left: (1080 - m.w) / 2 + dx, top: 236, width: m.w, height: m.h }}
    />
  );
};

const camera: Assenta[] = [
  { f: 0, pose: inclina(9, -6, 1.04) },
  { f: 0, pose: inclina(6, -4), dur: 22 },
  // a figura: corte para outra inclinação, que assenta
  { f: 148, pose: inclina(-10, 6, 1.04), dur: 0 },
  { f: 148, pose: inclina(-7, 4), dur: 22 },
  { f: 452, pose: inclina(8, 5), dur: 0 },
  { f: 625, pose: inclina(-6, -5), dur: 0 },
  { f: 782, pose: inclina(7, -3), dur: 0 },
  { f: 934, pose: inclina(5, 2, 1.03), dur: 0 },
  { f: 934, pose: inclina(4, 1), dur: 22 },
];

export const Memoria: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#DCE6E2' }}>
    <Plano
      id="mem"
      camera={camera}
      papel={[R(479 + 2, 14), R(531 + 2), R(560 + 2), R(615 + 2)]}
      tinta={{
        a2: R(36),
        a3: R(70, 14),
        a4: R(94),
        'corte-148': C(148),
        'rot-corpo': R(152, 10),
        corpo: [160, 130],
        sai: [289, 6],
        entra: [324, 6],
        b1: R(379),
        b2: R(408, 14),
        b3: R(420),
        'corte-452': C(452),
        c1: R(461),
        c2: R(479, 14),
        c3: R(488),
        'corte-516': C(516),
        torso: C(625),
        d1: R(629),
        d2: R(655, 14),
        d3: R(664),
        'corte-692': C(692),
        e1: R(697),
        ferrugem: R(739, 12),
        e2: R(760, 14),
        'corte-782': C(782),
        f1: R(793),
        f2: R(829),
        f3: R(860, 14),
        f4: R(902),
        'corte-934': C(934),
        g1: R(946),
        g2: R(991, 14),
        g3: R(1007, 14),
      }}
    >
      <Cartas />
    </Plano>
    <Legenda
      short="memoria"
      soPalavra={[
        [68, 94],
        [406, 420],
        [477, 488],
        [653, 664],
        [758, 782],
        [858, 902],
        [989, 1026],
      ]}
    />
    <Som n="3-memoria" />
  </AbsoluteFill>
);
