export const ordemDasCenas = [
  'ma',
  'tresSegundos',
  'dinheiroSome',
  'quatroPerguntas',
  'kakeibo',
  'dinheiroZen',
] as const;

export type CenaId = (typeof ordemDasCenas)[number];
