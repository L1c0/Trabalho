/**
 * A MONTAGEM — 15.671 frames a 30fps (8min42).
 *
 * Todos os numeros aqui foram medidos na narracao, nao estimados.
 * Cada borda de bloco cai dentro de uma pausa real da fala, achada por
 * deteccao de silencio. Se voce mover um corte, ele cai no meio de uma
 * palavra.
 *
 * A narracao entrega 19,9% de silencio. Esse respiro e o metronomo do
 * filme: e nele que as imagens trocam.
 */

export const TOTAL = 15671;
export const FPS = 30;

/* ------------------------------------------------------------------ */
/* OS OITO BLOCOS                                                      */
/* ------------------------------------------------------------------ */

export type Bloco = {
  id: string;
  titulo: string | null; // null = bloco sem cartela
  de: number;
  ate: number;
  papel: string;         // chave de theme.ts -> papel
};

export const blocos: Bloco[] = [
  { id: 'gancho',   titulo: null,             de: 0,     ate: 968,   papel: 'fosfofilita' },
  { id: 'navio',    titulo: 'O NAVIO',        de: 968,   ate: 2595,  papel: 'fosfofilita' },
  { id: 'dureza',   titulo: 'A DUREZA',       de: 2595,  ate: 4468,  papel: 'fosfofilita' },
  { id: 'trocas',   titulo: 'A LISTA',        de: 4468,  ate: 6545,  papel: 'ENCADEADO' },
  { id: 'locke',    titulo: 'A MEMORIA',      de: 6545,  ate: 8738,  papel: 'mercurio' },
  { id: 'hume',     titulo: 'O FEIXE',        de: 8738,  ate: 10438, papel: 'mercurio' },
  { id: 'especies', titulo: 'AS TRES PARTES', de: 10492, ate: 13399, papel: 'neutro' },
  { id: 'anatta',   titulo: 'ANATTA',         de: 13399, ate: 15671, papel: 'neutro' },
];

/**
 * A cartela de bloco entra nos primeiros 110 frames do bloco, sozinha no
 * papel vazio, corpo 64, na margem esquerda. Sao seis ao longo do filme e
 * funcionam como metronomo. O bloco 'gancho' nao tem cartela de proposito:
 * o filme comeca sem avisar o que e.
 */

/* ------------------------------------------------------------------ */
/* O PAPEL                                                             */
/* ------------------------------------------------------------------ */

/**
 * Fora do bloco 'trocas' o papel segue a coluna `papel` do bloco acima,
 * interpolando ao longo de 120 frames na entrada do bloco.
 *
 * DENTRO do bloco 'trocas' ele muda seis vezes, uma por substituicao,
 * acompanhando a narracao. Cada transicao leva 90 frames. E a espinha do
 * filme: o fundo esta sendo contaminado junto com a personagem.
 */
export const trocasDoPapel = [
  { frame: 4530, papel: 'agata',    fala: 'pernas de agata' },
  { frame: 4830, papel: 'ouro',     fala: 'bracos de liga de ouro e platina' },
  { frame: 5100, papel: 'lapis',    fala: 'a cabeca' },
  { frame: 5880, papel: 'perola',   fala: 'o olho esquerdo' },
  { frame: 6050, papel: 'prata',    fala: 'o outro olho' },
  { frame: 6200, papel: 'mercurio', fala: 'o cabelo' },
];

/* ------------------------------------------------------------------ */
/* OS TRES PRETOS                                                      */
/* ------------------------------------------------------------------ */

/**
 * cor.preto (#000000) aparece AQUI e em nenhum outro lugar do filme.
 * Sao tres, e juntos formam o arco: a pergunta, a rendicao, a resposta.
 */
export const pretos = [
  { de: 720, ate: 800, o_que:
    'A pergunta, escrita no papel: "Em que momento ela parou de ser ela?" Texto em preto puro, resto do quadro vazio.' },
  { de: 10350, ate: 10438, o_que:
    'A frase "Ele chegou na resposta e nao conseguiu conviver com ela." O preto entra no texto ao longo de 30 frames.' },
  { de: 15502, ate: 15671, o_que:
    'O FIM. O papel vai para preto puro em 20 frames enquanto o quadro `minuscula` fica em cena. O quadro ja e um campo estrelado preto: papel e imagem viram a mesma coisa, e a figura some dentro dela. Ultimo plano do filme.' },
];

