/**
 * O vocabulário de movimento (LEIA-PRIMEIRO). Quatro movimentos, nenhum
 * preset de editor: batida, assentar, travessia, recuo. Tudo linear; a
 * prensa bate e para, não quica.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 ao longo de [ini, ini + dur] */
export const prog = (f: number, ini: number, dur: number) => clamp((f - ini) / Math.max(1e-9, dur));

/**
 * batida: escala de `de` a 1,00 em `b` frames, batendo (1,00) no frame `i`.
 * Antes de aparecer devolve null.
 */
export const escalaBatida = (f: number, i: number, b = 3, de = 1.18): number | null => {
  const a = i - (b - 1);
  if (f < a) return null;
  if (f >= i) return 1;
  return de - ((de - 1) * (f - a)) / (b - 1);
};

/**
 * O quadro inteiro desloca `d` px no instante da batida e volta em 2 frames.
 * Direção alternando lado a lado (`lado` = 1 ou -1), nunca sorteada.
 */
export type Batida = [number, number, number]; // [frame da batida, d, lado]
export const tremor = (f: number, batidas: Batida[]) => {
  let x = 0;
  for (const [i, d, lado] of batidas) {
    if (f === i) x += lado * d;
    else if (f === i + 1) x += (lado * d) / 2;
  }
  return x;
};
