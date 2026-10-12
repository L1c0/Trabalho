import {fx} from '../theme';

// 2 · ABERRAÇÃO CROMÁTICA. O vermelho abre para fora e o azul fecha para dentro, com o
// deslocamento crescendo com o QUADRADO da distância ao centro: zero no meio, 3 px nas
// bordas. É lente: no centro da tela não aparece nada.

type Mapa = {w: number; h: number; dx: Float32Array; dy: Float32Array};
let mapa: Mapa | null = null;
let copia: Uint8ClampedArray | null = null;

const montar = (w: number, h: number): Mapa => {
  const dx = new Float32Array(w * h);
  const dy = new Float32Array(w * h);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const raio = Math.max(w, h) / 2; // a borda mais distante do lado maior
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ux = (x - cx) / raio;
      const uy = (y - cy) / raio;
      const r = Math.hypot(ux, uy);
      // |d| = máx · r², ao longo do raio, limitado a máx (nos cantos r passa de 1)
      const mag = Math.min(fx.aberracao.maximo * r * r, fx.aberracao.maximo);
      dx[y * w + x] = r > 0 ? (mag * ux) / r : 0;
      dy[y * w + x] = r > 0 ? (mag * uy) / r : 0;
    }
  }
  return {w, h, dx, dy};
};

const amostra = (src: Uint8ClampedArray, w: number, h: number, x: number, y: number, c: number) => {
  const xi = Math.max(0, Math.min(w - 2, Math.floor(x)));
  const yi = Math.max(0, Math.min(h - 2, Math.floor(y)));
  const fx_ = Math.max(0, Math.min(1, x - xi));
  const fy = Math.max(0, Math.min(1, y - yi));
  const i = (yi * w + xi) * 4 + c;
  const a = src[i] + (src[i + 4] - src[i]) * fx_;
  const b = src[i + w * 4] + (src[i + w * 4 + 4] - src[i + w * 4]) * fx_;
  return a + (b - a) * fy;
};

export const aberracao = (px: Uint8ClampedArray, w: number, h: number) => {
  if (!mapa || mapa.w !== w || mapa.h !== h) mapa = montar(w, h);
  if (!copia || copia.length !== px.length) copia = new Uint8ClampedArray(px.length);
  copia.set(px);
  const {dx, dy} = mapa;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      const ox = dx[k];
      const oy = dy[k];
      if (ox * ox + oy * oy < 0.01) continue;
      const i = k * 4;
      px[i] = amostra(copia, w, h, x - ox, y - oy, 0); // vermelho: a imagem vai para fora
      px[i + 2] = amostra(copia, w, h, x + ox, y + oy, 2); // azul: para dentro
    }
  }
};
