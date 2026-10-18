import {blocos, pretos, trocasDoPapel} from '../data/timeline';
import {cor, papel} from '../theme';

/**
 * A cor do papel em cada frame. O papel é o Phos.
 *
 * - Fora do bloco 'trocas': a cor do bloco, interpolando 120 frames na entrada dele.
 * - Dentro de 'trocas': seis mudanças, uma por substituição, 90 frames cada.
 * - O FIM (terceiro preto): o papel vai a preto puro em 20 frames.
 * Interpolação lenta e suave, nunca corte.
 */
const ENTRADA_BLOCO = 120;
const TROCA = 90;
const PRETO_FINAL = 20;

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const suave = (t: number) => t * t * (3 - 2 * t);

type Passo = {frame: number; para: string; dur: number};
const chave = (k: string) => (papel as Record<string, string>)[k];

const passos: Passo[] = (() => {
  const lista: Passo[] = [];
  let atual = chave(blocos[0].papel);
  for (const b of blocos) {
    if (b.papel === 'ENCADEADO') {
      for (const t of trocasDoPapel) {
        lista.push({frame: t.frame, para: chave(t.papel), dur: TROCA});
        atual = chave(t.papel);
      }
    } else if (chave(b.papel) !== atual) {
      lista.push({frame: b.de, para: chave(b.papel), dur: ENTRADA_BLOCO});
      atual = chave(b.papel);
    }
  }
  // o terceiro preto: "O papel vai para preto puro em 20 frames"
  lista.push({frame: pretos[2].de, para: cor.preto, dur: PRETO_FINAL});
  return lista;
})();

const INICIO = chave(blocos[0].papel);

/** O terceiro preto, de 0 a 1, com a mesma curva do papel: o quadro em cena desce junto. */
export const pretoFinal = (f: number) => suave(Math.min(1, Math.max(0, (f - pretos[2].de) / PRETO_FINAL)));

export const papelNo = (f: number): string => {
  let c = rgb(INICIO);
  for (const p of passos) {
    if (f <= p.frame) break;
    const t = suave(Math.min(1, (f - p.frame) / p.dur));
    const alvo = rgb(p.para);
    c = c.map((v, i) => v + (alvo[i] - v) * t);
  }
  return hex(c);
};
