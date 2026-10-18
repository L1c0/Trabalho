// Recorte da margem branca de página dos quadros que vão em TELA CHEIA (âncora CHEIO).
// Medido nos próprios arquivos: a caixa do conteúdo, sem o branco do escaneamento. Num
// plano cheio a margem branca viraria faixa; no último plano ela impediria a figura de
// sumir no preto. Os quadros com moldura (<Painel>) não usam isto.
export const recortes: Record<string, {x: number; y: number; w: number; h: number; W: number; H: number}> = {
  olhoPerola: {x: 84, y: 52, w: 1880, h: 483, W: 2016, H: 586},
  kongoRosto: {x: 53, y: 52, w: 1881, h: 482, W: 1986, H: 586},
  andYet: {x: 53, y: 51, w: 1879, h: 2817, W: 1984, H: 2920},
  // 16:9 (correção): ainda tem o branco do escaneamento e o fio do quadro nas laterais
  minuscula: {x: 62, y: 0, w: 1860, h: 1116, W: 1984, H: 1116},
};
