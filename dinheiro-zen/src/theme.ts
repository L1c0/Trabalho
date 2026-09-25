import {Easing, useVideoConfig} from 'remotion';
import type {CenaId} from './data/cenas';

// ─── Paleta (nomes tradicionais). Sem preto puro, sem branco puro. ───
export const cores = {
  torinoko: '#EDE6D6', // 鳥の子 papel
  sumi: '#1C1A17', // 墨 tinta
  shu: '#B7382A', // 朱 carimbo
  ai: '#2A3B4D', // 藍 índigo
  rikyu: '#888E7E', // 利休鼠 secundário
  koshi: '#D8CFBB', // 格子 treliça
} as const;

// ─── Fontes ───
export const fontes = {
  display: '"Shippori Mincho", "Noto Serif JP", serif',
  apoio: '"Zen Kaku Gothic New", "Noto Serif JP", sans-serif',
  pesos: {
    shippori: ['500', '600', '800'],
    zenKaku: ['400', '500'],
    notoSerif: ['500', '600', '800'],
  },
  peso: {corpo: 500, titulo: 600, hanko: 800, apoio: 400, apoioForte: 500},
} as const;

// ─── Escala tipográfica e de formas (px no 9x16; o 1x1 multiplica por k) ───
export const escala = {
  kanjiMa: 380,
  kanjiForma: 180,
  kanjiKakeibo: 190,
  larguraColuna: 150,
  corpo: 52,
  pergunta: 50,
  risco: 50,
  contador: 140,
  ano: 132,
  autora: 34,
  titulo: 84,
  subtitulo: 36,
  aviso: 26,
  ruby: 18,
  hanko: 150,
  losango: 12,
} as const;

export const proporcoes = {
  entrelinha: 1.22,
  entrelinhaTitulo: 1.08,
  espacoRuby: '0.28em',
  espacoAutora: '0.18em',
  espacoCaixaAlta: '0.06em',
  // meia largura da tinta em fração da caixa do kanji (KanjiVG e glifo tipográfico)
  tintaKanjiVG: 0.42,
  tintaFonte: 0.47,
} as const;

// ─── Grid: tategaki com espinha a 72%, fukinsei (margens assimétricas) ───
export const grid = {
  colunaX: 0.72,
  margemEsq: 300,
  margemDir: 96,
  calha: 36,
  rubyAfastamento: 14,
  alturaReferencia: 950,
  // Palco vertical. 9x16 respeita a zona segura de Reels (14% topo, 35% base).
  palco: {
    '9x16': {topo: 300, base: 1250},
    '1x1': {topo: 96, base: 984},
  },
} as const;

