import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Plano, NEUTRA, type Assenta } from '../lib/Plano';
import { Legenda } from '../lib/Legenda';
import { R, Som } from '../lib/montagem';

/**
 * 1 · O LEVIATÃ — 983 frames.
 *
 * Uma única aproximação contínua, do frontispício inteiro até dentro da
 * armadura, onde dá para contar as pessoas (V2 §5.1). Antes de "Agora chega
 * perto" (280) a câmera anda devagar o bastante para parecer parada; dali em
 * diante ela vai, e na última batida (915) para dentro do corpo do gigante
 * e não volta.
 *
 * A gravura fica numa janela; embaixo, uma faixa de papel com filete (a
 * página de catálogo): procedência, a legenda queimada e, no fim, a
 * pergunta, impressa sozinha no papel enquanto a multidão continua em cima.
 * Letra nunca vai por cima da gravura cheia.
 *
 * As coordenadas da câmera são as da própria gravura (2208 x 3521).
 */
const JANELA: [number, number] = [540, 575];

// perfil de velocidade da aproximação: arranca em 12% do trecho, anda, e
// desacelera nos últimos 30% até parar no 915 (aceleração constante)
const trapezio = (a: number, d: number) => (t: number) => {
  const v = 1 / (1 - a / 2 - d / 2);
  if (t < a) return (v * t * t) / (2 * a);
  if (t < 1 - d) return v * (a / 2 + (t - a));
  const r = 1 - t;
  return 1 - (v * r * r) / (2 * d);
};

const camera: Assenta[] = [
  { f: 0, pose: { s: 0.29, x: 1104, y: 1840, rx: 6, ry: -4 } },
  { f: 0, pose: { s: 0.312, x: 1094, y: 1740, rx: 5.8, ry: -3.8 }, dur: 280, curva: (t) => t },
  { f: 280, pose: { s: 1.85, x: 1012, y: 742, rx: 5, ry: -3 }, dur: 635, curva: trapezio(0.12, 0.3) },
];

export const Leviata: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#E4E2DD' }}>
    <Plano id="lev" camera={camera} pivo={JANELA} tinta={{ circulo: [373, 18] }} />
    <Plano id="lev-mat" camera={[{ f: 0, pose: NEUTRA }]} tinta={{ q1: R(918, 14), q2: R(958, 12) }} />
    <Legenda short="leviata" soPalavra={[[915, 983]]} />
    <Som n="1-leviata" />
  </AbsoluteFill>
);
