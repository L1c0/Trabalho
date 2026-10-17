import {dimensoes} from '../data/dimensoes';
import {altura, grade, largura} from '../theme';

/**
 * Tamanho e posição das peças. Os números do README estão aqui; o que o README não fixa
 * (onde exatamente fica cada âncora) também está aqui, num lugar só, para ajustar fácil.
 */
export type Ancora = 'EA' | 'DB' | 'CA' | 'CHEIO';

export const MOLDURA = 2; // <Painel>: moldura em cor.tinta
export const RESPIRO = 20; // <Painel>: respiro branco interno

export const ALTURA_PAINEL = 0.7; // quadros de mangá: 55% a 78% da altura → 70%
export const ALTURA_MIN_PAINEL = 0.55;
export const ALTURA_PRANCHA = 0.55; // pranchas de retrato: 45% a 60% → 55%
export const ALTURA_GRAVURA = 0.6;
export const FOLGA_VERTICAL = 110; // distância da âncora alta ao topo / da baixa à base

const larguraUtil = largura - grade.esq - grade.dir; // 1500: da espinha à margem que respira

export const dimensao = (arq: string) => {
  const d = dimensoes[arq];
  if (!d) throw new Error(`sem dimensões para ${arq}`);
  return {w: d[0], h: d[1]};
};

/** Retângulo (externo) de uma peça de largura w e altura h na âncora. */
export const posicionar = (ancora: Exclude<Ancora, 'CHEIO'>, w: number, h: number) => {
  const topoAlto = FOLGA_VERTICAL;
  switch (ancora) {
    case 'EA':
      return {x: grade.esq, y: topoAlto, w, h};
    case 'DB':
      return {x: largura - grade.dir - w, y: altura - FOLGA_VERTICAL - h, w, h};
    case 'CA':
      return {x: (largura - w) / 2, y: topoAlto, w, h};
  }
};

/** Altura externa do painel: 70% da tela, menos se a largura passar da área útil. */
export const medidasPainel = (arq: string) => {
  const {w, h} = dimensao(arq);
  const borda = 2 * (MOLDURA + RESPIRO);
  const r = w / h;
  // muito estreito (phosVertical): "a altura total menos as margens"
  if (r < 0.4) {
    const H = altura - grade.topo - grade.base;
    return {W: (H - borda) * r + borda, H, estreito: true};
  }
  let H = altura * ALTURA_PAINEL;
  let W = (H - borda) * r + borda;
  if (W > larguraUtil) {
    W = larguraUtil;
    H = Math.max(altura * ALTURA_MIN_PAINEL, (W - borda) / r + borda);
  }
  return {W, H, estreito: false};
};
