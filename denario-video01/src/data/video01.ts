// VÍDEO 01 · DENÁRIO · "37 horas" (Crimson Desert)
// Todo texto, frame, número e imagem deste vídeo. Trocar de vídeo = criar video02.ts.
//
// 24 fps. A narração manda: os frames foram medidos na narração tratada
// (public/audio/narracao.mp3, 4:56) e todo evento cai numa pausa da fala.
// O mapa do brief foi feito para ~8 min; aqui cada momento está onde a voz diz aquilo.

import type {CorDoBloco} from '../theme';

export type Efeito = {frame: number; arquivo: string; db: number};
export type Segmento = {rotulo: string; horas: number; destaque?: boolean};
export type Estado = {prefixo?: string; numero: string; sufixo?: string};
export type Bloco = {id: string; nome: string; cor: CorDoBloco; de: number; ate: number};

export const video01 = {
  codigo: 'DNR · 01',
  fps: 24,
  largura: 1920,
  altura: 1080,
  duracao: 7052,
  fimDaFala: 6992, // depois daqui: preto, só o logo, 60 frames. Corta.

  // ─── Blocos: um componente por bloco, uma cor por bloco ───
  blocos: [
    {id: 'abertura', nome: 'ABERTURA', cor: 'branco', de: 0, ate: 1512},
    {id: 'seneca', nome: 'SÊNECA', cor: 'verde', de: 1512, ate: 2640},
    {id: 'ansiedade', nome: 'ANSIEDADE', cor: 'verde', de: 2640, ate: 3974},
    {id: 'conta', nome: 'A CONTA', cor: 'magenta', de: 3974, ate: 5110},
    {id: 'valeu', nome: 'O QUE VALEU', cor: 'laranja', de: 5110, ate: 5677},
    {id: 'pratica', nome: 'A PRÁTICA', cor: 'azul', de: 5677, ate: 6055},
    {id: 'denario', nome: 'DENÁRIO', cor: 'roxo', de: 6055, ate: 6992},
    {id: 'fim', nome: 'FIM', cor: 'roxo', de: 6992, ate: 7052},
  ] as Bloco[],

  // ─── Camadas fixas ───
  marcas: {de: 288, ate: 6992}, // sem marca enquanto "CRIMSON DESERT" está sozinho
  logo: {de: 288},
  grid: {de: 1512, ate: 6992, fuga: {x: 0.5, y: 0.44}},

  // ─── 0 · abertura (branco sobre preto) ───
  abertura: {
    titulo: {texto: 'CRIMSON DESERT', de: 24, ate: 288}, // ESCRITA, sozinho
    mouse: {imagem: 'img/mao-mouse.png', de: 288, ate: 518, x: 930, y: 150, largura: 900}, // ← 300
    legenda: {texto: 'eu sabia que não era pra mim', de: 288, ate: 518}, // ← 300
    compra: {texto: 'COMPREI MESMO ASSIM', de: 518, ate: 647}, // CORTE ← 500 ("Comprei" é dito em 522)
    horas: {texto: '37 HORAS', de: 800, ate: 1356, duracao: 96, corpoInicial: 64, corpoFinal: 300}, // PESO ← 900 ("37 horas" em 801)
  },

  // ─── 1 · Sêneca (verde) ───
  seneca: {
    busto: {imagem: 'img/busto-romano.png', de: 1512, ate: 2262, queixo: 0.84, altura: 1010, direita: 40}, // ← 1500
    citacao: {
      de: 1785, // ← 1500: entra quando ele começa a paráfrase ("Ele diz que ninguém empresta a casa")
      ate: 2262,
      linhas: ['ninguém empresta a casa.', 'ninguém deixa mexer no dinheiro.', 'mas o tempo a gente dá', 'pra qualquer um.'],
    },
    burro: {texto: 'FUI BURRO', de: 2353, risco: 2380, ate: 2640}, // ← 2000: "porque foi burro. Não explica nada."
  },

  // ─── 2 · ansiedade (verde) ───
  ansiedade: {
    titulo: {linhas: ['ANSIEDADE', 'DE FICAR DE FORA'], de: 2640, ate: 3588}, // ESCRITA ← 2000
    barra: {
      de: 3588, // ← 2800: "É a unidade de medida."
      ate: 3890,
      foto: 'img/ponto-onibus.jpg',
      opacidade: 0.2,
      segmentos: [
        {rotulo: 'acordar · 40min', horas: 40 / 60},
        {rotulo: 'ônibus · 1h', horas: 1},
        {rotulo: 'trabalho · 8h', horas: 8, destaque: true},
        {rotulo: 'ônibus · 1h', horas: 1},
        {rotulo: 'resto', horas: 24 - 40 / 60 - 10},
      ] as Segmento[],
    },
    dia: {texto: 'DIA', de: 3890, ate: 3974, foto: 'img/onibus-lotado.jpg', opacidade: 0.25}, // RESTO ← 3200: "Eu sei o que é 37 horas porque eu vivi cada uma delas"
  },

  // ─── 3 · a conta (magenta) ───
  conta: {
    passos: {
      de: 4060, // ← 4000: "Pega o que você recebe."
      ate: 4614,
      linhas: [
        'pega o que você recebe',
        'tira o que o trabalho te cobra pra existir',
        'divide pelas horas que ele realmente consome',
        'inclui o deslocamento e o tempo de ficar pronto',
      ],
    },
    contador: {de: 4614, ate: 4962, valor: 10.8, prefixo: 'R$ ', casas: 2, sufixo: ''}, // ← 4300: "eram uns 10,80" em 4621
    troca: {
      de: 4962, // ← 5000: o terceiro estado cai em "três terça-feiras" (5044)
      ate: 5110,
      estados: [
        {prefixo: 'R$', numero: '400'},
        {numero: '37', sufixo: 'HORAS'},
        {numero: '3,5', sufixo: 'TERÇAS'},
      ] as Estado[],
    },
  },

  // ─── 4 · o que valeu (laranja) ───
  valeu: {
    teclado: {imagem: 'img/teclado.png', de: 5110, ate: 5249, x: 820, y: 180, largura: 1000}, // ← 5400: "Comprei um teclado caro"
    legenda: {texto: 'esse valeu cada hora', de: 5160, ate: 5249}, // em "valeu cada hora"
    cortes: [
      {texto: 'DINHEIRO VOLTA', de: 5518, ate: 5552}, // ← 5800
      {texto: 'TERÇA-FEIRA NÃO', de: 5552, ate: 5600}, // 48 frames sozinha
    ],
    sofa: {foto: 'img/sofa.jpg', de: 5600, ate: 5677, opacidade: 0.3}, // ← 6000
  },

  // ─── 5 · a prática (azul) ───
  pratica: {
    cartela: {
      de: 5677, // ← 6500: "Calcula o seu número e escreve no papel."
      linhas: [
        'calcule o seu número e escreva no papel',
        'deixe num lugar que você olhe',
        'compra acima de R$ 200: divida e veja em horas',
      ],
    },
  },

  // ─── 6 · denário (roxo) ───
  denario: {
    moeda: {imagem: 'img/moeda-denario-2.png', de: 6055, tamanho: 560, y: 90}, // ← 7400: "O nome desse canal é uma moeda romana."
    titulo: {texto: 'DENÁRIO', de: 6128}, // ESCRITA, em "O denário"
    legenda: {texto: 'cabia na mão', de: 6260}, // em "Ela cabia na mão."
  },

  // ─── Áudio ───
  audio: {
    narracao: 'audio/narracao.mp3',
    // nível = pico do arquivo em dBFS (o mesmo critério dos Reels)
    trilha: {arquivo: 'audio/trilha.mp3', de: 800, ate: 7052, db: -22, picoDoArquivo: -0.2, duckingDb: -3, ataque: 2, release: 10}, // ← 900
    tensao: {arquivo: 'audio/tensao.mp3', de: 2640, ate: 3974, db: -28, picoDoArquivo: 0}, // ← 2000 / 4000
    efeitos: [
      {frame: 511, arquivo: 'sfx/click.mp3', db: -26}, // ← 480: o clique da compra, logo antes de "Comprei"
      {frame: 2380, arquivo: 'sfx/click.mp3', db: -26}, // o risco
      {frame: 6055, arquivo: 'sfx/moeda.mp3', db: -24}, // ← 7400
    ] as Efeito[],
    // trechos com voz (frames), medidos na narração; guiam o ducking da trilha
    fala: [
      [5, 11], [32, 114], [130, 307], [317, 466], [484, 510], [517, 549], [558, 571], [578, 902], [910, 1069], [1076, 1117],
      [1126, 1419], [1428, 1507], [1518, 1609], [1616, 1707], [1714, 1886], [1893, 2063], [2071, 2077], [2091, 2107],
      [2116, 2254], [2269, 2372], [2392, 2410], [2418, 2424], [2438, 2466], [2473, 2750], [2759, 2815], [2826, 2901],
      [2910, 2945], [2954, 2989], [2997, 3029], [3040, 3088], [3099, 3184], [3192, 3301], [3310, 3392], [3399, 3464],
      [3496, 3521], [3535, 3585], [3593, 3799], [3818, 4098], [4105, 4292], [4300, 4466], [4475, 4492], [4501, 4611],
      [4621, 4647], [4704, 4766], [4768, 4781], [4788, 4808], [4816, 4846], [4858, 4958], [4969, 5002], [5013, 5018],
      [5027, 5071], [5088, 5108], [5115, 5245], [5252, 5476], [5485, 5582], [5608, 5730], [5737, 6049], [6060, 6066],
      [6076, 6125], [6134, 6203], [6210, 6255], [6265, 6287], [6296, 6302], [6316, 6421], [6428, 6534], [6543, 6652],
      [6659, 6715], [6725, 6827], [6834, 6851], [6858, 6890], [6903, 6988],
    ] as [number, number][],
  },

  // ─── Thumb 16x9 ───
  thumb: {
    texto: '37 HORAS',
    tamanho: 400,
    foto: 'img/ponto-onibus.jpg', // atrás da tipografia
    objeto: {imagem: 'img/moeda-denario-2.png', tamanho: 300, x: 1430, y: 130}, // em amarelo-limão
    margem: 0.1,
  },
} as const;

export type Video = typeof video01;