// ─── Motion: parâmetros de cada técnica ───
export const motion = {
  kakijun: {
    ma: {traco: 6, pausa: 4},
    // 38 traços entre 820 e ~972: com pausa de 4–6 frames não cabem na cena.
    kakeibo: {traco: 3, pausa: 1},
  },
  // Pincel em unidades do KanjiVG (viewBox 109). Grosso no início, fino na saída.
  pincel: {inicio: 10, fim: 2.6, curva: 1.1, toque: 0.05, amostra: 1.2, mascara: 1.7, angulo: -12, minimoDirecao: 0.5, entrada: 1.25},
  tinta: {frequencia: 0.32, oitavas: 2, deslocamento: 1.1, semente: 7},
  escrita: {quadrosPorLetra: 0.9, quadrosPorLetraAviso: 0.3, minimo: 10, suave: 16, sobreposicao: 0.3, vertical: 12},
  pauta: {traco: 12, intervalo: 3, espessura: 1.5, passo: 120},
  fusuma: {fechar: 12, segurar: 4, abrir: 12, moldura: 22, fio: 2, puxador: 46, puxadorRecuo: 72},
  intervalo: {duracao: 30, inicio: 10, fim: 4.5},
  nijimi: {
    crescer: 48,
    raio: 170,
    frequencia: 0.016,
    oitavas: 3,
    deslocamento: 0.34,
    semente: 11,
    opacidade: 0.88,
    // opacidade sobe de dentro para fora: cada anel começa depois do anterior
    atrasoBorda: 0.55,
    frente: 0.5, // a frente molhada já nasce nítida
    orla: 0.35,
  },
  quadrados: {condensar: 22, lado: 30, passo: 64, secarMancha: 44, deslocamento: 2.2, frequencia: 0.08, oitavas: 2, bordaInicial: 0.5},
  pautaCaderno: {linhas: 6, primeira: 0.31, passo: 0.12},
  enso: {
    traco: 26,
    raio: 380,
    abertura: 0.1,
    inicioGraus: 125,
    ondulacao: 0.018,
    larguraInicio: 30,
    larguraFim: 7,
    curva: 0.9,
    recuo: 285, // centro a esta distância à esquerda do alinhamento das perguntas
    centroY: 0.61,
  },
  contador: {passoTresDoisUm: 30, passoAno: 4, entrada: 6, larguraDigito: 0.62},
  // larguras do risco em fração do corpo do texto
  risco: {traco: 8, pausaAntesDaNova: 2, subida: 0.06, inicio: 0.15, fim: 0.06, alturaNova: 0.92, larguraLetra: 0.5},
  hanko: {escalaInicial: 1.14, pressao: 3, opacidade: 0.92, rotacao: -1.5, borda: 0.07, glifo: 0.74},
  hankoTinta: {frequencia: 0.06, oitavas: 3, deslocamento: 3, falhas: 0.62, semente: 23, sangria: 1.04, sangriaOpacidade: 0.28},
  losango: {pressao: 3, antecedencia: 6, afastamento: 18},
  absorcao: 14,
  // fibras: RGB do sumi (0–1), alfa = contraste·ruído − limiar
  washi: {frequencia: 0.9, oitavas: 4, opacidade: 0.14, semente: 3, fibra: [0.11, 0.1, 0.09], contraste: 2, limiar: 1},
} as const;

// ─── Curvas. Nada de spring, bounce ou elástico. ───
export const curvas = {
  pincel: Easing.inOut(Easing.sin),
  linear: Easing.linear,
} as const;

// ─── Tempo (frames absolutos, 30 fps). A narração define o timing. ───
// Cues marcados com ← foram movidos do brief para a pausa de fala mais próxima.
export const tempo = {
  fps: 30,
  total: 1200,
  ma: {
    pauta: 0,
    kakijun: 20,
    ruby: 145, // ← 140 caía em "japonesa"
    legenda: 152, // ← 160 caía em "os grandes"
  },
  fusuma1: 197, // ← 200 caía em "querem"
  tresSegundos: {
    formas: 235, // ← 230 caía no fim de "conheça"
    intervalo: 260,
    contador: 304, // ← 300/330/360 caíam em "A" e "de"; 304/334/364 caem em pausas
    legenda: 339, // ← 340 caía no "É"
    absorcao: 386,
  },
  dinheiroSome: {
    nijimi: 400,
    quadrados: 460,
    legenda: 512, // ← 520 caía em "maioria"
    absorcao: 586,
  },
  quatroPerguntas: {
    ano: 613, // logo depois de "1904" ser falado
    pauta: 613, // ← 600 caía em "1904"
    perguntas: [627, 666, 706, 750], // ← 620/665/710/755 caíam em palavras
    enso: 765, // ← 760 caía em "app"
  },
  fusuma2: 800,
  kakeibo: {
    kakijun: 820,
    riscoTexto: 895, // "um aplicativo" precisa estar escrito antes do risco (pausa após "mês")
    risco: 928, // ← 920 caía em "chama"
    nome: 928, // pausa antes de "Kakeibo" ser falado
    autora: 970,
    absorcao: 986,
  },
  dinheiroZen: {
    hanko: 1006, // ← 1020 caía em "fazer"
    titulo: 1047, // ← 1050 caía em "muito"
    subtitulo: 1080,
    aviso: 1147, // ← 1150 caía em "Toque"
  },
} as const;

