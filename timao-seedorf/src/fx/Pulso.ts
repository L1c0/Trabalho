import {fx} from '../theme';

// 9 · PULSO. Três momentos e só três (o gol, o pênalti, o apito final): +12% de brilho
// que cai exponencialmente em 6 frames. Nenhum flash branco cheio.
export const pulso = (frame: number, momentos: readonly number[]) => {
  let extra = 0;
  for (const m of momentos) {
    const t = frame - m;
    if (t >= 0 && t < fx.pulso.duracao) extra = Math.max(extra, fx.pulso.brilho * Math.exp(-fx.pulso.queda * t));
  }
  return 1 + extra;
};

// brilho de flicker e pulso juntos, numa passada
export const brilho = (px: Uint8ClampedArray, fator: number) => {
  if (Math.abs(fator - 1) < 1e-4) return;
  for (let i = 0; i < px.length; i += 4) {
    px[i] *= fator;
    px[i + 1] *= fator;
    px[i + 2] *= fator;
  }
};
