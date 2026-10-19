/**
 * A montagem do Vinland, plano a plano.
 *
 * Cada corte cai numa pausa real da leitura (energia da narração quadro a
 * quadro, limiar -39,7 dB, pausas de 4+ quadros), os oito cortes de bloco são
 * os de timeline.ts. As revelações começam no quadro em que a palavra começa
 * (transcrição com tempo por palavra). Tudo em frames ABSOLUTOS do filme.
 *
 * folha    id em src/data/folhas.json (impressa por prensa/folhas.py)
 * passos   uma entrada por estado da folha: 'feito' = já estava impresso
 *          quando o plano entra; [frame, duração] = a tinta entra ali.
 *          Passo que não aparece fica sem imprimir.
 * camera   o ponto da folha (px de quadro a partir do centro dela) que fica
 *          no centro da tela, e a escala. empurrão = 3,5% no plano inteiro;
 *          sulco = linha reta, velocidade constante, sem easing.
 */
import type { Camera } from '../lib/Folha';

export type Passo = 'feito' | [number, number];
export type Mov = 'empurrao' | 'sulco' | 'parado';

export type Plano = {
  de: number;
  ate: number;
  folha?: string;
  passos?: Passo[];
  mov?: Mov;
  camera?: Camera;
  /** onde a câmera para quando o movimento é empurrão (sem camera explícita) */
  em?: { x: number; y: number; s?: number };
  entrada?: 'tempera';
  /** revelação com a curva do broto (só no fecho) */
  broto?: boolean;
  cena?: 'CemSocos' | 'SemInimigos';
  nota?: string;
};

const sulco = (x0: number, y0: number, x1: number, y1: number, s = 1): Camera => ({
  de: { s, x: x0, y: y0 },
  ate: { s, x: x1, y: y1 },
});

