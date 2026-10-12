// SEEDORF NO CORINTHIANS · análise · 1920x1080 (e 1080x1920), 30 fps, 3870 frames
// A lista de clipes e a lista de cards, como dados. Trocar de edit = trocar este arquivo.
//
// Os cortes foram medidos na narração (public/audio/narracao.mp3). O brief tinha metade
// deles no meio de uma palavra: cada um foi para a pausa mais próxima, nunca para dentro
// de uma frase. Os marcados com ← mudaram em relação ao brief.

import type {BlocoId} from '../theme';

export type Clipe = {
  id: string; // nome do arquivo, sem extensão
  pasta: string;
  de: number;
  bloco: BlocoId;
  duracao: number; // segundos de material
  foco: number; // 0–1, onde cortar na horizontal no 9:16
  recorte?: {escala: number; foco: number}; // reuso: enquadramento mais fechado
  velocidade?: number; // playbackRate próprio (o reuso usa um diferente da primeira passagem)
  faltando?: true; // arquivo não recebido
};

export type Card = {
  casa: string;
  golsCasa: number;
  fora: string;
  golsFora: number;
  rotulo: string;
  x: number; // fração do quadro, canto superior esquerdo
  y: number;
  frame: number;
  dur: number;
  pendente?: true; // faltam os dados
};

const Q = '01-queda';
const T = '02-travessia';
const V = '03-virada';
const G = '04-gloria';

