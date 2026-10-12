import {cores} from '../theme';

// 1 · DUOTONE. Dessatura até sobrar `saturacao` da cor original e mapeia a luminância no
// gradiente sombra → médio → alto → luz. A cor que sobra é somada por cima do gradiente,
// e o viés quente do gradiente (R > G > B em todas as faixas) manda sobre ela.

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const SOMBRA = hex(cores.sombra);
const MEDIO = hex(cores.medio);
const LUZ = hex(cores.luz);

const lut = new Float32Array(256 * 3);
let chave = '';
const montarLut = (alto: number[]) => {
  const k = alto.map((v) => v.toFixed(2)).join(',');
  if (k === chave) return;
  chave = k;
  const paradas = [SOMBRA, MEDIO, alto, LUZ];
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * 3;
    const s = Math.min(2, Math.floor(t));
    const f = t - s;
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = paradas[s][c] + (paradas[s + 1][c] - paradas[s][c]) * f;
  }
};

export const duotone = (px: Uint8ClampedArray, saturacao: number, alto: number[]) => {
  montarLut(alto);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const j = (l | 0) * 3;
    const [gr, gg, gb] = [lut[j], lut[j + 1], lut[j + 2]];
    const R = gr + saturacao * (r - l);
    let G = gg + saturacao * (g - l);
    let B = gb + saturacao * (b - l);
    // o viés quente manda: a cor original só pode somar calor, nunca tirar. A distância
    // R−G e G−B nunca fica menor que a do gradiente naquela luminância, então um gramado
    // verde vira cáqui, um céu azul vira cinza quente, uma camisa roxa vira vinho.
    if (G > R - (gr - gg)) G = R - (gr - gg);
    if (B > G - (gg - gb)) B = G - (gg - gb);
    px[i] = R;
    px[i + 1] = G;
    px[i + 2] = B;
  }
};
