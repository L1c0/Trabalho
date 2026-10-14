// VÍDEO 02 · "Ocupação dos espaços" · 213,2 s de narração (+2 s de fecho) · 30 fps
// Cada frame foi medido na narração tratada (public/audio/video02.mp3): os cortes caem nas
// pausas; as entradas sincronizadas (setas, rótulos, legendas) caem na palavra.
import type {Pt} from '../lib/formato';
import type {DadosVideo} from './tipos';

const p = (x: number, y: number): Pt => ({x, y});
const ret = (x0: number, y0: number, x1: number, y1: number): Pt[] => [p(x0, y0), p(x1, y0), p(x1, y1), p(x0, y1)];

// bola parada: a "área ampliada" (só a metade da área do lado do escanteio + a pequena área)
const AREA_ATAQUE = {x0: 0.4, y0: 0.38, lado: 0.62};
const AREA_DEFESA = {x0: -0.02, y0: 0.38, lado: 0.62};
// defesa da bola parada: os mesmos 8 em todas as telas da sequência
const defesaBolaParada = {
  time: 'neutro' as const,
  recorte: AREA_DEFESA,
  mostrar: [2, 3, 4, 5],
  pos: {2: p(0.012, 0.57), 3: p(0.07, 0.6), 4: p(0.06, 0.5), 5: p(0.085, 0.44)},
  adversario: {time: 'adversario' as const, jogadores: {7: p(0.004, 0.985), 9: p(0.05, 0.47), 4: p(0.09, 0.62), 5: p(0.11, 0.43)}},
};

