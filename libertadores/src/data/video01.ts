// VÍDEO 01 · "Libertadores 2026 — o que esperar das semifinais" · 200,3 s · 6009 frames · 30 fps
// Cada frame foi medido na narração tratada (public/audio/video01.mp3): os cortes caem nas
// pausas; as entradas sincronizadas (setas, zonas, textos) caem na palavra.
// Cores: no bloco Fluminense × Palmeiras, Palmeiras de branco; no bloco Estudiantes ×
// Flamengo, Estudiantes de branco (regra de conflito do brief), e isso vale o vídeo inteiro.
import type {Pt} from '../lib/formato';
import type {DadosVideo} from './tipos';

const p = (x: number, y: number): Pt => ({x, y});
const ret = (x0: number, y0: number, x1: number, y1: number): Pt[] => [p(x0, y0), p(x1, y0), p(x1, y1), p(x0, y1)];
const FP = 'fluminense|palmeiras';
const EF = 'estudiantes|flamengo';

export const video01: DadosVideo = {
  id: 'video01',
  titulo: 'Libertadores 2026 — o que esperar das semifinais',
  duracao: 6009,
  narracao: 'audio/video01.mp3',
  trilha: null, // ← arquivo de trilha não recebido
  // trechos com voz, medidos (guiam o ducking da trilha)
  fala: [[0,64],[76,130],[143,230],[234,283],[301,342],[350,388],[394,428],[436,546],[556,637],[665,718],[731,744],[750,778],[797,819],[823,884],[902,960],[969,1014],[1023,1108],[1112,1116],[1131,1150],[1154,1222],[1235,1280],[1287,1349],[1364,1426],[1432,1450],[1454,1480],[1488,1583],[1597,1634],[1646,1733],[1749,1822],[1830,1919],[1923,1928],[1939,1980],[1989,2000],[2004,2030],[2037,2090],[2110,2154],[2164,2256],[2266,2356],[2367,2472],[2484,2584],[2600,2656],[2664,2693],[2701,2768],[2786,2837],[2849,2926],[2940,3030],[3036,3072],[3086,3153],[3162,3200],[3207,3273],[3290,3357],[3373,3492],[3500,3551],[3570,3629],[3638,3716],[3729,3824],[3838,3965],[3977,3990],[3998,4055],[4062,4070],[4075,4133],[4146,4189],[4198,4304],[4308,4312],[4323,4411],[4420,4528],[4532,4536],[4548,4568],[4576,4639],[4650,4752],[4769,4885],[4901,4960],[4975,5065],[5080,5209],[5230,5320],[5327,5363],[5375,5452],[5456,5481],[5491,5558],[5575,5618],[5629,5698],[5702,5723],[5727,5766],[5783,5867],[5873,5922],[5930,6002]] as [number, number][],
  cenas: [
    {tipo: 'cartela', frame: 0, titulo: 'LIBERTADORES 2026', sub: 'o que esperar das semifinais'},
    {tipo: 'broll', frame: 140, arquivo: 'broll/estadio-noturno.mp4'}, // ← 150
    {
      tipo: 'campo',
      frame: 232, // ← 300: "…pela qualidade individual. Em confrontos equilibrados, a organização tática, o controle emocional e a capacidade de corrigir…"
      time: 'neutro',
      linhas: {x: [0.28, 0.5, 0.72], aparecem: [360, 403, 444]},
      texto: {linhas: ['180 MINUTOS'], frame: 514}, // ← 540: na palavra "180"
    },

    // ─── Fluminense × Palmeiras ───
    {tipo: 'confronto', frame: 660, casa: 'fluminense', fora: 'palmeiras', rotulo: 'POSSE CONTRA EFICIÊNCIA'},
    {tipo: 'broll', frame: 788, arquivo: 'broll/maracana-lotado.mp4'}, // ← 780
    {
      tipo: 'campo',
      frame: 895, // ← 900: "A equipe deve buscar a saída curta, aproximar os meio-campistas e usar os laterais…"
      time: 'fluminense',
      confronto: FP,
      mostrar: [3, 4, 5, 8, 10, 2, 6],
      pos: {3: p(0.16, 0.64), 4: p(0.16, 0.36), 5: p(0.27, 0.5), 8: p(0.4, 0.68), 10: p(0.4, 0.32), 2: p(0.24, 0.9), 6: p(0.24, 0.1)},
      setas: [
        // saída curta: zagueiros e volante, passes curtos entre si
        {de: 't4', para: 't5', frame: 948, tipo: 'passe', curva: 0.8},
        {de: 't5', para: 't3', frame: 960, tipo: 'passe', curva: 0.8},
        // os laterais sobem
        {de: 't2', para: p(0.56, 0.93), frame: 1030, tipo: 'movimento', curva: -0.7},
        {de: 't6', para: p(0.56, 0.07), frame: 1038, tipo: 'movimento', curva: 0.7},
      ],
      movimentos: [
        // "aproximar os meio-campistas"
        {quem: 't8', para: p(0.33, 0.6), frame: 988},
        {quem: 't10', para: p(0.33, 0.4), frame: 992},
      ],
    },
    {
      tipo: 'campo',
      frame: 1128, // ← 1140: "O Palmeiras provavelmente aceitará período sem a bola, mas tentará fechar o centro e induzir…"
      time: 'palmeiras',
      confronto: FP,
      formacao: 'bloco',
      mostrar: [7, 5, 8, 11, 10, 9],
      adversario: {time: 'fluminense', jogadores: {4: p(0.66, 0.42)}},
      zonas: [{pontos: ret(0.28, 0.34, 0.52, 0.66), frame: 1257, cor: 'time'}], // "fechar o centro"
      setas: [{de: 't10', para: p(0.6, 0.18), frame: 1293, tipo: 'movimento', curva: 1.1}], // "induzir… a jogar por fora"
    },
    {
      tipo: 'campo',
      frame: 1360, // ← 1350: "A intenção será recuperar a posse e acelerar imediatamente, explorando os espaços deixados pelos laterais tricolores."
      time: 'palmeiras',
      confronto: FP,
      mostrar: [5, 7, 9, 11],
      pos: {5: p(0.38, 0.5), 7: p(0.47, 0.8), 9: p(0.52, 0.52), 11: p(0.47, 0.2)},
      adversario: {time: 'fluminense', jogadores: {2: p(0.42, 0.1), 6: p(0.42, 0.9)}},
      destaques: [{quem: 't5', frame: 1396}],
      setas: [
        {de: 't5', para: p(0.76, 0.86), frame: 1442, tipo: 'passe', curva: 0.6},
        {de: 't11', para: p(0.78, 0.12), frame: 1454, tipo: 'movimento', curva: -0.6},
      ],
      zonas: [
        {pontos: ret(0.54, 0, 0.86, 0.26), frame: 1509, cor: 'perigo'},
        {pontos: ret(0.54, 0.74, 0.86, 1), frame: 1509, cor: 'perigo'},
      ],
    },
    {tipo: 'cartela', frame: 1592, titulo: 'ATACAR SEM SE DESORGANIZAR?'}, // a pergunta lida pela narração inteira
    {
      tipo: 'campo',
      frame: 1742, // ← 1740: "Se perder a bola com muitos jogadores à frente… Se for cauteloso demais…"
      time: 'fluminense',
      confronto: FP,
      mostrar: [3, 4, 2, 6, 8, 10, 7, 9],
      pos: {3: p(0.38, 0.62), 4: p(0.38, 0.38), 2: p(0.6, 0.9), 6: p(0.6, 0.1), 8: p(0.62, 0.62), 10: p(0.64, 0.36), 7: p(0.74, 0.8), 9: p(0.76, 0.48)},
      zonas: [{pontos: ret(0.08, 0.02, 0.54, 0.98), frame: 1800, cor: 'perigo', ate: 1938}],
      // "Se for cauteloso demais": os seis recuam
      movimentos: [
        {quem: 't2', para: p(0.36, 0.88), frame: 1938},
        {quem: 't6', para: p(0.36, 0.12), frame: 1938},
        {quem: 't8', para: p(0.45, 0.62), frame: 1938},
        {quem: 't10', para: p(0.45, 0.38), frame: 1938},
        {quem: 't7', para: p(0.53, 0.8), frame: 1938},
        {quem: 't9', para: p(0.56, 0.5), frame: 1938},
      ],
    },
    {tipo: 'broll', frame: 1986, arquivo: 'broll/contra-ataque.mp4'}, // ← 1950

    {tipo: 'cartela', frame: 2100, titulo: 'DUELOS IMPORTANTES'},
    {
      tipo: 'duelo',
      frame: 2160, // ← 2190: "Laterais do Fluminense contra os pontas palmeirenses."
      time: 'fluminense',
      confronto: FP,
      mostrar: [2, 6, 3, 4],
      pos: {2: p(0.3, 0.88), 6: p(0.3, 0.12), 3: p(0.2, 0.62), 4: p(0.2, 0.38)},
      adversario: {time: 'palmeiras', jogadores: {11: p(0.37, 0.84), 7: p(0.37, 0.16), 9: p(0.3, 0.5)}},
      pares: [
        ['t2', 'a11'],
        ['t6', 'a7'],
      ],
      contexto: ['t3', 't4', 'a9'],
      rotulo: 'LATERAIS × PONTAS',
    },
    {
      tipo: 'duelo',
      frame: 2263, // ← 2310: "Volantes na disputa pelo controle do corredor central."
      time: 'fluminense',
      confronto: FP,
      mostrar: [5, 8, 10],
      pos: {5: p(0.42, 0.5), 8: p(0.5, 0.64), 10: p(0.5, 0.36)},
      adversario: {time: 'palmeiras', jogadores: {10: p(0.46, 0.44), 5: p(0.55, 0.58), 8: p(0.56, 0.4)}},
      pares: [
        ['t5', 'a10'],
        ['t8', 'a5'],
      ],
      contexto: ['t10', 'a8'],
      rotulo: 'VOLANTES NO CORREDOR CENTRAL',
    },
    {
      tipo: 'duelo',
      frame: 2363, // ← 2370: "E a zaga tricolor protegendo a profundidade nas transições."
      time: 'fluminense',
      confronto: FP,
      mostrar: [3, 4, 5],
      pos: {3: p(0.27, 0.6), 4: p(0.27, 0.4), 5: p(0.42, 0.5)},
      adversario: {time: 'palmeiras', jogadores: {9: p(0.34, 0.44), 10: p(0.37, 0.64)}},
      pares: [
        ['t4', 'a9'],
        ['t3', 'a10'],
      ],
      contexto: ['t5'],
      setas: [{de: 'a9', para: p(0.12, 0.42), frame: 2400, tipo: 'movimento', curva: 0.5}],
      rotulo: 'ZAGA × PROFUNDIDADE',
    },
    {
      tipo: 'campo',
      frame: 2481, // ← 2490: "O Palmeiras não precisa dominar a posse para controlar a partida…"
      time: 'palmeiras',
      confronto: FP,
      formacao: 'bloco',
      mostrar: [2, 3, 4, 6, 7, 5, 8, 11],
      texto: {linhas: ['CONTROLAR SEM A BOLA'], frame: 2560},
    },

    // ─── Estudiantes × Flamengo ───
    {tipo: 'confronto', frame: 2783, casa: 'estudiantes', fora: 'flamengo', rotulo: 'PRESSÃO CONTRA CONSTRUÇÃO'}, // ← 2790
    {tipo: 'broll', frame: 2936, arquivo: 'broll/estudiantes-pressao.mp4'}, // ← 2910
    {
      tipo: 'campo',
      frame: 3033, // ← 3060: "…e emocional. A equipe argentina pode pressionar a saída…"
      time: 'estudiantes',
      confronto: EF,
      mostrar: [9, 10, 11, 7],
      pos: {9: p(0.72, 0.5), 10: p(0.66, 0.36), 11: p(0.7, 0.2), 7: p(0.7, 0.78)},
      adversario: {time: 'flamengo', jogadores: {1: p(0.975, 0.5), 3: p(0.88, 0.38), 4: p(0.88, 0.62), 5: p(0.8, 0.5)}},
      pressoes: [{alvo: 'a3', quem: ['t9', 't10', 't11'], frame: 3128}],
    },
    {
      tipo: 'campo',
      frame: 3285, // ← 3300: "O Flamengo terá de construir com paciência. Seus zagueiros e volantes… linhas de passe constantes…"
      time: 'flamengo',
      confronto: EF,
      mostrar: [3, 4, 5, 8, 10, 2, 6],
      pos: {3: p(0.18, 0.64), 4: p(0.18, 0.36), 5: p(0.3, 0.5), 8: p(0.36, 0.68), 10: p(0.36, 0.32), 2: p(0.3, 0.9), 6: p(0.3, 0.1)},
      movimentos: [{quem: 't5', para: p(0.16, 0.5), frame: 3381}], // o volante baixa entre os zagueiros
      setas: [
        {de: 't5', para: 't3', frame: 3432, tipo: 'passe', curva: 0.8},
        {de: 't3', para: 't8', frame: 3442, tipo: 'passe', curva: 0.8},
        {de: 't8', para: 't5', frame: 3452, tipo: 'passe', curva: 0.8},
        {de: 't5', para: 't4', frame: 3466, tipo: 'passe', curva: -0.8},
        {de: 't4', para: 't10', frame: 3476, tipo: 'passe', curva: -0.8},
        {de: 't10', para: 't5', frame: 3486, tipo: 'passe', curva: -0.8},
      ],
    },
    {tipo: 'broll', frame: 3633, arquivo: 'broll/flamengo-saida.mp4'}, // ← 3570: "…encontrará espaço para atacar a defesa argentina."
    {
      tipo: 'campo',
      frame: 3725, // ← 3720: "O problema aparecerá quando o Flamengo perder a bola no meio-campo. O Estudiantes é perigoso quando recupera…"
      time: 'flamengo',
      confronto: EF,
      mostrar: [3, 4, 5, 8, 10],
      pos: {3: p(0.32, 0.62), 4: p(0.32, 0.38), 5: p(0.48, 0.5), 8: p(0.57, 0.64), 10: p(0.57, 0.36)},
      adversario: {time: 'estudiantes', jogadores: {10: p(0.52, 0.45), 9: p(0.4, 0.55)}},
      zonas: [{pontos: ret(0.25, 0.32, 0.56, 0.68), frame: 3792, cor: 'perigo'}],
      destaques: [{quem: 'a10', frame: 3880}],
    },
    {
      tipo: 'campo',
      frame: 3972, // ← 3900: "Por isso, a reação imediata após a perda será tão importante quanto a própria posse."
      time: 'flamengo',
      confronto: EF,
      mostrar: [5, 8, 10, 9],
      pos: {5: p(0.44, 0.54), 8: p(0.57, 0.66), 10: p(0.57, 0.36), 9: p(0.64, 0.5)},
      adversario: {time: 'estudiantes', jogadores: {10: p(0.51, 0.47), 8: p(0.42, 0.28)}},
      pressoes: [{alvo: 'a10', quem: ['t5', 't8', 't10'], frame: 4004}],
    },

    {tipo: 'cartela', frame: 4140, titulo: 'DUELOS IMPORTANTES'},
    {
      tipo: 'duelo',
      frame: 4195, // ← 4200: "Volantes do Flamengo contra a pressão dos meio-campistas argentinos."
      time: 'flamengo',
      confronto: EF,
      mostrar: [5, 8, 10],
      pos: {5: p(0.4, 0.46), 8: p(0.46, 0.62), 10: p(0.53, 0.34)},
      adversario: {time: 'estudiantes', jogadores: {8: p(0.44, 0.4), 10: p(0.51, 0.62), 5: p(0.57, 0.48)}},
      pares: [
        ['t5', 'a8'],
        ['t8', 'a10'],
      ],
      contexto: ['t10', 'a5'],
      rotulo: 'VOLANTES × MEIO-CAMPISTAS',
    },
    {
      tipo: 'duelo',
      frame: 4306, // ← 4320: "Pontas rubro-negros contra os laterais do Estudiantes."
      time: 'flamengo',
      confronto: EF,
      mostrar: [7, 11, 9],
      pos: {7: p(0.7, 0.86), 11: p(0.7, 0.14), 9: p(0.76, 0.5)},
      adversario: {time: 'estudiantes', jogadores: {6: p(0.75, 0.88), 2: p(0.75, 0.12), 3: p(0.83, 0.4), 4: p(0.83, 0.6)}},
      pares: [
        ['t7', 'a6'],
        ['t11', 'a2'],
      ],
      contexto: ['t9', 'a3', 'a4'],
      rotulo: 'PONTAS × LATERAIS',
    },
    {
      tipo: 'duelo',
      frame: 4416, // ← 4410: "E a bola aérea defensiva do Flamengo contra os atacantes argentinos."
      time: 'flamengo',
      confronto: EF,
      recorte: {x0: -0.02, y0: 0.18, lado: 0.64},
      mostrar: [1, 3, 4],
      pos: {1: p(0.012, 0.5), 3: p(0.07, 0.6), 4: p(0.07, 0.42)},
      adversario: {time: 'estudiantes', jogadores: {9: p(0.1, 0.45), 11: p(0.11, 0.62)}},
      pares: [
        ['t4', 'a9'],
        ['t3', 'a11'],
      ],
      contexto: ['t1'],
      rotulo: 'BOLA AÉREA × ATACANTES',
    },
    {tipo: 'broll', frame: 4530, arquivo: 'broll/flamengo-na-area.mp4'}, // cabeceio não recebido: o lance do Flamengo na área
    {
      tipo: 'campo',
      frame: 4645, // ← 4650: "Mas controlar o jogo não significa atacar de qualquer maneira… equilibrar agressividade e proteção defensiva."
      time: 'flamengo',
      confronto: EF,
      mostrar: [3, 4, 5, 8, 10, 7, 9, 11],
      pos: {3: p(0.4, 0.62), 4: p(0.4, 0.38), 5: p(0.5, 0.5), 8: p(0.62, 0.64), 10: p(0.64, 0.36), 7: p(0.78, 0.86), 9: p(0.82, 0.5), 11: p(0.78, 0.14)},
      setas: [
        {de: 't7', para: p(0.93, 0.78), frame: 4705, tipo: 'movimento', curva: -0.6},
        {de: 't10', para: p(0.88, 0.38), frame: 4713, tipo: 'movimento', curva: 0.6},
      ],
      destaques: [
        {quem: 't3', frame: 4776},
        {quem: 't4', frame: 4776},
        {quem: 't5', frame: 4776},
      ],
      texto: {linhas: ['PROTAGONISMO COM PROTEÇÃO'], frame: 4835},
    },

    // ─── como sair jogando ───
    {tipo: 'cartela', frame: 4893, titulo: 'COMO SAIR JOGANDO?'},
    {
      tipo: 'campo',
      frame: 4968, // ← 4980: "A saída de bola… O Fluminense tentará atrair a pressão e criar espaços com movimentação curta."
      time: 'fluminense',
      confronto: FP,
      mostrar: [1, 3, 4, 5, 8],
      pos: {1: p(0.04, 0.5), 3: p(0.12, 0.66), 4: p(0.12, 0.34), 5: p(0.22, 0.5), 8: p(0.3, 0.66)},
      adversario: {time: 'palmeiras', jogadores: {9: p(0.3, 0.42), 10: p(0.33, 0.6)}},
      setas: [
        {de: 'a9', para: 't4', frame: 5110, tipo: 'movimento', curva: -0.5},
        {de: 'a10', para: 't3', frame: 5118, tipo: 'movimento', curva: 0.5},
        {de: 't4', para: 't5', frame: 5170, tipo: 'passe', curva: 0.8},
        {de: 't5', para: 't8', frame: 5182, tipo: 'passe', curva: 0.8},
      ],
    },
    {
      tipo: 'campo',
      frame: 5225, // ← 5160: "O Palmeiras poderá responder bloqueando o passe por dentro e forçando a bola longa."
      time: 'palmeiras',
      confronto: FP,
      mostrar: [9, 10, 8],
      pos: {9: p(0.8, 0.46), 10: p(0.74, 0.56), 8: p(0.7, 0.38)},
      adversario: {time: 'fluminense', jogadores: {1: p(0.975, 0.5), 3: p(0.88, 0.36), 4: p(0.88, 0.64), 5: p(0.78, 0.5)}},
      zonas: [{pontos: ret(0.74, 0.4, 0.86, 0.6), frame: 5282, cor: 'time'}],
      setas: [{de: 'a3', para: p(0.42, 0.18), frame: 5336, tipo: 'passe', curva: 0.7}],
    },
    {
      tipo: 'campo',
      frame: 5370, // ← 5340: "O Flamengo deve procurar superioridade numérica desde a defesa, com os volantes se aproximando dos zagueiros."
      time: 'flamengo',
      confronto: EF,
      mostrar: [3, 4, 5, 8],
      pos: {3: p(0.13, 0.66), 4: p(0.13, 0.34), 5: p(0.32, 0.56), 8: p(0.32, 0.42)},
      adversario: {time: 'estudiantes', jogadores: {9: p(0.22, 0.28), 11: p(0.22, 0.72)}},
      setas: [
        {de: 't5', para: p(0.19, 0.53), frame: 5496, tipo: 'movimento', curva: 0.5},
        {de: 't8', para: p(0.24, 0.44), frame: 5502, tipo: 'movimento', curva: -0.5},
      ],
      movimentos: [
        {quem: 't5', para: p(0.19, 0.5), frame: 5500},
        {quem: 't8', para: p(0.25, 0.42), frame: 5506},
      ],
    },
    {
      tipo: 'campo',
      frame: 5572, // ← 5520: "Os Estudiantes, por outro lado, pode tentar encurtar o campo e transformar cada erro em uma oportunidade de ataque."
      time: 'estudiantes',
      confronto: EF,
      mostrar: [2, 3, 4, 6, 7, 5, 8, 11],
      pos: {2: p(0.3, 0.82), 3: p(0.3, 0.62), 4: p(0.3, 0.38), 6: p(0.3, 0.18), 7: p(0.45, 0.8), 5: p(0.45, 0.58), 8: p(0.45, 0.42), 11: p(0.45, 0.2)},
      linhas: {x: [0.3, 0.45, 0.62], aparecem: [5580, 5583, 5586], mover: {x: [0.42, 0.53, 0.64], frame: 5640}},
      movimentos: [
        ...([2, 3, 4, 6] as const).map((n) => ({quem: `t${n}` as const, para: p(0.42, {2: 0.82, 3: 0.62, 4: 0.38, 6: 0.18}[n]), frame: 5640})),
        ...([7, 5, 8, 11] as const).map((n) => ({quem: `t${n}` as const, para: p(0.53, {7: 0.8, 5: 0.58, 8: 0.42, 11: 0.2}[n]), frame: 5640})),
      ],
      setas: [{de: 't8', para: p(0.76, 0.46), frame: 5712, tipo: 'passe', curva: 0.6}],
    },
    {
      tipo: 'campo',
      frame: 5780, // ← 5700: "A equipe que conseguir sair da pressão com qualidade terá mais controle territorial…"
      time: 'neutro',
      texto: {linhas: ['QUEM SAI DA PRESSÃO,', 'CONTROLA O JOGO'], frame: 5790},
    },
    {tipo: 'fecho', frame: 5927}, // ← 5940
  ],
};
