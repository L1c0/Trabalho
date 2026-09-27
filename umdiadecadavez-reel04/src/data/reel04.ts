// REEL #04 · @umdiadecadavez · "Você não tá preguiçoso, tá exausto"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel04.mp3):
// a gravação nova (35,8 s), sem cortes nem inserções, só com o tratamento de voz.
// Todo evento cai numa pausa ou entre palavras; os marcados com ← mudaram em relação ao brief,
// que tinha sido marcado na gravação anterior (29,5 s).

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

export const reel04 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1055,
  // tudo para aqui; os últimos 10 frames são silêncio absoluto, sem fade
  fim: 1045,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Você deita pra descansar e levanta pior do que deitou.', de: 13, ate: 93},
    {texto: 'Aí você se chama de preguiçoso,', de: 101, ate: 147},
    {texto: 'mas preguiça e exaustão são coisas diferentes.', de: 153, ate: 239},
    {texto: 'Preguiça é não querer,', de: 245, ate: 278},
    {texto: 'exaustão é querer e não conseguir.', de: 283, ate: 330},
    {texto: 'Se você tá deitado se sentindo culpado,', de: 339, ate: 405},
    {texto: 'isso não é preguiça. Preguiçoso não sente culpa. Sêneca escreveu … de vez em quando,', de: 412, ate: 596},
    {texto: 'porque ela volta melhor depois do descanso.', de: 602, ate: 665},
    {texto: 'Mas reparem o que você faz quando deita.', de: 670, ate: 734},
    {texto: 'Você pega o celular e rola por 40 minutos. Isso não é afrouxar.', de: 740, ate: 840},
    {texto: 'É trocar um cansaço por outro.', de: 847, ate: 891},
    {texto: 'Descanso de verdade é chato.', de: 896, ate: 939},
    {texto: 'É olhar para o teto.', de: 944, ate: 979},
    {texto: 'É dormir cedo sem merecer.', de: 984, ate: 1027},
  ] as Fala[],

  // ─── Blocos: uma cena por bloco. Depois da virada é sempre a mesma folha. ───
  blocos: [
    {id: 'breu', de: 0, ate: 239},
    {id: 'caderno', de: 227, ate: 672},
    {id: 'celular', de: 664, ate: 900},
    {id: 'fecho', de: 892, ate: 1055},
  ],

  // ─── 0 · no breu ───
  breu: {
    // no TikTok não há breu: o hero 1 entra no frame 0
    hero1: {linhas: ['DEITEI PRA', 'DESCANSAR'], de: 20, deSemBreu: 0, tamanho: 92, topo: 780},
    apagar1: 88, // ← 60: depois de "deitou."
    hero2: {linhas: ['LEVANTEI', 'PIOR'], de: 97, tamanho: 150, topo: 720}, // ← 90: antes de "Aí você se chama"
    apagar2: 142,
    preguicoso: {texto: 'PREGUIÇOSO', de: 150, tamanho: 150, topo: 800, risco: 192}, // ← 120 / ← 150: depois de "preguiçoso," / entre "exaustão" e "são coisas diferentes"
  },

  // ─── 1 · o caderno ───
  caderno: {
    virada: 227, // ← 180: depois de "diferentes."
    linhas: [
      {texto: 'preguiça = não querer', de: 241, base: 702}, // ← 195: em "Preguiça é não querer"
      {texto: 'exaustão = querer e não conseguir', de: 280, base: 780}, // ← 240: em "exaustão é querer"
    ],
    tamanhoLinha: 58,
    recuo: {de: 332, duracao: 12, opacidade: 0.3}, // ← 270: depois de "não conseguir."
    culpa: {texto: 'se tá deitado com culpa', de: 358, topo: 1250}, // ← 290: em "se sentindo culpado"
    esvaziaAntesDoSoco: 435, // a página fica vazia para o hero 3 entrar sozinho
    soco: {linhas: ['PREGUIÇOSO', 'NÃO SENTE', 'CULPA'], de: 445, duracao: 30, tamanho: 130, topo: 700}, // ← 360: em "Preguiçoso"
    // PARE TUDO por 45 frames depois de "culpa.". A gravação não tem 45 frames de silêncio ali
    // (a voz volta com "Sêneca escreveu…" em ~0497): a imagem fica parada mesmo assim.
    parada: {de: 484, ate: 529}, // ← 390–435
    gigante: {texto: 'SÊNECA', de: 529, tamanho: 470, esquerda: 380, topo: 1390, opacidade: 0.12}, // ← 435
    legendas: [
      {texto: 'afrouxar a mente de vez em quando', de: 549, topo: 1250}, // ← 460: em "afrouxar"
      {texto: 'ela volta melhor depois', de: 600, topo: 1310}, // ← 525: em "porque ela volta"
    ],
    esvazia: 664, // ← 585: depois de "descanso."
  },

  // ─── 2 · o celular ───
  celular: {
    hero: {linhas: ['40', 'MINUTOS'], de: 737, tamanho: 230, topo: 640}, // ← 645: em "Você pega o celular"
    luz: {de: 776, apaga: 806, x: 170, y: 470, largura: 740, altura: 1060}, // ← 660 / ← 705: em "por 40 minutos" / "Isso não é afrouxar"
    legenda: {texto: 'trocar um cansaço por outro', de: 842, topo: 1250}, // ← 720
    apagar: 892,
  },

  // ─── 3 · fecho ───
  fecho: {
    linhas: [
      {texto: 'descanso de verdade é chato', de: 903, base: 858}, // ← 765
      {texto: 'é olhar pro teto', de: 945, base: 936}, // ← 800
    ],
    tamanhoLinha: 72,
    hero: {linhas: ['SEM MERECER'], de: 981, tamanho: 150, topo: 1030}, // ← 825: em "É dormir cedo"
    faixa: 1009, // ← 850: em "sem merecer"; só no Instagram
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel04.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo do #02, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 227, // ← 180: entra com o papel
      ate: 1045,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 484, ate: 529, db: -32, rampa: 3}, // a parada: o silêncio precisa ser silêncio
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 227, db: -30, fadeDe: 203, fadeAte: 225},
    // alternar caneta-a, caneta-b e caneta-c é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 192, arquivo: 'sfx/caneta-b.mp3', db: -24}, // o risco
      {frame: 227, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 241, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 280, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 445, arquivo: 'sfx/caneta-b.mp3', db: -24},
      // a parada: nada
      {frame: 903, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 945, arquivo: 'sfx/caneta-a.mp3', db: -24},
      // 1045: nada
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