const fusumaCobre = (inicio: number) => inicio + motion.fusuma.fechar;

// Janela de cada cena. A troca acontece com o fusuma fechado.
export const janelas: Record<CenaId, {de: number; ate: number}> = {
  ma: {de: 0, ate: fusumaCobre(tempo.fusuma1)},
  tresSegundos: {de: fusumaCobre(tempo.fusuma1), ate: tempo.dinheiroSome.nijimi},
  dinheiroSome: {de: tempo.dinheiroSome.nijimi, ate: 600},
  quatroPerguntas: {de: 600, ate: fusumaCobre(tempo.fusuma2)},
  kakeibo: {de: fusumaCobre(tempo.fusuma2), ate: 1000},
  dinheiroZen: {de: 1000, ate: tempo.total},
};

// ─── Áudio ───
export const audio = {
  narracao: 'audio/narracao.mp3',
  sfxDb: -24,
  trilhaDb: -20,
} as const;

export const local = (cena: CenaId, frameAbsoluto: number) => frameAbsoluto - janelas[cena].de;

export const dbParaVolume = (db: number) => 10 ** (db / 20);

// ─── Composição de cada cena (frações da altura do palco) ───
const composicao = {
  ma: {kanjiTopo: 0.02, rubyTopo: 0.1, legendaTopo: 0.97},
  tresSegundos: {quererTopo: 0.02, comprarTopo: 0.8, folga: 0.03, contadorCentro: 0.43, legendaTopo: 0.53},
  dinheiroSome: {legendaTopo: 0.62},
  quatroPerguntas: {anoTopo: 0},
  kakeibo: {kanjiTopo: 0.02, vao: 18, riscoTopo: 0.12, nomeTopo: 0.29, autoraTopo: 0.42},
  dinheiroZen: {tituloTopo: 0.26, subtituloTopo: 0.47, hankoTopo: 0.63, avisoTopo: 0.9},
} as const;

export type Formato = '9x16' | '1x1';

export const formatos: Record<Formato, {width: number; height: number}> = {
  '9x16': {width: 1080, height: 1920},
  '1x1': {width: 1080, height: 1080},
};