export const planos: Plano[] = [
  // ======================= 1 · THORFINN EXISTIU (guerra) =======================
  { de: 0, ate: 122, folha: 'c1', passos: [[2, 45]], nota: 'Thorfinn existiu.' },
  { de: 122, ate: 365, folha: 't1a', passos: [[166, 24], [228, 40]], nota: 'Karlsefni, islandês, c. 980' },
  { de: 365, ate: 481, folha: 'q1a', passos: ['feito'], em: { x: 0, y: -300 }, nota: 'casou com Gudrid' },
  { de: 481, ate: 719, folha: 'q1b', passos: ['feito'], nota: 'três navios, Vinland' },
  { de: 719, ate: 894, folha: 't1b', passos: [[722, 34], [815, 24]], nota: 'skrælingar' },
  { de: 894, ate: 1142, folha: 'q1c', passos: ['feito'], nota: 'irmão de Leif Erikson' },
  { de: 1142, ate: 1459, folha: 't1c', passos: [[1257, 22], [1282, 50]], nota: 'três anos' },
  { de: 1459, ate: 1781, folha: 'q1a', passos: ['feito'], mov: 'sulco', camera: sulco(0, -230, 0, 250),
    nota: 'comprou uma fazenda; a terra prometida não vingou' },

  // ======================= 2 · A FONTE / HAUKR (perda) =========================
  { de: 1781, ate: 1893, folha: 'c2', passos: [[1784, 45]], nota: 'uma coisa sobre a fonte' },
  { de: 1893, ate: 1999, folha: 't2a', passos: [[1896, 22], [1954, 30]], nota: 'as duas sagas divergem' },
  { de: 1999, ate: 2241, folha: 't2b', passos: [[2016, 16], [2082, 18], [2128, 22]],
    nota: 'sessenta contra cento e quarenta, uma apagando a outra' },
  { de: 2241, ate: 2486, folha: 'c2', mov: 'sulco', camera: sulco(-300, -95, -330, -105, 1.2), nota: 'Haukr Erlendsson' },
  { de: 2486, ate: 2798, folha: 't2c', passos: [[2557, 26], [2603, 36], [2672, 46]], nota: 'copiado por alguém da família' },
  { de: 2798, ate: 2894, folha: 't2d', passos: [[2804, 26]], nota: 'guarda essa informação' },
  { de: 2894, ate: 3358, folha: 't2e', passos: [[2930, 28], [3024, 28], [3225, 26], [3286, 30]],
    nota: '2005, 2005, 2025, vinte anos' },
  { de: 3358, ate: 3570, folha: 't2f', passos: [[3359, 20], [3441, 36]], nota: 'violência não leva a nada de bom' },
  { de: 3570, ate: 3924, folha: 'q2a', passos: ['feito'], mov: 'sulco', camera: sulco(-200, 0, 200, 0),
    nota: 'um homem que renuncia à violência' },
  { de: 3924, ate: 4105, folha: 't2g', passos: [[3924, 104]], nota: 'por que você escreve em direção a um fim reprovado?' },

  // ======================= 3 · O MUNDO É HISTÓRICO (ferro) =====================
  { de: 4105, ate: 4165, folha: 'c3', passos: [[4106, 22]], mov: 'parado', nota: 'vamos ao que ele mudou' },
  { de: 4165, ate: 4289, folha: 'q3a', passos: ['feito'], entrada: 'tempera', nota: 'criança numa aldeia islandesa' },
  { de: 4289, ate: 4492, folha: 'q3b', passos: ['feito'], entrada: 'tempera', mov: 'sulco', camera: sulco(0, -150, 0, 150),
    nota: 'o bando do assassino' },
  { de: 4492, ate: 4609, folha: 'q3c', passos: ['feito', [4494, 16], [4580, 18]], nota: 'Askeladd: invenção' },
  { de: 4609, ate: 4759, folha: 'q3d', passos: [[4610, 14], [4657, 14], [4729, 18]], nota: 'Thors, Einar: invenção' },
  { de: 4759, ate: 4935, folha: 'q3e', passos: ['feito', [4770, 20], [4840, 40]], nota: 'Canute existiu' },
  { de: 4935, ate: 5154, folha: 'q3f', passos: [[4936, 14], [4978, 14], [5043, 14]], nota: 'Thorkell, Sweyn e Harald, Leif e Gudrid' },
  { de: 5154, ate: 5446, folha: 't3a', passos: [[5249, 70], [5350, 70]], nota: 'manteve / inventou' },
  { de: 5446, ate: 5551, folha: 'c3', em: { x: 120, y: 30, s: 1.06 }, nota: 'o mundo é histórico, o motivo é ficcional' },
  { de: 5551, ate: 5741, folha: 'q3g', passos: ['feito', [5552, 30], [5611, 30]], nota: 'o motivo muda duas vezes: vingança' },
  { de: 5741, ate: 5960, folha: 'q3i', passos: ['feito'], entrada: 'tempera', nota: 'Askeladd morre; vendido como escravo' },

  // ======================= 4 · CEM SOCOS (fazenda) =============================
  { de: 5960, ate: 6076, folha: 'c4', passos: [[5962, 48]], nota: 'a cartela vazada' },
  { de: 6076, ate: 6199, folha: 'q4a', passos: ['feito'], mov: 'sulco', camera: sulco(-180, 0, 180, 0),
    nota: 'arrancando toco' },
  { de: 6199, ate: 6354, folha: 'q4b', passos: ['feito'], mov: 'sulco', camera: sulco(200, 0, -200, 0),
    nota: 'as mãos na terra' },
  { de: 6354, ate: 6651, folha: 'q4c', passos: ['feito'], mov: 'sulco', camera: sulco(0, -240, 0, 240),
    nota: 'cap. 96: aposta que aguenta cem socos' },
  { de: 6651, ate: 6906, cena: 'CemSocos', nota: 'não devolve nenhum golpe' },
  { de: 6906, ate: 7089, cena: 'SemInimigos', nota: 'de pé: eu não tenho inimigos (fala em 7042)' },

  // ======================= 5 · TOLSTÓI / 1893 (socos) ==========================
  { de: 7089, ate: 7195, folha: 'c5', passos: [[7091, 45]], nota: 'tem nome e endereço' },
  { de: 7195, ate: 7322, folha: 't5a', passos: [[7214, 24], [7286, 22]], nota: 'não resistência; Tolstói' },
  { de: 7322, ate: 7561, folha: 't5b', passos: [[7322, 36], [7382, 18], [7458, 28]], nota: 'O Reino de Deus Está em Vós, 1893' },
  { de: 7561, ate: 7926, folha: 'c5', mov: 'sulco', camera: sulco(-240, 150, -262, 185, 1.22),
    nota: 'não resistir ao mal; aceitar ser morto antes de matar' },
  { de: 7926, ate: 8103, folha: 't5c', passos: [[8010, 12], [8027, 12], [8042, 12], [8060, 24]], nota: 'raiva, medo, ódio' },
  { de: 8103, ate: 8229, folha: 't5d', passos: [[8116, 24], [8180, 24]], nota: 'Gandhi: decisivo' },

  // ======================= 6 · GANDHI DISCORDA (báltico) =======================
  { de: 8229, ate: 9115, folha: 'c6', passos: [[8231, 30], [8625, 50], [8772, 50]], mov: 'sulco',
    camera: sulco(0, 0, 20, 10, 1), nota: 'a discordância é o layout; segura boa parte do bloco' },
  { de: 9115, ate: 9312, folha: 'q6a', passos: ['feito'], mov: 'sulco', camera: sulco(200, 0, -200, 0),
    nota: 'de um lado, do outro' },
  { de: 9312, ate: 9481, folha: 'c6', passos: ['feito', 'feito', 'feito', [9312, 115]], em: { x: 0, y: 110, s: 1.06 },
    nota: 'um pode mudar de ideia; o outro não' },
  { de: 9481, ate: 9540, folha: 'q6b', passos: ['feito', [9481, 20]], nota: 'Thorfinn está no segundo grupo' },

  // ======================= 7 · 1021 (neve) =====================================
  { de: 9540, ate: 9945, folha: 'h7', passos: ['feito'], mov: 'sulco', camera: sulco(-300, 120, 300, 150),
    nota: "L'Anse aux Meadows" },
  { de: 9945, ate: 10259, folha: 't7a', passos: [[9946, 26], [10040, 14], [10066, 14], [10102, 16], [10155, 16], [10213, 16]],
    nota: 'o inventário do sítio' },
  { de: 10259, ate: 10362, folha: 'h7', passos: ['feito'], em: { x: 200, y: 260, s: 1.25 }, nota: 'a datação' },
  { de: 10362, ate: 10807, folha: 'g7', passos: [[10368, 66], [10452, 90], [10652, 116], [10772, 16]],
    nota: 'os anéis; a régua conta os 28 até 1021' },
  { de: 10807, ate: 10917, folha: 'c7', passos: [[10808, 34]], nota: 'mil e vinte e um' },
  { de: 10917, ate: 11193, folha: 'h7', passos: ['feito'], mov: 'sulco', camera: sulco(320, 300, 120, 290, 1.1),
    nota: 'foram embora de forma organizada' },
  { de: 11193, ate: 11426, folha: 'q7a', passos: ['feito'], nota: 'estação de reparo de barco' },
  { de: 11426, ate: 11488, folha: 't7b', passos: [[11427, 26]], nota: 'a terra prometida era uma oficina' },

  // ======================= 8 · JUNTA AS DUAS PONTAS (broto) ====================
  { de: 11488, ate: 12011, folha: 't8a', passos: [[11546, 56], [11783, 56]], mov: 'sulco', camera: sulco(0, 0, 25, 10),
    nota: 'o Thorfinn do Yukimura, o Thorfinn de verdade' },
  { de: 12011, ate: 12229, folha: 'q8a', passos: ['feito', [12140, 20], [12181, 18]], nota: 'arrancando toco; era escravo' },
  { de: 12229, ate: 12481, folha: 'q8b', passos: ['feito'], mov: 'sulco', camera: sulco(180, 0, -180, 0),
    nota: 'o campo arado, do outro lado' },
  { de: 12481, ate: 12848, folha: 'c2-broto', passos: [[12490, 40]], nota: 'lembra do Haukr' },
  { de: 12848, ate: 13080, folha: 't8b', passos: [[12948, 30], [12998, 24], [13030, 26]], nota: 'um texto já mexido' },
  { de: 13080, ate: 13193, folha: 'q8c', passos: ['feito'], em: { x: 0, y: -300 }, nota: 'Yukimura faz a mesma coisa' },
  { de: 13193, ate: 13454, folha: 't8c', passos: [[13205, 40], [13310, 84], [13420, 20]], nota: 'não é uma posição, é uma estratégia' },
  { de: 13454, ate: 13636, folha: 'q8d', passos: ['feito', [13458, 56], [13552, 50]], nota: 'sem prometer vitória; sem garantia de chegar' },
  { de: 13636, ate: 13845, folha: 'h8', passos: ['feito'], em: { x: 150, y: 240, s: 1.12 }, nota: 'as oito casas abandonadas em ordem' },
  { de: 13845, ate: 13922, folha: 't8e', passos: [[13846, 22], [13895, 16]], nota: 'isso é a obra' },
  { de: 13922, ate: 14104, folha: 'q8e', passos: [[13924, 110]], broto: true, nota: 'cap. 220: o broto' },
  { de: 14104, ate: 14274, folha: 'c8', passos: [[14106, 48]], nota: 'e você, continuaria?' },
];