export const video02: DadosVideo = {
  id: 'video02',
  titulo: 'Ocupação dos espaços',
  duracao: 6456, // ← 6396: a voz vai até 6383; o fecho ganha 2 s depois dela
  narracao: 'audio/video02.mp3',
  trilha: null, // ← arquivo de trilha não recebido
  // trechos com voz, medidos (guiam o ducking da trilha)
  fala: [[0,49],[65,129],[144,206],[214,268],[276,340],[359,396],[413,471],[489,546],[550,576],[595,673],[686,780],[793,863],[870,894],[911,1042],[1051,1132],[1150,1197],[1212,1263],[1268,1317],[1329,1385],[1390,1440],[1445,1481],[1495,1521],[1529,1620],[1624,1628],[1640,1757],[1772,1898],[1904,1949],[1961,1995],[2001,2093],[2097,2153],[2170,2222],[2237,2262],[2266,2344],[2350,2403],[2417,2532],[2541,2617],[2631,2702],[2706,2744],[2762,2824],[2837,2874],[2878,2897],[2911,2953],[2968,3025],[3037,3126],[3141,3188],[3201,3290],[3299,3364],[3377,3428],[3433,3484],[3498,3562],[3567,3616],[3626,3677],[3685,3740],[3752,3840],[3855,3937],[3951,4027],[4040,4130],[4147,4183],[4196,4282],[4297,4354],[4369,4374],[4378,4442],[4451,4508],[4518,4574],[4578,4583],[4593,4635],[4644,4663],[4667,4675],[4684,4718],[4722,4849],[4872,4909],[4923,5027],[5041,5075],[5080,5118],[5122,5161],[5179,5245],[5249,5300],[5311,5403],[5412,5461],[5476,5576],[5580,5607],[5621,5668],[5673,5706],[5711,5738],[5742,5769],[5775,5779],[5792,5876],[5880,5886],[5896,5937],[5941,6001],[6012,6047],[6052,6077],[6086,6112],[6127,6188],[6202,6232],[6238,6245],[6249,6266],[6282,6300],[6312,6334],[6339,6384]] as [number, number][],
  cenas: [
    {tipo: 'cartela', frame: 0, titulo: 'OCUPAÇÃO DOS ESPAÇOS'},

    // ─── a formação anunciada × a formação jogada ───
    {
      tipo: 'campo',
      frame: 60, // ← 90: "Não basta observar a formação inicial."
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // os 11: o desenho da formação precisa do time inteiro
      transformacoes: [
        {para: '4-4-2', frame: 214}, // ← 210: "…pode [pausa] defender em 4-4-2"
        {para: '3-ultima-linha', frame: 272}, // ← 330: "…e [pausa] atacar com três jogadores na última linha"
      ],
      legenda: [
        {texto: '4-3-3', frame: 186}, // na palavra "4-3-3"
        {texto: '4-4-2', frame: 214},
        {texto: '3 NA ÚLTIMA LINHA', frame: 272},
      ],
      texto: {linhas: ['A FORMAÇÃO ANUNCIADA', 'NÃO É A FORMAÇÃO JOGADA'], frame: 349}, // ← 420
    },
    // item 1: "os laterais avançam ao mesmo tempo"
    {
      tipo: 'campo',
      frame: 405, // ← 510
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [2, 3, 4, 5, 6],
      setas: [
        {de: 't2', para: p(0.6, 0.92), frame: 418, tipo: 'movimento', curva: -0.8},
        {de: 't6', para: p(0.6, 0.08), frame: 424, tipo: 'movimento', curva: 0.8},
      ],
      zonas: [
        {pontos: ret(0.12, 0.74, 0.4, 1), frame: 452, cor: 'perigo'},
        {pontos: ret(0.12, 0, 0.4, 0.26), frame: 452, cor: 'perigo'},
      ],
    },
    // item 2: "se os pontas permanecem abertos ou entram por dentro"
    {
      tipo: 'campo',
      frame: 482, // ← 600
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [7, 8, 9, 10, 11],
      destaques: [
        {quem: 't7', frame: 500, ate: 559},
        {quem: 't11', frame: 500, ate: 559},
      ],
      movimentos: [
        {quem: 't7', para: p(0.7, 0.66), frame: 559},
        {quem: 't11', para: p(0.7, 0.34), frame: 559},
      ],
    },
    // item 3: "se os meias ocupam o espaço entre as linhas"
    {
      tipo: 'campo',
      frame: 588, // ← 690
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [8, 9, 10],
      linhas: {x: [0.4, 0.58, 0.76], aparecem: [590, 594, 598], pisca: 648},
      movimentos: [
        {quem: 't10', para: p(0.58, 0.4), frame: 608},
        {quem: 't8', para: p(0.58, 0.6), frame: 612},
      ],
    },
    // item 4: "se há cobertura quando um defensor abandona sua posição"
    {
      tipo: 'campo',
      frame: 680, // ← 780
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [2, 3, 4, 5, 6],
      movimentos: [
        {quem: 't4', para: p(0.36, 0.32), frame: 738},
        {quem: 't3', para: p(0.21, 0.44), frame: 760},
      ],
      setas: [{de: 't3', para: p(0.21, 0.42), frame: 758, tipo: 'movimento', curva: 0.6}],
    },
    // item 5: "e se o centroavante participa da construção, ou fica isolado"
    {
      tipo: 'campo',
      frame: 788, // ← 870
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [7, 8, 9, 10, 11],
      setas: [
        {de: 't9', para: 't8', frame: 822, tipo: 'passe', curva: 0.8, ate: 882},
        {de: 't9', para: 't10', frame: 832, tipo: 'passe', curva: -0.8, ate: 882},
      ],
      opacidades: [
        {quem: 'todos', exceto: ['t9'], valor: 0.15, frame: 882}, // "…ou fica isolado"
        {quem: 'todos', valor: 1, frame: 960}, // "…algumas equipes conseguem criar superioridade"
      ],
      destaques: [{quem: 't9', frame: 882, ate: 960}],
    },
    {tipo: 'broll', frame: 1047, arquivo: 'broll/jogada-coletiva.mp4'}, // ← 1020

    // ─── pressão e transições ───
    {tipo: 'cartela', frame: 1141, titulo: 'PRESSÃO E TRANSIÇÕES'},
    {tipo: 'broll', frame: 1205, arquivo: 'broll/pressao-alta.mp4'}, // ← 1620: "A reação após a perda da bola pode decidir as semifinais."
    {
      tipo: 'campo',
      frame: 1323, // ← 1230: "Se o time pressionar imediatamente…"
      time: 'neutro',
      mostrar: [7, 9, 10, 11],
      pos: {9: p(0.79, 0.52), 10: p(0.72, 0.4), 11: p(0.8, 0.22), 7: p(0.74, 0.72)},
      adversario: {time: 'adversario', jogadores: {4: p(0.86, 0.42), 3: p(0.9, 0.62), 1: p(0.98, 0.5)}},
      pressoes: [{alvo: 'a4', quem: ['t9', 't10', 't11'], frame: 1342}],
      destaques: [{quem: 't10', frame: 1412}], // "…recuperar a posse perto da área adversária"
    },
    {
      tipo: 'campo',
      frame: 1490, // ← 1440: "Se não conseguir, precisará recuar rapidamente e reorganizar suas linhas."
      time: 'neutro',
      mostrar: [2, 3, 4, 6, 5, 8, 10],
      pos: {2: p(0.5, 0.84), 3: p(0.5, 0.62), 4: p(0.5, 0.38), 6: p(0.5, 0.16), 8: p(0.63, 0.66), 5: p(0.63, 0.5), 10: p(0.63, 0.34)},
      linhas: {x: [0.5, 0.63, 0.78], aparecem: [1494, 1497, 1500], mover: {x: [0.2, 0.33, 0.48], frame: 1549}},
      movimentos: [
        ...([2, 3, 4, 6] as const).map((n) => ({quem: `t${n}` as const, para: p(0.2, {2: 0.84, 3: 0.62, 4: 0.38, 6: 0.16}[n]), frame: 1549})),
        ...([8, 5, 10] as const).map((n) => ({quem: `t${n}` as const, para: p(0.33, {8: 0.66, 5: 0.5, 10: 0.34}[n]), frame: 1549})),
      ],
    },
    {
      tipo: 'campo',
      frame: 1634, // ← 1740: "Palmeiras e Estudiantes tendem a valorizar bastante a transição ofensiva."
      time: 'palmeiras',
      mostrar: [10, 9],
      pos: {10: p(0.3, 0.3), 9: p(0.4, 0.14)},
      adversario: {time: 'estudiantes', jogadores: {10: p(0.3, 0.7), 9: p(0.4, 0.86)}},
      marcas: [
        {quem: 't10', texto: 'Palmeiras'},
        {quem: 'a10', texto: 'Estudiantes'},
      ],
      setas: [
        {de: 't10', para: p(0.8, 0.24), frame: 1712, tipo: 'passe', curva: -0.7},
        {de: 't9', para: p(0.84, 0.1), frame: 1718, tipo: 'movimento', curva: -0.5},
        {de: 'a10', para: p(0.8, 0.76), frame: 1712, tipo: 'passe', curva: 0.7},
        {de: 'a9', para: p(0.84, 0.9), frame: 1718, tipo: 'movimento', curva: 0.5},
      ],
    },
    {
      tipo: 'campo',
      frame: 1765, // ← 1860: "…evitar perdas perigosas no corredor central e nas costas dos laterais."
      time: 'neutro',
      mostrar: [2, 3, 4, 5, 6],
      pos: {2: p(0.48, 0.88), 6: p(0.48, 0.12), 3: p(0.22, 0.62), 4: p(0.22, 0.38), 5: p(0.36, 0.5)},
      zonas: [
        {pontos: ret(0.28, 0.36, 0.62, 0.64), frame: 1868, cor: 'perigo'},
        {pontos: ret(0.12, 0.74, 0.42, 1), frame: 1912, cor: 'perigo'},
        {pontos: ret(0.12, 0, 0.42, 0.26), frame: 1912, cor: 'perigo'},
      ],
    },
    {
      tipo: 'campo',
      frame: 1955, // ← 2040
      time: 'neutro',
      texto: {linhas: ['UM ERRO DE POSIÇÃO PESA MAIS', 'QUE DEZ MINUTOS DE POSSE'], frame: 2012},
    },

    // ─── bola parada ───
    {tipo: 'cartela', frame: 2165, titulo: 'A IMPORTÂNCIA DA BOLA PARADA'},
    {
      tipo: 'campo',
      frame: 2230, // ← 2310: "Escanteios, faltas, laterais e cobranças próximas da área…"
      time: 'neutro',
      recorte: AREA_ATAQUE,
      mostrar: [10, 4, 3, 9, 5],
      pos: {10: p(0.996, 0.988), 4: p(0.89, 0.47), 3: p(0.9, 0.6), 9: p(0.93, 0.53), 5: p(0.85, 0.66)},
      adversario: {time: 'adversario', jogadores: {2: p(0.985, 0.57), 4: p(0.945, 0.56), 5: p(0.93, 0.46)}},
      setas: [{de: 't10', para: p(0.94, 0.52), frame: 2262, tipo: 'passe', curva: 0.6}],
    },
    {tipo: 'broll', frame: 2412, arquivo: 'broll/estudiantes-na-area.mp4'}, // ← 2430: escanteio não recebido; Estudiantes atacando a área
    {
      tipo: 'campo',
      frame: 2532, // ← 2550: "…pela força física e pela agressividade na área. Palmeiras e Flamengo… decidir pelo alto."
      time: 'neutro',
      recorte: AREA_ATAQUE,
      mostrar: [10, 4, 3, 9, 5],
      pos: {10: p(0.996, 0.988), 4: p(0.89, 0.47), 3: p(0.9, 0.6), 9: p(0.93, 0.53), 5: p(0.85, 0.66)},
      adversario: {time: 'adversario', jogadores: {2: p(0.985, 0.57), 4: p(0.945, 0.56), 5: p(0.93, 0.46)}},
      destaques: [
        {quem: 't9', frame: 2556},
        {quem: 't3', frame: 2556},
      ],
      setas: [{de: 't10', para: 't9', frame: 2721, tipo: 'passe', curva: 0.6}],
    },
    {
      ...defesaBolaParada,
      tipo: 'duelo',
      frame: 2758, // ← 2550: "Na defesa, será necessário observar: marcação individual…"
      pares: [
        ['t4', 'a9'],
        ['t3', 'a4'],
        ['t5', 'a5'],
      ],
      contexto: [],
      ligarEm: 2846,
      semAneis: true,
      rotulo: 'MARCAÇÃO INDIVIDUAL',
    },
    {
      ...defesaBolaParada,
      tipo: 'duelo',
      frame: 2876, // ← 2670: "…ou por zona."
      pares: [],
      contexto: [],
      rotulo: 'MARCAÇÃO POR ZONA',
      zonas: [
        {pontos: ret(0, 0.52, 0.06, 0.66), frame: 2878, cor: 'time'},
        {pontos: ret(0, 0.42, 0.06, 0.52), frame: 2882, cor: 'time'},
        {pontos: ret(0.06, 0.4, 0.12, 0.66), frame: 2886, cor: 'time'},
      ],
    },
    {
      ...defesaBolaParada,
      tipo: 'duelo',
      frame: 2905, // ← 2790: "Quem protege a primeira trave?"
      pares: [],
      contexto: [],
      rotulo: 'PRIMEIRA TRAVE',
      destaques: [{quem: 't2', frame: 2912}],
    },
    {
      ...defesaBolaParada,
      tipo: 'duelo',
      frame: 2962, // ← 2880: "Como a equipe defende a segunda bola?"
      mostrar: [2, 3, 4, 5, 8],
      pos: {...defesaBolaParada.pos, 8: p(0.19, 0.52)},
      pares: [],
      contexto: [],
      rotulo: 'SEGUNDA BOLA',
      zonas: [{pontos: ret(0.155, 0.38, 0.25, 0.66), frame: 2972, cor: 'perigo'}],
    },
    {
      ...defesaBolaParada,
      tipo: 'duelo',
      frame: 3033, // ← 2970: "E se há jogadores preparados para impedir o contra-ataque?"
      mostrar: [2, 3, 4, 5, 7, 11],
      pos: {...defesaBolaParada.pos, 7: p(0.3, 0.86), 11: p(0.28, 0.56)},
      pares: [],
      contexto: [],
      rotulo: 'CONTRA-ATAQUE',
      setas: [{de: 't11', para: p(0.58, 0.62), frame: 3048, tipo: 'movimento', curva: -0.5}],
    },

    // ─── o papel dos treinadores ───
    {tipo: 'cartela', frame: 3134, titulo: 'O PAPEL DOS TREINADORES'},
    // B-ROLL "técnico na beira" (3150) não recebido: o campo entra já em "Os técnicos serão
    // avaliados… pela capacidade de corrigir o jogo", e a zona e as setas esperam suas palavras.
    {
      tipo: 'campo',
      frame: 3195, // ← 3270: "Se o adversário bloquear a saída, será preciso criar uma alternativa."
      time: 'neutro',
      mostrar: [3, 4, 5, 2],
      pos: {3: p(0.14, 0.64), 4: p(0.14, 0.36), 5: p(0.27, 0.5), 2: p(0.25, 0.9)},
      adversario: {time: 'adversario', jogadores: {9: p(0.25, 0.4), 10: p(0.29, 0.6)}},
      zonas: [{pontos: ret(0.18, 0.4, 0.34, 0.6), frame: 3392, cor: 'adversario'}],
      setas: [
        {de: 't3', para: 't2', frame: 3442, tipo: 'passe', curva: -0.6},
        {de: 't2', para: p(0.5, 0.94), frame: 3464, tipo: 'passe', curva: -0.4},
      ],
    },
    {
      tipo: 'campo',
      frame: 3490, // ← 3450: "Se os laterais estiverem sendo explorados, alguém terá de fazer a cobertura."
      time: 'neutro',
      mostrar: [2, 3, 4, 5],
      pos: {2: p(0.5, 0.88), 3: p(0.22, 0.62), 4: p(0.22, 0.38), 5: p(0.36, 0.5)},
      adversario: {time: 'adversario', jogadores: {11: p(0.34, 0.86)}},
      zonas: [{pontos: ret(0.12, 0.74, 0.42, 1), frame: 3508, cor: 'perigo'}],
      setas: [{de: 't5', para: p(0.26, 0.8), frame: 3578, tipo: 'movimento', curva: 0.6}],
      movimentos: [{quem: 't5', para: p(0.27, 0.78), frame: 3582}],
    },
    {
      tipo: 'campo',
      frame: 3622, // ← 3630: "Se o centroavante ficar isolado, os meias precisarão aproximar-se."
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [8, 9, 10],
      destaques: [{quem: 't9', frame: 3632, ate: 3696}],
      movimentos: [
        {quem: 't8', para: p(0.62, 0.58), frame: 3696},
        {quem: 't10', para: p(0.62, 0.42), frame: 3700},
      ],
    },
    {
      tipo: 'campo',
      frame: 3746, // ← 3780: "As substituições também podem mudar o desenho da partida."
      time: 'neutro',
      formacao: '4-3-3',
      mostrar: [5, 8, 10, 7, 9, 11, 19],
      pos: {19: p(0.66, 0.4)},
      saidas: [{quem: 't11', frame: 3764}],
      entradas: [{quem: 't19', frame: 3780}],
      movimentos: [{quem: 't10', para: p(0.6, 0.16), frame: 3792}],
    },
    {
      tipo: 'cartoes',
      frame: 3848, // ← 3960
      intervalo: 20,
      itens: [
        {texto: 'PONTA VELOZ', frame: 3860},
        {texto: 'VOLANTE A MAIS', frame: 3956},
        {texto: 'SEGUNDO ATACANTE', frame: 4048},
      ],
    },

    // ─── o fator emocional ───
    {tipo: 'cartela', frame: 4138, titulo: 'O FATOR EMOCIONAL'},
    {tipo: 'broll', frame: 4190, arquivo: 'broll/cartao-amarelo.mp4', taxa: 0.63}, // ← 4260 (2,1 s de material para 3,3 s)
    {
      tipo: 'rotulos',
      frame: 4290, // ← 4410: "É também uma competição de pressão. Cartões, discussões, cera, vaias e decisões da arbitragem…"
      itens: [
        {texto: 'CARTÕES', frame: 4372, onde: p(0.2, 0.24)},
        {texto: 'DISCUSSÕES', frame: 4399, onde: p(0.5, 0.12)},
        {texto: 'CERA', frame: 4430, onde: p(0.8, 0.24)},
        {texto: 'VAIAS', frame: 4454, onde: p(0.26, 0.78)},
        {texto: 'ARBITRAGEM', frame: 4495, onde: p(0.72, 0.8)},
      ],
    },
    {
      tipo: 'campo',
      frame: 4588, // ← 4590
      time: 'neutro',
      texto: {linhas: ['QUEM PERDE A CONCENTRAÇÃO,', 'PAGA'], frame: 4600},
    },

    // ─── quem chega mais preparado ───
    {tipo: 'cartela', frame: 4862, titulo: 'QUEM CHEGA MAIS PREPARADO?'},
    {
      tipo: 'ficha',
      frame: 4916,
      time: 'palmeiras',
      atributos: [
        {texto: 'Defesa organizada', frame: 5046},
        {texto: 'Transições', frame: 5082},
        {texto: 'Mata-mata', frame: 5140},
      ],
    },
    {
      tipo: 'ficha',
      frame: 5170,
      time: 'flamengo',
      atributos: [
        {texto: 'Elenco', frame: 5222},
        {texto: 'Talento individual', frame: 5262},
        {texto: 'Regularidade', frame: 5345},
      ],
    },
    {
      tipo: 'ficha',
      frame: 5470,
      time: 'fluminense',
      atributos: [
        {texto: 'Controle de ritmo', frame: 5525},
        {texto: 'Posse', frame: 5556},
        {texto: 'Meio-campo', frame: 5590},
      ],
    },
    {
      tipo: 'ficha',
      frame: 5614,
      time: 'estudiantes',
      atributos: [
        {texto: 'Força em casa', frame: 5687},
        {texto: 'Bola parada', frame: 5716},
        {texto: 'Duelos', frame: 5746},
      ],
    },
    {
      tipo: 'campo',
      frame: 5785, // ← 5880: "A tendência é de semifinais decididas nos detalhes."
      time: 'neutro',
      linhas: {x: [0.3, 0.5, 0.7], aparecem: [5790, 5794, 5798]},
      texto: {linhas: ['DECIDIDO NOS DETALHES'], frame: 5842},
    },
    {
      tipo: 'campo',
      frame: 6195, // ← 6060: "Na Libertadores, a camisa pesa. Mas, no fim, quem avança é quem executa melhor o plano."
      time: 'neutro',
      texto: {linhas: ['A CAMISA PESA', 'QUEM AVANÇA É QUEM EXECUTA'], frame: 6246, quadros: [6246, 6313]},
    },
    {tipo: 'fecho', frame: 6386}, // ← 6300
  ],
};
