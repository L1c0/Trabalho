/**
 * OS QUATRO SHORTS — 1080x1920, 30fps.
 *
 * As durações e os cortes só podem ser escritos depois que as narrações
 * existirem, pelo mesmo motivo do ensaio: todo corte cai numa pausa da
 * fala. O que está aqui é a estrutura e a zona segura.
 *
 * Os roteiros completos estão em SHORTS.md, na raiz.
 */

/** A interface do Shorts cobre a tela. Nada legível fora desta caixa. */
export const zonaSegura = {
  topo: 120,
  base: 380,   // titulo, canal, barra de progresso
  direita: 160, // curtir, comentar, compartilhar
  esquerda: 60,
  // caixa util: x de 60 a 920, y de 120 a 1540
  textoDe: 380,
  textoAte: 1100,
  legendaDe: 1150,
  legendaAte: 1400,
};

export type Short = {
  id: string;
  ordem: number;
  titulo: string;
  dur: string;
  pecas: string[];
  papel: string | 'ENCADEADO';
  nota: string;
};

export const shorts: Short[] = [
  {
    id: 'leviata',
    ordem: 1,
    titulo: 'Essa gravura de 1651 é feita de gente',
    dur: '~40s',
    pecas: ['leviata'],
    papel: 'neutro',
    nota: 'Uma peça só, do começo ao fim. O zoom do ensaio refeito em vertical: ' +
          'começa na gravura inteira e termina dentro da armadura. Em "agora chega ' +
          'perto" o movimento acelera — antes disso ele é lento o bastante para ' +
          'parecer parado, e esse contraste é o Short inteiro.',
  },
  {
    id: 'navio',
    ordem: 2,
    titulo: 'Esse navio não tem nenhuma peça original',
    dur: '~45s',
    pecas: ['navio', 'teseu', 'leviata'],
    papel: 'fosfofilita',
    nota: 'Os dois tondos circulares abrem; o Leviatã entra só na parte do Hobbes. ' +
          'Papel vazio nos dois momentos de pergunta.',
  },
  {
    id: 'memoria',
    ordem: 3,
    titulo: 'Nesse mangá a memória fica guardada no corpo',
    dur: '~45s',
    pecas: ['pernas', 'doacaoCabeca', 'olhoPerola', 'escorrendo', 'minuscula'],
    papel: 'ENCADEADO',
    nota: 'O que converte inscrito: é o único que mostra o que o canal faz. ' +
          'O papel deriva uma vez a cada perda citada, sete trocas rápidas em 45s ' +
          '(ver theme.ts -> papel, mesma ordem do ensaio). Ninguém vai saber dizer ' +
          'por quê, mas a contaminação chega.',
  },
  {
    id: 'pedra',
    ordem: 4,
    titulo: 'A pedra mais frágil do mundo virou protagonista',
    dur: '~35s',
    pecas: ['pernas'],
    papel: 'fosfofilita',
    nota: 'A régua de Mohs girada para vertical: 1 em cima, 10 embaixo, marcadores ' +
          'saindo para a direita. O 3,5 e o 10 entram grandes, contando, como no ensaio.',
  },
];

/**
 * LEGENDA QUEIMADA — obrigatória nos quatro.
 * A maioria assiste sem som. Palavra por palavra, Cormorant 600, 64px,
 * centralizada entre legendaDe e legendaAte. É a única coisa destes
 * Shorts que não existe no ensaio.
 */
export const legenda = {
  fonte: 600,
  corpo: 64,
  de: zonaSegura.legendaDe,
  ate: zonaSegura.legendaAte,
  modo: 'palavra-por-palavra' as const,
};

/**
 * O primeiro frame tem que estar completo. O feed julga em meio segundo,
 * e um Short que abre em papel vazio perde antes de começar.
 *
 * Fora isso, as regras do ensaio valem inteiras: corte seco, um movimento
 * só, nada de spring, flash, partícula ou corte na batida.
 */