/* ------------------------------------------------------------------ */
/* OS DOIS SILENCIOS                                                   */
/* ------------------------------------------------------------------ */

/**
 * Silencio absoluto: sem voz, sem trilha, sem ambiente. Os dois ja estao
 * DENTRO de public/audio/narracao.mp3 — foram inseridos na edicao do
 * audio, nao existiam na gravacao. Nao preencha com nada.
 */
export const silencios = [
  { de: 10438, ate: 10492, dur: '1,8s', o_que: 'Depois de "nao conseguiu conviver com ela". Papel vazio.' },
  { de: 15454, ate: 15502, dur: '1,6s', o_que: 'Antes da ultima frase. O quadro `minuscula` fica em cena, parado.' },
];

/* ------------------------------------------------------------------ */
/* A MONTAGEM                                                          */
/* ------------------------------------------------------------------ */

/**
 * ancora: onde a peca se posiciona. Nunca duas seguidas na mesma.
 *   'EA' esquerda-alta   'DB' direita-baixa   'CA' centro-alto
 *   'CHEIO' ocupa o quadro todo (so para as tiras largas e o zoom)
 *
 * Tudo que nao estiver listado e PAPEL VAZIO, e papel vazio e conteudo.
 * Nao preencha os buracos.
 */
export type Plano = {
  de: number;
  ate: number;
  peca: string | null;   // id de data/assets.ts, ou null = papel vazio
  ancora: 'EA' | 'DB' | 'CA' | 'CHEIO';
  nota?: string;
};

