import { FPS } from './base';

/**
 * A narração de cada Short vem como texto (src/data/s1.ts e s2.ts): uma
 * palavra por linha, com o segundo em que começa. Aqui ela vira blocos de
 * legenda, e os tempos em segundos viram quadros do vídeo.
 */
export type Palavra = { t: number; p: string };
export type Bloco = { ini: number; fim: number; palavras: Palavra[]; letreiro: boolean };

export const leFala = (txt: string): Bloco[] => {
  const blocos: Bloco[] = [];
  let atual: Palavra[] = [];
  for (const linha of txt.split('\n')) {
    const l = linha.trim();
    if (!l) continue;
    const partes = l.split(/\s+/);
    const fecha = partes[partes.length - 1].startsWith('|') ? partes.pop()! : '';
    atual.push({ t: parseFloat(partes[0]), p: partes.slice(1).join(' ') });
    if (fecha) {
      blocos.push({ ini: atual[0].t, fim: 0, palavras: atual, letreiro: fecha.includes('*') });
      atual = [];
    }
  }
  if (atual.length) blocos.push({ ini: atual[0].t, fim: 0, palavras: atual, letreiro: false });
  blocos.forEach((b, i) => {
    const ultima = b.palavras[b.palavras.length - 1];
    const prox = blocos[i + 1]?.ini ?? ultima.t + 1.2;
    // fica na tela até o bloco seguinte, mas não mais que 0,9 s depois da última palavra começar
    b.fim = Math.min(prox, ultima.t + 0.9);
  });
  return blocos;
};

/** Converte segundos da narração em quadros do vídeo, descontado o silêncio cortado do começo. */
export const relogio = (corte: number) => (seg: number) => Math.round((seg - corte) * FPS);

/** O segundo em que começa a `n`-ésima ocorrência de uma palavra (sem pontuação, sem caixa). */
export const acha = (blocos: Bloco[]) => {
  const limpa = (s: string) => s.toLowerCase().replace(/[“”".,:;!?]/g, '');
  return (palavra: string, n = 1): number => {
    let k = 0;
    for (const b of blocos) {
      for (const p of b.palavras) {
        if (limpa(p.p) === limpa(palavra) && ++k === n) return p.t;
      }
    }
    throw new Error(`a palavra "${palavra}" (${n}ª) não está na fala`);
  };
};
