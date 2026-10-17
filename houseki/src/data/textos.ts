/**
 * O texto que aparece na tela, com a acentuação do português.
 *
 * timeline.ts e o README estão sem acento (ASCII); a fala e a transcrição não. Nada aqui é
 * texto novo: cada linha vem de timeline.ts, do README ou do mockup, só acentuada.
 */

// títulos de bloco (timeline.ts → blocos[].titulo)
export const titulos: Record<string, string> = {
  navio: 'O NAVIO',
  dureza: 'A DUREZA',
  trocas: 'A LISTA',
  locke: 'A MEMÓRIA',
  hume: 'O FEIXE',
  especies: 'AS TRÊS PARTES',
  anatta: 'ANATTA',
};

// os dois pretos que são texto (timeline.ts → pretos)
export const pergunta = 'Em que momento ela parou de ser ela?';
export const rendicao = 'Ele chegou na resposta e não conseguiu conviver com ela.';

// a régua (README → <Regua>, rótulos do mockup-mohs.png)
export const regua = {
  cabecalho: 'ESCALA DE MOHS',
  marcadores: [
    {nome: 'cinábrio', valor: 2.25, forte: false},
    {nome: 'FOSFOFILITA', valor: 3.5, forte: true},
    {nome: 'lápis-lazúli', valor: 5.25, forte: false},
    {nome: 'ágata', valor: 6.75, forte: false},
    {nome: 'DIAMANTE', valor: 10, forte: true},
  ],
  rodape: ['a pérola não entra na escala: não é mineral.', 'aragonita colada com proteína, feita por um animal.'],
};

// o tríptico (timeline.ts → plano 11214)
export const tres = {
  primeiros: ['CARNE', 'OSSO', 'ALMA'],
  depois: ['ADMIRABILIS', 'GEMAS', 'LUNARIANOS'],
};

/**
 * "O príncipe e o sapateiro. Citação em texto, sem imagem." (timeline.ts, plano 7410)
 * O TEXTO DA CITAÇÃO NÃO ESTÁ NOS ARQUIVOS. Até ele chegar, o plano fica em papel vazio.
 */
export const citacaoPrincipe: string[] | null = null;