export const planos: Plano[] = [
  // ---- 1. GANCHO -------------------------------------------------
  { de: 30, ate: 250, peca: 'pernas', ancora: 'CA',
    nota: 'Abre nas pernas que nao sao dela. O filme comeca pelo resultado.' },
  { de: 250, ate: 400, peca: 'escorrendo', ancora: 'DB' },
  { de: 400, ate: 530, peca: 'doacaoCabeca', ancora: 'EA' },
  { de: 530, ate: 720, peca: null, ancora: 'CA' },
  { de: 720, ate: 800, peca: null, ancora: 'CA', nota: 'PRETO 1. A pergunta escrita. Nenhuma imagem.' },
  { de: 820, ate: 968, peca: 'phosMar', ancora: 'DB' },

  // ---- 2. O NAVIO ------------------------------------------------
  { de: 1080, ate: 1150, peca: null, ancora: 'CA' },
  { de: 1150, ate: 1450, peca: 'plutarco', ancora: 'EA',
    nota: 'NUNCA legendar como Plutarco. A identificacao do busto e so provavel.' },
  { de: 1450, ate: 1620, peca: 'navio', ancora: 'DB' },
  { de: 1620, ate: 1850, peca: 'teseu', ancora: 'CA',
    nota: 'Tondo circular. Rima com o navio, que tambem e tondo.' },
  { de: 1850, ate: 2060, peca: 'hobbes', ancora: 'EA',
    nota: 'Entra em "1.600 anos depois, Thomas Hobbes piorou tudo". Primeiro o homem; o livro dele vem logo em seguida.' },
  { de: 2060, ate: 2595, peca: 'leviata', ancora: 'CHEIO',
    nota: 'O PLANO MAIS ARRISCADO DO FILME. Escala de 70% a 150% ao longo de 2060->2480, enquadramento descendo para o torso do gigante. A revelacao de que a armadura e feita de gente tem que cair em 2370, onde a narracao pergunta "qual dos dois e o navio de Teseu?". De 2480 a 2595 fica parado no detalhe.' },

  // ---- 3. A DUREZA -----------------------------------------------
  { de: 2705, ate: 2960, peca: 'phosVertical', ancora: 'EA' },
  { de: 2960, ate: 3120, peca: null, ancora: 'CA' },
  { de: 3120, ate: 3900, peca: null, ancora: 'CHEIO',
    nota: 'A REGUA DE MOHS. Componente, nao imagem. Entra em 3120. O 10 do diamante conta em 3330; o 3,5 da fosfofilita conta em 3540. Fica ate 3900. Ver mockup-mohs.png.' },
  { de: 3900, ate: 4150, peca: 'rachadura', ancora: 'DB',
    nota: '"escolheu uma que quebra se voce olhar com forca"' },
  { de: 4170, ate: 4468, peca: 'olhoPerola', ancora: 'CHEIO',
    nota: 'Tira larga, 2016x586. "a memoria fica armazenada no mineral".' },

  // ---- 4. A LISTA — o papel muda seis vezes aqui ------------------
  { de: 4530, ate: 4830, peca: 'pernas', ancora: 'CA' },
  { de: 4830, ate: 5100, peca: 'pernaDet', ancora: 'EA' },
  { de: 5100, ate: 5450, peca: 'doacaoCabeca', ancora: 'DB' },
  { de: 5450, ate: 5880, peca: 'aechmea', ancora: 'CA',
    nota: 'A mudanca de personalidade depois da cabeca do Lapis.' },
  { de: 5880, ate: 6050, peca: 'olhoPerola', ancora: 'CHEIO' },
  { de: 6050, ate: 6200, peca: 'kongoRosto', ancora: 'CHEIO',
    nota: '"esse veio do proprio professor". Tira larga.' },
  { de: 6200, ate: 6400, peca: 'escorrendo', ancora: 'DB' },
  { de: 6400, ate: 6545, peca: null, ancora: 'CA',
    nota: '"o que sobrou do Phos original e um torso". Papel vazio.' },

  // ---- 5. A MEMORIA ----------------------------------------------
  { de: 6660, ate: 7100, peca: 'locke', ancora: 'EA',
    nota: 'Kneller 1697. Arquivo pequeno: plano medio, nunca close.' },
  { de: 7100, ate: 7410, peca: null, ancora: 'CA' },
  { de: 7410, ate: 7780, peca: null, ancora: 'CA',
    nota: 'O principe e o sapateiro. Citacao em texto, sem imagem.' },
  { de: 7780, ate: 8200, peca: 'locke', ancora: 'DB' },
  { de: 8200, ate: 8400, peca: null, ancora: 'CA' },
  { de: 8400, ate: 8738, peca: 'doacaoCabeca', ancora: 'CA',
    nota: '"Phos esquece." A porta se fechando.' },

  // ---- 6. O FEIXE ------------------------------------------------
  { de: 8880, ate: 9350, peca: 'hume', ancora: 'EA', nota: 'Allan Ramsay, 1766.' },
  { de: 9350, ate: 9700, peca: null, ancora: 'CA',
    nota: 'O feixe de percepcoes. Papel vazio e obrigatorio aqui: a tese e que nao tem nada atras.' },
  { de: 9700, ate: 9960, peca: 'estilhaco1', ancora: 'DB' },
  { de: 9960, ate: 10350, peca: 'treatise', ancora: 'CA',
    nota: 'A folha de rosto de 1739, no momento do apendice.' },
  { de: 10350, ate: 10438, peca: null, ancora: 'CA', nota: 'PRETO 2.' },
  { de: 10438, ate: 10492, peca: null, ancora: 'CA', nota: 'SILENCIO ABSOLUTO. Papel vazio.' },

  // ---- 7. AS TRES PARTES -----------------------------------------
  { de: 10602, ate: 10854, peca: 'phosVertical', ancora: 'EA' },
  { de: 10854, ate: 11214, peca: null, ancora: 'CA', nota: 'A lenda sendo contada. Papel vazio.' },
  { de: 11214, ate: 11754, peca: null, ancora: 'CHEIO',
    nota: 'O TRIPTICO. Componente <Tres>. Os tres entram um por vez: admirabilis em 11214, elenco em 11280, descida em 11340. Rotulos CARNE / OSSO / ALMA. Em 11394 os rotulos trocam para ADMIRABILIS / GEMAS / LUNARIANOS, acompanhando a narracao, e ficam ate 11754. E a unica vez que a imagem colorida aparece no filme.' },
  { de: 11754, ate: 12100, peca: 'lunariano', ancora: 'DB' },
  { de: 12100, ate: 12384, peca: 'bodhi', ancora: 'EA',
    nota: 'A estatua logo depois do Lunariano: o argumento visual inteiro, sem precisar dizer.' },
  { de: 12384, ate: 12700, peca: 'kongoRezando', ancora: 'CA' },
  { de: 12700, ate: 12954, peca: 'vajra', ancora: 'CHEIO',
    nota: 'Larga e baixa. Kongo = vajra = diamante e raio.' },
  { de: 12954, ate: 13200, peca: 'yama', ancora: 'DB' },
  { de: 13200, ate: 13399, peca: null, ancora: 'CA', nota: '"Nada disso e decoracao."' },

  // ---- 8. ANATTA -------------------------------------------------
  { de: 13620, ate: 14000, peca: 'formaFinal', ancora: 'CA',
    nota: 'O icone. Frontal, simetrico, halo. Guardado o filme inteiro para este momento.' },
  { de: 14000, ate: 14364, peca: null, ancora: 'CA' },
  { de: 14364, ate: 14604, peca: 'navio', ancora: 'CA',
    nota: 'O navio volta. "Ele simplesmente deixa de existir." O paradoxo se dissolve e a imagem que o abriu reaparece.' },
  { de: 14604, ate: 14904, peca: 'andYet', ancora: 'CHEIO' },
  { de: 14904, ate: 15294, peca: null, ancora: 'CA',
    nota: '"Voce nao e a mesma pessoa que comecou esse video." Papel vazio, so a voz. Nao ilustre isso.' },
  { de: 15294, ate: 15671, peca: 'minuscula', ancora: 'CHEIO',
    nota: 'A ultima imagem. Entra em 15294 e NAO SAI MAIS. Atravessa o silencio de 15454, a ultima frase em 15502 e o preto final. Um plano so, 12,6 segundos.' },
];

