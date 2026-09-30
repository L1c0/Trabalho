// REEL #07 · @umdiadecadavez · Diógenes e a tigela
// Todo texto, frame, desenho e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel07.mp3),
// sem cortes: as respirações ficam. Os marcados com ← mudaram em relação ao brief.

import {arco, curva, emenda, tremor, type Forma, type Ponto} from '../motion/formas';

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

// ─── Os objetos, desenhados à mão numa caixa 0–1 ───
// A tigela e as mãos são um traço só cada: é o que permite a morfose de uma na outra.
const TIGELA_TRACO: Ponto[] = tremor(
  emenda(
    arco(0.5, 0.36, 0.42, 0.1, Math.PI, 3 * Math.PI, 48), // a borda, uma volta inteira a partir da esquerda
    curva([0.08, 0.36], [0.12, 0.86], [0.5, 0.84], 20), // o bojo, até o fundo
    curva([0.5, 0.84], [0.88, 0.86], [0.92, 0.36], 20), // e de volta à borda
  ),
  0.004,
  3,
);

// dedos: pequenos arcos em sequência ao longo da borda de cada mão
const dedos = (x0: number, x1: number, y0: number, y1: number, n: number): Ponto[] =>
  emenda(
    ...Array.from({length: n}, (_, i) => {
      const a: Ponto = [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n];
      const b: Ponto = [x0 + ((x1 - x0) * (i + 1)) / n, y0 + ((y1 - y0) * (i + 1)) / n];
      return curva(a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 0.05], b, 8);
    }),
  );

const MAOS_TRACO: Ponto[] = tremor(
  emenda(
    curva([0.3, 0.98], [0.02, 0.86], [0.06, 0.42], 20), // pulso e borda da mão esquerda
    dedos(0.06, 0.47, 0.42, 0.34, 4), // os dedos da esquerda, até o meio
    curva([0.47, 0.34], [0.49, 0.6], [0.5, 0.74], 12), // a emenda das palmas
    curva([0.5, 0.74], [0.51, 0.6], [0.53, 0.34], 12),
    dedos(0.53, 0.94, 0.34, 0.42, 4), // os dedos da direita
    curva([0.94, 0.42], [0.98, 0.86], [0.7, 0.98], 20), // borda da mão direita e pulso
  ),
  0.004,
  7,
);

const MANTO: Forma = [
  tremor(
    emenda(
      curva([0.42, 0.12], [0.3, 0.14], [0.18, 0.28], 12), // ombro esquerdo
      curva([0.18, 0.28], [0.1, 0.6], [0.06, 0.9], 16), // cai até a barra
      curva([0.06, 0.9], [0.2, 0.96], [0.35, 0.9], 10), // barra ondulada
      curva([0.35, 0.9], [0.5, 0.84], [0.65, 0.9], 10),
      curva([0.65, 0.9], [0.8, 0.96], [0.94, 0.9], 10),
      curva([0.94, 0.9], [0.9, 0.6], [0.82, 0.28], 16), // sobe pela direita
      curva([0.82, 0.28], [0.7, 0.14], [0.58, 0.12], 12), // ombro direito
      curva([0.58, 0.12], [0.5, 0.22], [0.42, 0.12], 10), // a gola
    ),
    0.004,
    2,
  ),
  tremor(curva([0.36, 0.34], [0.3, 0.6], [0.28, 0.86], 14), 0.004, 5), // dobras
  tremor(curva([0.64, 0.34], [0.7, 0.6], [0.72, 0.86], 14), 0.004, 6),
];

const SACOLA: Forma = [
  tremor(
    emenda(
      curva([0.38, 0.4], [0.1, 0.52], [0.14, 0.76], 14), // o saco
      curva([0.14, 0.76], [0.2, 0.97], [0.5, 0.96], 12),
      curva([0.5, 0.96], [0.8, 0.97], [0.86, 0.76], 12),
      curva([0.86, 0.76], [0.9, 0.52], [0.62, 0.4], 14),
      curva([0.62, 0.4], [0.5, 0.44], [0.38, 0.4], 10), // a boca franzida
    ),
    0.004,
    4,
  ),
  tremor(curva([0.34, 0.46], [0.5, -0.12], [0.66, 0.46], 24), 0.004, 8), // a alça
  tremor(emenda(curva([0.44, 0.41], [0.47, 0.5], [0.42, 0.56], 8), curva([0.42, 0.56], [0.5, 0.52], [0.56, 0.58], 8)), 0.003, 9), // o cordão
];

export const objetos = {
  manto: MANTO,
  sacola: SACOLA,
  tigela: [TIGELA_TRACO] as Forma,
  maos: [MAOS_TRACO] as Forma,
  tigelaTraco: TIGELA_TRACO,
  maosTraco: MAOS_TRACO,
};

