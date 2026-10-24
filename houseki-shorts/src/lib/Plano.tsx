import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camada, type Tempos } from './Camada';
import { meta, PIVO } from './pecas';

/**
 * O papel em perspectiva (V2 §2.1). A folha impressa vive num plano dentro
 * do espaço 3D; a câmera inclina o plano de 6 a 14 graus, e a aproximação
 * vira paralaxe: a borda próxima cresce mais depressa que a distante.
 *
 * O plano nunca gira em eixo contínuo: ele ASSENTA. Cada pose nova chega e
 * para (desaceleração cúbica, sem passar do ponto — mola e ricochete estão
 * proibidos), e entre uma e outra a imagem fica parada de verdade.
 */

/** s: escala; x, y: ponto do QUADRO (coordenadas do plano) que fica no pivô; rx, ry: graus. */
export type Pose = { s: number; x: number; y: number; rx: number; ry: number };
/** A partir do frame `f`, vai da pose anterior até `pose` em `dur` frames. */
export type Assenta = { f: number; pose: Pose; dur?: number; curva?: (t: number) => number };

export const assentar = (t: number) => 1 - Math.pow(1 - t, 3);

const mistura = (a: Pose, b: Pose, t: number): Pose => ({
  s: a.s * Math.pow(b.s / a.s, t),           // escala em log: aproximação de velocidade uniforme
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rx: a.rx + (b.rx - a.rx) * t,
  ry: a.ry + (b.ry - a.ry) * t,
});

export const poseEm = (chaves: Assenta[], f: number): Pose => {
  let atual = chaves[0].pose;
  for (let i = 1; i < chaves.length; i++) {
    const c = chaves[i];
    if (f < c.f) break;
    const dur = c.dur ?? 20;
    if (f >= c.f + dur) {
      atual = c.pose;
      continue;
    }
    const t = (c.curva ?? assentar)((f - c.f) / dur);
    return mistura(atual, c.pose, t);
  }
  return atual;
};

export const transformDe = (p: Pose, ox: number, oy: number, pivo: [number, number]) =>
  `translate(${pivo[0]}px, ${pivo[1]}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${p.s}) translate(${-(p.x + ox)}px, ${-(p.y + oy)}px)`;

export const Plano: React.FC<{
  id: string;
  camera: Assenta[];
  tinta?: Tempos;
  papel?: Tempos;
  pivo?: [number, number];
  /** quadro de referência (coordenadas do frame quando a pose é neutra) */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ id, camera, tinta, papel, pivo = PIVO, children, style }) => {
  const f = useCurrentFrame();
  const m = meta(id);
  const p = poseEm(camera, f);
  return (
    <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `${pivo[0]}px ${pivo[1]}px`, overflow: 'hidden', ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: m.w,
          height: m.h,
          transformOrigin: '0 0',
          transform: transformDe(p, m.ox, m.oy, pivo),
          isolation: 'isolate',
        }}
      >
        <Camada id={id} camada="papel" tempos={papel} f={f} />
        <Camada id={id} camada="tinta" tempos={tinta} f={f} />
        {/* o que vive no mesmo plano (as cartas), em coordenadas do quadro */}
        {children && <div style={{ position: 'absolute', left: m.ox, top: m.oy, width: 1080, height: 1920 }}>{children}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** Pose neutra: o quadro do plano exatamente na tela. */
export const NEUTRA: Pose = { s: 1, x: PIVO[0], y: PIVO[1], rx: 0, ry: 0 };
/** Atalho: pose inclinada em torno da neutra. */
export const inclina = (rx: number, ry: number, s = 1, dx = 0, dy = 0): Pose => ({
  s,
  x: PIVO[0] + dx,
  y: PIVO[1] + dy,
  rx,
  ry,
});
