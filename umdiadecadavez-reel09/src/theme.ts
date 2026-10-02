import {Easing} from 'remotion';

// ─── Material: caderno barato, esferográfica azul acabando, abajur às 4 da manhã ───
// Sem preto puro, sem branco puro.
export const cores = {
  breu: '#16161A', // o quarto, a tela antes do caderno
  papel: '#D8D4C8', // folha de caderno amarelada
  dobra: '#C4BFB0', // sombra da página virada
  esfero: '#1F2430', // tinta de caneta azul, quase preta
  esferoFraca: '#3A4358', // caneta acabando
  destaque: '#B7382A', // caneta de corrigir, único acento
  pauta: '#A8B4C4', // linha azul do caderno
  luzFria: '#C9D6E8', // a tela do celular no escuro
} as const;

export const fontes = {
  hero: '"Anton", sans-serif',
  legenda: '"Montserrat", sans-serif',
  mao: '"Caveat", cursive',
  pesos: {anton: ['400'], montserrat: ['400', '500'], caveat: ['500']},
  peso: {hero: 400, legenda: 400, legendaForte: 500, mao: 500},
} as const;

// ─── Grid (px, 1080 de largura) ───
export const grid = {
  margem: 108,
  entrelinhaHero: 1.1, // o til de NÃO não encosta na linha de cima
  entrelinhaLegenda: 1.3,
  entrelinhaMao: 1.15,
} as const;

// ─── Texturas ───
export const textura = {
  fibra: {frequencia: 0.9, oitavas: 4, opacidade: 0.16, semente: 5},
  dobra: {angulo: 118, escurece: 0.03},
  vinheta: {opacidade: 0.7, centro: 0.38},
  sangramento: {blur: 1.5, opacidade: 0.25, desvio: 0.5},
  // limiar medido: com este ruído (média 0,50, dp 0,119) remove 8% do traço
  falha: {frequencia: 0.06, oitavas: 2, limiar: 0.671, semente: 17},
  pauta: {passo: 78, opacidade: 0.55, foco: 0.8, espessura: 1.5},
} as const;

// ─── Tempo das técnicas (frames). Os frames de cada evento ficam em data/. ───
export const tempo = {
  escrita: {suave: 6, quadrosPorLetra: 1.1, minimo: 6, folga: 0.3},
  manuscrito: {quadrosPorLetra: 0.8, levantaCaneta: 2, varia: 0.18, zigPorLetra: 1.6, pisca: 10},
  virada: {duracao: 12, sombra: 150, sombraOpacidade: 0.32},
  risco: {duracao: 8, tremor: 2, espessura: 0.07, amostras: 24},
  apagar: {duracao: 8, suave: 12},
  crescer: {duracao: 36},
  pautaFoco: 10,
  deriva: {px: 70},
  luz: {entrada: 6},
  faixa: 8,
  // os objetos desenhados à mão (traço contínuo)
  objeto: {desenho: 22, traco: 6},
  morfose: {duracao: 40, pontos: 240},
  // a barra: retângulo de 900x80 a traço contínuo; marca por máscara em 10 frames;
  // hachura a 45°, 9 px de passo, 2 px de traço, cada linha desenhada em 2 frames
  barra: {
    largura: 900,
    altura: 80,
    desenho: 22,
    tracoMax: 7,
    tracoMin: 5,
    tremor: 1.6,
    marca: 10,
    passo: 9,
    hachuraEspessura: 2,
    hachuraTraco: 2,
    rotulo: 24,
    rotuloMarca: 16,
    ponteiro: 46,
  },
  // o carimbo: círculo irregular a traço em volta do texto, rotação -4°, pulsa uma vez
  carimbo: {desenho: 20, rotacao: -4, pulso: 12, pulsoEscala: 0.06},
} as const;

export const curvas = {
  linear: Easing.linear,
  // letra humana: acelera no meio da palavra, desacelera no fim
  mao: Easing.inOut(Easing.cubic),
  corpo: Easing.inOut(Easing.sin),
} as const;

export const dbParaVolume = (db: number) => 10 ** (db / 20);

// ─── Plataforma ───
// Um booleano (tiktok) escolhe a variação; as duas composições saem do mesmo data/.
// TikTok: sem faixa e sem marca de canal (o TikTok reduz alcance de vídeo com marca de outra
// plataforma), legendas 8% mais altas (a interface come mais espaço embaixo), sem breu na abertura.
export const plataforma = (tiktok: boolean) => ({
  tiktok,
  faixa: !tiktok,
  breuNaAbertura: !tiktok,
  subirLegendas: tiktok ? 0.08 : 0, // fração da altura do quadro
});
export type Plataforma = ReturnType<typeof plataforma>;
