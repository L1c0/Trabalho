import {random} from 'remotion';

// 4 · GRÃO. Ruído gaussiano monocromático, regenerado a cada frame: uma tabela grande de
// valores normais e um ponto de partida novo (e um passo novo) a cada quadro. Grão parado
// é textura colada; este ferve.

const N = 1 << 22;
let tabela: Float32Array | null = null;
const montar = () => {
  const t = new Float32Array(N);
  let s = 1234567;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s + 1) / 0x80000001;
  };
  for (let i = 0; i < N; i += 2) {
    // Box–Muller
    const u = rnd();
    const v = rnd();
    const m = Math.sqrt(-2 * Math.log(u));
    t[i] = m * Math.cos(2 * Math.PI * v);
    t[i + 1] = m * Math.sin(2 * Math.PI * v);
  }
  return t;
};

export const grao = (px: Uint8ClampedArray, frame: number, sigma: number) => {
  if (!tabela) tabela = montar();
  const amp = sigma * 255;
  let j = Math.floor(random(`grao-${frame}`) * N);
  const passo = 1 + 2 * Math.floor(random(`grao-passo-${frame}`) * 7); // ímpar: percorre a tabela inteira
  for (let i = 0; i < px.length; i += 4) {
    const g = tabela[j] * amp;
    j = (j + passo) & (N - 1);
    px[i] += g;
    px[i + 1] += g;
    px[i + 2] += g;
  }
};