/* ------------------------------------------------------------------ */
/* O SOM                                                               */
/* ------------------------------------------------------------------ */

/**
 * Todos os arquivos ja estao no nivel final. Toque com volume 1.0 e nao
 * aplique ganho nenhum — a mixagem ja esta feita. A unica coisa que o
 * Remotion precisa fazer e colocar cada um no frame certo e cortar o
 * leito nos dois silencios.
 *
 * narracao  -15,8 LUFS   leito  -50 LUFS
 * trilhas   -31 LUFS     papel  -36 LUFS
 */
export const som = [
  { arq: 'audio/narracao.mp3', de: 0,     frames: 15671, nota: 'A espinha. Nunca sai.' },
  { arq: 'audio/leito.mp3',    de: 0,     frames: 15671, nota: 'Leito de sala. Roda o filme inteiro MENOS nos dois silencios: corte em 10438-10492 e em 15454-15502. E o que faz o silencio ser sentido como silencio e nao como falha de arquivo.' },
  { arq: 'audio/trilha1.mp3',  de: 59,    frames: 4409,  nota: 'Cold Stillness. Termina exatamente na borda do bloco 4.' },
  { arq: 'audio/trilha2.mp3',  de: 4750,  frames: 5688,  nota: 'Unresolved Figure. Termina exatamente em 10438, onde comeca o primeiro silencio.' },
  { arq: 'audio/trilha3.mp3',  de: 10491, frames: 2908,  nota: 'A terceira peca. Termina em 13399 e DEPOIS DISSO NAO TOCA MAIS NADA. Os ultimos 75 segundos sao so voz, leito e papel.' },
];

/**
 * Entre a trilha1 e a trilha2 existe um vao de 282 frames (9,4s) sem
 * musica, do frame 4468 ao 4750. NAO E ERRO e nao deve ser preenchido.
 * A trilha sai na cartela "A LISTA" e volta quando a lista ja comecou.
 * As pecas geradas nao davam a duracao exata do bloco, e esse vao foi
 * colocado na borda de proposito, onde ele vira respiro em vez de falha.
 */

/** O som de papel, nas sete entradas de cartela de bloco. 34 frames cada. */
export const papelNosTitulos = [968, 2595, 4468, 6545, 8738, 10492, 13399];

/* ------------------------------------------------------------------ */
/* TRECHOS PARA APROVACAO — renderize so estes tres primeiro           */
/* ------------------------------------------------------------------ */

export const aprovacao = [
  { de: 0, ate: 400, o_que: 'A abertura: o papel verde de fosfofilita e o primeiro quadro.' },
  { de: 2060, ate: 2595, o_que: 'O zoom do Leviata. O plano mais arriscado.' },
  { de: 15294, ate: 15671, o_que: 'O fim: o silencio, a ultima frase e o preto.' },
];
