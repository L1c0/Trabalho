/**
 * Ajustes de montagem sobre o pacote v3. O porquê de cada um está no LEIA.md.
 */

/** Chapas de identidade (a faixa vermelha): ficam fora da partitura de cor. */
export const IDENTIDADE = new Set(['p01-abertura', 'p08-tabela', 'p13-cartela']);

/** Peças deslocadas, em px da chapa (2400x1350). */
export const DESLOCA: Record<string, Record<string, { dx?: number; dy?: number }>> = {
  // A lista sobe 60 px, porque "CAVALGADA VIGOROSA" caía em cima da nota de
  // rodapé. "SANATÓRIO" sobe mais 13: o acento empurrava a linha para baixo,
  // e o espaço entre ela e a seguinte ficava menor que o das outras.
  'p05b-remedios': {
    t01: { dy: -60 },
    t02: { dy: -60 },
    t03: { dy: -73 },
    t04: { dy: -60 },
    t05: { dy: -60 },
    t06: { dy: -60 },
    t07: { dy: -60 },
  },
  // As palavras grandes sobem 40 px: "LINHA DE FRONTEIRA" caía em cima da
  // nota de rodapé.
  'p06-boletim': Object.fromEntries(
    ['l0500', 'l0501', 'l0600', 'l0601', 'l0602', 'l0603', 'l0700', 'l0701', 'l0702', 'l0800', 'l0801', 'l0802', 'l0803', 'l0804', 'l0805', 'l0806'].map(
      (id) => [id, { dy: -40 }],
    ),
  ),
  // "ENTÃO EU NÃO VOU USAR" desce 18 px; estava colado na linha de cima.
  'p11-sem-fonte': {
    l1200: { dy: 18 },
    l1201: { dy: 18 },
    l1202: { dy: 18 },
    l1203: { dy: 18 },
    l1204: { dy: 18 },
  },
};

/** Peças que somem antes do corte: o quadro em que acabam de sumir. */
export const SAI: Record<string, Record<string, number>> = {
  // a nota de rodapé do atlas sai junto com o atlas, quando entra o esquema
  'p06b-mapa': { t01: 8850 + 198 },
};

/** Clipes que começam alguns quadros adiante, segurando esse quadro no início. */
export const INICIO_CLIPE: Record<string, number> = {
  // Os 19 primeiros quadros eram outro plano, com um menu do jogo na tela.
  // Depois vinha um mergulho no preto até o quadro 31. O clipe segura o
  // quadro 32 no início; a imagem ali está parada.
  'c04-B.mp4': 32,
};

/**
 * Remendos sobre o jogo: uma caixa da tela recebe a imagem do próprio clipe
 * deslocada (o céu logo abaixo), com borda suave.
 */
export const REMENDO: Record<string, { x: number; y: number; w: number; h: number; de_dy: number }> = {
  // o clipe J tem o contador de quadros da gravação ("62 FPS") no canto de
  // cima, à direita (1816-1881 x 6-20), do começo ao fim
  'c17-J.mp4': { x: 1800, y: 0, w: 100, h: 32, de_dy: 34 },
};
