import { CORTE_S2, FALA_S2, FIM_S2 } from '../data/s2';
import { acha, leFala, relogio } from '../kit/fala';

/** O tempo do Short 2: tudo é escrito em segundos da narração e vira quadro por `q`. */
export const BLOCOS = leFala(FALA_S2);
export const q = relogio(CORTE_S2);
export const t = acha(BLOCOS);
/** quadro em que uma palavra é dita, um quadro adiantado */
export const qp = (palavra: string, n = 1) => q(t(palavra, n)) - 1;
export const DUR = q(FIM_S2);

/** Os cortes de cena, em segundos da narração. */
export const C = {
  tratamento: 8.42,
  receita: 11.86,
  ar: 13.96,
  leite: 14.94,
  carne: 15.62,
  repouso: 16.6,
  cavalgada: 17.98,
  cavalo: 19.86,
  mortes: 21.86,
  remedio: 28.16,
  nada: 40.32,
  visao: 44.06,
  preto: 46.06,
  buraco: 47.3,
  fim: 51.26,
} as const;
