/**
 * Vinland Saga — sistema visual.
 *
 * O Houseki usava o papel como a Phos: a cor do fundo acompanhava o que
 * ela estava virando. Aqui o fundo faz o caminho inverso e mais simples:
 * ele CLAREIA conforme o Thorfinn larga a violencia.
 *
 * Comeca em turfa (quase preto, o arco da guerra) e termina em broto
 * (quase branco, o painel final). O espectador nao percebe plano a plano,
 * percebe aos dez minutos, e e exatamente isso que se quer: a tese do
 * video acontecendo no fundo da tela sem ninguem narrar.
 */

/**
 * REGRA DURA: quadro de manga so entra sobre PAPEL.
 *
 * As PNGs entram em `multiply`. Multiply sobre base escura ou sobre
 * meio-tom achata tudo e deixa a tela cor de barro — testei, fica
 * parecendo foto velha, nao tinta. Sobre papel claro funciona, porque
 * e literalmente o que acontece na impressao: ninguem imprime retícula
 * em cima de preto.
 *
 * Entao a progressao do video mora DENTRO da faixa clara. O papel vai
 * de sujo pra limpo conforme o Thorfinn larga a violencia. Sutil de
 * proposito: ninguem nota no plano, todo mundo sente aos dez minutos.
 */
export const papel = {
  guerra: '#B3ABA0',   // papel mais sujo. cap. 1-54
  perda: '#B8B1A6',    // depois do Askeladd
  ferro: '#BFB8AD',    // o mercado de escravos
  fazenda: '#C6C0B4',  // arrancando toco. cap. 58-80
  socos: '#CDC7BB',    // cap. 96
  baltico: '#D6D1C6',
  neve: '#E2DFD6',
  broto: '#EDECE7',    // cap. 220. quase branco.
} as const;

export type Papel = keyof typeof papel;

export const progressao: Papel[] = [
  'guerra', 'perda', 'ferro', 'fazenda', 'socos', 'baltico', 'neve', 'broto',
];

/**
 * O escuro NAO some do video — ele fica nas cartelas de titulo entre os
 * blocos, que sao so tipografia. E ali que o preto profundo trabalha,
 * e o corte papel->preto->papel vira a respiracao do ensaio.
 */
export const cartela = {
  turfa: '#15130F',
  ferro: '#1E1F1D',
} as const;

export const cor = {
  tinta: '#14120E',
  papel: '#E9E8E2',
  /**
   * Ferrugem, nao sangue.
   * O prompt pedia carmesim #8B0000. Recusei: o video inteiro argumenta
   * que a violencia nao leva a nada, e vermelho-sangue na tela defende o
   * contrario a cada plano. Ferrugem e ferro que parou de ser arma. E a
   * tese, em uma cor so.
   */
  ferrugem: '#7A3B22',
  fraco: '#8C8679',
} as const;

/** Margem tipografica. Mesma grade do Houseki, pro canal ter mao. */
export const grade = { esq: 240, dir: 180, topo: 190, base: 170 } as const;

export const grao = {
  /** desvio padrao local (filtro de media 5x5, escala 0-255). medido, nao estimado. */
  alvo: 7,
  opacidade: 0.085,
} as const;
