import {Easing, useVideoConfig} from 'remotion';

// ─── Paleta (nomes tradicionais). Sem preto puro, sem branco puro. ───
export const cores = {
  torinoko: '#EDE6D6', // 鳥の子 papel
  sumi: '#1C1A17', // 墨 tinta
  shu: '#B7382A', // 朱 carimbo
  ai: '#2A3B4D', // 藍 índigo
  rikyu: '#888E7E', // 利休鼠 legenda
  koshi: '#D8CFBB', // 格子 pauta
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
  peso: {corpo: 500, hero: 600, hanko: 800, legenda: 400},
} as const;

// ─── Escala (px no 9x16; no 1x1 multiplica por k) ───
export const escala = {
  hero: 104, // UMA PALAVRA JAPONESA
  heroPausa: 112, // A PAUSA
  kanjiMa: 490, // o maior que cabe com a coluna a 72% e margem direita de 96
  kanjiForma: 170, // 欲 e 買
  contadorIntervalo: 240, // 3 · 2 · 1
  ano: 210, // 1904
  letra: 110, // APP / CADERNO
  pergunta: 46,
  kanjiKakeibo: 290,
  titulo: 96,
  subtitulo: 36,
  hanko: 150,
  losango: 12,
  larguraColuna: 150,
} as const;

// Corpos fixos pedidos no brief (não escalam no 1x1).
export const corpoFixo = {legenda: 32, ruby: 18, aviso: 26} as const;

export const proporcoes = {
  entrelinha: 1.22,
  entrelinhaHero: 1.04,
  entrelinhaLegenda: 1.35,
  espacoRuby: '0.28em',
  espacoCaixaAlta: '0.04em',
  // meia largura da tinta em fração da caixa do kanji (KanjiVG e glifo tipográfico)
  tintaKanjiVG: 0.42,
  tintaFonte: 0.47,
} as const;

// ─── Grid: tategaki com espinha a 72%, fukinsei (margens assimétricas) ───
export const grid = {
  colunaX: 0.72,
  margemEsq: 300,
  margemDir: 96,
  rubyAfastamento: 14,
  alturaReferencia: 950,
  palco: {
    '9x16': {topo: 300, base: 1250, legenda: 1300},
    '1x1': {topo: 70, base: 690, legenda: 740},
  },
} as const;

// ─── Motion: parâmetros de cada técnica (independem da locução) ───
export const motion = {
  kakijun: {
    ma: {traco: 3, pausa: 1},
    kakeibo: {traco: 2.5, pausa: 1},
  },
  // Pincel em unidades do KanjiVG (viewBox 109). Grosso na entrada, fino na saída.
  pincel: {inicio: 10, fim: 2.6, curva: 1.1, toque: 0.05, amostra: 1.2, mascara: 1.7, angulo: -12, minimoDirecao: 0.5, entrada: 1.25},
  tinta: {frequencia: 0.32, oitavas: 2, deslocamento: 1.1, semente: 7},
  escrita: {minimo: 6, suave: 16, vertical: 12, quadrosPorLetra: 0.5},
  pauta: {traco: 12, intervalo: 3, espessura: 1.5, passo: 120},
  fusuma: {fechar: 10, segurar: 2, abrir: 10, moldura: 22, fio: 2, puxador: 46, puxadorRecuo: 72},
  intervalo: {duracao: 12, inicio: 10, fim: 4.5, alcance: 240, vao: 125},
  nijimi: {
    crescer: 48,
    raio: 200,
    secar: 40,
    frequencia: 0.016,
    oitavas: 3,
    deslocamento: 0.34,
    semente: 11,
    opacidade: 0.88,
    atrasoBorda: 0.55, // opacidade sobe de dentro para fora
    frente: 0.5, // a frente molhada já nasce nítida
    orla: 0.35,
  },
  pautaCaderno: {linhas: 6, primeira: 0.4, passo: 0.1},
  enso: {traco: 26, raio: 330, abertura: 0.1, inicioGraus: 125, ondulacao: 0.018, larguraInicio: 30, larguraFim: 7, curva: 0.9},
  contador: {entrada: 6, larguraDigito: 0.62},
  // larguras do risco em fração do corpo do texto
  risco: {traco: 8, subida: 0.06, inicio: 0.15, fim: 0.06, alturaNova: 1, larguraLetra: 0.7},
  hanko: {escalaInicial: 1.14, pressao: 3, opacidade: 0.92, rotacao: -1.5, borda: 0.07, glifo: 0.74},
  hankoTinta: {frequencia: 0.06, oitavas: 3, deslocamento: 3, falhas: 0.62, semente: 23, sangria: 1.04, sangriaOpacidade: 0.28},
  losango: {pressao: 3, antecedencia: 6, afastamento: 18},
  absorcao: 14,
  legenda: {permanencia: 12},
  // fibras: RGB do sumi (0–1), alfa = contraste·ruído − limiar
  washi: {frequencia: 0.9, oitavas: 4, opacidade: 0.14, semente: 3, fibra: [0.11, 0.1, 0.09], contraste: 2, limiar: 1},
} as const;

// ─── Curvas. Nada de spring, bounce ou elástico. ───
export const curvas = {
  pincel: Easing.inOut(Easing.sin),
  linear: Easing.linear,
} as const;

