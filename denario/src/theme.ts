// ─── DENÁRIO · ensaio em colagem de arquivo ───
// Fotografia histórica e recorte sobre cor chapada. Quem carrega o vídeo é a imagem.
export const cores = {
  pompeia: '#8C2F22', // fundo, sempre. Chapado: não escurece, não texturiza, não anima.
  osso: '#F2EBDC', // texto principal, cartelas
  tinta: '#1C1815', // texto sobre osso, sombra de recorte
  ouro: '#C9A227', // números e destaque — no máximo 4 usos no vídeo inteiro
} as const;

export const fontes = {
  titulo: '"Playfair Display", serif',
  texto: '"Inter", sans-serif',
  pesos: {playfair: ['400', '700'], inter: ['400', '500']},
} as const;

export const escala = {
  titulo: 72, // médio. Nunca gigante.
  numero: 360,
  citacao: 30,
  credito: 12,
  marca: 16,
  margemCanto: 36,
} as const;

// Tratamento de toda imagem: P&B de contraste alto, o vermelho do fundo multiplicado
// nas sombras (8%), grão de 5%.
export const tratamento = {
  contraste: 1.45,
  vermelhoNasSombras: 0.08,
  grao: 0.05,
  graoFrequencia: 0.85,
  graoTroca: 2, // o grão muda a cada 2 frames
} as const;

// Papel sobre papel: toda peça recebe esta sombra.
export const sombra = {deslocamento: 4, desfoque: 2} as const;

export const movimento = {
  zoomDe: 1,
  zoomAte: 1.04,
  zoomDuracao: 144, // 6 s a 24 fps, no elemento principal
} as const;

// Regras de composição (checadas em desenvolvimento; ver lib/regras.ts)
export const regras = {
  elementos: [2, 4],
  rotacaoRecorte: 4,
  rotacaoDocumento: 8,
  duracao: [96, 192], // 4 a 8 s
  usosDeOuro: 4,
} as const;

export const dbParaVolume = (db: number) => 10 ** (db / 20);
