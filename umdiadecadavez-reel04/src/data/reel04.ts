// REEL #04 · @umdiadecadavez · "Você não tá preguiçoso, tá exausto"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel04.mp3),
// que já tem a pausa de 45 frames depois de "Preguiçoso não sente culpa." (inserida aqui:
// o arquivo recebido não tinha). Todo evento cai numa pausa da fala; os marcados com ←
// mudaram em relação ao brief.

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

export const reel04 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 885,
  // tudo para aqui; os últimos 10 frames são silêncio absoluto, sem fade
  fim: 875,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Você deita pra descansar … não é preguiça. Preguiçoso não sente culpa.', de: 4, ate: 385},
    {texto: 'Sêneca escreveu … Você pega o celular', de: 433, ate: 635},
    {texto: '… e rola por 40 minutos. Não é afrouxar', de: 640, ate: 717},
    {texto: 'É trocar um cansaço por outro. … É olhar pro teto.', de: 723, ate: 821},
    {texto: 'É dormir cedo sem merecer.', de: 826, ate: 868},
  ] as Fala[],

  // ─── Blocos: uma cena por bloco. Depois da virada é sempre a mesma folha. ───
  blocos: [
    {id: 'breu', de: 0, ate: 196},
    {id: 'caderno', de: 184, ate: 591},
    {id: 'celular', de: 583, ate: 772},
    {id: 'fecho', de: 764, ate: 885},
  ],

  // ─── 0 · no breu ───
  breu: {
    // no TikTok não há breu: o hero 1 entra no frame 0
    hero1: {linhas: ['DEITEI PRA', 'DESCANSAR'], de: 20, deSemBreu: 0, tamanho: 92, topo: 780},
    apagar1: 58, // ← 60 caía em "pior"
    hero2: {linhas: ['LEVANTEI', 'PIOR'], de: 85, tamanho: 150, topo: 720}, // ← 90 caía em "Aí você"
    apagar2: 105,
    preguicoso: {texto: 'PREGUIÇOSO', de: 113, tamanho: 150, topo: 800, risco: 149}, // ← 120 / ← 150, cada um na pausa mais próxima
  },

  // ─── 1 · o caderno ───
  caderno: {
    virada: 184, // ← 180 caía em "diferentes"
    linhas: [
      {texto: 'preguiça = não querer', de: 205, base: 702}, // ← 195 caía em "preguiça"
      {texto: 'exaustão = querer e não conseguir', de: 248, base: 780}, // ← 240
    ],
    tamanhoLinha: 58,
    recuo: {de: 276, duracao: 12, opacidade: 0.3}, // ← 270 caía em "conseguir"
    culpa: {texto: 'se tá deitado com culpa', de: 293, topo: 1250}, // ← 290 caía em "deitado"
    esvaziaAntesDoSoco: 338, // a página fica vazia para o hero 3 entrar sozinho
    soco: {linhas: ['PREGUIÇOSO', 'NÃO SENTE', 'CULPA'], de: 350, duracao: 30, tamanho: 130, topo: 700}, // ← 360 caía em "Preguiçoso"
    // 0390–0435: PARE TUDO. Nenhum movimento, nenhuma entrada, só a frase na página.
    parada: {de: 390, ate: 435},
    gigante: {texto: 'SÊNECA', de: 435, tamanho: 470, esquerda: 380, topo: 1390, opacidade: 0.12},
    legendas: [
      {texto: 'afrouxar a mente de vez em quando', de: 462, topo: 1250}, // ← 460
      {texto: 'ela volta melhor depois', de: 530, topo: 1310}, // ← 525 caía em "que ela"
    ],
    esvazia: 583, // ← 585 caía em "Mas"
  },

  // ─── 2 · o celular ───
  celular: {
    hero: {linhas: ['40', 'MINUTOS'], de: 645, tamanho: 230, topo: 640},
    luz: {de: 676, apaga: 711, x: 170, y: 470, largura: 740, altura: 1060}, // ← 660 / ← 705, nas pausas mais próximas
    legenda: {texto: 'trocar um cansaço por outro', de: 720, topo: 1250},
    apagar: 756,
  },

  // ─── 3 · fecho ───
  fecho: {
    linhas: [
      {texto: 'descanso de verdade é chato', de: 764, base: 858}, // ← 765
      {texto: 'é olhar pro teto', de: 798, base: 936}, // ← 800 caía em "olhar"
    ],
    tamanhoLinha: 72,
    hero: {linhas: ['SEM MERECER'], de: 825, tamanho: 150, topo: 1030},
    faixa: 848, // ← 850 caía em "merecer"; só no Instagram
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel04.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo do #02, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 184, // ← 180: entra com o papel
      ate: 875,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 390, ate: 435, db: -32, rampa: 3}, // a parada: o silêncio precisa ser silêncio
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 184, db: -30, fadeDe: 160, fadeAte: 182},
    // alternar caneta-a, caneta-b e caneta-c é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 149, arquivo: 'sfx/caneta-b.mp3', db: -24}, // o risco
      {frame: 184, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 205, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 248, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 350, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // 0390–0435: nada
      {frame: 764, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 798, arquivo: 'sfx/caneta-a.mp3', db: -24},
      // 0875: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1: mesmos componentes do Reel ───
  capa: {
    margem: 0.15,
    hero: {texto: 'PREGUIÇOSO', tamanho: 150, topo: 330},
    sub: {texto: 'você não tá preguiçoso', tamanho: 28},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel04;
export type BlocoId = (typeof reel04.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel04.blocos.find((b) => b.id === id)?.de ?? 0;
