// REEL #05 · @umdiadecadavez · "Epicteto e o que não depende de você"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel05.mp3),
// sem cortes: as respirações ficam. Todo evento cai numa pausa ou entre palavras; os
// marcados com ← mudaram em relação ao brief.
//
// O arco visual: linha reta → entorta → quebra → vira duas pilhas → uma transborda →
// sobra só a limpa. Nenhum elemento gráfico fora desse arco.

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

export const reel05 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1530,
  // tudo para aqui; os últimos 20 frames são silêncio absoluto, sem fade
  fim: 1510,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Epicteto nasceu escravo em Roma,', de: 13, ate: 73},
    {texto: 'o dono dele gostava de torturar.', de: 81, ate: 134},
    {texto: 'Tem o relato de um dia em que o cara estava torcendo a perna dele,', de: 154, ate: 243},
    {texto: 'e Epicteto falou,', de: 252, ate: 290},
    {texto: 'sem alterar a voz,', de: 304, ate: 337},
    {texto: 'se o senhor continuar, vai quebrar.', de: 347, ate: 399},
    {texto: 'O osso quebrou,', de: 414, ate: 443},
    {texto: 'e ele só disse, eu avisei.', de: 460, ate: 502},
    {texto: 'Pode ser lenda,', de: 520, ate: 544},
    {texto: 'mas virou a história dele porque resume o que ele ensinou pelo resto da sua vida.', de: 551, ate: 660},
    {texto: 'Tem o que depende de você', de: 673, ate: 720},
    {texto: 'e tem o que não depende.', de: 733, ate: 768},
    {texto: 'E quase todo o seu sofrimento', de: 782, ate: 832},
    {texto: 'tá na segunda pilha.', de: 841, ate: 866},
    {texto: 'Ele não escolheu ser escravo.', de: 885, ate: 924},
    {texto: 'Não escolheu a perna quebrada.', de: 940, ate: 984},
    {texto: 'Não escolheu absolutamente nada.', de: 993, ate: 1044},
    {texto: 'Escolheu não implorar.', de: 1067, ate: 1098},
    {texto: 'Isso não é aceitar numa boa.', de: 1117, ate: 1168},
    {texto: 'É parar de gastar força', de: 1181, ate: 1224},
    {texto: 'onde ela não muda nada,', de: 1231, ate: 1266},
    {texto: 'pra sobrar força onde muda.', de: 1284, ate: 1334},
    {texto: 'Hoje,', de: 1361, ate: 1370},
    {texto: 'escolhe uma coisa da sua semana que não depende de você', de: 1382, ate: 1463},
    {texto: 'e larga.', de: 1471, ate: 1486},
  ] as Fala[],

  // ─── Blocos: uma cena por bloco. Depois da virada é sempre a mesma folha. ───
  blocos: [
    {id: 'breu', de: 0, ate: 522},
    {id: 'lenda', de: 510, ate: 679},
    {id: 'pilhas', de: 671, ate: 1066},
    {id: 'implorar', de: 1058, ate: 1275},
    {id: 'fecho', de: 1267, ate: 1530},
  ],

  // ─── 0 · no breu: a linha que quebra ───
  breu: {
    // no TikTok não há breu: o hero 1 entra no frame 0
    hero1: {linhas: ['O DONO GOSTAVA', 'DE TORTURAR'], de: 20, deSemBreu: 0, tamanho: 88, topo: 780},
    apagar1: 136, // ← 110: depois de "torturar."
    osso: {x: 540, y: 610, altura: 700, espessura: 6, escreve: 150, entorta: 180, quebra: 430}, // ← quebra 420: em "quebrou"
    legendas: [
      {texto: 'sem alterar a voz', de: 297, topo: 1420}, // ← 260: em "sem alterar a voz"
      {texto: 'se o senhor continuar', de: 342, topo: 1480}, // ← 360
      {texto: 'vai quebrar', de: 385, topo: 1540}, // ← 390
    ],
    apagarLegendas: 444, // a fratura fica sozinha para o "EU AVISEI"
    hero2: {linhas: ['EU AVISEI'], de: 450, tamanho: 170, topo: 870},
  },

  // ─── 1 · o papel entra: lenda ───
  lenda: {
    virada: 510,
    gigante: {texto: 'EPICTETO', de: 523, tamanho: 440, esquerda: 300, topo: 760, opacidade: 0.12}, // ← 540: em "Pode ser lenda"
    legenda: {texto: 'pode ser lenda', de: 547, topo: 1250}, // ← 570
    esvazia: 671, // depois de "pelo resto da sua vida."
  },

  // ─── 2 · as duas pilhas ───
  pilhas: {
    de: 679, // ← 690: em "Tem o que depende de você"
    x: 540,
    afastamento: 40,
    tamanho: 56,
    passo: 156, // uma linha de pauta sim, outra não
    baseTitulo: 1014,
    baseLinhas: 1170,
    esquerda: {
      titulo: {texto: 'depende de mim', de: 722}, // ← 720
      linhas: [
        {texto: 'o que eu penso', de: 740},
        {texto: 'o que eu faço', de: 777},
      ],
    },
    direita: {
      titulo: {texto: 'não depende', de: 757}, // ← 760
      // a mais nova entra no alto e empurra as outras até saírem pela base
      linhas: ['o corpo', 'a reputação', 'o que pensam de mim', 'o chefe', 'o trânsito', 'o passado', 'a economia'],
      transbordar: {de: 797}, // ← 800: em "E quase todo o seu sofrimento"
    },
    recuo: {de: 870, duracao: 12, opacidade: 0.25},
    // três riscos em sequência, mesmo ritmo, mesmo lugar
    frases: [
      {texto: 'SER ESCRAVO', de: 890, risco: 930}, // risco na pausa depois de "ser escravo."
      {texto: 'A PERNA QUEBRADA', de: 952, risco: 990}, // ← 960 / ← 1000
      {texto: 'ABSOLUTAMENTE NADA', de: 1016, risco: 1056}, // ← 1020 / ← 1055
    ],
    tamanhoFrase: 96,
    topoFrase: 420,
    apagar: 1058, // ← 1080: na pausa antes de "Escolheu não implorar"
  },

  // ─── 3 · escolheu não implorar ───
  implorar: {
    hero: {linhas: ['ESCOLHEU', 'NÃO IMPLORAR'], de: 1066, tamanho: 130, topo: 640}, // ← 1090: em "Escolheu"
    // PARE TUDO por 45 frames, logo depois de "implorar." A voz volta dentro da parada
    // ("Isso não é aceitar numa boa", em 1117): a gravação não foi editada.
    parada: {de: 1099, ate: 1144}, // ← 1130–1175
    linhas: [
      {texto: 'não é aceitar numa boa', de: 1172, base: 1170}, // ← 1180
      {texto: 'é economizar força', de: 1227, base: 1248}, // ← 1240
    ],
    tamanhoLinha: 64,
    apagar: 1267,
  },

  // ─── 4 · fecho: sobra só a pilha limpa ───
  fecho: {
    pilha: {
      titulo: {texto: 'depende de mim', de: 1275}, // ← 1290
      linhas: [
        {texto: 'o que eu penso', de: 1293},
        {texto: 'o que eu faço', de: 1308},
      ],
    },
    legenda: {texto: 'pra sobrar onde muda', de: 1316, topo: 1480}, // ← 1330
    hero: {linhas: ['ESCOLHE UMA', 'E LARGA'], de: 1375, tamanho: 120, topo: 420}, // ← 1400: em "escolhe uma coisa"
    faixa: 1467, // ← 1470; só no Instagram
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel05.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo dos outros Reels, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 510,
      ate: 1510,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 1099, ate: 1144, db: -32, rampa: 3}, // a parada: o silêncio precisa ser silêncio
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 510, db: -30, fadeDe: 490, fadeAte: 508},
    // alternar caneta-a, caneta-b e caneta-c é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 430, arquivo: 'sfx/caneta-b.mp3', db: -20}, // A QUEBRA
      {frame: 510, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 722, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 757, arquivo: 'sfx/caneta-a.mp3', db: -24},
      // o transbordo: uma caneta por linha, alternando
      {frame: 797, arquivo: 'sfx/caneta-b.mp3', db: -28},
      {frame: 809, arquivo: 'sfx/caneta-c.mp3', db: -28},
      {frame: 821, arquivo: 'sfx/caneta-a.mp3', db: -28},
      {frame: 833, arquivo: 'sfx/caneta-b.mp3', db: -28},
      {frame: 845, arquivo: 'sfx/caneta-c.mp3', db: -28},
      {frame: 857, arquivo: 'sfx/caneta-a.mp3', db: -28},
      {frame: 869, arquivo: 'sfx/caneta-b.mp3', db: -28},
      // os três riscos
      {frame: 930, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 990, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 1056, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 1066, arquivo: 'sfx/caneta-c.mp3', db: -24}, // ← 1095
      // a parada: nada
      {frame: 1172, arquivo: 'sfx/caneta-a.mp3', db: -24}, // ← 1185
      {frame: 1227, arquivo: 'sfx/caneta-b.mp3', db: -24}, // ← 1245
      {frame: 1375, arquivo: 'sfx/caneta-c.mp3', db: -24}, // ← 1405
      // 1510: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1: mesmos componentes do Reel ───
  capa: {
    margem: 0.15,
    // a fratura fica acima do hero, à vista; dentes maiores porque a linha é mais grossa
    osso: {x: 540, y: 180, altura: 470, espessura: 16, dente: 18, afasta: 16},
    hero: {texto: 'EU AVISEI', tamanho: 150, topo: 480},
    sub: {texto: 'Epicteto, escravo em Roma', tamanho: 28, topo: 690},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel05;
export type BlocoId = (typeof reel05.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel05.blocos.find((b) => b.id === id)?.de ?? 0;