export const reel07 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 888,
  // tudo para aqui; os últimos 12 frames são silêncio absoluto, sem fade
  fim: 876,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Diógenes tinha três coisas: um manto, uma sacola e uma tigela para beber água.', de: 14, ate: 141},
    {texto: 'Um dia ele viu um menino bebendo água com as mãos em concha.', de: 157, ate: 237},
    {texto: 'Ele parou,', de: 247, ate: 271},
    {texto: 'olhou para a própria tigela e jogou fora.', de: 280, ate: 334},
    {texto: 'Falou assim: um garoto acabou de me ensinar que eu ainda carregava coisa demais.', de: 343, ate: 473},
    {texto: 'A gente compra para resolver problema,', de: 484, ate: 536},
    {texto: 'e quase sempre o problema era não ter parado para olhar.', de: 543, ate: 629},
    {texto: 'Hoje, antes de comprar qualquer coisa, pergunta:', de: 636, ate: 715},
    {texto: 'já não tem um jeito de fazer isso sem?', de: 722, ate: 791},
    {texto: 'Às vezes tem, e é de graça.', de: 800, ate: 847},
  ] as Fala[],

  // ─── Blocos da página (camada de baixo). A lista e os objetos são uma camada contínua. ───
  blocos: [
    {id: 'breu', de: 0, ate: 162},
    {id: 'pagina', de: 150, ate: 888},
  ],

  // ─── 0 · no breu ───
  breu: {
    hero1: {linhas: ['ELE TINHA', 'TRÊS COISAS'], de: 20, deSemBreu: 0, tamanho: 88, topo: 760},
    apagar1: 73, // ← 72
  },

  // ─── A LISTA: manto, sacola, tigela ───
  lista: {
    lado: 240,
    intervalo: 40,
    itens: [
      {objeto: 'manto', rotulo: '01', desenha: 80}, // ← 82: logo depois de "um manto,"
      {objeto: 'sacola', rotulo: '02', desenha: 102}, // ← 106: depois de "uma sacola"
      {objeto: 'tigela', rotulo: '03', desenha: 122}, // ← 130: depois de "uma tigela"
    ],
    posicoes: [
      {f: 0, x: 300, y: 520, escala: 1, opacidade: 1},
      {f: 178, x: 300, y: 520, escala: 1, opacidade: 1}, // desliza para o canto e espera
      {f: 202, x: 70, y: 120, escala: 0.34, opacidade: 0.5},
      {f: 682, x: 70, y: 120, escala: 0.34, opacidade: 0.5}, // ← 660: volta ao centro depois da parada
      {f: 706, x: 330, y: 380, escala: 0.8, opacidade: 1},
      {f: 792, x: 330, y: 380, escala: 0.8, opacidade: 1},
    ],
    contador: [
      {de: 80, texto: '03'},
      {de: 342, texto: '02'}, // o contador vira 02
    ],
    // a tigela se destaca, flutua ao centro e cresce até metade da tela
    remover: {indice: 2, de: 252, ate: 297, destino: {x: 270, y: 630, lado: 540}},
    vazio: {de: 706}, // quando a lista chega ao centro, o lugar da tigela fica pontilhado por 15 frames
    some: 792, // ← 810: tudo some menos as mãos
  },

  // ─── 1 · a página ───
  pagina: {
    virada: 150,
    maos: {de: 192, duracao: 38, x: 290, y: 650, lado: 500, apaga: 240},
    legenda1: {texto: 'um menino bebendo com as mãos', de: 222, apaga: 335, topo: 1420},
    morfose: {de: 297, x: 270, y: 630, lado: 540, apaga: 480}, // ← 296; as mãos ficam até a página esvaziar
    gigante: {texto: 'DIÓGENES', de: 368, tamanho: 400, esquerda: 300, topo: 1330, opacidade: 0.12}, // ← 360
    legenda2: {texto: 'eu ainda carregava coisa demais', de: 422, topo: 1420}, // ← 408
    esvazia: 480,
    hero2: {linhas: ['A GENTE COMPRA', 'PRA RESOLVER'], de: 494, tamanho: 100, topo: 600}, // ← 498
    hero3: {linhas: ['SÓ QUE NÃO', 'TINHA PROBLEMA'], de: 567, tamanho: 100, topo: 860}, // ← 572
    // PARE TUDO por 40 frames. A voz volta dentro dela ("Hoje,", em 0636).
    parada: {de: 630, ate: 670}, // ← 628–668
    apagarHerois: 670,
    hero4: {linhas: ['JÁ NÃO TEM', 'UM JEITO SEM?'], de: 716, tamanho: 110, topo: 1150}, // ← 706
    apagarHero4: 792,
    final: {
      maos: {de: 800, duracao: 38, x: 390, y: 700, lado: 300}, // ← 810
      manuscrito: {texto: 'às vezes é de graça', de: 848, tamanho: 64, base: 1110}, // ← 846
    },
    faixa: 862, // só no Instagram
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel07.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo dos outros Reels, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 150,
      ate: 876,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 630, ate: 670, db: -32, rampa: 3},
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 150, db: -30, fadeDe: 130, fadeAte: 148},
    // alternar as três canetas é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 80, arquivo: 'sfx/caneta-b.mp3', db: -24}, // os três objetos
      {frame: 102, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 122, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 150, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 192, arquivo: 'sfx/caneta-b.mp3', db: -24}, // as mãos
      {frame: 297, arquivo: 'sfx/caneta-c.mp3', db: -26}, // a morfose, suave
      {frame: 494, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 567, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // 0630–0670: nada
      {frame: 716, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 800, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 848, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // 0876: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1 (não veio no brief: proposta com os mesmos componentes) ───
  capa: {
    margem: 0.15,
    maos: {x: 340, y: 140, lado: 400},
    hero: {texto: 'JÁ NÃO TEM UM JEITO SEM?', tamanho: 70, topo: 580},
    sub: {texto: 'Diógenes e a tigela', tamanho: 28, topo: 680},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel07;
export type BlocoId = (typeof reel07.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel07.blocos.find((b) => b.id === id)?.de ?? 0;
