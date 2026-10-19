/**
 * Vocabulario de movimento do Vinland.
 *
 * Nenhum deles e preset de editor. Cada um sai de uma coisa que acontece
 * na obra: o arado, o soco, a tempera do ferro, o broto. Isso importa
 * porque parallax lento + screen shake aleatorio e o visual que todo
 * canal de ensaio usa, e o canal vende o oposto disso.
 */
import { interpolate, spring } from 'remotion';

/* ------------------------------------------------------------------ *
 * SULCO — o arado
 * Corte em linha reta, velocidade constante, SEM easing. Arado nao
 * desacelera no fim do campo. Usar nas passagens da fazenda.
 * ------------------------------------------------------------------ */
export const sulco = (frame: number, inicio: number, duracao: number) =>
  interpolate(frame, [inicio, inicio + duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t, // linear de proposito
  });

/* ------------------------------------------------------------------ *
 * GOLPE — o soco contado
 * O unico lugar do video onde a tela treme, e ela treme CONTADA: um
 * pulso por soco, na cadencia, decaindo dentro de cada pulso. Shake
 * aleatorio vira ruido; shake metronomico vira a contagem do cap. 96.
 * ------------------------------------------------------------------ */
export const golpe = (
  frame: number,
  {
    inicio,
    intervalo = 14,   // frames entre socos (30fps -> ~2.1 por segundo)
    n = 8,
    forca = 26,
    decaimento = 0.88, // cada soco seguinte pesa menos: ele vai aguentando
  }: {
    inicio: number;
    intervalo?: number;
    n?: number;
    forca?: number;
    decaimento?: number;
  },
) => {
  const t = frame - inicio;
  if (t < 0) return { x: 0, y: 0, soco: 0 };

  const idx = Math.floor(t / intervalo);
  if (idx >= n) return { x: 0, y: 0, soco: n };

  const dentro = t - idx * intervalo;       // frames desde ESTE soco
  const amplitude = forca * Math.pow(decaimento, idx);
  // pulso curto: sobe em 1 frame, morre em 6
  const env = Math.max(0, 1 - dentro / 6);
  const queda = env * env;                   // quadratico, bate e some

  // direcao alternada, pra leitura de "outro lado da cara"
  const lado = idx % 2 === 0 ? 1 : -1;
  return {
    x: amplitude * queda * lado,
    y: amplitude * queda * 0.35,
    soco: idx + 1,
  };
};

/* ------------------------------------------------------------------ *
 * TEMPERA — ferro quente na agua
 * O contraste bate de chapado pra duro num quadro. Nao e fade.
 * Usar nas entradas do arco da guerra.
 * ------------------------------------------------------------------ */
export const tempera = (frame: number, inicio: number, duracao = 10) => {
  const t = interpolate(frame, [inicio, inicio + duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // contraste 0.42 -> 1.0, brilho 1.28 -> 1.0
  return {
    filter: `contrast(${0.42 + 0.58 * t}) brightness(${1.28 - 0.28 * t})`,
    opacidade: Math.min(1, t * 2.6),
  };
};

/* ------------------------------------------------------------------ *
 * BROTO — a mascara que cresce de baixo
 * Lenta, sem overshoot. O fecho do cap. 220 e a unica coisa no video
 * que tem direito de demorar.
 * ------------------------------------------------------------------ */
export const broto = (frame: number, inicio: number, fps: number) => {
  const s = spring({
    frame: frame - inicio,
    fps,
    config: { damping: 200, stiffness: 28, mass: 2.4 }, // sem quique
    durationInFrames: 110,
  });
  return s;
};

/* ------------------------------------------------------------------ *
 * EMPURRAO — o zoom que quase nao existe
 * 3,5% em 8 segundos. Se o espectador PERCEBER o zoom, ele e grande
 * demais. Isso aqui existe so pra imagem parada nao morrer na tela.
 * ------------------------------------------------------------------ */
export const empurrao = (
  frame: number,
  duracao: number,
  quanto = 0.035,
) => 1 + interpolate(frame, [0, duracao], [0, quanto], {
  extrapolateRight: 'clamp',
});
