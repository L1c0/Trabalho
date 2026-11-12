import React from 'react';
import { c01, COR, FONTE, prog, saiExpo, W } from './base';
import { Bloco } from './fala';

/**
 * A legenda: o bloco que está sendo dito, em tiras de tinta. Cada palavra
 * entra no instante em que é falada e a palavra do momento fica dourada.
 * Os blocos marcados como letreiro não aparecem aqui (a cena já os mostra).
 */
export const Legenda: React.FC<{
  blocos: Bloco[];
  f: number;
  /** segundos da narração -> quadro */
  q: (seg: number) => number;
  y?: number;
  /** quadros em que a legenda some (cenas que pedem tela limpa): pares [ini, fim] */
  esconde?: [number, number][];
  tam?: number;
}> = ({ blocos, f, q, y = 1418, esconde = [], tam = 58 }) => {
  if (esconde.some(([a, b]) => f >= a && f < b)) return null;
  const i = blocos.findIndex((b) => f >= q(b.ini) - 1 && f < q(b.fim));
  if (i < 0) return null;
  const b = blocos[i];
  if (b.letreiro) return null;
  const ini = q(b.ini) - 1;
  const abre = saiExpo(prog(f, ini, 5));
  const fecha = 1 - prog(f, q(b.fim) - 3, 3);
  const giro = (i % 2 ? 1 : -1) * 1.1;
  return (
    <div style={{ position: 'absolute', left: 90, width: W - 180, top: y, display: 'flex', justifyContent: 'center', opacity: c01(fecha), pointerEvents: 'none' }}>
      <div style={{ transform: `rotate(${giro}deg) translateY(${((1 - abre) * 26).toFixed(1)}px)`, opacity: abre, textAlign: 'center', maxWidth: 860 }}>
        <span
          style={{
            fontFamily: FONTE.oswald,
            fontWeight: 700,
            fontSize: tam,
            lineHeight: 1.62,
            letterSpacing: '0.035em',
            textTransform: 'uppercase',
            color: COR.osso,
            background: COR.tinta,
            padding: '6px 22px 8px',
            WebkitBoxDecorationBreak: 'clone',
            boxDecorationBreak: 'clone',
            boxShadow: `7px 8px 0 rgba(181,19,13,0.92)`,
          }}
        >
          {b.palavras.map((p, k) => {
            const t0 = q(p.t);
            const t1 = k + 1 < b.palavras.length ? q(b.palavras[k + 1].t) : q(b.fim);
            const dita = f >= t0 - 1;
            const agora = f >= t0 - 1 && f < t1 - 1;
            const pulo = dita ? 1 + 0.16 * Math.pow(1 - prog(f, t0 - 1, 5), 2) : 1;
            return (
              <React.Fragment key={k}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: dita ? 1 : 0.34,
                    color: agora ? COR.sol : COR.osso,
                    transform: `scale(${pulo.toFixed(3)})`,
                  }}
                >
                  {p.p}
                </span>
                {k < b.palavras.length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </span>
      </div>
    </div>
  );
};
