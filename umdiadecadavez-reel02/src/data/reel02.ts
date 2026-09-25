// REEL #02 · @umdiadecadavez · Sêneca e o medo sem nome.
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel02.mp3)
// e todo evento cai numa pausa da fala. Os marcados com ← mudaram em relação ao brief.

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number; duracao?: number};

export const reel02 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 900,
  // tudo para aqui; os últimos 10 frames são silêncio absoluto, sem fade
  fim: 890,

  // ─── Narração, frase por frase (usada também para o ducking da trilha) ───
  falas: [
    {texto: 'Você acorda e o nó já tá lá.', de: 13, ate: 75},
    {texto: 'Antes de qualquer coisa acontecer.', de: 83, ate: 130},
    {texto: 'Aí você pega o celular, olha o saldo, fecha, olha de novo.', de: 142, ate: 241},
    {texto: 'Sêneca escreveu que a gente sofre mais na cabeça do que na vida.', de: 258, ate: 359},
    {texto: 'E ele não tava sendo bonitinho.', de: 373, ate: 413},
    {texto: 'O cara tinha medo de verdade.', de: 421, ate: 461},
    {texto: 'Medo sem nome é pior, sempre.', de: 470, ate: 552},
    {texto: 'Então escreve.', de: 567, ate: 582},
    {texto: 'O que exatamente acontece se eu não pagar essa conta?', de: 596, ate: 676},
    {texto: 'Escreve com detalhe.', de: 681, ate: 712},
    {texto: 'Quase sempre o pior é ruim.', de: 726, ate: 770},
    {texto: 'Mas tem tamanho.', de: 784, ate: 809},
    {texto: 'E coisa com tamanho dá pra pensar.', de: 829, ate: 876},
  ] as Fala[],

  // ─── Blocos: uma cena por bloco. Viradas sobrepõem o bloco anterior. ───
  blocos: [
    {id: 'noBreu', de: 0, ate: 81},
    {id: 'antesDe', de: 81, ate: 140},
    {id: 'celular', de: 140, ate: 262},
    {id: 'seneca', de: 250, ate: 382},
    {id: 'medo', de: 370, ate: 488},
    {id: 'semNome', de: 488, ate: 565},
    {id: 'escreve', de: 565, ate: 713},
    {id: 'tamanho', de: 713, ate: 900},
  ],

  // ─── 0 · no breu ───
  noBreu: {
    hero: {texto: 'O NÓ JÁ TÁ LÁ', de: 28, duracao: 44, tamanho: 96, topo: 700}, // ← 20 caía em "Você"
    legenda: {texto: 'você acorda e', de: 44, tamanho: 36, topo: 648}, // ← 90 caía em "Antes"
  },

  // ─── 1 · antes de acontecer ───
  antesDe: {
    antes: {texto: 'ANTES DE', de: 81, tamanho: 72, topo: 880}, // ← 120 caía em "acontecer"
    hero: {texto: 'ACONTECER', de: 107, duracao: 18, tamanho: 150, topo: 950}, // ← 150
    apagar: 131, // ← 180
  },

  // ─── 2 · o celular no escuro ───
  celular: {
    luz: {de: 140, apaga: 241, x: 200, y: 330, largura: 680, altura: 1040}, // ← 210 / 330
    palavras: [
      {texto: 'OLHA', de: 186}, // ← 240
      {texto: 'FECHA', de: 206}, // ← 270
      {texto: 'OLHA DE NOVO', de: 224}, // ← 300
    ],
    tamanho: 120,
    esquerda: 300,
    topo: 780,
  },

  // ─── 3 · Sêneca: o papel entra ───
  seneca: {
    virada: 250, // ← 360; o breu volta por poucos frames: só há 16 frames (com respiração) entre "novo" e "Sêneca"
    hero: {texto: 'SÊNECA', de: 281, duracao: 12, tamanho: 110, topo: 470}, // ← 390
    citacao: {linhas: ['sofremos mais na imaginação', 'do que na realidade'], de: 293, tamanho: 40, topo: 620}, // ← 420
    gigante: {texto: 'IMAGINAÇÃO', de: 293, ate: 382, tamanho: 470, esquerda: 330, topo: 820, opacidade: 0.12}, // ← 470
  },

  // ─── 4 · medo de verdade (primeira página do caderno) ───
  medo: {
    virada: 370,
    frase: {texto: 'ELE NÃO TAVA SENDO BONITINHO', de: 383, tamanho: 34, topo: 352}, // ← 510
    hero: {linhas: ['MEDO DE', 'VERDADE'], fraca: 419, cheia: 440, duracao: 20, tamanho: 150, topo: 420}, // ← 570
  },

  // ─── 5 · sem nome ───
  semNome: {
    hero: {texto: 'SEM NOME', de: 490, tamanho: 150, base: 858}, // ← 630
    risco: 560, // ← 700
  },

  // ─── 6 · escreve o pior ───
  escreve: {
    pautaFoco: 565, // ← 750
    linhas: [
      {texto: 'cartão · R$ 340 · dia 12', de: 585}, // ← 765
      {texto: 'se eu não pagar: juros + nome sujo', de: 621}, // ← 787
      {texto: 'quem eu posso ligar:', de: 659, incompleta: true}, // ← 809; fica aberta, com o traço piscando
    ],
    tamanho: 54,
    primeiraBase: 1014,
  },

  // ─── 7 · tem tamanho ───
  tamanho: {
    apagarCaderno: 713,
    crescer: {texto: 'R$ 340', de: 724, corpoInicial: 56, corpoFinal: 300, base: 900}, // ← 840
    limite: {linhas: ['é isto.', 'só isto.'], de: 746, tamanho: 38, afastamento: 30, acimaDaBase: 14}, // ← 862
    faixa: 768, // ← 875
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel02.mp3',
    trilha: {arquivo: 'audio/trilha.mp3', de: 250, ate: 890, duckingDb: -3, ataque: 2, release: 12},
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 250, db: -30, fadeDe: 230, fadeAte: 248},
    // alternar caneta-a e caneta-b é obrigatório
    efeitos: [
      {frame: 28, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 140, arquivo: 'sfx/notificacao.mp3', db: -26},
      {frame: 250, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 281, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 560, arquivo: 'sfx/caneta-a.mp3', db: -24}, // o risco
      {frame: 585, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 621, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 659, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // 724 (crescer): nada — o silêncio é o efeito
    ] as Efeito[],
  },

  // ─── Capa 1x1: mesmos componentes do Reel ───
  capa: {
    margem: 0.15,
    hero: {texto: 'SÊNECA', tamanho: 230, topo: 300},
    sub: {texto: 'o medo sem nome', tamanho: 28},
    faixa: {topo: 800, altura: 118, tamanho: 22}, // texto termina dentro da margem de 15%
  },
} as const;

export type Reel = typeof reel02;
export type BlocoId = (typeof reel02.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel02.blocos.find((b) => b.id === id)?.de ?? 0;
