// Todo texto que aparece na tela. Cada array é uma linha (a quebra é intencional).
// CONFORMIDADE Meta Ads: nada de promessa de resultado, valores em R$, percentuais,
// "renda extra", "liberdade financeira", "saia das dívidas", antes/depois ou "toque no link".

export const textos = {
  ma: {
    kanji: '間',
    ruby: 'ma',
    legenda: ['o espaço entre', 'duas coisas'],
  },
  tresSegundos: {
    querer: {kanji: '欲', ruby: 'yoku'},
    comprar: {kanji: '買', ruby: 'kau'},
    contagem: ['3', '2', '1'],
    legenda: ['três segundos', 'entre querer', 'e comprar'],
  },
  dinheiroSome: {
    categorias: 4,
    legenda: ['é aí que o', 'dinheiro some'],
  },
  quatroPerguntas: {
    perguntas: [
      'Quanto você tem?',
      'Quanto quer guardar?',
      'Quanto está gastando?',
      'Como pode melhorar?',
    ],
  },
  kakeibo: {
    kanji: [
      {kanji: '家', ruby: 'ka'},
      {kanji: '計', ruby: 'kei'},
      {kanji: '簿', ruby: 'bo'},
    ],
    risco: {antes: 'um', riscada: 'aplicativo', nova: 'caderno'},
    ano: ['1900', '1901', '1902', '1903', '1904'],
    autora: 'Hani Motoko',
  },
  dinheiroZen: {
    hanko: '禅',
    titulo: ['Dinheiro', 'Zen'],
    subtitulo: ['O guia completo do', 'método Kakeibo.'],
    aviso: [
      'Conteúdo educativo sobre organização das finanças pessoais.',
      'Não constitui recomendação financeira ou de investimento.',
    ],
  },
} as const;

const todasAsStrings = (v: unknown): string[] => {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(todasAsStrings);
  if (v && typeof v === 'object') return Object.values(v).flatMap(todasAsStrings);
  return [];
};

export const textoCompleto = todasAsStrings(textos).join('');
