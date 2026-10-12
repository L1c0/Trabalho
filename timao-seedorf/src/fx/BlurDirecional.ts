import {fx} from '../theme';

// 8 · DESFOQUE DE VELOCIDADE. Só nos clipes abaixo de 0,70: um desfoque horizontal de
// 2 px, misturado na proporção do movimento do quadro. Disfarça o degrau da câmera lenta.

let copia: Uint8ClampedArray | null = null;

export const blurDirecional = (px: Uint8ClampedArray, w: number, h: number, mistura: number) => {
  if (mistura <= 0.01) return;
  if (!copia || copia.length !== px.length) copia = new Uint8ClampedArray(px.length);
  copia.set(px);
  const r = fx.blur.raio;
  for (let y = 0; y < h; y++) {
    const linha = y * w;
    for (let x = 0; x < w; x++) {
      const i = (linha + x) * 4;
      for (let c = 0; c < 3; c++) {
        let soma = 0;
        for (let k = -r; k <= r; k++) soma += copia[(linha + Math.min(w - 1, Math.max(0, x + k))) * 4 + c];
        px[i + c] = copia[i + c] + (soma / (2 * r + 1) - copia[i + c]) * mistura;
      }
    }
  }
};
