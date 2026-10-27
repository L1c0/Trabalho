import tl from './data/timeline.json';

/**
 * A tabela de timeline.json, uma linha por frame (LEIA-PRIMEIRO: "lê a
 * tabela, não recalcula"). Colunas: frame escala cy interno frente
 * casca_op aneis_contados contando.
 */
export type Quadro = {
  escala: number;
  cy: number;
  interno: number;
  frente: number;
  cascaOp: number;
  contados: number;
  contando: number;
};

/**
 * Uma linha está quebrada: no frame 965 a frente volta de 46,90 para 46,00
 * (o 28º anel some por um frame) e a escala salta 2,3%; no 966 tudo volta
 * (frente 47, escala 0,33014). No resto da contagem a frente é exatamente
 * 19 + (f - 676) / 10,3214 e a escala é 400 / raio(frente); só o 965 foge,
 * no ponto em que a conta dá 28,0 redondo. Fica com o valor da fórmula,
 * que é o mesmo do 966, com a borda úmida ainda ligada.
 */
const CORRECOES: Record<number, number[]> = {
  965: [965, 0.33014, 670, 0.0, 47.0, 1.0, 28, 1],
};

const Q = tl.quadros as number[][];

export const quadro = (f: number): Quadro => {
  const r = CORRECOES[f] ?? Q[Math.max(0, Math.min(Q.length - 1, f))];
  return { escala: r[1], cy: r[2], interno: r[3], frente: r[4], cascaOp: r[5], contados: r[6], contando: r[7] };
};
