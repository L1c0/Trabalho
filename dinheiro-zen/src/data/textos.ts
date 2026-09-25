// Todo texto que aparece na tela. Cada item de array é uma linha (a quebra é intencional).
// Campos opcionais vazios não aparecem na tela.
// VERSÃO DE TESTE: o texto acompanha a locução de teste. Render descartável, não publicar.

type Linhas = readonly string[];

type Textos = {
  ma: {kanji: string; ruby: string; legenda: Linhas};
  tresSegundos: {
    querer: {kanji: string; ruby: string};
    comprar: {kanji: string; ruby: string};
    contagem: Linhas;
    legenda: Linhas;
  };
  dinheiroSome: {categorias: number; legenda: Linhas};
  quatroPerguntas: {ano?: Linhas; perguntas: Linhas};
  kakeibo: {
    kanji: readonly {kanji: string; ruby: string}[];
    nome?: Linhas;
    risco?: {antes: string; riscada: string; nova: string};
    autora?: string;
  };
  dinheiroZen: {hanko: string; titulo: Linhas; subtitulo?: Linhas; aviso?: Linhas};
};

export const textos: Textos = {
  ma: {
    kanji: '間',
    ruby: 'ma',
    legenda: ['a pausa'],
  },
  tresSegundos: {
    querer: {kanji: '欲', ruby: 'yoku'},
    comprar: {kanji: '買', ruby: 'kau'},
    contagem: ['3', '2', '1'],
    legenda: ['TRÊS', 'SEGUNDOS'],
  },
  dinheiroSome: {
    categorias: 4,
    legenda: ['entre querer', 'e comprar'],
  },
  quatroPerguntas: {
    ano: ['1900', '1901', '1902', '1903', '1904'],
    perguntas: ['Quanto você tem?', 'Quanto quer guardar?', 'Quanto está gastando?', 'Como pode melhorar?'],
  },
  kakeibo: {
    kanji: [
      {kanji: '家', ruby: 'ka'},
      {kanji: '計', ruby: 'kei'},
      {kanji: '簿', ruby: 'bo'},
    ],
    nome: ['Kakeibo'],
  },
  dinheiroZen: {
    hanko: '禅',
    titulo: ['Dinheiro', 'Zen'],
  },
};

const todasAsStrings = (v: unknown): string[] => {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(todasAsStrings);
  if (v && typeof v === 'object') return Object.values(v).flatMap(todasAsStrings);
  return [];
};

export const textoCompleto = todasAsStrings(textos).join('');
