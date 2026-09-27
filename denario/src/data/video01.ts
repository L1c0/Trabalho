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

  // Cada composição: 4 a 8 s, 2 a 4 elementos, um grande (~60%) e um pequeno (~15%), ao menos
  // um sangrando pela borda, peso alternando entre esquerda (E) e direita (D). A troca é por
  // corte seco, sempre numa pausa ou entre palavras. O texto ao lado é o que a voz diz.
  composicoes: [
    // E · "Eu comprei um jogo chamado Crimson Desert por 400 reais."
    {
      id: 'compra',
      nome: 'A compra',
      de: 0,
      ate: 172,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: -260, y: 110, largura: 1000, rotacao: -5, zoom: true, origemZoom: '60% 30%'},
        {tipo: 'recorte', img: 'maoMouse', x: 1330, y: 560, largura: 420, rotacao: -3},
        {tipo: 'titulo', texto: 'CRIMSON DESERT', x: 1250, y: 170, tamanho: 64},
        {tipo: 'credito', texto: 'Anúncio da Loja do Jacintho'},
      ],
    },
    // D · "…eu sabia no momento em que eu cliquei que não era o tipo de jogo que eu gosto."
    {
      id: 'cliquei',
      nome: 'Eu cliquei',
      de: 172,
      ate: 314,
      elementos: [
        {tipo: 'recorte', img: 'maoMouse', x: 780, y: 300, largura: 1250, rotacao: 3, zoom: true, origemZoom: '30% 40%'},
        {tipo: 'documento', img: 'jacintho', quadro: {x: 0, y: 0, w: 1233, h: 320}, x: 150, y: 120, largura: 620, rotacao: -6},
      ],
    },
    // E · "Eu sabia, tinha lido as análises, tinha visto gameplay…"
    {
      id: 'analises',
      nome: 'As análises',
      de: 314,
      ate: 480,
      elementos: [
        {tipo: 'documento', img: 'jornal', x: -120, y: 70, largura: 1050, rotacao: -4, zoom: true, origemZoom: '40% 30%'},
        {tipo: 'documento', img: 'milReis', quadro: {x: 300, y: 440, w: 420, h: 91}, x: 1180, y: 760, largura: 520, rotacao: 5},
        {tipo: 'credito', texto: 'Marmota Fluminense, 17 de março de 1857'},
      ],
    },
    // D · O DESEJO VENDIDO. "Isso aqui não é pra você. Comprei mesmo assim e não abri." Deixe o anúncio falar.
    {
      id: 'desejo',
      nome: 'O desejo vendido',
      de: 480,
      ate: 648,
      elementos: [
        {tipo: 'documento', img: 'cocaCola', x: 1120, y: -90, largura: 760, rotacao: 3, zoom: true, origemZoom: '50% 80%'},
        {tipo: 'documento', img: 'jacintho', quadro: {x: 240, y: 330, w: 730, h: 510}, x: 180, y: 700, largura: 460, rotacao: 4},
        {tipo: 'credito', texto: 'Coca-Cola, 1900 — "tome um copo quando estiver cansado de fazer compras"'},
      ],
    },
    // E · "Depois eu fiz uma conta que mudou o tamanho da coisa. 400 reais pra mim na época eram mais ou menos…"
    {
      id: 'aconta',
      nome: 'Uma conta',
      de: 648,
      ate: 800,
      elementos: [
        {tipo: 'documento', img: 'milReis', x: -140, y: 250, largura: 1300, rotacao: -3, zoom: true, origemZoom: '40% 50%'},
        {tipo: 'cena', img: 'livro', x: 1400, y: 120, largura: 380, rotacao: 3},
        {tipo: 'credito', texto: 'Cédula de 1 mil-réis, Banco do Brasil, 1923'},
      ],
    },
    // D · AS 37 HORAS — a imagem mais forte do vídeo: 8 s. "37 horas de trabalho. 37 horas."
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
    // E · "Quando eu vi esse número… pensei nas terças-feiras. Porque assim que aquele dinheiro existiu…"
    {
      id: 'tercas',
      nome: 'As terças-feiras',
      de: 992,
      ate: 1126,
      elementos: [
        {tipo: 'cena', img: 'fila', x: -90, y: 170, largura: 1200, rotacao: 2, zoom: true, origemZoom: '40% 50%'},
        {tipo: 'cena', img: 'bonde', quadro: {x: 520, y: 450, w: 630, h: 330}, x: 1330, y: 640, largura: 440, rotacao: -3},
        {tipo: 'credito', texto: 'Fila na Caixa Econômica Federal'},
      ],
    },
    // D · "Pegando condução, aguentando o dia inteiro. Três dias e meio desses…"
    {
      id: 'conducao',
      nome: 'Condução',
      de: 1126,
      ate: 1238,
      elementos: [
        {tipo: 'cena', img: 'bonde', quadro: {x: 480, y: 380, w: 1120, h: 520}, x: 700, y: 260, largura: 1400, rotacao: -2, zoom: true, origemZoom: '50% 50%'},
        {tipo: 'cena', img: 'onibus', quadro: {x: 620, y: 40, w: 280, h: 260}, x: 170, y: 150, largura: 330, rotacao: 3},
      ],
    },
    // E · "…empilhados, entregues para um arquivo que continua fechado na minha biblioteca."
    {
      id: 'empilhados',
      nome: 'Empilhados',
      de: 1238,
      ate: 1356,
      elementos: [
        {tipo: 'documento', img: 'milReis', x: -160, y: 90, largura: 1150, rotacao: -6, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 360, y: 520, largura: 760, rotacao: 4},
        {tipo: 'recorte', img: 'maoMouse', x: 1450, y: 330, largura: 330, rotacao: -4},
      ],
    },
    // D · "E o que me incomoda… é que eu não pechinchei nada. Eu que reclamo de 5 reais no pão."
    {
      id: 'pao',
      nome: 'Cinco reais no pão',
      de: 1356,
      ate: 1512,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: 820, y: -70, largura: 1180, rotacao: 4, zoom: true, origemZoom: '50% 40%'},
        {tipo: 'documento', img: 'valeQuantoPesa', quadro: {x: 0, y: 680, w: 624, h: 154}, x: 140, y: 760, largura: 560, rotacao: -5},
      ],
    },
    // E · SÊNECA. "Tem um texto do Sêneca sobre isso que eu leio de novo de tempos em tempos."
    {
      id: 'seneca',
      nome: 'Sêneca',
      de: 1512,
      ate: 1645,
      elementos: [
        {tipo: 'recorte', img: 'seneca', x: 90, y: 230, largura: 760, rotacao: -2, zoom: true, origemZoom: '50% 30%'},
        {tipo: 'documento', img: 'jornal', x: 1390, y: 110, largura: 700, rotacao: 6},
        {tipo: 'credito', texto: 'Sêneca, gravura'},
      ],
    },
    // D · "Ele escreve pra um amigo e comenta uma coisa meio óbvia…"
    {
      id: 'carta',
      nome: 'A carta',
      de: 1645,
      ate: 1787,
      elementos: [
        {tipo: 'documento', img: 'jornal', quadro: {x: 0, y: 150, w: 579, h: 424}, x: 760, y: 190, largura: 1200, rotacao: -3, zoom: true, origemZoom: '30% 30%'},
        {tipo: 'recorte', img: 'seneca', x: 160, y: 560, largura: 360, rotacao: 3},
      ],
    },
    // E · "Ele diz que ninguém empresta a casa, ninguém deixa outra pessoa mexer no dinheiro."
    {
      id: 'casa',
      nome: 'Ninguém empresta a casa',
      de: 1787,
      ate: 1891,
      elementos: [
        {tipo: 'documento', img: 'jacintho', quadro: {x: 240, y: 330, w: 730, h: 510}, x: -110, y: 140, largura: 1150, rotacao: -3, zoom: true},
        {tipo: 'citacao', linhas: ['Ninguém empresta a casa.', 'Ninguém deixa mexer no dinheiro.'], x: 1180, y: 700, largura: 560, rotacao: 2},
      ],
    },
    // D · "A gente é sovinha com propriedade, desconfiado, cuidadoso."
    {
      id: 'sovinha',
      nome: 'Sovinha',
      de: 1891,
      ate: 1989,
      elementos: [
        {tipo: 'documento', img: 'livro', x: 760, y: 200, largura: 1250, rotacao: 3, zoom: true, origemZoom: '30% 40%'},
        {tipo: 'documento', img: 'milReis', quadro: {x: 380, y: 90, w: 270, h: 390}, x: 250, y: 150, largura: 300, rotacao: -5},
        {tipo: 'credito', texto: 'Livro-razão de F. Scott Fitzgerald, 1926'},
      ],
    },
    // E · "Com o tempo, a gente é generosíssimo, dá pra qualquer um, dá pra coisa nenhuma."
    {
      id: 'generoso',
      nome: 'Generosíssimo',
      de: 1989,
      ate: 2116,
      elementos: [
        {tipo: 'cena', img: 'assembleia', x: -100, y: 200, largura: 1240, rotacao: -2, zoom: true},
        {tipo: 'citacao', linhas: ['Mas o tempo a gente dá', 'pra qualquer um.'], x: 1260, y: 260, largura: 460, rotacao: -2},
      ],
    },
    // D · "E aí vem a parte dele que é meio cruel. Tempo é a única coisa que, quando acaba, acabou."
    {
      id: 'cruel',
      nome: 'Quando acaba, acabou',
      de: 2116,
      ate: 2266,
      elementos: [
        {tipo: 'recorte', img: 'seneca', x: 1080, y: 150, largura: 820, rotacao: 2, zoom: true, origemZoom: '60% 30%'},
        {tipo: 'citacao', linhas: ['Tempo é a única coisa', 'que, quando acaba, acabou.'], x: 180, y: 420, largura: 560, rotacao: -1.5},
      ],
    },
    // E · "Eu fui atrás de entender por que aquele clique aconteceu. Porque foi burro não explica nada."
    {
      id: 'clique',
      nome: 'Aquele clique',
      de: 2266,
      ate: 2434,
      elementos: [
        {tipo: 'recorte', img: 'maoMouse', x: -180, y: 260, largura: 1300, rotacao: -3, zoom: true, origemZoom: '70% 40%'},
        {tipo: 'documento', img: 'cocaCola', quadro: {x: 0, y: 640, w: 535, h: 160}, x: 1180, y: 160, largura: 560, rotacao: 5},
      ],
    },
    // D · "O que eu comprei não foi o jogo, foi a sensação de estar dentro de alguma coisa, sabe?"
    {
      id: 'dentro',
      nome: 'Estar dentro',
      de: 2434,
      ate: 2540,
      elementos: [
        {tipo: 'documento', img: 'cocaCola', quadro: {x: 0, y: 0, w: 535, h: 640}, x: 1000, y: -70, largura: 820, rotacao: 3, zoom: true},
        {tipo: 'cena', img: 'assembleia', quadro: {x: 250, y: 120, w: 450, h: 340}, x: 200, y: 640, largura: 420, rotacao: -3},
      ],
    },
    // E · "Tinha lançamento, tinha gente falando, tinha amigos jogando, tinha aquele barulho todo."
    {
      id: 'barulho',
      nome: 'Aquele barulho',
      de: 2540,
      ate: 2645,
      elementos: [
        {tipo: 'cena', img: 'bonde', quadro: {x: 1100, y: 400, w: 500, h: 460}, x: -80, y: 120, largura: 1000, rotacao: -2, zoom: true},
        {tipo: 'cena', img: 'fila', quadro: {x: 150, y: 100, w: 450, h: 408}, x: 1080, y: 520, largura: 520, rotacao: 3},
        {tipo: 'documento', img: 'jornal', quadro: {x: 0, y: 0, w: 579, h: 150}, x: 1150, y: 110, largura: 560, rotacao: -4},
      ],
    },
    // D · A ÂNSIA. "E existe um tipo de ansiedade muito específica de ficar de fora…" Sem texto.
    {
      id: 'ansia',
      nome: 'A ânsia',
      de: 2645,
      ate: 2830,
      elementos: [
        {tipo: 'cena', img: 'assembleia', x: 640, y: 110, largura: 1340, rotacao: -1.5, zoom: true},
        {tipo: 'recorte', img: 'maoMouse', x: 150, y: 770, largura: 250, rotacao: 3},
      ],
    },
    // E · "Comprar resolve isso em 3 segundos. É um alívio rápido e real. Você clica…"
    {
      id: 'alivio',
      nome: 'O alívio',
      de: 2830,
      ate: 2995,
      elementos: [
        {tipo: 'documento', img: 'cocaCola', x: 120, y: -60, largura: 720, rotacao: -4, zoom: true, origemZoom: '50% 30%'},
        {tipo: 'recorte', img: 'maoMouse', x: 1200, y: 520, largura: 560, rotacao: 2},
      ],
    },
    // D · "…e por algum instante entra no grupo. O problema é que o alívio dura o clique."
    {
      id: 'grupo',
      nome: 'Entra no grupo',
      de: 2995,
      ate: 3099,
      elementos: [
        {tipo: 'cena', img: 'assembleia', quadro: {x: 0, y: 60, w: 460, h: 400}, x: 900, y: 180, largura: 1100, rotacao: 2, zoom: true},
        {tipo: 'recorte', img: 'maoMouse', x: 220, y: 300, largura: 360, rotacao: -4},
      ],
    },
    // E · "Depois disso, o jogo é só um arquivo. E aí você já pagou."
    {
      id: 'arquivo',
      nome: 'Só um arquivo',
      de: 3099,
      ate: 3196,
      elementos: [
        {tipo: 'recorte', img: 'teclado', x: -200, y: 380, largura: 1350, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 1350, y: 140, largura: 420, rotacao: 6},
      ],
    },
    // D · "Isso não é falta de disciplina, é o funcionamento normal de uma cabeça cercada de estímulo."
    {
      id: 'estimulo',
      nome: 'Cercada de estímulo',
      de: 3196,
      ate: 3306,
      elementos: [
        {tipo: 'documento', img: 'valeQuantoPesa', x: 1080, y: -140, largura: 820, rotacao: 4, zoom: true, origemZoom: '50% 30%'},
        {tipo: 'documento', img: 'cocaCola', quadro: {x: 0, y: 0, w: 535, h: 640}, x: 300, y: 380, largura: 380, rotacao: -5},
        {tipo: 'credito', texto: 'Sabonete Vale Quanto Pesa, anúncio'},
      ],
    },
    // E · "A indústria inteira é desenhada para fabricar exatamente essa ânsia. Não tem virtude que segure sozinha."
    {
      id: 'industria',
      nome: 'A indústria',
      de: 3306,
      ate: 3494,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: -200, y: -40, largura: 1250, rotacao: -3, zoom: true, origemZoom: '50% 30%'},
        {tipo: 'documento', img: 'cocaCola', x: 1180, y: 420, largura: 460, rotacao: 5},
        {tipo: 'documento', img: 'valeQuantoPesa', quadro: {x: 0, y: 0, w: 624, h: 420}, x: 1450, y: 90, largura: 360, rotacao: -6},
      ],
    },
    // D · "O que muda o jogo? Perdão pelo trocadilho. É a unidade de medida."
    {
      id: 'unidade',
      nome: 'A unidade de medida',
      de: 3494,
      ate: 3629,
      elementos: [
        {tipo: 'documento', img: 'livro', quadro: {x: 40, y: 20, w: 330, h: 300}, x: 980, y: 110, largura: 1000, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', quadro: {x: 380, y: 90, w: 270, h: 390}, x: 330, y: 560, largura: 300, rotacao: 4},
      ],
    },
    // E · "Enquanto o preço é 400 reais, ele é abstrato. R$ 400 é um número que aparece e some da conta."
    {
      id: 'abstrato',
      nome: 'Abstrato',
      de: 3629,
      ate: 3776,
      elementos: [
        {tipo: 'documento', img: 'milReis', x: -240, y: 330, largura: 1250, rotacao: 5, zoom: true},
        {tipo: 'numero', texto: 'R$ 400', x: 1010, y: 150, tamanho: 250},
        {tipo: 'recorte', img: 'maoMouse', x: 1420, y: 640, largura: 330, rotacao: -3},
      ],
    },
    // D · A TERÇA-FEIRA — a sequência mais importante: 8 s. "Ninguém sente R$ 400. Mas 37 horas eu sinto…
    // porque eu vivi cada uma delas."
    {
      id: 'terca',
      nome: 'A terça-feira',
      de: 3776,
      ate: 3968,
      elementos: [
        {tipo: 'cena', img: 'onibus', x: 800, y: 110, largura: 1250, rotacao: -1.5, zoom: true, origemZoom: '55% 30%'},
        {tipo: 'cena', img: 'fila', x: 110, y: 600, largura: 460, rotacao: 2.5},
        {tipo: 'documento', img: 'milReis', x: 430, y: 830, largura: 700, rotacao: 4},
        {tipo: 'credito', texto: 'Ônibus L-102, Vale do Jatobá'},
      ],
    },
    // E · A CONTA. "E a conta para chegar nesse número é chata e vale os 10 minutos. Pega o que você recebe."
    {
      id: 'conta',
      nome: 'A conta',
      de: 3968,
      ate: 4103,
      elementos: [
        {tipo: 'cena', img: 'livro', x: -60, y: 60, largura: 1000, rotacao: -2, zoom: true},
        {tipo: 'documento', img: 'valeQuantoPesa', x: 1330, y: 150, largura: 580, rotacao: 5},
      ],
    },
    // D · "Tira o que o trabalho te cobra para existir. Condução, almoço fora, a roupa que você só usa pra ir trabalhar."
    {
      id: 'custos',
      nome: 'O que o trabalho cobra',
      de: 4103,
      ate: 4257,
      elementos: [
        {tipo: 'cena', img: 'bonde', x: 700, y: 120, largura: 1350, rotacao: 2, zoom: true, origemZoom: '30% 40%'},
        {tipo: 'documento', img: 'jacintho', quadro: {x: 0, y: 300, w: 240, h: 560}, x: 260, y: 300, largura: 260, rotacao: -5},
      ],
    },
    // E · "Divide pelas horas que ele realmente consome. E aí inclui o deslocamento e o tempo de ficar pronto."
    {
      id: 'deslocamento',
      nome: 'O deslocamento',
      de: 4257,
      ate: 4400,
      elementos: [
        {tipo: 'cena', img: 'onibus', quadro: {x: 600, y: 230, w: 600, h: 400}, x: -120, y: 180, largura: 1150, rotacao: -2, zoom: true},
        {tipo: 'cena', img: 'fila', x: 1300, y: 150, largura: 440, rotacao: 3},
      ],
    },
    // D · "Porque aquilo também é o trabalho tomando seu dia. Só que sem pagar."
    {
      id: 'sempagar',
      nome: 'Sem pagar',
      de: 4400,
      ate: 4503,
      elementos: [
        {tipo: 'cena', img: 'fila', quadro: {x: 150, y: 100, w: 450, h: 408}, x: 900, y: 120, largura: 1100, rotacao: 2, zoom: true},
        {tipo: 'documento', img: 'livro', quadro: {x: 60, y: 170, w: 360, h: 90}, x: 170, y: 250, largura: 520, rotacao: -4},
      ],
    },
    // E · "O número que sai é bem menor do que o do contracheque. No meu caso, eram uns 10,80."
    {
      id: 'dezoitenta',
      nome: 'R$ 10,80',
      de: 4503,
      ate: 4695,
      elementos: [
        {tipo: 'documento', img: 'livro', x: -120, y: 150, largura: 1150, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 1330, y: 110, largura: 500, rotacao: 6},
        {tipo: 'numero', texto: 'R$ 10,80', x: 900, y: 660, tamanho: 230, entra: 111}, // em "10,80"
      ],
    },
    // D · "Depois que eu soube esse número, algumas coisas mudaram sozinhas. Não virei econômico…"
    {
      id: 'mudaram',
      nome: 'Mudaram sozinhas',
      de: 4695,
      ate: 4856,
      elementos: [
        {tipo: 'recorte', img: 'teclado', x: 820, y: 340, largura: 1300, rotacao: 3, zoom: true},
        {tipo: 'documento', img: 'jornal', quadro: {x: 0, y: 150, w: 579, h: 424}, x: 170, y: 140, largura: 420, rotacao: -5},
      ],
    },
    // E · "Mas apareceu um intervalo entre o impulso e o clique."
    {
      id: 'intervalo',
      nome: 'O intervalo',
      de: 4856,
      ate: 4968,
      elementos: [
        {tipo: 'recorte', img: 'maoMouse', x: -150, y: 380, largura: 1150, rotacao: -2, zoom: true},
        {tipo: 'documento', img: 'cocaCola', quadro: {x: 0, y: 0, w: 535, h: 640}, x: 1380, y: 150, largura: 360, rotacao: 5},
      ],
    },
    // D · "Nesse intervalo cabe uma pergunta. Isso aqui vale três terça-feiras? Às vezes vale."
    {
      id: 'pergunta',
      nome: 'Vale quanto pesa',
      de: 4968,
      ate: 5110,
      elementos: [
        // "VALE QUANTO PESA" legível: é a frase do vídeo
        {tipo: 'documento', img: 'valeQuantoPesa', x: 1000, y: -120, largura: 900, rotacao: -4, zoom: true, origemZoom: '50% 85%'},
        {tipo: 'cena', img: 'onibus', quadro: {x: 0, y: 0, w: 700, h: 630}, x: 220, y: 560, largura: 420, rotacao: 3},
      ],
    },
    // E · O QUE VALEU. "Comprei um teclado caro depois disso e acho que valeu cada hora."
    {
      id: 'valeu',
      nome: 'O que valeu',
      de: 5110,
      ate: 5252,
      elementos: [
        {tipo: 'recorte', img: 'teclado', x: -120, y: 360, largura: 1300, rotacao: -3, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 1420, y: 60, largura: 380, rotacao: -6},
      ],
    },
    // D · "O Sêneca não estava dizendo para viver contando moeda… parar de tratar tempo como se fosse infinito."
    {
      id: 'infinito',
      nome: 'Como se fosse infinito',
      de: 5252,
      ate: 5432,
      elementos: [
        {tipo: 'recorte', img: 'seneca', x: 1000, y: 120, largura: 860, rotacao: 2, zoom: true, origemZoom: '60% 30%'},
        {tipo: 'recorte', img: 'moeda', x: 260, y: 600, largura: 300, rotacao: -4},
      ],
    },
    // E · "Porque é o único recurso que você tem que definitivamente não é."
    {
      id: 'recurso',
      nome: 'O único recurso',
      de: 5432,
      ate: 5528,
      elementos: [
        {tipo: 'cena', img: 'bonde', quadro: {x: 520, y: 450, w: 630, h: 330}, x: -100, y: 200, largura: 1200, rotacao: -2, zoom: true},
        {tipo: 'cena', img: 'fila', x: 1350, y: 620, largura: 400, rotacao: 3},
      ],
    },
    // D · "Dinheiro volta, mas terça-feira não."
    {
      id: 'volta',
      nome: 'Dinheiro volta',
      de: 5528,
      ate: 5624,
      elementos: [
        {tipo: 'cena', img: 'onibus', x: 780, y: 400, largura: 1300, rotacao: 2, zoom: true},
        {tipo: 'titulo', texto: 'Dinheiro volta.', x: 180, y: 190},
        {tipo: 'titulo', texto: 'Terça-feira não.', x: 180, y: 290, entra: 24}, // em "mas terça-feira não"
      ],
    },
    // E · "…eu sugiro uma só. Calcula o seu número e escreve no papel."
    {
      id: 'pratica',
      nome: 'A prática',
      de: 5624,
      ate: 5737,
      elementos: [
        {tipo: 'documento', img: 'livro', x: -160, y: 100, largura: 1100, rotacao: -3, zoom: true},
        {tipo: 'citacao', linhas: ['Calcule o seu número.', 'Escreva no papel.'], x: 1180, y: 560, largura: 460, rotacao: 2},
      ],
    },
    // D · "Não no celular que você não vai ver. Num papel, na carteira ou colado em algum lugar que você olhe."
    {
      id: 'papel',
      nome: 'Num papel',
      de: 5737,
      ate: 5870,
      elementos: [
        {tipo: 'documento', img: 'jornal', x: 880, y: 90, largura: 1100, rotacao: 5, zoom: true},
        {tipo: 'documento', img: 'milReis', x: 150, y: 700, largura: 520, rotacao: -4},
      ],
    },
    // E · "Na próxima compra acima de R$ 200, divide e olhe o resultado em horas… o ponto é você saber."
    {
      id: 'proxima',
      nome: 'A próxima compra',
      de: 5870,
      ate: 6060,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: -180, y: 60, largura: 1150, rotacao: -4, zoom: true},
        {tipo: 'recorte', img: 'maoMouse', x: 1250, y: 540, largura: 560, rotacao: 3},
        {tipo: 'citacao', linhas: ['Acima de R$ 200:', 'divida e veja em horas.'], x: 1260, y: 190, largura: 470, rotacao: -2},
      ],
    },
    // D · "O nome desse canal é uma moeda romana. O denário pagava um dia de trabalho de um soldado."
    {
      id: 'denario',
      nome: 'O denário',
      de: 6060,
      ate: 6205,
      elementos: [
        {tipo: 'recorte', img: 'moeda', x: 960, y: 60, largura: 1000, rotacao: 3, zoom: true},
        {tipo: 'recorte', img: 'seneca', x: 240, y: 520, largura: 400, rotacao: -3},
        {tipo: 'credito', texto: 'Denário romano'},
      ],
    },
    // E · "E eu gosto dela por um motivo meio bobo. Ela cabia na mão."
    {
      id: 'mao',
      nome: 'Cabia na mão',
      de: 6205,
      ate: 6305,
      elementos: [
        {tipo: 'recorte', img: 'maoMouse', x: -200, y: 260, largura: 1250, rotacao: -3, zoom: true},
        {tipo: 'recorte', img: 'moeda', x: 1350, y: 380, largura: 330, rotacao: 4},
      ],
    },
    // D · "O sujeito terminava o dia, recebia aquele pedacinho de prata e conseguia olhar para ele."
    {
      id: 'prata',
      nome: 'Pedacinho de prata',
      de: 6305,
      ate: 6425,
      elementos: [
        {tipo: 'cena', img: 'bonde', quadro: {x: 1100, y: 400, w: 500, h: 460}, x: 900, y: 80, largura: 1080, rotacao: 2, zoom: true},
        {tipo: 'recorte', img: 'moeda', x: 250, y: 500, largura: 420, rotacao: -3},
      ],
    },
    // E · "Ele estava a quinta-feira dele, inteiro em metal, do tamanho de uma unha."
    {
      id: 'unha',
      nome: 'Do tamanho de uma unha',
      de: 6425,
      ate: 6549,
      elementos: [
        {tipo: 'cena', img: 'fila', x: -150, y: 120, largura: 1300, rotacao: -2, zoom: true},
        {tipo: 'recorte', img: 'moeda', x: 1450, y: 700, largura: 180, rotacao: 4},
      ],
    },
    // D · "A gente perdeu esse objeto. Nosso dia virou notificação de crédito em conta."
    {
      id: 'notificacao',
      nome: 'Crédito em conta',
      de: 6549,
      ate: 6659,
      elementos: [
        {tipo: 'documento', img: 'livro', x: 820, y: 200, largura: 1200, rotacao: 3, zoom: true},
        {tipo: 'recorte', img: 'teclado', x: 150, y: 180, largura: 460, rotacao: -3},
      ],
    },
    // E · "Crimson Desert continua lá sem abrir… lembro das 37 horas."
    {
      id: 'biblioteca',
      nome: 'Na biblioteca',
      de: 6659,
      ate: 6832,
      elementos: [
        {tipo: 'documento', img: 'jacintho', x: -220, y: 180, largura: 1100, rotacao: -4, zoom: true},
        {tipo: 'recorte', img: 'maoMouse', x: 1400, y: 640, largura: 360, rotacao: 3},
        {tipo: 'numero', texto: '37', x: 1150, y: -110, tamanho: 380, entra: 128}, // em "37 horas"
      ],
    },
    // D · A MOEDA — as duas moedas juntas fecham o vídeo. "Faz a sua conta, descobre quanto custa uma hora sua."
    {
      id: 'moeda',
      nome: 'A moeda',
      de: 6832,
      ate: 6992,
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
