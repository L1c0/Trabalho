import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {medidas} from '../theme';
import {useFormato} from './formato';

// GRÃO + VINHETA: a camada única no topo. Ruído gaussiano sigma 0,012, REGENERADO A CADA
// QUADRO (posição e passo novos na tabela gaussiana a cada frame). Somado de verdade: a parte
// positiva entra por plus-lighter, a negativa por difference, para aparecer também no fundo
// quase preto (overlay e soft-light somem no escuro). Meia resolução: grão de 2 px.
const N = 1 << 20;
const tabela = (() => {
  const t = new Float32Array(N);
  let s = 12345;
  const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) + 1) / 0x80000001;
  for (let i = 0; i < N; i += 2) {
    const [u, v] = [r(), r()];
    const m = Math.sqrt(-2 * Math.log(u));
    t[i] = m * Math.cos(2 * Math.PI * v);
    t[i + 1] = m * Math.sin(2 * Math.PI * v);
  }
  return t;
})();

export const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const fm = useFormato();
  const [w, h] = [fm.largura / 2, fm.altura / 2];
  const pos = useRef<HTMLCanvasElement>(null);
  const neg = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cp = pos.current?.getContext('2d');
    const cn = neg.current?.getContext('2d');
    if (!cp || !cn) return;
    const [ip, ineg] = [cp.createImageData(w, h), cn.createImageData(w, h)];
    const amp = medidas.grao.sigma * 255;
    let k = Math.floor(random(`grao-${f}`) * N);
    const passo = 1 + 2 * Math.floor(random(`passo-${f}`) * 997);
    for (let i = 0; i < w * h; i++) {
      const v = tabela[k] * amp;
      k = (k + passo) & (N - 1);
      const j = i * 4;
      const [a, b] = v > 0 ? [v, 0] : [0, -v];
      ip.data[j] = ip.data[j + 1] = ip.data[j + 2] = a;
      ineg.data[j] = ineg.data[j + 1] = ineg.data[j + 2] = b;
      ip.data[j + 3] = ineg.data[j + 3] = 255;
    }
    cp.putImageData(ip, 0, 0);
    cn.putImageData(ineg, 0, 0);
  }, [f, w, h]);
  const estilo = {position: 'absolute' as const, inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated' as const};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <canvas ref={pos} width={w} height={h} style={{...estilo, mixBlendMode: 'plus-lighter'}} />
      <canvas ref={neg} width={w} height={h} style={{...estilo, mixBlendMode: 'difference'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${medidas.grao.vinheta}) 100%)`}} />
    </AbsoluteFill>
  );
};
