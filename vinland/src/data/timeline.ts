/**
 * Linha do tempo do Vinland — versão com o bloco 4 regravado.
 *
 * Narração: 475,80 s = 14.274 frames a 30 fps.
 * Áudio: vinland-narracao-v2-16LUFS.wav
 *   -16,0 LUFS · -1,6 dBTP · LRA 2,4 · 48 kHz · estéreo
 *
 * A emenda:
 *   corte de entrada  198,67 s  (3:18,67, depois de "é vendido como escravo")
 *   corte de saída    225,20 s  (3:45,20, a pausa que abria o bloco 5)
 *   trecho novo       37,63 s
 *   tudo que vem depois de 225,20 deslocou +11,10 s = +333 frames
 *
 * Normalizar só no fim, nunca os pedaços separados: cada um ganharia um
 * fator diferente e a emenda viraria degrau de volume.
 *
 * Os oito cortes caem em pausa real da leitura, medida por silencedetect
 * a -38 dB / 0,40 s no arquivo CRU emendado. Medir no normalizado não
 * funciona: ele está 10 dB mais alto e o limiar deixa de pegar as pausas
 * (achei 40 em vez de 113 — foi assim que percebi).
 */

export const FPS = 30;
export const DURACAO_NARRACAO = 14274;

export type Bloco = {
  n: number;
  nome: string;
  corte: number;
  papel: string;
  /** pausa que abriga o corte, em segundos */
  pausa: number;
};

export const blocos: Bloco[] = [
  { n: 1, nome: 'THORFINN EXISTIU',      corte: 0,     papel: 'guerra',  pausa: 0.60 },
  { n: 2, nome: 'A FONTE / HAUKR',       corte: 1781,  papel: 'perda',   pausa: 0.68 },
  { n: 3, nome: 'O MUNDO É HISTÓRICO',   corte: 4105,  papel: 'ferro',   pausa: 0.41 },
  { n: 4, nome: 'CEM SOCOS',             corte: 5960,  papel: 'fazenda', pausa: 0.64 },
  { n: 5, nome: 'TOLSTÓI / 1893',        corte: 7089,  papel: 'socos',   pausa: 0.53 },
  { n: 6, nome: 'GANDHI DISCORDA',       corte: 8229,  papel: 'baltico', pausa: 0.90 },
  { n: 7, nome: '1021',                  corte: 9540,  papel: 'neve',    pausa: 0.58 },
  { n: 8, nome: 'JUNTA AS DUAS PONTAS',  corte: 11488, papel: 'broto',   pausa: 0.51 },
];

export const duracaoBloco = (i: number) =>
  (i < blocos.length - 1 ? blocos[i + 1].corte : DURACAO_NARRACAO) - blocos[i].corte;

/**
 * O frame em que ele DIZ a frase. A cena SemInimigos tem que largar o
 * lettering do balão exatamente aqui — não antes, não depois.
 * Sobram 47 frames (1,6 s) até o bloco 5 entrar: a frase cai e corta.
 */
export const FRASE_SEM_INIMIGOS = 7042;

/** Pausas longas o bastante pra segurar um plano sem narração por cima. */
export const respiros = [
  { frame: 11320, dur: 1.38 },
  { frame: 9753,  dur: 1.24 },
  { frame: 12205, dur: 1.02 },
  { frame: 11051, dur: 0.98 },
  { frame: 10782, dur: 0.95 },
  { frame: 3479,  dur: 0.94 },
  { frame: 8215,  dur: 0.90 },
];
