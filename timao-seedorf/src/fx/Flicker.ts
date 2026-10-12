import {fx} from '../theme';

// 3 · FLICKER. Brilho variando ±1,8%, soma de dois senos (3 Hz e 7 Hz) para não formar padrão.
export const flicker = (frame: number, fps: number) => {
  const t = frame / fps;
  const [a, b] = fx.flicker.freqs;
  return 1 + (fx.flicker.amplitude * (Math.sin(2 * Math.PI * a * t) + Math.sin(2 * Math.PI * b * t + 1.3))) / 2;
};
