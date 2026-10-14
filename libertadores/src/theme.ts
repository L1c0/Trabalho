// ─── QUADRO TÁTICO · Libertadores 2026 ───
// Paleta, times, tipografia e os dois formatos. Nenhum componente recebe número solto:
// tudo o que é cor, medida ou tempo de animação mora aqui.

export const paleta = {
  fundo: '#0D1117', // quase preto, viés azul
  campo: '#16251C', // verde muito escuro
  linhas: '#2E4538', // linhas do campo
  texto: '#F0EDE6', // osso
  secundario: '#8A9490', // rótulos, legendas de apoio
  taca: '#E8B84B', // dourado: só elementos neutros (cartelas, numeração, destaque)
  perigo: '#FF5A4E', // "zona vermelha" e o anel do jogador pressionado (fora dos tons dos times)
} as const;

export type TimeId = 'fluminense' | 'palmeiras' | 'flamengo' | 'estudiantes' | 'neutro' | 'adversario';

export const times: Record<TimeId, {nome: string; cor: string; secundaria: string; escudo?: string}> = {
  fluminense: {nome: 'Fluminense', cor: '#9F0000', secundaria: '#006437', escudo: 'escudos/fluminense.png'},
  palmeiras: {nome: 'Palmeiras', cor: '#006437', secundaria: '#FFFFFF', escudo: 'escudos/palmeiras.png'},
  flamengo: {nome: 'Flamengo', cor: '#C52613', secundaria: '#1A1A1A', escudo: 'escudos/flamengo.png'},
  estudiantes: {nome: 'Estudiantes', cor: '#E30613', secundaria: '#FFFFFF', escudo: 'escudos/estudiantes.png'},
  // vídeo 02: o "time" genérico das explicações e o adversário genérico
  neutro: {nome: 'Time', cor: '#F0EDE6', secundaria: '#8A9490'},
  adversario: {nome: 'Adversário', cor: '#8A9490', secundaria: '#2E4538'},
};

// Conflito de cor: dois vermelhos ou dois verdes no mesmo campo não se leem.
// Regra fixa do brief, sem improviso.
export const confrontos: Record<string, Partial<Record<TimeId, string>>> = {
  'fluminense|palmeiras': {fluminense: '#9F0000', palmeiras: '#FFFFFF'},
  'estudiantes|flamengo': {estudiantes: '#FFFFFF', flamengo: '#C52613'},
};

export const corDoTime = (time: TimeId, confronto?: string) =>
  (confronto && confrontos[confronto]?.[time]) ?? times[time].cor;

// número legível sobre a cor do jogador
export const corDoNumero = (fundo: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(fundo.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? paleta.fundo : '#FFFFFF';
};

export const fontes = {
  display: '"Anton", sans-serif', // pesada e condensada
  corpo: '"Inter", sans-serif',
  numeros: 'tabular-nums' as const, // font-variant-numeric, sempre
};

// Medidas de componente (px no formato 16:9; o vertical multiplica a tipografia por `k`)
export const medidas = {
  jogador: {diametro: 26, numero: 13, contorno: 2, anel: 4, periodoAnel: 40},
  seta: {espessura: 4, desenho: 18, ponta: 4, curvatura: 0.2, tracejado: '8 4', pontaComp: 13, pontaLarg: 11},
  zona: {preenchimento: 0.18, borda: 0.45, espessuraBorda: 2, entrada: 12, escalaInicial: 0.94},
  linhas: {opacidade: 0.25, espessura: 4, tracejado: '14 8', pisca: 14},
  entrada: {duracao: 8, pico: 1.08, quadroPico: 6, intervalo: 3},
  formacao: {duracao: 45, rastro: [[5, 0.2], [10, 0.12], [15, 0.06]] as const},
  pressao: {duracao: 35, raioInicial: 0.13, raioFinal: 0.04, parada: 0.035},
  cartela: {barra: 4, barraLarg: 140, barraEntrada: 14, titulo: 64, sub: 18, mascara: 14},
  confronto: {escudo: 160, entrada: 20, folga: 8, x: 40, rotulo: 30, desfoque: 12, fundo: 0.3},
  duelo: {rotulo: 20, contexto: 0.15},
  ficha: {escudo: 72, nome: 32, barra: 16, barraAltura: 10, rotulo: 13},
  rotulo: {tamanho: 11, espacamento: '0.12em'},
  texto: {display: 92},
  broll: {saturacao: 0.4},
  grao: {sigma: 0.012, vinheta: 0.16},
  fecho: {logo: 0.42, entrada: 12},
};

// ─── Os dois formatos. O booleano `vertical` decide a orientação do campo. ───
// Campo real 105 x 68 m, sempre. No 16:9 o campo deita (ataque para a direita); no 9:16
// fica em pé (ataque para cima) e todo o conteúdo fica entre 12% e 82% da altura.
export type Formato = {
  vertical: boolean;
  largura: number;
  altura: number;
  k: number; // escala da tipografia
  campo: {x: number; y: number; w: number; h: number}; // retângulo das linhas do campo, em px
  tituloY: number; // fração da altura onde fica o título da cartela
  margem: number; // margem lateral do texto
  rotuloY: number; // y do rótulo embaixo do campo (Duelo)
};

const COMPR = 105;
const LARG = 68;

const horizontal = (): Formato => {
  const h = 880; // 100 px de margem em cima e embaixo
  const w = Math.round((h * COMPR) / LARG);
  return {vertical: false, largura: 1920, altura: 1080, k: 1, campo: {x: (1920 - w) / 2, y: 100, w, h}, tituloY: 0.42, margem: (1920 - w) / 2, rotuloY: 1080 - 52};
};

const vertical = (): Formato => {
  const h = 1240; // cabe entre 12% e 82% com espaço para o rótulo embaixo
  const w = Math.round((h * LARG) / COMPR);
  return {vertical: true, largura: 1080, altura: 1920, k: 1.15, campo: {x: (1080 - w) / 2, y: 250, w, h}, tituloY: 0.38, margem: 110, rotuloY: 1532};
};

export const formatos = {horizontal: horizontal(), vertical: vertical()};

export const curvas = {
  suave: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), // in-out cúbica
  saida: (t: number) => 1 - Math.pow(1 - t, 3),
};

export const dbParaVolume = (db: number) => 10 ** (db / 20);
