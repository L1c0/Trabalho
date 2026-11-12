import { CORTE_S1, FALA_S1, FIM_S1 } from '../data/s1';
import { acha, leFala, relogio } from '../kit/fala';

/** O tempo do Short 1: tudo é escrito em segundos da narração e vira quadro por `q`. */
export const BLOCOS = leFala(FALA_S1);
export const q = relogio(CORTE_S1);
/** segundo em que uma palavra é dita: t('tabela'), t('acabou', 2) */
export const t = acha(BLOCOS);
/** quadro em que uma palavra é dita, um quadro adiantado (a imagem chega junto com o som) */
export const qp = (palavra: string, n = 1) => q(t(palavra, n)) - 1;
export const DUR = q(FIM_S1);

/** Os cortes de cena, em segundos da narração. */
export const C = {
  tabela: 3.86,
  data: 5.04,
  boletim: 7.5,
  escritorio: 20.72,
  colunas: 22.9,
  linha: 24.66,
  mapa: 28.6,
  fechada: 34.72,
  censura: 37.3,
  citacao: 41.3,
  montanha: 45.62,
  raio: 47.5,
  atestado: 49.3,
  fim: 53.86,
} as const;
