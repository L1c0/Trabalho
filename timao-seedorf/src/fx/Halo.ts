import {cores, fx} from '../theme';

// 7 · HALAÇÃO. O que passa de 0,82 de luminância vira uma máscara, borrada em ~8 px, e
// soma um brilho quente (#C98F6B a 18%) por cima: o refletor estourando.
// A máscara é borrada em meia resolução, com três passadas de caixa (≈ gaussiana).

const [QR, QG, QB] = [1, 3, 5].map((i) => parseInt(cores.quente.slice(i, i + 2), 16));
let buf: Float32Array | null = null;
let tmp: Float32Array | null = null;

const caixa = (src: Float32Array, dst: Float32Array, w: number, h: number, r: number, horizontal: boolean) => {
  const n = horizontal ? w : h;
  const linhas = horizontal ? h : w;
  const passo = horizontal ? 1 : w;
  for (let l = 0; l < linhas; l++) {
    const base = horizontal ? l * w : l;
    let soma = 0;
    for (let k = -r; k <= r; k++) soma += src[base + Math.min(n - 1, Math.max(0, k)) * passo];
    for (let i = 0; i < n; i++) {
      dst[base + i * passo] = soma / (2 * r + 1);
      const sai = Math.max(0, i - r);
      const entra = Math.min(n - 1, i + r + 1);
      soma += src[base + entra * passo] - src[base + sai * passo];
    }
  }
};

export const halo = (px: Uint8ClampedArray, w: number, h: number, intensidade: number) => {
  if (intensidade <= 0) return;
  const hw = w >> 1;
  const hh = h >> 1;
  if (!buf || buf.length !== hw * hh) {
    buf = new Float32Array(hw * hh);
    tmp = new Float32Array(hw * hh);
  }
  const lim = fx.halo.limiar * 255;
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < hw; x++) {
      const i = ((y * 2) * w + x * 2) * 4;
      const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
      buf[y * hw + x] = l > lim ? Math.min(1, (l - lim) / 20) : 0;
    }
  }
  const r = Math.max(1, Math.round(fx.halo.raio / 2 / 1.7));
  for (let k = 0; k < 3; k++) {
    caixa(buf, tmp!, hw, hh, r, true);
    caixa(tmp!, buf, hw, hh, r, false);
  }
  const a = fx.halo.opacidade * intensidade;
  for (let y = 0; y < h; y++) {
    const my = Math.min(hh - 1, y >> 1);
    for (let x = 0; x < w; x++) {
      const m = buf[my * hw + Math.min(hw - 1, x >> 1)] * a;
      if (m < 0.002) continue;
      const i = (y * w + x) * 4;
      // tela (screen) com a cor quente
      px[i] += (255 - px[i]) * m * (QR / 255);
      px[i + 1] += (255 - px[i + 1]) * m * (QG / 255);
      px[i + 2] += (255 - px[i + 2]) * m * (QB / 255);
    }
  }
};
