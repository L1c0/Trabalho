// REEL #03 · @umdiadecadavez · Marco Aurélio e o pior emprego do mundo.
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel03.mp3)
// e todo evento cai numa pausa da fala. Os marcados com ← mudaram em relação ao brief.

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number; duracao?: number};

export const reel03 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1080,
  // tudo para aqui; os últimos 10 frames são silêncio absoluto, sem fade
  fim: 1070,

  // ─── Narração, frase por frase (usada também para o ducking da trilha) ───
  falas: [
    {texto: 'Marco Aurélio tinha o emprego mais poderoso do mundo', de: 10, ate: 99},
    {texto: 'e escrevia de madrugada que não queria levantar da cama.', de: 101, ate: 208},
    {texto: 'Ele não escrevia isso pra ninguém ler.', de: 225, ate: 278},
    {texto: 'Era um caderno particular', de: 284, ate: 328},
    {texto: 'que só apareceu depois que ele morreu.', de: 332, ate: 385},
    {texto: 'E sabe o que ele escrevia pra si mesmo?', de: 391, ate: 453},
    {texto: 'Não era você consegue,', de: 469, ate: 506},
    {texto: 'não era acredite.', de: 511, ate: 541},
    {texto: 'Era levanta.', de: 553, ate: 568},
    {texto: 'Você foi feito pra trabalhar,', de: 587, ate: 627},
    {texto: 'fica com preguiça igual todo mundo.', de: 632, ate: 682},
    {texto: 'O cara mais poderoso do império', de: 711, ate: 776},
    {texto: 'se convencia de levantar todo dia', de: 780, ate: 865},
    {texto: 'igual você.', de: 878, ate: 898},
    {texto: 'A diferença é que ele tinha um lugar para colocar isso.', de: 910, ate: 974},
    {texto: 'Você está segurando tudo na sua cabeça.', de: 987, ate: 1048},
  ] as Fala[],

  // ─── Blocos: uma cena por bloco. Todos depois da virada são a mesma folha. ───
  blocos: [
    {id: 'breu', de: 0, ate: 222},
    {id: 'caderno', de: 210, ate: 395},
    {id: 'riscos', de: 395, ate: 544},
    {id: 'levanta', de: 544, ate: 877},
    {id: 'igualVoce', de: 877, ate: 1080},
  ],

  // ─── 0 · no breu (7 s sem papel) ───
  breu: {
    hero1: {linhas: ['O EMPREGO MAIS', 'PODEROSO DO MUNDO'], de: 26, duracao: 60, tamanho: 88, topo: 800}, // ← 20 caía em "Marco"
    apagar1: 110, // ← 120 caía em "escrevia"
    hero2: {linhas: ['NÃO QUERIA', 'LEVANTAR'], de: 160, duracao: 24, tamanho: 150, topo: 760}, // ← 135 caía em "madrugada"
    apagar2: 198, // ← 195 ainda era "levantar"
  },

  // ─── 1 · o papel entra: o caderno ───
  caderno: {
    virada: 210,
    legendas: [
      {texto: 'não era pra ninguém ler', de: 258, topo: 470}, // ← 240 caía em "escrevia"
      {texto: 'um caderno particular', de: 293, topo: 548}, // ← 300 caía em "caderno"
      {texto: 'achado depois que ele morreu', de: 348, topo: 626}, // ← 350 caía em "apareceu"
    ],
    tamanho: 40,
    gigante: {texto: 'MEDITAÇÕES', de: 281, tamanho: 380, esquerda: 170, topo: 900, opacidade: 0.12}, // ← 270 caía em "ninguém"
    esvazia: 387, // ← 390; a página fica só com pauta e vinheta
  },

  // ─── 2 · as duas frases riscadas ───
  riscos: {
    pergunta: {texto: 'e o que ele escrevia era', de: 411, tamanho: 32, topo: 1500}, // ← 420 caía em "ele escrevia"
    frases: [
      // escrita curta para sobrar tempo com a frase inteira antes do risco
      {texto: 'VOCÊ CONSEGUE', de: 455, duracao: 10, risco: 468, apagar: 480}, // ← 450 · ← 472 caía em "Não era"
      {texto: 'ACREDITE', de: 490, duracao: 9, risco: 524, apagar: 536}, // ← 495 caía em "consegue" · ← 517 caía em "não era"
    ],
    tamanho: 130,
    topo: 820,
  },

  // ─── 3 · clímax: o que ele escrevia de verdade ───
  levanta: {
    linhas: [
      {texto: 'LEVANTA.', de: 544, tamanho: 220, base: 702}, // ← 540 caía em "acredite"
      {texto: 'VOCÊ FOI FEITO PRA TRABALHAR', de: 575, tamanho: 66, base: 858},
      {texto: 'FICA COM PREGUIÇA IGUAL TODO MUNDO', de: 629, tamanho: 54, base: 1014}, // ← 635 caía em "fica"
    ],
    recuo: {de: 690, duracao: 12, opacidade: 0.35},
    hero: {texto: 'SE CONVENCIA', de: 778, duracao: 20, tamanho: 150, topo: 800}, // ← 720: "se convencia" só é dita em 780
    todoDia: {texto: 'todo dia', de: 829, tamanho: 40, topo: 1090}, // ← 800: "todo dia" só é dito em 836
    apagar: 869, // ← 870 ainda era a cauda de "dia"
  },

  // ─── 4 · igual você ───
  igualVoce: {
    hero: {texto: 'IGUAL VOCÊ', de: 877, tamanho: 150, topo: 885}, // ← 880 caía em "igual"; parado até 909
    pautaFoco: 909, // ← 900: começa depois dos 15 frames parados
    linhas: [
      {texto: 'ele tinha onde colocar', de: 927, base: 1248}, // ← 915 caía em "diferença"
      {texto: 'você tá segurando na cabeça', de: 985, base: 1326}, // ← 990 caía em "Você"
    ],
    tamanho: 64,
    faixa: 1049, // ← 1040 caía em "cabeça"
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel03.mp3',
    // -20 dB = pico da trilha em -20 dBFS; o arquivo (o mesmo do #02) tem pico em -16 dBFS
    trilha: {arquivo: 'audio/trilha.mp3', de: 210, ate: 1070, db: -20, picoDoArquivo: -16, duckingDb: -3, ataque: 2, release: 12},
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 210, db: -30, fadeDe: 190, fadeAte: 208},
    // alternar caneta-a, caneta-b e caneta-c é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 26, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 210, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 468, arquivo: 'sfx/caneta-b.mp3', db: -24}, // risco 1
      {frame: 524, arquivo: 'sfx/caneta-c.mp3', db: -24}, // risco 2
      {frame: 544, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 575, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 629, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 778, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 927, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 985, arquivo: 'sfx/caneta-c.mp3', db: -24}, // ← 995: junto com a linha que começa em 985
      // 1070: nada — o silêncio é o efeito
    ] as Efeito[],
  },

  // ─── Capa 1x1: mesmos componentes do Reel ───
  capa: {
    margem: 0.15,
    hero: {texto: 'LEVANTA.', tamanho: 210, base: 470},
    sub: {texto: 'o que Marco Aurélio escrevia pra si mesmo', tamanho: 28},
    faixa: {topo: 800, altura: 118, tamanho: 22}, // texto termina dentro da margem de 15%
  },
} as const;

export type Reel = typeof reel03;
export type BlocoId = (typeof reel03.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel03.blocos.find((b) => b.id === id)?.de ?? 0;
