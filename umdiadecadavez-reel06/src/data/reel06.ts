// REEL #06 · @umdiadecadavez · "O anel de Giges — o que você faria se ninguém soubesse"
// Todo texto, frame e efeito do Reel. Trocar de Reel = trocar este arquivo.
//
// A narração manda. Os frames foram medidos na narração tratada (public/audio/reel06.mp3),
// sem cortes: as respirações ficam. Os marcados com ← mudaram em relação ao brief.
//
// Uma mecânica só governa o vídeo: GIRAR O ANEL LIGA E DESLIGA A INVISIBILIDADE.
// desenha → gira → abre o vão → os crimes acontecem dentro → gira e fecha → espera no
// canto → volta → multiplica em três → três vãos → fecham juntos → convergem em um → fecha.

import type {Quadro} from '../motion/trajeto';

export type Fala = {texto: string; de: number; ate: number};
export type Efeito = {frame: number; arquivo: string; db: number};

const CENTRO = {x: 540, y: 900, raio: 300, traco: 1};
const CANTO = {x: 900, y: 250, raio: 80, traco: 0.5}; // traço fino, esperando

export const reel06 = {
  handle: '@umdiadecadavez',
  fps: 30,
  duracao: 1095,
  // tudo para aqui; os últimos 15 frames são silêncio absoluto, sem fade
  fim: 1080,

  // ─── Narração em trechos contínuos de voz (guiam o ducking da trilha) ───
  falas: [
    {texto: 'Platão conta uma história sobre um pastor que achou um anel.', de: 27, ate: 104},
    {texto: 'O anel deixava ele invisível, era só girar na mão.', de: 114, ate: 193},
    {texto: 'E o que o cara fez?', de: 205, ate: 232},
    {texto: 'Entrou no palácio, seduziu a rainha, matou o rei e tomou o lugar dele.', de: 246, ate: 353},
    {texto: 'Platão usa isso para fazer uma pergunta desconfortável. Se ninguém pudesse te ver,', de: 367, ate: 527},
    {texto: 'você continuaria sendo uma boa pessoa?', de: 537, ate: 605},
    {texto: 'Ou você só é decente porque tem gente olhando?', de: 619, ate: 691},
    {texto: 'E, antes de responder que sim, pensa no seguinte:', de: 711, ate: 777},
    {texto: 'o anel existe.', de: 784, ate: 808},
    {texto: 'Chama comentário anônimo,', de: 819, ate: 840},
    {texto: '… chama perfil fake,', de: 847, ate: 920},
    {texto: 'chama trânsito.', de: 927, ate: 956},
    {texto: 'A gente já sabe quem é quando ninguém tá vendo.', de: 963, ate: 1038},
  ] as Fala[],

  // ─── Blocos da página (camada A). O anel e o vão são uma camada própria, por cima. ───
  blocos: [
    {id: 'breu', de: 0, ate: 402},
    {id: 'pagina', de: 390, ate: 1095},
  ],

  // ─── O ANEL: um trajeto de quadros-chave (posição, tamanho, giro) ───
  anel: {
    desenha: 113, // ← 120: logo depois de "achou um anel."; uma volta em 50 frames
    some: 818, // divide-se em três…
    volta: 992, // …e volta a ser um
    trajeto: [
      {f: 113, ...CENTRO, giro: 0},
      {f: 164, giro: 0}, // ← 170: fechado, PRIMEIRO GIRO em "era só girar na mão"
      {f: 194, giro: 1},
      {f: 384, giro: 1}, // SEGUNDO GIRO, rápido: fecha o vão em 6 frames
      {f: 390, giro: 1.5},
      {f: 459, ...CENTRO}, // ← 450: encolhe e vai para o canto, de perfil
      {f: 479, ...CANTO},
      {f: 615, giro: 1.5}, // meio grau, e desiste
      {f: 617, giro: 1.5 + 0.5 / 180},
      {f: 619, giro: 1.5},
      {f: 727, ...CANTO, giro: 1.5}, // ← 720: volta ao centro, crescendo, de frente
      {f: 757, ...CENTRO, giro: 2},
      {f: 818, giro: 2},
      {f: 992, ...CENTRO, giro: 3}, // os três se fundem de volta num só, fechado
    ] as Quadro[],
  },

  // ─── 0 · no breu ───
  breu: {
    hero1: {linhas: ['UM PASTOR', 'ACHOU UM ANEL'], de: 20, deSemBreu: 0, tamanho: 88, topo: 780},
    apagar1: 106, // ← 100: depois de "um pastor que achou um anel."
    legendas: [
      {texto: 'era só girar na mão', de: 164, apaga: 194, tamanho: 40, topo: 1400}, // ← 175
      {texto: 'e o que ele fez', de: 204, apaga: 232, tamanho: 32, topo: 1400}, // ← 225: "E o que o cara fez?"
    ],
  },

  // ─── o vão principal: os crimes acontecem dentro ───
  vao: {
    abre: 240,
    fecha: 391, // o segundo giro fecha o vão em 0390; ele não reabre
    paralaxe: {de: 240, ate: 390},
    tamanho: 56,
    linhas: [
      {texto: 'entrou no palácio', de: 246, risco: 306, dy: -90}, // ← 265 / ← 300
      {texto: 'matou o rei', de: 309, risco: 327, dy: 0}, // ← 340
      {texto: 'tomou o lugar', de: 330, risco: 354, dy: 90}, // ← 380
    ],
  },

  // ─── 1 · a página ───
  pagina: {
    virada: 390,
    gigante: {texto: 'PLATÃO', de: 407, tamanho: 440, esquerda: 330, topo: 1350, opacidade: 0.12}, // ← 420
    hero2: {linhas: ['SE NINGUÉM', 'TE VISSE'], de: 480, tamanho: 110, topo: 560},
    hero3: {linhas: ['VOCÊ AINDA', 'SERIA BOM?'], de: 532, tamanho: 110, topo: 850}, // ← 560: em "você continuaria"
    // PARE TUDO por 45 frames. A voz volta dentro dela ("Ou você só é decente…", em 0619).
    parada: {de: 620, ate: 665},
    legenda: {texto: 'ou só porque tem gente olhando', de: 692, topo: 1250}, // ← 690
    esvazia: 719, // a página limpa antes do anel voltar
    // a paralaxe dos três vãos: a página vai 6 px para a direita
    paralaxe: {de: 841, ate: 972},
  },

  // ─── na frente do anel ───
  frente: {
    hero4: {linhas: ['O ANEL', 'EXISTE'], de: 779, apaga: 810, tamanho: 150, topo: 735}, // ← 760: em "o anel existe"
    hero5: {linhas: ['VOCÊ JÁ', 'SABE'], de: 1010, tamanho: 120, topo: 768},
    faixa: 1050, // só no Instagram
  },

  // ─── MULTIPLICAR: três anéis, três vãos ───
  multiplicar: {
    divide: 818, // ← 800: depois de "o anel existe."
    espalha: 20,
    volta: 969, // ← 985: convergem e se fundem em 0992
    converge: 23,
    raio: 170,
    traco: 0.75,
    destinos: [
      {x: 300, y: 640},
      {x: 780, y: 980},
      {x: 330, y: 1330},
    ],
    giro: [
      {f: 818, giro: 2},
      {f: 960, giro: 2}, // os três giram para o perfil ao mesmo tempo
      {f: 972, giro: 2.5},
      {f: 992, giro: 3},
    ] as Quadro[],
    tamanho: 46,
    vaos: [
      {abre: 841, linhas: ['comentário', 'anônimo']}, // ← 840
      {abre: 881, linhas: ['perfil fake']}, // ← 875
      {abre: 922, linhas: ['trânsito']}, // ← 910
    ],
    fecham: 972, // os três giram para o perfil em 0960–0972 e ficam fechados
    paralaxe: {de: 841, ate: 972},
  },

  faixa: {altura: 150, tamanho: 22},

  // ─── Áudio ───
  audio: {
    narracao: 'audio/reel06.mp3',
    // nível = pico da trilha em dBFS (o arquivo, o mesmo dos outros Reels, tem pico em -16 dBFS)
    trilha: {
      arquivo: 'audio/trilha.mp3',
      de: 390,
      ate: 1080,
      db: -20,
      picoDoArquivo: -16,
      duckingDb: -3,
      ataque: 2,
      release: 12,
      silencio: {de: 620, ate: 665, db: -32, rampa: 3},
    },
    roomtone: {arquivo: 'sfx/roomtone.mp3', de: 0, ate: 390, db: -30, fadeDe: 370, fadeAte: 388},
    // alternar as três canetas é obrigatório. Nenhum whoosh.
    efeitos: [
      {frame: 20, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 113, arquivo: 'sfx/caneta-b.mp3', db: -24}, // o anel desenhando
      {frame: 164, arquivo: 'sfx/caneta-c.mp3', db: -26}, // o primeiro giro
      {frame: 306, arquivo: 'sfx/caneta-a.mp3', db: -24}, // os três riscos
      {frame: 327, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 354, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 384, arquivo: 'sfx/caneta-a.mp3', db: -22}, // o vão fechando, seco
      {frame: 390, arquivo: 'sfx/pagina.mp3', db: -22},
      {frame: 480, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 532, arquivo: 'sfx/caneta-c.mp3', db: -24},
      // 0620–0665: nada
      {frame: 779, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 818, arquivo: 'sfx/caneta-b.mp3', db: -26}, // a multiplicação
      {frame: 841, arquivo: 'sfx/caneta-c.mp3', db: -24},
      {frame: 881, arquivo: 'sfx/caneta-a.mp3', db: -24},
      {frame: 922, arquivo: 'sfx/caneta-b.mp3', db: -24},
      {frame: 960, arquivo: 'sfx/caneta-c.mp3', db: -22}, // os três fechando juntos
      {frame: 1010, arquivo: 'sfx/caneta-a.mp3', db: -24},
      // 1080: nada
    ] as Efeito[],
  },

  // ─── Capa 1x1 ───
  capa: {
    margem: 0.15,
    anel: {x: 540, y: 330, raio: 175, traco: 1.2},
    hero: {texto: 'VOCÊ AINDA SERIA BOM?', tamanho: 74, topo: 555},
    sub: {texto: 'o anel de Giges', tamanho: 28, topo: 670},
    faixa: {topo: 800, altura: 118, tamanho: 22},
  },
} as const;

export type Reel = typeof reel06;
export type BlocoId = (typeof reel06.blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => reel06.blocos.find((b) => b.id === id)?.de ?? 0;