export const edit = {
  fps: 30,
  duracao: 3870,

  blocos: [
    {id: 'queda', de: 0},
    {id: 'travessia', de: 900},
    {id: 'virada', de: 1926}, // ← 1920: caía em "Corinthians."
    {id: 'gloria', de: 2610},
  ] as {id: BlocoId; de: number}[],

  // Cada clipe vai do seu `de` até o `de` do próximo. A velocidade é a do bloco; se o
  // material não cobre o espaço nessa velocidade, o clipe desacelera o mínimo para cobrir.
  clipes: [
    // ─── QUEDA ───
    {id: 'q05-goleiro-gol', pasta: Q, de: 0, bloco: 'queda', duracao: 3, foco: 0.65},
    {id: 'q08-tres-cabisbaixos', pasta: Q, de: 60, bloco: 'queda', duracao: 3, foco: 0.42},
    {id: 'q01-cabeca-baixa', pasta: Q, de: 180, bloco: 'queda', duracao: 3, foco: 0.4},
    {id: 'q09-rosto-fechado', pasta: Q, de: 330, bloco: 'queda', duracao: 3, foco: 0.35},
    {id: 'q10-ajoelhado', pasta: Q, de: 409, bloco: 'queda', duracao: 3, foco: 0.5, faltando: true}, // ← 420
    {id: 'q03-reclamacao', pasta: Q, de: 510, bloco: 'queda', duracao: 3, foco: 0.55},
    {id: 'q06-goleiro-chuva', pasta: Q, de: 608, bloco: 'queda', duracao: 3.5, foco: 0.2}, // ← 600
    {id: 'q04-chao-chuva', pasta: Q, de: 672, bloco: 'queda', duracao: 3, foco: 0.6}, // ← 690
    {id: 'q07-goleiro-caido', pasta: Q, de: 750, bloco: 'queda', duracao: 3, foco: 0.42}, // ← 780
    {id: 'q02-parado', pasta: Q, de: 831, bloco: 'queda', duracao: 3, foco: 0.8}, // ← 840
    // ─── TRAVESSIA ───
    {id: 't01-gol-vazio-ct', pasta: T, de: 900, bloco: 'travessia', duracao: 3, foco: 0.5},
    {id: 't02-escada', pasta: T, de: 1072, bloco: 'travessia', duracao: 3, foco: 0.5}, // ← 1050
    {id: 't05-grupo-treino', pasta: T, de: 1200, bloco: 'travessia', duracao: 3, foco: 0.55},
    {id: 't03-faixa-cabeca', pasta: T, de: 1350, bloco: 'travessia', duracao: 3, foco: 0.38},
    {id: 't06-tecnico-bone', pasta: T, de: 1486, bloco: 'travessia', duracao: 3, foco: 0.3}, // ← 1500
    {id: 't07-correndo', pasta: T, de: 1660, bloco: 'travessia', duracao: 3.5, foco: 0.45}, // ← 1650
    {id: 't04-ceu', pasta: T, de: 1781, bloco: 'travessia', duracao: 3, foco: 0.5}, // ← 1800: respiro, nada por cima
    // ─── VIRADA ───
    // só o 2º plano do drone (a fusão do original não entra): 3,33 s, desacelera a ~0,59
    {id: 'v06-maracana', pasta: V, de: 1926, bloco: 'virada', duracao: 3.33, foco: 0.62}, // ← 1920
    // o lance dos bastidores de Corinthians 1 x 0 Vasco (só o plano aberto da área)
    {id: 'v04-corrida', pasta: V, de: 2095, bloco: 'virada', duracao: 5.43, foco: 0.45}, // ← 2070
    {id: 'v01-gol-camisa10', pasta: V, de: 2223, bloco: 'virada', duracao: 4, foco: 0.55}, // ← 2220
    {id: 'v02-lance-goleiro', pasta: V, de: 2380, bloco: 'virada', duracao: 3, foco: 0.45}, // ← 2400
    {id: 'v03-penalti', pasta: V, de: 2497, bloco: 'virada', duracao: 4, foco: 0.65}, // ← 2490
    // ─── GLÓRIA ───
    {id: 'g01-explosao', pasta: G, de: 2610, bloco: 'gloria', duracao: 3, foco: 0.65},
    {id: 'g03-abraco-fechado', pasta: G, de: 2734, bloco: 'gloria', duracao: 3, foco: 0.55}, // ← 2760
    {id: 'g04-abraco-joelhos', pasta: G, de: 2898, bloco: 'gloria', duracao: 3, foco: 0.6}, // ← 2910
    {id: 'g05-comissao', pasta: G, de: 3040, bloco: 'gloria', duracao: 3, foco: 0.45}, // ← 3060
    {id: 'g02-abraco-goleiro', pasta: G, de: 3180, bloco: 'gloria', duracao: 3, foco: 0.32},
    {id: 'g03-abraco-fechado', pasta: G, de: 3266, bloco: 'gloria', duracao: 3, foco: 0.35, recorte: {escala: 1.25, foco: 0.35}}, // ← 3300, reuso
    {id: 'g04-abraco-joelhos', pasta: G, de: 3420, bloco: 'gloria', duracao: 3, foco: 0.6, recorte: {escala: 1.3, foco: 0.6}, velocidade: 0.74}, // reuso
    {id: 'g06-campo-festa', pasta: G, de: 3528, bloco: 'gloria', duracao: 2, foco: 0.55}, // ← 3540
    {id: 'g01-explosao', pasta: G, de: 3596, bloco: 'gloria', duracao: 3, foco: 0.5, recorte: {escala: 1.2, foco: 0.5}}, // ← 3660, reuso
  ] as Clipe[],

  // o card final: do fim do último clipe até o fim do filme
  fecho: {de: 3771}, // ← 3780: caía em "inscreva-se"

  // NENHUM CARD NA TRAVESSIA. Nunca dois seguidos no mesmo canto.
  cards: [
    {casa: 'Palmeiras', golsCasa: 4, fora: 'Corinthians', golsFora: 1, rotulo: 'Brasileirão', x: 0.58, y: 0.72, frame: 180, dur: 120},
    {casa: '?', golsCasa: 0, fora: '?', golsFora: 0, rotulo: 'Eliminado', x: 0.08, y: 0.18, frame: 750, dur: 110, pendente: true}, // ← 780
    {casa: 'Vasco', golsCasa: 1, fora: 'Corinthians', golsFora: 1, rotulo: 'Final', x: 0.62, y: 0.2, frame: 2223, dur: 130}, // ← 2220
    {casa: 'Vasco', golsCasa: 1, fora: 'Corinthians', golsFora: 2, rotulo: 'Campeão', x: 0.3, y: 0.76, frame: 2898, dur: 90}, // ← 2910
  ] as Card[],

  // escudos: public/escudos/<time>.png
  escudos: {Palmeiras: 'escudos/palmeiras.png', Corinthians: 'escudos/corinthians.png', Vasco: 'escudos/vasco.png'} as Record<string, string>,

  // o gol, o pênalti, o apito final
  pulsos: [2223, 2497, 2610], // ← 2220, 2490

  // ─── Áudio ───
  audio: {
    narracao: 'audio/narracao.mp3', // -16 LUFS, do frame 0 ao fim, sem corte
    // nível = pico do arquivo em dBFS; o drone tem pico em -0,2 dBFS
    trilha: {arquivo: 'audio/trilha.mp3', de: 0, some: 3540, fade: 40, db: -22, picoDoArquivo: -0.2, duckingDb: -3, ataque: 2, release: 12},
    // a voz real por baixo da sintética: "…com muito trabalho, mostrar seu melhor pelo Corinthians"
    recado: {arquivo: 'audio/seedorf-recado-3s.mp3', de: 2610, db: -12},
    // trechos com voz (frames), medidos na narração; guiam o ducking da trilha
    fala: [
      [1, 52], [70, 174], [192, 327], [343, 451], [462, 508], [527, 630], [644, 724], [736, 826], [836, 893], [910, 1002],
      [1014, 1068], [1078, 1202], [1222, 1265], [1281, 1480], [1493, 1507], [1517, 1654], [1666, 1679], [1688, 1774],
      [1788, 1920], [1933, 2010], [2022, 2090], [2101, 2154], [2177, 2193], [2208, 2307], [2319, 2422], [2438, 2514],
      [2528, 2605], [2621, 2630], [2639, 2729], [2740, 2810], [2819, 2851], [2861, 2938], [2956, 3013], [3027, 3164],
      [3175, 3385], [3399, 3412], [3424, 3520], [3535, 3708], [3719, 3870],
    ] as [number, number][],
  },
};

export type Edit = typeof edit;

// O clipe de cada posição, com o fim e o índice (o zoom alterna entre entrar e sair)
export const clipesComFim = () =>
  edit.clipes.map((c, i) => ({...c, ate: edit.clipes[i + 1]?.de ?? edit.fecho.de, indice: i}));
