import type { Montagem } from './tipos';

/**
 * A partitura de cor. Cada ponto é [frame, saturação, como chega no
 * próximo]: 0 = degrau (a virada cai inteira no frame, numa pausa da fala),
 * 1 = linha reta até o próximo ponto (a cor drenando na caverna).
 * Depois do pico do kabuki ela nunca sobe.
 */
export const saturacao = (m: Montagem, f: number) => {
  const p = m.partitura;
  let i = 0;
  while (i + 1 < p.length && p[i + 1][0] <= f) i++;
  const [f0, s0, modo] = p[i];
  if (modo === 1 && i + 1 < p.length) {
    const [f1, s1] = p[i + 1];
    return s0 + (s1 - s0) * Math.min(1, Math.max(0, (f - f0) / (f1 - f0)));
  }
  return s0;
};
