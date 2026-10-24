import pecas from '../data/pecas.json';

/** Um passo de revelação de uma camada (src/data/pecas.json, saído da prensa). */
export type Passo = { caixa: number[]; largura: number; modo: string; nome?: string | null };

export type Meta = {
  id: string;
  w: number;
  h: number;
  ox: number;
  oy: number;
  tons?: string[];
  papel?: Passo[];
  tinta?: Passo[];
  estados?: number;
  carta?: boolean;
};

const META = pecas as unknown as Record<string, Meta>;

export const meta = (id: string): Meta => {
  const m = META[id];
  if (!m) throw new Error(`peça ${id} não foi impressa (rode prensa/shorts.py ${id})`);
  return m;
};

/** Quadro do Short. */
export const W = 1080;
export const H = 1920;
/** Ponto de apoio da inclinação: 50% x 58% (V2 §2.1). */
export const PIVO: [number, number] = [540, 1114];
