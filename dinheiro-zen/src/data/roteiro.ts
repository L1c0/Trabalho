// ROTEIRO — todo texto e todo frame do vídeo (30 fps). Trocar a locução = trocar este arquivo.
//
// Regra do motion lettering: a palavra na tela é a palavra falada, no frame em que é falada.
// Os frames de cada palavra foram medidos na locução de teste (±2 frames).
// Eventos que não são palavra (fusuma, nijimi, enso, hanko…) caem sempre numa pausa da fala.
//
// TESTE — não publicar. Trechos não conformes estão marcados com ⚠.

import {motion} from '../theme';

export type Palavra = {texto: string; de: number; ate: number};
const p = (texto: string, de: number, ate: number): Palavra => ({texto, de, ate});

// ─── LEGENDA: o resto da narração, palavra por palavra. Cada grupo é uma linha. ───
export const legenda: Palavra[][] = [
  // ⚠ gancho não conforme: só legenda
  [p('Ei,', 21, 27), p('você', 38, 46), p('aí,', 46, 53)],
  [p('sabia', 70, 83), p('que', 85, 89), p('existe', 89, 100)],
  [p('que', 148, 154), p('os', 154, 158), p('grandes', 158, 170), p('bancos', 170, 187)],
  [p('não', 187, 194), p('querem', 194, 209), p('que', 209, 214), p('você', 214, 219), p('conheça?', 222, 234)],
  [p('É', 339, 343), p('o', 343, 347), p('espaço', 350, 360), p('de', 360, 364)],
  [p('segundos', 379, 395)],
  [p('entre', 404, 417), p('querer', 418, 428), p('e', 440, 443), p('comprar.', 445, 458)],
  // ⚠ "a maioria perde o controle": só legenda
  [p('É', 482, 487), p('ali', 487, 498)],
  [p('que', 514, 517), p('a', 517, 520), p('maioria', 520, 530), p('perde', 530, 540), p('o', 540, 545), p('controle.', 545, 552)],
  [p('Em', 573, 578)],
  [p('uma', 617, 624), p('japonesa', 624, 641), p('criou', 644, 655), p('um', 655, 658), p('método', 658, 666)],
  [p('que', 676, 679), p('usa', 679, 689), p('essa', 689, 696), p('pausa', 696, 710), p('a', 710, 718), p('seu', 718, 725), p('favor.', 725, 735)],
  [p('Sem', 751, 756)],
  [p('só', 807, 816), p('um', 816, 821)],
  [p('e', 843, 850), p('4', 850, 861), p('perguntas', 864, 879), p('por', 881, 888), p('mês.', 888, 892)],
  [p('Se', 909, 914), p('chama', 914, 927)],
  // ⚠ "toque no link": formato errado para Reels
  [p('Toque', 1149, 1152), p('no', 1154, 1159), p('link', 1159, 1165), p('e', 1171, 1173), p('comece', 1173, 1181), p('hoje.', 1181, 1187)],
];

// Falado mas fora da tela no teste.
export const semLegenda: Palavra[][] = [
  [p('sem', 780, 787), p('juros,', 787, 799)], // ⚠ comparação com crédito
  // ⚠ promessa de resultado: só imagem
  [p('E', 985, 989), p('ele', 989, 997), p('pode', 1007, 1012), p('te', 1013, 1017), p('fazer', 1018, 1027), p('guardar', 1027, 1037)],
  [p('muito', 1049, 1058), p('dinheiro', 1061, 1071), p('pela', 1083, 1090), p('primeira', 1090, 1099), p('vez', 1099, 1106)],
  [p('na', 1106, 1111), p('sua', 1111, 1117), p('vida.', 1117, 1123)],
];

