import {interpolate} from 'remotion';
import {curvas} from '../theme';

// O estado de um anel num frame: onde está, de que tamanho, quanto girou.
// `giro` é o eixo de tudo: scaleX = cos(giro · π). 0 = de frente, 0,5 = de perfil,
// 1 = de frente espelhado, 1,5 = de perfil de novo…
export type EstadoDoAnel = {x: number; y: number; raio: number; giro: number; traco: number};
export type Quadro = {f: number} & Partial<EstadoDoAnel>;

const campos = ['x', 'y', 'raio', 'giro', 'traco'] as const;

// Interpola cada campo entre os quadros-chave em que ele aparece. Posição e tamanho
// seguem a curva do corpo; o giro é linear dentro de cada trecho (a velocidade do giro
// é decidida pelos quadros-chave).
export const estadoNo = (trajeto: readonly Quadro[], frame: number): EstadoDoAnel => {
  const e = {x: 0, y: 0, raio: 0, giro: 0, traco: 1};
  for (const c of campos) {
    const pts = trajeto.filter((q) => q[c] !== undefined) as (Quadro & Record<typeof c, number>)[];
    if (pts.length === 0) continue;
    if (pts.length === 1) {
      e[c] = pts[0][c];
      continue;
    }
    e[c] = interpolate(
      frame,
      pts.map((q) => q.f),
      pts.map((q) => q[c]),
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: c === 'giro' ? curvas.linear : curvas.corpo},
    );
  }
  return e;
};

export const escalaX = (giro: number) => Math.cos(giro * Math.PI);
