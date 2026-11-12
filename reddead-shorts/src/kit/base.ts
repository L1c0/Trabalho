/** Medidas, cores, fontes e funções de tempo usadas nos dois Shorts. */

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const COR = {
  tinta: '#120a07', // o preto da gravura
  papel: '#efe4c9', // creme
  ouro: '#e9a82b',
  sol: '#f6c95a',
  sangue: '#b5130d',
  vermelho: '#cf1a12',
  noite: '#140d0a',
  osso: '#f4ecd8',
  cinza: '#8a8272',
} as const;

/** As famílias vêm embutidas (src/kit/fontes.ts). */
export const FONTE = {
  anton: "'RS Anton', Impact, sans-serif",
  oswald: "'RS Oswald', 'Arial Narrow', sans-serif",
  cinzel: "'RS Cinzel', Georgia, serif",
  doc: "'RS Doc', Georgia, serif",
  maquina: "'RS Maquina', 'Courier New', monospace",
  assina: "'RS Assina', cursive",
  slab: "'RS Slab', Georgia, serif",
} as const;

export const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progresso de 0 a 1 entre o quadro `ini` e `ini + dur`. */
export const prog = (f: number, ini: number, dur: number) => c01((f - ini) / Math.max(dur, 0.0001));
/** Leva [a, b] para [c, d], preso nas pontas. */
export const mapa = (v: number, a: number, b: number, c: number, d: number) => mix(c, d, c01((v - a) / (b - a)));

// curvas de tempo
export const saiCubica = (t: number) => 1 - Math.pow(1 - t, 3);
export const saiQuinta = (t: number) => 1 - Math.pow(1 - t, 5);
export const saiExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const entraCubica = (t: number) => t * t * t;
export const entraExpo = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
export const entraSai = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Passa um pouco do ponto e volta. */
export const saiVolta = (t: number, forca = 1.70158) => 1 + (forca + 1) * Math.pow(t - 1, 3) + forca * Math.pow(t - 1, 2);
/** Mola amortecida: sobe rápido, passa do ponto e assenta. */
export const mola = (t: number, osc = 2.2, amort = 5.5) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.exp(-amort * t) * Math.cos(osc * Math.PI * t));

/** Número pseudoaleatório fixo, de 0 a 1, para uma semente (o render é determinístico). */
export const rnd = (...sem: number[]) => {
  let h = 2166136261;
  for (const s of sem) {
    h ^= Math.floor(s * 1000003) | 0;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return ((h >>> 0) % 1000003) / 1000003;
};

/** Tremor que decai: devolve o deslocamento em px e a rotação em graus. */
export const tremor = (f: number, ini: number, forca = 14, dur = 12) => {
  const t = f - ini;
  if (t < 0 || t >= dur) return { x: 0, y: 0, rot: 0 };
  const k = Math.pow(1 - t / dur, 2) * forca;
  return { x: (rnd(t, 1, ini) - 0.5) * 2 * k, y: (rnd(t, 2, ini) - 0.5) * 2 * k, rot: (rnd(t, 3, ini) - 0.5) * k * 0.04 };
};

/** Soma de vários tremores (um por impacto). */
export const tremores = (f: number, lista: [number, number?, number?][]) => {
  let x = 0;
  let y = 0;
  let rot = 0;
  for (const [ini, forca, dur] of lista) {
    const t = tremor(f, ini, forca, dur);
    x += t.x;
    y += t.y;
    rot += t.rot;
  }
  return { x, y, rot };
};

/** Opacidade de uma peça que entra em `ini` e sai em `fim`. */
export const some = (f: number, ini: number, fim: number, entra = 6, sai = 6) => Math.min(prog(f, ini, entra), 1 - prog(f, fim - sai, sai));