// ─── OS 6 HEROS ───
export const heros = {
  // 1 · escrita, uma palavra por linha
  umaPalavraJaponesa: {linhas: [[p('uma', 101, 108)], [p('palavra', 108, 122)], [p('japonesa', 122, 144)]], absorve: 220},
  // 2 · kakijun; o romaji entra quando "Ma" é falado
  ma: {kanji: '間', kakijun: 236, ruby: p('ma', 263, 273)},
  // 3 · escrita + 15 frames de silêncio visual depois de "pausa" terminar (315–330)
  aPausa: {linhas: [[p('a', 298, 301), p('pausa', 305, 315)]]},
  // 4 · contador: "3" entra quando "três" é falado; depois um por segundo
  tresDoisUm: {valores: ['3', '2', '1'], falado: p('3', 368, 379), passo: 30},
  // 5 · contador 1900 → 1904 durante "mil novecentos e quatro"
  ano: {valores: ['1900', '1901', '1902', '1903', '1904'], falado: p('1904', 578, 611), passo: 8},
  // 6 · kakijun; o romaji entra quando "Kakeibo" é falado
  kakeibo: {kanji: ['家', '計', '簿'], kakijun: 907, ruby: p('kakeibo', 941, 958)},
};

// ─── Palavras faladas com coreografia própria (não são hero) ───
export const letras = {
  riscada: p('app', 756, 772),
  nova: p('caderno', 821, 835),
};

// ─── Texto que não vem da locução (pedido explícito do brief) ───
export const textosFixos = {
  formas: {querer: '欲', comprar: '買'},
  perguntas: ['Quanto eu tenho?', 'Quanto vou guardar?', 'Quanto posso gastar?', 'Como posso melhorar?'],
  hanko: '禅',
  titulo: ['Dinheiro', 'Zen'],
  subtitulo: ['O guia completo do', 'método Kakeibo.'],
  aviso: ['Material educativo. Não substitui', 'orientação financeira profissional.'],
};

// ─── Eventos que não são palavra (todos numa pausa da fala) ───
export const cues = {
  trelica: 0,
  hero1Absorve: heros.umaPalavraJaponesa.absorve,
  fusuma1: 330, // depois dos 15 frames parados
  formas: 348, // pausa "o | espaço"
  intervalo: 364, // pausa "de | três"
  intervaloAbsorve: 458,
  nijimi: 460,
  nijimiSeca: 510, // pausa "ali | que"
  enso: 667, // pausa "método | que"
  anoAbsorve: 736,
  pautaCaderno: 750,
  risco: 772, // logo depois de "app"
  perguntas: [836, 851, 866, 881], // a primeira na pausa "caderno | e"
  fusuma2: 893, // pausa "mês | Se"
  kakeiboAbsorve: 1047,
  hanko: 1072, // pausa "dinheiro | pela"
  titulo: 1088, // pausa "pela | primeira"
  subtitulo: 1124, // pausa "vida | Toque"
  aviso: 1166, // pausa "link | e"
};

const fusumaFecha = (inicio: number) => inicio + motion.fusuma.fechar;

// ─── Blocos de tempo: uma cena por bloco ───
export const blocos = [
  {id: 'gancho', de: 0, ate: heros.ma.kakijun},
  {id: 'ma', de: heros.ma.kakijun, ate: heros.aPausa.linhas[0][0].de},
  {id: 'pausa', de: heros.aPausa.linhas[0][0].de, ate: fusumaFecha(cues.fusuma1)},
  {id: 'tresSegundos', de: fusumaFecha(cues.fusuma1), ate: cues.intervaloAbsorve},
  {id: 'controle', de: cues.intervaloAbsorve, ate: 571},
  {id: 'ano', de: 571, ate: cues.pautaCaderno},
  {id: 'caderno', de: cues.pautaCaderno, ate: fusumaFecha(cues.fusuma2)},
  {id: 'kakeibo', de: fusumaFecha(cues.fusuma2), ate: cues.kakeiboAbsorve + motion.absorcao},
  {id: 'zen', de: cues.kakeiboAbsorve + motion.absorcao, ate: 1148},
  {id: 'cta', de: 1148, ate: 1200},
] as const;

export type BlocoId = (typeof blocos)[number]['id'];

export const inicioDoBloco = (id: BlocoId) => blocos.find((b) => b.id === id)?.de ?? 0;

const todasAsStrings = (v: unknown): string[] => {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(todasAsStrings);
  if (v && typeof v === 'object') return Object.values(v).flatMap(todasAsStrings);
  return [];
};

// Para carregar só as fatias de fonte necessárias (maiúsculas incluídas).
export const textoCompleto = [legenda, heros, letras, textosFixos]
  .flatMap(todasAsStrings)
  .map((t) => t + t.toUpperCase())
  .join('');
