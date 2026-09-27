// VÍDEO 01 · DENÁRIO · "As 37 horas que eu paguei por um jogo que não abri"
// Ensaio em colagem de arquivo. Cada composição é uma lista de elementos: imagem, posição,
// largura, rotação, entrada. Trocar de vídeo = criar video02.ts com este mesmo formato.
//
// 24 fps. A narração manda o timing: os frames foram medidos na narração tratada
// (public/audio/narracao.mp3, 4:56) e cada troca cai numa pausa da fala.

import type {Video} from './tipos';

export const video01 = {
  codigo: 'DNR 01',
  titulo: 'As 37 horas que eu paguei por um jogo que não abri',
  fps: 24,
  largura: 1920,
  altura: 1080,
  duracao: 7052,

  // ─── Acervo (px da imagem original) ───
  imagens: {
    jacintho: {src: 'img/anuncio-loja-jacintho.jpg', w: 1233, h: 1117},
    cocaCola: {src: 'img/anuncio-coca-cola.jpg', w: 535, h: 800},
    bonde: {src: 'img/bonde-operarios-1916.png', w: 1600, h: 1150},
    seneca: {src: 'img/seneca-gravura.png', w: 897, h: 1264},
    jornal: {src: 'img/jornal-1857.png', w: 579, h: 574},
    assembleia: {src: 'img/assembleia.jpg', w: 700, h: 460},
    onibus: {src: 'img/onibus-jatoba.jpg', w: 1200, h: 630},
    fila: {src: 'img/fila-caixa.jpg', w: 768, h: 508},
    milReis: {src: 'img/mil-reis.jpg', w: 1014, h: 531},
    livro: {src: 'img/livro-razao.jpg', w: 512, h: 384},
    valeQuantoPesa: {src: 'img/anuncio-vale-quanto-pesa.jpg', w: 624, h: 834},
    moeda: {src: 'img/moeda-denario-2.png', w: 1790, h: 1740},
    maoMouse: {src: 'img/mao-mouse.png', w: 1069, h: 890},
    teclado: {src: 'img/teclado.png', w: 1541, h: 949},
  },

  composicoes: [
    // 0:00 A COMPRA — pesa à esquerda
    {
      id: 'compra',
      nome: 'A compra',
      de: 0,
      ate: 186,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: -260, y: 110, largura: 1000, rotacao: -5, zoom: true, origemZoom: '60% 30%'},
        {tipo: 'recorte', img: 'maoMouse', x: 1330, y: 560, largura: 420, rotacao: -3},
        {tipo: 'titulo', texto: 'CRIMSON DESERT', x: 1250, y: 170, tamanho: 64},
      ],
    },
    // O DESEJO VENDIDO — pesa à direita. Deixe o anúncio falar.
    {
      id: 'desejo',
      nome: 'O desejo vendido',
      de: 412,
      ate: 580,
      elementos: [
        {tipo: 'documento', img: 'cocaCola', x: 1120, y: -90, largura: 760, rotacao: 3, zoom: true, origemZoom: '50% 80%'},
        {tipo: 'credito', texto: 'Coca-Cola, 1900 — "tome um copo quando estiver cansado de fazer compras"'},
      ],
    },
    // AS 37 HORAS — a imagem mais forte do vídeo: 8 s. "37 horas de trabalho" (801)
    {
      id: 'bonde',
      nome: 'As 37 horas',
      de: 800,
      ate: 992,
      elementos: [
        // enquadrado para "CARRO PARA OPERARIOS" e "100 RÉIS" ficarem legíveis
        {tipo: 'cena', img: 'bonde', quadro: {x: 20, y: 250, w: 1180, h: 700}, x: 640, y: 150, largura: 1450, rotacao: 1.5, zoom: true, origemZoom: '40% 35%'},
        {tipo: 'numero', texto: '37', x: 170, y: -120, tamanho: 440},
        {tipo: 'credito', texto: 'São Paulo, 1916'},
      ],
    },
    // SÊNECA — pesa à esquerda. "Tem um texto do Sêneca" (1523)
    {
      id: 'seneca',
      nome: 'Sêneca',
      de: 1512,
      ate: 1704,
      elementos: [
        {tipo: 'recorte', img: 'seneca', x: 90, y: 230, largura: 760, rotacao: -2, zoom: true, origemZoom: '50% 30%'},
        {tipo: 'documento', img: 'jornal', x: 1390, y: 110, largura: 700, rotacao: 6},
        {tipo: 'citacao', linhas: ['Ninguém empresta a casa.', 'Mas o tempo a gente dá', 'pra qualquer um.'], x: 1000, y: 800, largura: 560, rotacao: -1.5},
      ],
    },
    // A ÂNSIA — pesa à direita. "ansiedade de ficar de fora" (2674). Sem texto.
    {
      id: 'ansia',
      nome: 'A ânsia',
      de: 2640,
      ate: 2808,
      elementos: [
        {tipo: 'cena', img: 'assembleia', x: 640, y: 110, largura: 1340, rotacao: -1.5, zoom: true},
        {tipo: 'recorte', img: 'maoMouse', x: 150, y: 770, largura: 250, rotacao: 3},
      ],
    },
    // A TERÇA-FEIRA — a sequência mais importante: 8 s. "Ninguém sente R$ 400. Mas 37 horas eu sinto…
    // porque eu vivi cada uma delas." (3779–3963)
    {
      id: 'terca',
      nome: 'A terça-feira',
      de: 3776,
      ate: 3968,
      elementos: [
        {tipo: 'cena', img: 'onibus', x: 800, y: 110, largura: 1250, rotacao: -1.5, zoom: true, origemZoom: '55% 30%'},
        {tipo: 'cena', img: 'fila', x: 110, y: 600, largura: 460, rotacao: 2.5},
        {tipo: 'documento', img: 'milReis', x: 430, y: 830, largura: 700, rotacao: 4},
      ],
    },
    // A CONTA — pesa à esquerda. "E a conta para chegar nesse número" (3974)
    {
      id: 'conta',
      nome: 'A conta',
      de: 3975,
      ate: 4167,
      elementos: [
        {tipo: 'cena', img: 'livro', x: -60, y: 60, largura: 1000, rotacao: -2, zoom: true},
        {tipo: 'documento', img: 'valeQuantoPesa', x: 1330, y: 150, largura: 580, rotacao: 5},
        {tipo: 'numero', texto: 'R$ 10,80', x: 150, y: 800, tamanho: 230},
      ],
    },
    // O QUE VALEU — "Comprei um teclado caro" (5112)
    {
      id: 'valeu',
      nome: 'O que valeu',
      de: 5110,
      ate: 5302,
      elementos: [
        {tipo: 'recorte', img: 'teclado', x: 250, y: 380, largura: 1300, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 1500, y: 60, largura: 380, rotacao: -6},
      ],
    },
    // A MOEDA — as duas moedas juntas fecham o vídeo. "O nome desse canal é uma moeda romana" (6067)
    {
      id: 'moeda',
      nome: 'A moeda',
      de: 6055,
      ate: 6247,
      elementos: [
        {tipo: 'recorte', img: 'moeda', x: 260, y: 150, largura: 820, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 1280, y: 440, largura: 900, rotacao: 5},
        {tipo: 'titulo', texto: 'DENÁRIO', x: 1300, y: 230},
      ],
    },
    // FIM — fundo limpo, só a marca. 60 frames. Corta.
    {id: 'fim', nome: 'Fim', de: 6992, ate: 7052, elementos: []},
  ],

  audio: {
    narracao: 'audio/narracao.mp3',
    // nível = pico do arquivo em dBFS (o mesmo critério dos outros vídeos); entra com o bonde
    trilha: {arquivo: 'audio/trilha.mp3', de: 800, ate: 7052, db: -22, picoDoArquivo: -0.2, duckingDb: -3, ataque: 2, release: 10},
    // trechos com voz (frames), medidos na narração; guiam o ducking da trilha
    fala: [
    [5, 11], [32, 114], [130, 307], [317, 466], [484, 510], [517, 549], [558, 571], [578, 902], [910, 1069], [1076, 1117],
    [1126, 1419], [1428, 1507], [1518, 1609], [1616, 1707], [1714, 1886], [1893, 2063], [2071, 2077], [2091, 2107],
    [2116, 2254], [2269, 2372], [2392, 2410], [2418, 2424], [2438, 2466], [2473, 2750], [2759, 2815], [2826, 2901],
    [2910, 2945], [2954, 2989], [2997, 3029], [3040, 3088], [3099, 3184], [3192, 3301], [3310, 3392], [3399, 3464],
    [3496, 3521], [3535, 3585], [3593, 3799], [3818, 4098], [4105, 4292], [4300, 4466], [4475, 4492], [4501, 4611],
    [4621, 4647], [4704, 4766], [4768, 4781], [4788, 4808], [4816, 4846], [4858, 4958], [4969, 5002], [5013, 5018],
    [5027, 5071], [5088, 5108], [5115, 5245], [5252, 5476], [5485, 5582], [5608, 5730], [5737, 6049], [6060, 6066],
    [6076, 6125], [6134, 6203], [6210, 6255], [6265, 6287], [6296, 6302], [6316, 6421], [6428, 6534], [6543, 6652],
    [6659, 6715], [6725, 6827], [6834, 6851], [6858, 6890], [6903, 6988]
    ],
  },

  thumb: {
    elementos: [
      {tipo: 'cena', img: 'bonde', quadro: {x: 20, y: 250, w: 1180, h: 700}, x: 640, y: 300, largura: 1480, rotacao: 1.5},
      {tipo: 'recorte', img: 'moeda', x: 210, y: 430, largura: 470, rotacao: -4},
      {tipo: 'titulo', texto: '37 HORAS', x: 200, y: 150, tamanho: 110},
    ],
  },
} satisfies Video;
