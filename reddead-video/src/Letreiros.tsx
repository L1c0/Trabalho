import React from 'react';
import { Img, staticFile } from 'remotion';
import { c01, entrada } from './comum';
import sobreJogo from './data/sobre-jogo.json';

/**
 * Os letterings sobre o jogo (coreografia.sobre_jogo). O pacote dá o quadro
 * de entrada, a classe e a posição. Já vêm alinhados pela linha de base
 * (ferramentas/prepara-v3.py).
 *
 * - Entrada: a das peças. 8 quadros, sobe 24 px, opacidade. Nos de impacto
 *   é letra a letra, 3 quadros entre elas, como nas chapas.
 * - Saída: o pacote não diz. Ficou assim:
 *   - Dois letterings da mesma cena com até 8 s entre eles formam um par
 *     ("A MEDICINA OCIDENTAL INTEIRA" / "DE MÃOS VAZIAS"). O impacto fica
 *     em cima da tarja, e os dois saem juntos, 5 s depois do segundo.
 *   - Um do mesmo tipo no par (impacto e impacto) tira o anterior antes de
 *     entrar.
 *   - Se sobrar menos de 2,5 s até o corte, fica até o corte.
 *   - A saída é só opacidade, em 8 quadros.
 */
type Item = {
  id: string;
  arq: string;
  cena: number;
  frame: number;
  classe: 'impacto' | 'tarja';
  texto: string;
  x: number;
  y: number;
  w: number;
  h: number;
  letras?: number[][];
};
type Pronto = Item & { sai: number; cortes: number[][] };

const SEGURA = 150;
const PAR = 240;
const EMENDA = 75;
const SAIDA = 8;

/** Cortes de letra contíguos: a fronteira fica no meio do vão entre duas letras. */
const contiguos = (letras: number[][], w: number) =>
  letras.map(([a, b], k) => [
    k === 0 ? 0 : Math.round((letras[k - 1][1] + a) / 2),
    k === letras.length - 1 ? w : Math.round((b + letras[k + 1][0]) / 2),
  ]);

export const preparaLetreiros = (fimDaCena: (cena: number) => number): Pronto[] => {
  const itens = (sobreJogo as unknown as Item[]).slice().sort((a, b) => a.frame - b.frame);
  const prontos: Pronto[] = [];
  const porCena = new Map<number, Item[]>();
  for (const g of itens) porCena.set(g.cena, [...(porCena.get(g.cena) ?? []), g]);
  for (const [cena, lista] of porCena) {
    const fim = fimDaCena(cena);
    const grupos: Item[][] = [];
    for (const g of lista) {
      const ult = grupos[grupos.length - 1];
      if (ult && g.frame - ult[ult.length - 1].frame <= PAR) ult.push(g);
      else grupos.push([g]);
    }
    for (const grupo of grupos) {
      let sai = Math.min(fim, grupo[grupo.length - 1].frame + SEGURA);
      if (fim - sai < EMENDA) sai = fim;
      for (const g of grupo) {
        const prox = grupo.find((o) => o.frame > g.frame && o.classe === g.classe);
        prontos.push({
          ...g,
          sai: prox ? prox.frame - 2 : sai,
          cortes: g.letras ? contiguos(g.letras, g.w) : [[0, g.w]],
        });
      }
    }
  }
  return prontos;
};

export const Letreiros: React.FC<{ itens: Pronto[]; f: number; fim: number }> = ({ itens, f, fim }) => (
  <>
    {itens.map((g) => {
      if (f < g.frame) return null;
      const some = g.sai < fim ? c01((g.sai - f) / SAIDA) : 1;
      if (some <= 0) return null;
      const src = staticFile(`pecas/_sobre-jogo/${g.arq}`);
      return (
        <div key={g.id} style={{ position: 'absolute', left: g.x, top: g.y, width: g.w, height: g.h, opacity: some }}>
          {g.cortes.map(([a, b], k) => {
            const { op, dy } = entrada(f, g.frame + (g.classe === 'impacto' ? 3 * k : 0));
            if (op <= 0) return null;
            return (
              <Img
                key={k}
                src={src}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: dy,
                  width: g.w,
                  height: g.h,
                  opacity: op,
                  clipPath: g.cortes.length > 1 ? `inset(0 ${g.w - b}px 0 ${a}px)` : undefined,
                }}
              />
            );
          })}
        </div>
      );
    })}
  </>
);