const layoutPara = (formato: Formato, W: number) => {
  const palco = grid.palco[formato];
  const h = palco.base - palco.topo;
  const k = h / grid.alturaReferencia;
  const y = (f: number) => palco.topo + f * h;
  const px = (v: number) => v * k;
  const espinha = W * grid.colunaX;
  const esq = grid.margemEsq;
  const dir = W - grid.margemDir;
  const colunaMeia = px(escala.larguraColuna) / 2;
  const textoDireita = espinha - colunaMeia - px(grid.calha);
  const rubyX = (tamanho: number, tinta: number) => espinha + tamanho * tinta + px(grid.rubyAfastamento);

  const ma = (() => {
    const tamanho = px(escala.kanjiMa);
    const topo = y(composicao.ma.kanjiTopo);
    const passo = px(motion.pauta.passo);
    const verticais: number[] = [];
    for (let x = espinha + passo / 2; x <= dir; x += passo) verticais.push(x);
    for (let x = espinha - passo / 2; x >= esq; x -= passo) verticais.push(x);
    verticais.sort((a, b) => b - a); // direita → esquerda
    return {
      kanji: {cx: espinha, topo, tamanho},
      ruby: {x: rubyX(tamanho, proporcoes.tintaKanjiVG), topo: topo + tamanho * composicao.ma.rubyTopo},
      legenda: {direita: textoDireita, topo: topo + tamanho * composicao.ma.legendaTopo},
      pauta: {verticais, topo: y(0), base: y(1), esq: Math.min(...verticais), dir: Math.max(...verticais)},
    };
  })();

  const intervalo = (() => {
    const c = composicao.tresSegundos;
    const tamanho = px(escala.kanjiForma);
    const quererTopo = y(c.quererTopo);
    const comprarTopo = y(c.comprarTopo);
    const y1 = quererTopo + tamanho + c.folga * h;
    const y2 = comprarTopo - c.folga * h;
    return {tamanho, quererTopo, comprarTopo, x: espinha, y1, y2, meio: (y1 + y2) / 2};
  })();

  const tresSegundos = {
    ...intervalo,
    rubyX: rubyX(intervalo.tamanho, proporcoes.tintaFonte),
    contador: {direita: textoDireita, centro: y(composicao.tresSegundos.contadorCentro)},
    legenda: {direita: textoDireita, topo: y(composicao.tresSegundos.legendaTopo)},
  };

  const dinheiroSome = {
    linha: {x: intervalo.x, y1: intervalo.y1, y2: intervalo.y2},
    centro: {x: espinha, y: intervalo.meio},
    raio: px(motion.nijimi.raio),
    quadrados: Array.from({length: 4}, (_, i) => ({
      x: espinha,
      y: intervalo.meio + (i - 1.5) * px(motion.quadrados.passo),
    })),
    ladoQuadrado: px(motion.quadrados.lado),
    legenda: {direita: textoDireita, topo: y(composicao.dinheiroSome.legendaTopo)},
  };

  const quatroPerguntas = (() => {
    const pc = motion.pautaCaderno;
    const linhas = Array.from({length: pc.linhas}, (_, i) => y(pc.primeira + i * pc.passo));
    const direita = espinha + colunaMeia;
    const e = motion.enso;
    const tamanho = px(escala.pergunta);
    return {
      linhas,
      esq,
      dir,
      direita,
      ano: {direita, topo: y(composicao.quatroPerguntas.anoTopo)},
      perguntas: linhas.slice(1, 5).map((linha) => ({base: linha, topo: linha - tamanho * 1.15})),
      enso: {cx: direita - px(e.recuo), cy: y(e.centroY) - tamanho / 2, raio: px(e.raio)},
    };
  })();

  const kakeibo = (() => {
    const c = composicao.kakeibo;
    const tamanho = px(escala.kanjiKakeibo);
    const vao = px(c.vao);
    return {
      kanji: [0, 1, 2].map((i) => ({cx: espinha, topo: y(c.kanjiTopo) + i * (tamanho + vao), tamanho})),
      rubyX: rubyX(tamanho, proporcoes.tintaKanjiVG),
      risco: {direita: textoDireita, topo: y(c.riscoTopo)},
      nome: {direita: textoDireita, topo: y(c.nomeTopo)},
      autora: {direita: textoDireita, topo: y(c.autoraTopo)},
    };
  })();

  const dinheiroZen = (() => {
    const c = composicao.dinheiroZen;
    return {
      titulo: {direita: textoDireita, topo: y(c.tituloTopo)},
      subtitulo: {direita: textoDireita, topo: y(c.subtituloTopo)},
      hanko: {direita: textoDireita, topo: y(c.hankoTopo), tamanho: px(escala.hanko)},
      aviso: {direita: dir, topo: y(c.avisoTopo), largura: dir - esq},
    };
  })();

  const tipo = Object.fromEntries(Object.entries(escala).map(([nome, v]) => [nome, px(v)])) as Record<
    keyof typeof escala,
    number
  >;

  return {formato, largura: W, k, px, espinha, esq, dir, palco, tipo, ma, tresSegundos, dinheiroSome, quatroPerguntas, kakeibo, dinheiroZen};
};

export type Layout = ReturnType<typeof layoutPara>;

export const useLayout = (): Layout => {
  const {width, height} = useVideoConfig();
  return layoutPara(height > width ? '9x16' : '1x1', width);
};
