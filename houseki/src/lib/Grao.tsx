import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {altura, grao, largura} from '../theme';

/**
 * GRÃO: a mesma camada por cima de tudo, inclusive do papel vazio, a 2,8%, REGENERADA A
 * CADA FRAME (grão parado vira textura e aparece). É somado com média zero: a parte
 * positiva entra por plus-lighter, a negativa por difference. Assim ele não clareia nem
 * escurece o papel, só o anima. Escala 1,0 = um grão por pixel.
 */
const N = 1 << 21;
const tabela = (() => {
  const t = new Int8Array(N);
  let s = 987654321;
  for (let i = 0; i < N; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    t[i] = (s >>> 24) - 128;
  }
  return t;
})();

export const Grao: React.FC = () => {
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
      const v = tabela[k] * grao.opacidade;
      k = (k + passo) & (N - 1);
      const [p, n] = v > 0 ? [v, 0] : [0, -v];
      a.data[j] = a.data[j + 1] = a.data[j + 2] = p;
      b.data[j] = b.data[j + 1] = b.data[j + 2] = n;
      a.data[j + 3] = b.data[j + 3] = 255;
    }
    cp.putImageData(a, 0, 0);
    cn.putImageData(b, 0, 0);
  }, [f, w, h]);
  const estilo = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%'};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <canvas ref={pos} width={w} height={h} style={{...estilo, mixBlendMode: 'plus-lighter'}} />
      <canvas ref={neg} width={w} height={h} style={{...estilo, mixBlendMode: 'difference'}} />
    </AbsoluteFill>
  );
};
