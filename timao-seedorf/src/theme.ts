// ─── SEEDORF NO CORINTHIANS · tratamento uniforme de footage ───
// Todo número de efeito mora aqui, por bloco. Os componentes leem daqui, não recebem
// número solto.

export const cores = {
  sombra: '#201A16', // preto quente, nunca puro
  medio: '#64534D',
  alto: '#A79892',
  luz: '#E2DEDB', // branco osso
  altoGloria: '#C98F6B', // o título é a única coisa que ganha cor
  quente: '#C98F6B', // halação e vazamento de luz
  barra: '#0C0A09', // letterbox e fundo do fecho
  cardFundo: 'rgba(20,16,14,0.82)',
  cardNomes: '#A79892',
} as const;

export const fontes = {
  texto: '"Inter", sans-serif',
  pesos: ['400', '600', '700'],
} as const;

export type BlocoId = 'queda' | 'travessia' | 'virada' | 'gloria';

// Intensidade de cada efeito por bloco. A troca acontece no corte que abre o bloco;
// a da glória é gradual (`transicaoGloria`).
export const blocos: Record<BlocoId, {
  velocidade: number; // playbackRate do bloco
  saturacao: number; // fração da cor original que sobra (medido no quadro: ~20 de saturação média; ~45 na glória)
  alto: string; // a terceira parada do gradiente
  grao: number; // sigma do ruído gaussiano (0–1)
  vinheta: number; // escurecimento máximo
  halo: boolean;
  vazamento: boolean;
  zoom: number; // zoom máximo de cada clipe
}> = {
  queda: {velocidade: 1, saturacao: 0.2, alto: cores.alto, grao: 0.022, vinheta: 0.3, halo: false, vazamento: false, zoom: 1.03},
  travessia: {velocidade: 0.63, saturacao: 0.2, alto: cores.alto, grao: 0.022, vinheta: 0.22, halo: false, vazamento: false, zoom: 1.03},
  virada: {velocidade: 0.76, saturacao: 0.2, alto: cores.alto, grao: 0.022, vinheta: 0.22, halo: true, vazamento: false, zoom: 1.03},
  gloria: {velocidade: 0.62, saturacao: 1, alto: cores.altoGloria, grao: 0.014, vinheta: 0.16, halo: true, vazamento: true, zoom: 1.05},
};

export const transicaoGloria = 60; // frames: a paleta da glória chega aos poucos, nunca de uma vez

export const fx = {
  aberracao: {maximo: 3}, // px nas bordas, zero no centro, cresce com o quadrado do raio
  flicker: {amplitude: 0.018, freqs: [3, 7] as const}, // ±1,8%, soma de dois senos (Hz)
  vinheta: {inicio: 0.62}, // fração do raio onde o escurecimento começa
  letterbox: {altura: 54, entrada: 20},
  halo: {limiar: 0.82, raio: 8, opacidade: 0.18},
  blur: {limiarVelocidade: 0.7, raio: 2}, // desfoque horizontal nos clipes abaixo de 0,70
  pulso: {duracao: 6, brilho: 0.12, queda: 0.5}, // +12%, saída exponencial
  vazamento: {periodo: 210, maximo: 0.14}, // 7 s, de 0 a 14%
} as const;

export const card = {
  altura: 86,
  raio: 6,
  blur: 8,
  escudo: 44,
  gols: 34,
  rotulo: 11,
  nomes: 13,
  entrada: 8,
  saida: 6,
} as const;

export const fecho = {entrada: 20, escudo: 120, titulo: 22, sub: 14, fundoFinal: 0.75} as const;

export const curvas = {
  corpo: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t),
};

export const dbParaVolume = (db: number) => 10 ** (db / 20);
