import {Easing} from 'remotion';

// ─── DENÁRIO · sistema visual do canal ───
// Fundo preto, tipografia branca, UMA cor por bloco. Tudo que não é o assunto fica em cinza.
export const cores = {
  preto: '#000000',
  branco: '#FFFFFF',
  apagado: '#333333', // o resto do dia, o que não é o assunto
  marca: '#666666', // micro-tipografia dos cantos
  limao: '#D8E84A', // o objeto da thumb
  fundoThumb: '#16A89B',
} as const;

// Cor de cada bloco. A abertura não tem cor: branco sobre preto.
export const corDoBloco = {
  branco: cores.branco,
  verde: '#16A89B',
  magenta: '#D9367A',
  laranja: '#F2892B',
  azul: '#3D7DDB',
  roxo: '#8C5BD6',
} as const;
export type CorDoBloco = keyof typeof corDoBloco;

export const fontes = {
  lettering: '"Archivo Black", sans-serif',
  texto: '"Montserrat", sans-serif',
  pesos: {montserrat: ['400', '500', '600', '700']},
  peso: {texto: 500, forte: 700},
} as const;

// ─── Escala (px, quadro 1920x1080) ───
export const escala = {
  margem: 144, // área segura de título: 7,5% da largura
  lettering: 150,
  letteringGrande: 280,
  contador: 300,
  legenda: 40,
  empilhar: 54,
  cartela: 28,
  rotulo: 20,
  marca: 14,
  entrelinha: 1.05,
  entrelinhaTexto: 1.35,
} as const;

// ─── Tempo (frames a 24 fps). A 24 fps movimento rápido treme: nada abaixo de 12 frames. ───
export const tempo = {
  minimo: 12,
  escrita: {suave: 6, quadrosPorLetra: 1.2}, // borda suave de 6%
  empilhar: 8,
  empilharConta: 20,
  troca: 40,
  risco: {duracao: 12, tremor: 2, amostras: 28, espessura: 0.09},
  barra: {intervalo: 10, pausa: 24},
  barras: {intervalo: 6, subida: 12},
  cartela: 20,
  contador: 24,
  resto: 24, // a palavra fica inteira este tempo antes de se dividir
  grid: {quadrosPorLinha: 192}, // deslocamento lento e contínuo
} as const;

export const textura = {
  grid: {opacidade: 0.4, linhas: 14, raios: 18, espessura: 1.6},
  duotoneRecorte: 1,
} as const;

export const curvas = {
  linear: Easing.linear,
  peso: Easing.inOut(Easing.sin),
} as const;

export const dbParaVolume = (db: number) => 10 ** (db / 20);
