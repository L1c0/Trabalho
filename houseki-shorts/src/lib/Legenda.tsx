import React from 'react';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/EBGaramond';
import palavras from '../data/palavras.json';

const { fontFamily } = loadFont('normal', { weights: ['500'] });

/**
 * A legenda queimada (V2 §1): faixa de serviço, não elemento de design.
 * EB Garamond 500, corpo 40, #2A2622 a 80%, entre y=1330 e y=1430.
 * Palavra por palavra: cada palavra entra no frame em que é dita (corte,
 * sem fade). Quando a tipografia cinética está no pico, a legenda fica só
 * com a palavra corrente (`soPalavra`).
 */

type Palavra = { t: string; b: number; de: number; ate: number };
const DADOS = palavras as unknown as Record<string, { frames: number; palavras: Palavra[] }>;

/** Linhas de no máximo ~30 caracteres, quebrando de preferência na pontuação. */
const linhas = (ps: Palavra[]) => {
  const out: Palavra[][] = [];
  let atual: Palavra[] = [];
  let tam = 0;
  ps.forEach((p, i) => {
    const novaBatida = i > 0 && p.b !== ps[i - 1].b;
    if (atual.length && (novaBatida || tam + p.t.length + 1 > 30)) {
      out.push(atual);
      atual = [];
      tam = 0;
    }
    atual.push(p);
    tam += p.t.length + 1;
    if (/[.,?:;!]$/.test(p.t) && tam >= 14) {
      out.push(atual);
      atual = [];
      tam = 0;
    }
  });
  if (atual.length) out.push(atual);
  return out;
};

export const Legenda: React.FC<{ short: string; soPalavra?: [number, number][] }> = ({ short, soPalavra = [] }) => {
  const f = useCurrentFrame();
  const ps = DADOS[short].palavras;
  const ls = linhas(ps);
  // a linha corrente: a última que já começou; some 24 frames depois da última palavra dela
  let li = -1;
  for (let i = 0; i < ls.length; i++) if (f >= Math.floor(ls[i][0].de)) li = i;
  if (li < 0) return null;
  const linha = ls[li];
  const fimLinha = linha[linha.length - 1].ate;
  const proxima = ls[li + 1]?.[0].de ?? Infinity;
  if (f > fimLinha + 24 && f < proxima) return null;
  const pico = soPalavra.some(([a, b]) => f >= a && f < b);
  const ditas = linha.filter((p) => f >= Math.floor(p.de));
  if (pico && f > ditas[ditas.length - 1].ate + 10) return null;
  // a linha inteira é diagramada desde o começo e as palavras ainda não
  // ditas ficam invisíveis: a palavra nova entra no lugar dela, nada anda
  const mostrar = pico ? ditas.slice(-1) : linha;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        width: 860,
        top: 1356,
        textAlign: 'center',
        fontFamily,
        fontWeight: 500,
        fontSize: 40,
        lineHeight: '48px',
        color: '#2A2622',
        opacity: 0.8,
        whiteSpace: 'nowrap',
      }}
    >
      {mostrar.map((p, i) => (
        <span key={i} style={{ visibility: f >= Math.floor(p.de) ? 'visible' : 'hidden' }}>
          {(i ? ' ' : '') + p.t}
        </span>
      ))}
    </div>
  );
};
