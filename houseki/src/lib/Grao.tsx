import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {altura, grao, largura} from '../theme';

/**
 * GRÃO: a mesma camada por cima de tudo, inclusive do papel vazio, REGENERADA A CADA FRAME
 * (grão parado vira textura e aparece).
 *
 * A força é um número medido, não uma porcentagem (README, <Papel>): em papel vazio, o desvio
 * padrão local da luminância depois de tirar a média 5x5 tem que ficar entre 6 e 8. Ruído
 * branco perde √(24/25) nessa medida, então o desvio do ruído é 7 / 0,98 — o meio da faixa.
 * Medido no frame renderizado (ver o relatório da correção), não estimado.
 *
 * É somado com média zero e recortado nas pontas, como grão de verdade: a parte positiva
 * entra por plus-lighter; a negativa também, mas sobre o filme invertido (inverter, somar,
 * inverter de volta = subtrair). Assim o papel não clareia nem escurece, e onde é preto puro
 * o grão não acende o preto pela metade negativa. Escala 1,0 = um grão por pixel.
 */
const DESVIO = 7 / Math.sqrt(24 / 25);

const N = 1 << 21;
// quase gaussiano (soma de quatro uniformes), desvio 1
const tabela = (() => {
  const t = new Float32Array(N);
  let s = 987654321;
  const u = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296 - 0.5;
  };
  for (let i = 0; i < N; i++) t[i] = (u() + u() + u() + u()) * Math.sqrt(3);
  return t;
})();

export const Grao: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const w = Math.round(largura / grao.escala);
  const h = Math.round(altura / grao.escala);
  const pos = useRef<HTMLCanvasElement>(null);
  const neg = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cp = pos.current?.getContext('2d');
    const cn = neg.current?.getContext('2d');
    if (!cp || !cn) return;
    const [a, b] = [cp.createImageData(w, h), cn.createImageData(w, h)];
    let k = Math.floor(random(`grao-${f}`) * N);
    const passo = 1 + 2 * Math.floor(random(`passo-${f}`) * 4093);
    for (let i = 0, j = 0; i < w * h; i++, j += 4) {
      const v = tabela[k] * DESVIO;
      k = (k + passo) & (N - 1);
      const [p, n] = v > 0 ? [v, 0] : [0, -v];
      a.data[j] = a.data[j + 1] = a.data[j + 2] = p;
      b.data[j] = b.data[j + 1] = b.data[j + 2] = n;
      a.data[j + 3] = b.data[j + 3] = 255;
    }
    cp.putImageData(a, 0, 0);
    cn.putImageData(b, 0, 0);
  }, [f, w, h]);
  const estilo = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', mixBlendMode: 'plus-lighter' as const};
  return (
    <AbsoluteFill style={{filter: 'invert(1)'}}>
      <AbsoluteFill style={{filter: 'invert(1)'}}>
        {children}
        <canvas ref={pos} width={w} height={h} style={estilo} />
      </AbsoluteFill>
      <canvas ref={neg} width={w} height={h} style={estilo} />
    </AbsoluteFill>
  );
};
