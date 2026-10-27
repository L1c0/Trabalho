/**
 * O vocabulário de movimento (LEIA-PRIMEIRO). Quatro movimentos, nenhum
 * preset de editor: batida, assentar, travessia, recuo. Tudo linear; a
 * prensa bate e para, não quica.
 *
 * Um efeito "em n frames" ocupa n frames na tela contando as duas pontas:
 * o valor de partida no primeiro, o de chegada no n-ésimo.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 ao longo de [ini, ini + dur] */
export const prog = (f: number, ini: number, dur: number) => clamp((f - ini) / Math.max(1e-9, dur));
/** 0..1 em n frames a partir de `ini`, contando as duas pontas */
export const passo = (f: number, ini: number, n: number) => clamp((f - ini) / Math.max(1, n - 1));

/** batida: de `de` a 1,00 em `b` frames a partir do frame em que a camada entra */
export const escalaBatida = (f: number, entra: number, b = 3, de = 1.18) => lerp(de, 1, passo(f, entra, b));
/** o frame do impacto da batida: quando a escala chega a 1,00 */
export const impacto = (entra: number, b = 3) => entra + b - 1;

/**
 * O quadro inteiro desloca `d` px no instante da batida e volta em 2 frames.
 * Direção alternando lado a lado (`lado` = 1 ou -1), nunca sorteada.
 */
export type Batida = [number, number, number]; // [frame do impacto, d, lado]
export const tremor = (f: number, batidas: Batida[]) => {
  let x = 0;
  for (const [i, d, lado] of batidas) {
    if (f === i) x += lado * d;
    else if (f === i + 1) x += (lado * d) / 2;
  }
  return x;
};
