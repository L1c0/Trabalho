import { loadFont } from '@remotion/google-fonts/CormorantGaramond';

const cormorant = loadFont();

/**
 * Uma familia so, o filme inteiro. A variacao vem de peso, corpo e
 * entreletra — nunca de uma fonte nova.
 *
 * Nao troque por Playfair. Playfair tem contraste alto e eixo vertical
 * duro; parece capa de revista. Cormorant tem o desenho antigo, de
 * Garamond, que e o que faz a tela parecer pagina impressa.
 */
export const font = cormorant.fontFamily;

/**
 * O PAPEL E O PHOS.
 * Essa e a ideia central do filme e esta inteira aqui nesta constante.
 *
 * O fundo comeca no verde da fosfofilita e vai sendo contaminado pela
 * cor de cada material que entra no corpo dela. Ninguem vai reparar.
 * Todo mundo vai sentir.
 *
 * A transicao entre dois estados NUNCA e um corte. E uma interpolacao
 * lenta, de 90 a 150 frames, atravessando o bloco inteiro.
 */
export const papel = {
  fosfofilita: '#DCE6E2', // verde-azulado, o estado original
  agata:       '#E0DDD4', // as pernas
  ouro:        '#E6DFCE', // os bracos
  lapis:       '#DCDEE4', // a cabeca
  perola:      '#E6E4DE', // o olho esquerdo
  prata:       '#E2E3E4', // o olho direito
  mercurio:    '#DEDFE0', // a cabeca escorrendo
  neutro:      '#E4E2DD', // o bloco do anatta: nao sobrou cor nenhuma
};

export const cor = {
  tinta: '#221F1B',  // o preto quente. E o preto padrao do filme.
  fraco: '#7A7E78',  // rotulo, numero, nota de rodape
  /**
   * PRETO PURO E RESERVADO.
   * Pode aparecer em exatamente tres momentos do filme, listados em
   * data/timeline.ts. Se voce usar em qualquer outro lugar, os tres
   * perdem o efeito e o filme fica cinza do comeco ao fim.
   */
  preto: '#000000',
};

/**
 * Corpo de texto em escala de livro, nao de video.
 * Nada aqui e "grande para caber na tela do celular". Se o espectador
 * tem que apertar o olho, otimo: e o que ele faz com um livro.
 */
export const tipo = {
  tituloBloco: 64,
  citacao: 48,
  corpo: 36,
  rotulo: 30,   // sempre em caixa alta com entreletra de 0.22em
  nota: 26,
};

/**
 * Margens assimetricas. Nada e centralizado neste filme, nunca.
 * A margem esquerda e a espinha; a direita respira.
 */
export const grade = {
  esq: 240,
  dir: 180,
  topo: 190,
  base: 170,
};

export const fps = 30;
export const largura = 1920;
export const altura = 1080;

/** Grao: a mesma camada por cima de tudo, inclusive do papel vazio. */
export const grao = { opacidade: 0.028, escala: 1.0 };