export const video = {fps: 30, duracao: 1200} as const;

export const audio = {sfxDb: -24} as const;
export const dbParaVolume = (db: number) => 10 ** (db / 20);

// ─── Composição de cada página (frações da altura do palco) ───
const composicao = {
  hero1Topo: 0.12,
  maTopo: 0,
  maRubyTopo: 0.1,
  aPausaFolga: 0.03,
  intervaloCentro: 0.4,
  intervaloComprarX: 400, // distância de 買 para a espinha
  anoTopo: 0.22,
  letraTopo: 0.14,
  kakeiboTopo: 0,
  kakeiboVao: 18,
  kakeiboRubyTopo: 0.1,
  tituloTopo: 0.16,
  subtituloTopo: 0.4,
  hankoTopo: 0.6,
  hankoFolga: 16,
  avisoTopo: 0.86,
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
  const eixo = espinha + colunaMeia; // o português se pendura nesta linha
  const c = composicao;
  const rubyX = (tamanho: number, tinta: number) => espinha + tamanho * tinta + px(grid.rubyAfastamento);

  const trelica = (() => {
    const passo = px(motion.pauta.passo);
    const verticais: number[] = [];
    for (let x = espinha + passo / 2; x <= dir; x += passo) verticais.push(x);
    for (let x = espinha - passo / 2; x >= esq; x -= passo) verticais.push(x);
    verticais.sort((a, b) => b - a); // direita → esquerda
    return {verticais, topo: y(0), base: y(1), esq: Math.min(...verticais), dir: Math.max(...verticais)};
  })();

  const hero1 = {direita: eixo, topo: y(c.hero1Topo)};

  const ma = (() => {
    const tamanho = px(escala.kanjiMa);
    const topo = y(c.maTopo);
    return {
      kanji: {cx: espinha, topo, tamanho},
      ruby: {x: rubyX(tamanho, proporcoes.tintaKanjiVG), topo: topo + tamanho * c.maRubyTopo},
      aPausa: {direita: eixo, topo: topo + tamanho + c.aPausaFolga * h},
    };
  })();

  const intervalo = (() => {
    const tamanho = px(escala.kanjiForma);
    const meio = y(c.intervaloCentro);
    const comprarX = espinha - px(c.intervaloComprarX);
    const x = (comprarX + tamanho / 2 + espinha - tamanho / 2) / 2;
    const alcance = px(motion.intervalo.alcance);
    const vao = px(motion.intervalo.vao);
    return {
      tamanho,
      topo: meio - tamanho / 2,
      querer: {cx: espinha},
      comprar: {cx: comprarX},
      linha: {x, cima: [meio - alcance, meio - vao] as const, baixo: [meio + vao, meio + alcance] as const},
      digito: {cx: x, meio, tamanho: px(escala.contadorIntervalo)},
      nijimi: {cx: x, cy: meio, raio: px(motion.nijimi.raio)},
    };
  })();

  const ano = (() => {
    const tamanho = px(escala.ano);
    const topo = y(c.anoTopo);
    const largura = 4 * motion.contador.larguraDigito * tamanho;
    return {
      direita: eixo,
      topo,
      tamanho,
      enso: {cx: eixo - largura / 2, cy: topo + tamanho / 2, raio: px(motion.enso.raio)},
    };
  })();

  const caderno = (() => {
    const pc = motion.pautaCaderno;
    const linhas = Array.from({length: pc.linhas}, (_, i) => y(pc.primeira + i * pc.passo));
    const tamanho = px(escala.pergunta);
    return {
      letra: {direita: eixo, topo: y(c.letraTopo), tamanho: px(escala.letra)},
      linhas,
      esq,
      dir,
      direita: eixo,
      perguntas: linhas.slice(1, 5).map((linha) => ({topo: linha - tamanho * 1.15})),
    };
  })();

  const kakeibo = (() => {
    const tamanho = px(escala.kanjiKakeibo);
    const vao = px(c.kakeiboVao);
    const topo = y(c.kakeiboTopo);
    return {
      kanji: [0, 1, 2].map((i) => ({cx: espinha, topo: topo + i * (tamanho + vao), tamanho})),
      ruby: {x: rubyX(tamanho, proporcoes.tintaKanjiVG), topo: topo + tamanho * c.kakeiboRubyTopo},
    };
  })();

  const zen = {
    titulo: {direita: eixo, topo: y(c.tituloTopo)},
    subtitulo: {direita: eixo, topo: y(c.subtituloTopo)},
    hanko: {direita: espinha - colunaMeia - px(c.hankoFolga), topo: y(c.hankoTopo), tamanho: px(escala.hanko)},
    aviso: {direita: eixo, topo: y(c.avisoTopo)},
  };

  const legenda = {direita: eixo, topo: palco.legenda};

  const tipo = Object.fromEntries(Object.entries(escala).map(([nome, v]) => [nome, px(v)])) as Record<
    keyof typeof escala,
    number
  >;

  return {formato, largura: W, k, px, espinha, eixo, esq, dir, palco, tipo, trelica, hero1, ma, intervalo, ano, caderno, kakeibo, zen, legenda};
};

export type Layout = ReturnType<typeof layoutPara>;

export const useLayout = (): Layout => {
  const {width, height} = useVideoConfig();
  return layoutPara(height > width ? '9x16' : '1x1', width);
};
