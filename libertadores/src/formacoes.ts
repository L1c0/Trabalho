// As posições de cada esquema, em fração do campo (x = avanço, y = largura; y=0 é o lado
// esquerdo de quem ataca). Numeração brasileira: 2 lateral-direito, 3 e 4 zagueiros,
// 6 lateral-esquerdo, 5 volante, 8 e 10 meias, 7 e 11 pontas, 9 centroavante.
//
// As três formações do vídeo 02 foram desenhadas para que a TRANSFORMAÇÃO mova só quem
// muda de função: 4-3-3 → 4-4-2 mexe 4 (os pontas descem, o 10 sobe, o 5 abre);
// 4-4-2 → três na última linha mexe 3 (o 5 desce entre os zagueiros, os laterais sobem).
import type {Pt} from './lib/formato';

type Esquema = Record<number, Pt>;

const f433: Esquema = {
  1: {x: 0.04, y: 0.5},
  2: {x: 0.26, y: 0.86},
  3: {x: 0.2, y: 0.62},
  4: {x: 0.2, y: 0.38},
  6: {x: 0.26, y: 0.14},
  5: {x: 0.38, y: 0.5},
  8: {x: 0.48, y: 0.66},
  10: {x: 0.5, y: 0.34},
  7: {x: 0.68, y: 0.86},
  9: {x: 0.73, y: 0.5},
  11: {x: 0.68, y: 0.14},
};

const f442: Esquema = {...f433, 7: {x: 0.47, y: 0.88}, 11: {x: 0.47, y: 0.12}, 5: {x: 0.43, y: 0.37}, 10: {x: 0.68, y: 0.36}};

const f3ul: Esquema = {...f442, 5: {x: 0.19, y: 0.5}, 2: {x: 0.42, y: 0.94}, 6: {x: 0.42, y: 0.06}};

// bloco baixo e compacto (duas linhas de quatro), para o time sem a bola
const bloco: Esquema = {
  1: {x: 0.04, y: 0.5},
  2: {x: 0.2, y: 0.78},
  3: {x: 0.18, y: 0.6},
  4: {x: 0.18, y: 0.4},
  6: {x: 0.2, y: 0.22},
  7: {x: 0.33, y: 0.78},
  5: {x: 0.31, y: 0.58},
  8: {x: 0.31, y: 0.42},
  11: {x: 0.33, y: 0.22},
  10: {x: 0.45, y: 0.42},
  9: {x: 0.47, y: 0.58},
};

export const formacoes: Record<string, Esquema> = {
  '4-3-3': f433,
  '4-4-2': f442,
  '3-ultima-linha': f3ul,
  bloco,
};

export const NOMES_FORMACAO: Record<string, string> = {'4-3-3': '4-3-3', '4-4-2': '4-4-2', '3-ultima-linha': '3 NA ÚLTIMA LINHA'};
