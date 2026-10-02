// REEL #09 · @umdiadecadavez · "A reunião que podia ser um e-mail"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel09.mp3,
// 35,3 s), sem cortes: as respirações ficam. Os marcados com ← mudaram em relação ao brief.
//
// O arco: a lista de Sêneca → o carimbo de ano 49 ao lado dela → a barra de 40 minutos →
// a marca do que importava → a hachura cobrindo o resto → a barra espera no canto.

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

const CENTRO = {x: 90, y: 880, escala: 1, opacidade: 1};
const CANTO = {x: 705, y: 190, escala: 0.35, opacidade: 0.35};

export const reel09 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1059,
  // tudo para aqui; os últimos 9 frames são silêncio absoluto, sem fade
  fim: 1050,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Sêneca escreveu uma frase sobre o tempo que até hoje ninguém digeriu direito.', de: 17, ate: 135},
    {texto: 'Ele diz que a gente não recebe uma vida curta, a gente torna ela curta. E aí ele lista onde o tempo vai:', de: 145, ate: 323},
    {texto: 'bajular quem a gente não gosta, discutir coisa que não vai mudar,', de: 335, ate: 436},
    {texto: 'esperar por uma resposta que não vem.', de: 446, ate: 495},
    {texto: 'Isso foi escrito há dois mil anos e descreve a sua quinta-feira.', de: 505, ate: 601},
    {texto: 'O ponto dele não é largar o emprego.', de: 616, ate: 669},
    {texto: 'É que você reclama do dia curto e passa 40 minutos numa reunião', de: 679, ate: 791},
    {texto: 'que ia caber em três linhas.', de: 802, ate: 842},
    {texto: 'O tempo não está acabando,', de: 860, ate: 902},
    {texto: 'está sendo gasto.', de: 913, ate: 933},
    {texto: 'E a diferença é que gasto a gente escolhe.', de: 957, ate: 1013},
  ] as Fala[],

  // ─── Blocos da página (camada de baixo). A barra é uma camada contínua por cima. ───
  blocos: [
    {id: 'breu', de: 0, ate: 268},
    {id: 'pagina', de: 256, ate: 1059},
  ],

  // ─── 0 · no breu ───
  breu: {
    hero1: {linhas: ['NINGUÉM DIGERIU', 'DIREITO'], de: 20, deSemBreu: 0, tamanho: 86, topo: 760},
    apagar1: 137, // ← 110: na pausa depois de "direito."
    // "A VIDA" / "NÃO É" (riscado) + "CURTA"
    hero2: {de: 150, tamanho: 130, topo: 600, risco: 210},
    hero3: {linhas: ['A GENTE ENCURTA ELA'], de: 218, tamanho: 96, topo: 900}, // ← 225: em "a gente torna ela curta"
  },

  // ─── 1 · a página ───
  pagina: {
    virada: 256, // ← 270: na pausa depois de "curta."
    gigante: {texto: 'SÊNECA', de: 298, ate: 618, tamanho: 440, esquerda: 330, topo: 1380, opacidade: 0.12}, // ← 300
    linhas: [
      // um travessão curto à esquerda, como item de lista de caderno
      {texto: '— bajular quem não gosto', de: 326, base: 780}, // ← 330
      {texto: '— discutir o que não muda', de: 388, base: 858}, // ← 385
      {texto: '— esperar resposta que não vem', de: 440, base: 936}, // ← 440
    ],
    tamanhoLinha: 54,
    carimbo: {texto: 'ano 49', de: 503, pulsa: 604, x: 870, y: 610, raio: 92, tamanho: 58}, // ← 510 / ← 600
    legenda1: {texto: 'e descreve a sua quinta-feira', de: 558, topo: 1250}, // ← 570: em "e descreve"
    apagar: 618, // ← 630: na pausa depois de "O ponto"
    legenda2: {texto: 'você reclama que o dia é curto', de: 677, apaga: 852, topo: 1250}, // ← 700: em "você reclama"
    hero4: {linhas: ['NÃO TÁ ACABANDO'], de: 878, tamanho: 120, topo: 620}, // ← 890: em "não está acabando"
    hero5: {linhas: ['TÁ SENDO GASTO'], de: 905, tamanho: 120, topo: 760}, // ← 925: na pausa antes de "está sendo gasto"
    apagarHerois: 945, // na pausa antes de "E a diferença"
    hero6: {linhas: ['GASTO A GENTE', 'ESCOLHE'], de: 975, tamanho: 130, topo: 760}, // ← 960: em "gasto a gente escolhe"
    // PARE TUDO por 40 frames. "…escolhe" (até 1013) termina dentro dela.
    parada: {de: 1000, ate: 1040},
    faixa: 1040, // só no Instagram
  },

  // ─── A BARRA ───
  barra: {
    desenha: 661, // ← 650: na pausa depois de "emprego."
    rotulo: {texto: '40 MINUTOS', de: 741}, // ← 650: aparece quando a voz diz "40 minutos"
    marcar: {de: 793, posicao: 0.3, fracao: 0.07, rotulo: {texto: '3 LINHAS', de: 825}}, // ← 780 / em "três linhas"
    hachura: {de: 803, duracao: 45}, // ← 800
    posicoes: [
      {f: 0, ...CENTRO},
      {f: 852, ...CENTRO}, // ← 870: na pausa depois de "três linhas."
      {f: 876, ...CANTO},
    ],
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel09.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo dos outros Reels, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 256,
      ate: 1050,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 1000, ate: 1040, db: -32, rampa: 3},
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 256, db: -30, fadeDe: 236, fadeAte: 254},
    // alternar as três canetas. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 210, arquivo: 'sfx/caneta-b.mp3', db: -24}, // o risco
      {frame: 256, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 326, arquivo: 'sfx/caneta-c.mp3', db: -24}, // as três linhas
      {frame: 388, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 440, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 503, arquivo: 'sfx/caneta-c.mp3', db: -24}, // o carimbo
      {frame: 661, arquivo: 'sfx/caneta-a.mp3', db: -24}, // a barra
      // a hachura: riscado contínuo e baixo
      {frame: 803, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 811, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 819, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 827, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 835, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 843, arquivo: 'sfx/caneta-b.mp3', db: -30},
      {frame: 878, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 905, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 975, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // a parada: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1 ───
  capa: {
    margem: 0.15,
    barra: {x: 162, y: 340, largura: 756, altura: 80},
    rotulo: '40 MINUTOS',
    seta: {texto: '3 linhas', tamanho: 46},
    hero: {texto: 'A REUNIÃO', tamanho: 120, topo: 595},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel09;
export type BlocoId = (typeof reel09.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel09.blocos.find((b) => b.id === id)?.de ?? 0;
