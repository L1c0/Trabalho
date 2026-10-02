// REEL #08 · @umdiadecadavez · "Catão — o homem que treinava ser pobre"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel08.mp3,
// 36,5 s), sem cortes: as respirações ficam. Os marcados com ← mudaram em relação ao brief.
//
// O arco: a balança se desenha → os dois medos entram equilibrados → um afunda → ela
// espera no canto → volta e se reequilibra. Nenhum elemento gráfico fora desse arco.

import type {EventoDeInclinacao} from '../motion/oscilacao';

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

const CENTRO = {x: 540, y: 740, escala: 1, opacidade: 1};
const CANTO = {x: 860, y: 230, escala: 0.34, opacidade: 0.4};

export const reel08 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1125,
  // tudo para aqui; os últimos 10 frames são silêncio absoluto, sem fade
  fim: 1115,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Catão era um dos homens mais ricos de Roma,', de: 13, ate: 106},
    {texto: 'e de vez em quando ele saía de casa com a roupa mais surrada que tinha,', de: 114, ate: 215},
    {texto: 'andava pela rua assim,', de: 222, ate: 267},
    {texto: 'de propósito,', de: 278, ate: 297},
    {texto: 'pra ser olhado torto.', de: 308, ate: 336},
    {texto: 'Não era humildade, era treino.', de: 346, ate: 391},
    {texto: 'Ele queria descobrir uma coisa específica.', de: 403, ate: 476},
    {texto: 'Do que eu realmente tenho medo?', de: 491, ate: 530},
    {texto: 'Da pobreza', de: 545, ate: 565},
    {texto: 'ou da vergonha de parecer pobre?', de: 572, ate: 624},
    {texto: 'Porque são medos diferentes,', de: 642, ate: 679},
    {texto: 'e o segundo é o que te faz gastar o que você não tem.', de: 692, ate: 762},
    {texto: 'Sêneca escrevia para um amigo:', de: 782, ate: 831},
    {texto: 'separa alguns dias para comer o mínimo e vestir o pior.', de: 843, ate: 929},
    {texto: 'E então pergunta a si mesmo: era isso que eu temia?', de: 944, ate: 1035},
    {texto: 'Quase nunca era.', de: 1048, ate: 1067},
  ] as Fala[],

  // ─── Blocos da página (camada de baixo). A balança é uma camada contínua por cima. ───
  blocos: [
    {id: 'breu', de: 0, ate: 404},
    {id: 'pagina', de: 392, ate: 1125},
  ],

  // ─── 0 · no breu ───
  breu: {
    hero1: {linhas: ['UM DOS MAIS RICOS', 'DE ROMA'], de: 20, deSemBreu: 0, tamanho: 86, topo: 760},
    apagar1: 108, // ← 100: na pausa depois de "Roma,"
    legendas: [
      {texto: 'saía de casa com a roupa mais surrada', de: 142, topo: 1250}, // ← 120: em "ele saía"
      {texto: 'e andava pela rua assim', de: 219, topo: 1310}, // ← 180: na pausa antes de "andava"
      {texto: 'de propósito, pra ser olhado torto', de: 270, topo: 1370}, // ← 240: na pausa antes de "de propósito"
    ],
    apagarLegendas: 337, // na pausa antes de "Não era humildade"
    // "NÃO ERA" e "HUMILDADE" em duas linhas; o risco atravessa só a segunda
    hero2: {linhas: ['NÃO ERA', 'HUMILDADE'], de: 339, tamanho: 130, topo: 700, risco: 368}, // ← 300 / ← 345
    hero3: {linhas: ['ERA TREINO'], de: 372, tamanho: 130, topo: 990}, // ← 360: em "era treino"
  },

  // ─── 1 · a página ───
  pagina: {
    virada: 392, // ← 390: depois de "treino."
    gigante: {texto: 'CATÃO', de: 428, ate: 765, tamanho: 420, esquerda: 300, topo: 190, opacidade: 0.12}, // ← 420; sai quando a balança vai pro canto
    legenda: {texto: 'é esse que te faz gastar', de: 741, topo: 1250}, // ← 740
    linhas: [
      // uma a cada 40 frames, na pausa antes de "separa alguns dias…"
      {texto: 'come o mínimo', de: 838, base: 1014}, // ← 810
      {texto: 'veste o pior', de: 878, base: 1092}, // ← 850
      {texto: 'alguns dias só', de: 918, base: 1170}, // ← 890
    ],
    tamanhoLinha: 64,
    recuo: {de: 932, duracao: 12, opacidade: 0.3}, // ← 930
    hero4: {linhas: ['ERA ISSO QUE', 'EU TEMIA?'], de: 989, duracao: 30, tamanho: 120, topo: 560}, // ← 950: em "era isso que eu temia"
    // PARE TUDO por 40 frames, logo depois de "temia?". "Quase nunca era" (1048) cai dentro.
    parada: {de: 1037, ate: 1077}, // ← 1000–1040
    apagar: 1077, // as linhas e o hero 4 saem para a balança voltar
    hero5: {linhas: ['QUASE NUNCA', 'ERA'], de: 1080, tamanho: 120, topo: 250},
    faixa: 1100, // só no Instagram
  },

  // ─── A BALANÇA ───
  balanca: {
    desenha: 457, // ← 450: na pausa depois de "uma coisa"; quatro peças em 68 frames
    // onde ela está (pivô, escala, opacidade), por quadros-chave
    posicoes: [
      {f: 0, ...CENTRO},
      {f: 765, ...CENTRO}, // ← 780: encolhe e vai para o canto, mantendo a inclinação
      {f: 789, ...CANTO},
      {f: 1077, ...CANTO}, // ← 1050: volta ao centro, crescendo (depois da parada)
      {f: 1091, ...CENTRO},
    ],
    inclinacao: [
      {f: 0, alvo: 0, duracao: 0},
      {f: 640, balanco: {amplitude: 0.06, periodo: 28}}, // oscila de leve, sem assentar
      {f: 690, alvo: 0.9, duracao: 30}, // o prato direito afunda
      {f: 1077, alvo: 0, duracao: 24}, // ← 1065: os dois pratos se igualam
    ] as EventoDeInclinacao[],
    esquerda: {texto: 'ser pobre', de: 540, tamanho: 58},
    direita: {texto: 'PARECER pobre', de: 598, tamanho: 58}, // ← 590: na pausa antes de "parecer"
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel08.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo dos outros Reels, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 392,
      ate: 1115,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 1037, ate: 1077, db: -32, rampa: 3},
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 392, db: -30, fadeDe: 372, fadeAte: 390},
    // alternar as três canetas é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 368, arquivo: 'sfx/caneta-b.mp3', db: -24}, // o risco
      {frame: 392, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 457, arquivo: 'sfx/caneta-c.mp3', db: -24}, // as quatro peças da balança
      {frame: 475, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 497, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 511, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 540, arquivo: 'sfx/caneta-a.mp3', db: -24}, // os dois medos
      {frame: 598, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 690, arquivo: 'sfx/caneta-c.mp3', db: -22}, // o prato afundando
      {frame: 838, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 878, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 918, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 989, arquivo: 'sfx/caneta-a.mp3', db: -24},
      // a parada: nada
      {frame: 1080, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // 1115: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1 ───
  capa: {
    margem: 0.15,
    balanca: {x: 540, y: 190, escala: 0.5, inclinacao: 0.6, tamanhoTexto: 96}, // inclinada menos que no vídeo: o prato fundo não alcança o título
    hero: {texto: 'QUAL DOS DOIS É O SEU?', tamanho: 66, topo: 690},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel08;
export type BlocoId = (typeof reel08.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel08.blocos.find((b) => b.id === id)?.de ?? 0;
