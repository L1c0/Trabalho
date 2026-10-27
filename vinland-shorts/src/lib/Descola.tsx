import React, { useLayoutEffect, useRef } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

/**
 * A chapa saindo: a tinta descola em mancha, não dá fade. O limiar avança
 * sobre o ruído da máscara (mascara-N.png) de `lo` a `hi` (a faixa útil do
 * ruído, medida em preparar.py); onde o ruído fica abaixo do limiar, a
 * tinta já saiu. A borda do descolamento tem 8 níveis de largura, para não
 * serrilhar.
 */
type Dados = { tinta: Uint8ClampedArray; mascara: Uint8ClampedArray };
const cache = new Map<string, Promise<Dados>>();
const W = 1080;
const H = 1920;
const MACIO = 8;

const pixels = (src: string) =>
  new Promise<Uint8ClampedArray>((ok, erro) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(im, 0, 0, W, H);
      ok(ctx.getImageData(0, 0, W, H).data);
    };
    im.onerror = () => erro(new Error(`não carregou ${src}`));
    im.src = staticFile(src);
  });

const carregar = (chapa: string, mascara: string) => {
  const k = `${chapa}|${mascara}`;
  let p = cache.get(k);
  if (!p) {
    p = Promise.all([pixels(chapa), pixels(mascara)]).then(([tinta, m]) => ({ tinta, mascara: m }));
    cache.set(k, p);
  }
  return p;
};

export const Descola: React.FC<{
  chapa: string;
  mascara: string;
  /** 0..1: quanto já descolou */
  u: number;
  lo: number;
  hi: number;
  style?: React.CSSProperties;
}> = ({ chapa, mascara, u, lo, hi, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`descola ${chapa}`);
    carregar(chapa, mascara)
      .then(({ tinta, mascara: m }) => {
        const cv = ref.current;
        if (!cv) return continueRender(h);
        const ctx = cv.getContext('2d')!;
        const out = ctx.createImageData(W, H);
        const o = out.data;
        const limiar = lo + (hi - lo) * u;
        for (let i = 0; i < o.length; i += 4) {
          const a = tinta[i + 3];
          if (a === 0) continue;
          const fica = (m[i] - limiar) / MACIO;
          if (fica <= 0) continue;
          o[i] = tinta[i];
          o[i + 1] = tinta[i + 1];
          o[i + 2] = tinta[i + 2];
          o[i + 3] = fica >= 1 ? a : a * fica;
        }
        ctx.putImageData(out, 0, 0);
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, [chapa, mascara, u, lo, hi]);
  return <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, ...style }} />;
};
