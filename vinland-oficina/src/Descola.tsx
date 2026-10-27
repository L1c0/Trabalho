import React, { useLayoutEffect, useRef } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

/**
 * Uma construção saindo (LEIA-PRIMEIRO: "a saída não é fade"). O limiar
 * sobe sobre a máscara de ruído: onde a máscara está abaixo dele, a tinta
 * já descolou. A coluna da tabela é o valor que vai de 1 a 0, então o
 * limiar é 1 − v na escala da máscara (0..255). A borda do limiar tem
 * MACIO níveis de largura, só para não serrilhar.
 *
 * Só a caixa da construção (timeline.json) é processada, com uma folga.
 */
const W = 1080;
const H = 1920;
const MACIO = 4;
const FOLGA = 6;

type Dados = { tinta: Uint8ClampedArray; mascara: Uint8ClampedArray };
const cache = new Map<string, Promise<Dados>>();

const pixels = (src: string, x: number, y: number, w: number, h: number) =>
  new Promise<Uint8ClampedArray>((ok, erro) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(im, 0, 0, W, H);
      ok(ctx.getImageData(x, y, w, h).data);
    };
    im.onerror = () => erro(new Error(`não carregou ${src}`));
    im.src = staticFile(src);
  });

export const Descola: React.FC<{ chapa: string; mascara: string; caixa: number[]; v: number }> = ({ chapa, mascara, caixa, v }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const x = Math.max(0, caixa[0] - FOLGA);
  const y = Math.max(0, caixa[1] - FOLGA);
  const w = Math.min(W, caixa[2] + FOLGA) - x;
  const h = Math.min(H, caixa[3] + FOLGA) - y;
  useLayoutEffect(() => {
    const hd = delayRender(`descola ${chapa}`);
    const k = `${chapa}|${mascara}`;
    let p = cache.get(k);
    if (!p) {
      p = Promise.all([pixels(chapa, x, y, w, h), pixels(mascara, x, y, w, h)]).then(([tinta, m]) => ({ tinta, mascara: m }));
      cache.set(k, p);
    }
    p.then(({ tinta, mascara: m }) => {
      const cv = ref.current;
      if (!cv) return continueRender(hd);
      const ctx = cv.getContext('2d')!;
      const out = ctx.createImageData(w, h);
      const o = out.data;
      const limiar = (1 - v) * 255;
      for (let i = 0; i < o.length; i += 4) {
        const a = tinta[i + 3];
        if (a === 0) continue;
        const fica = (m[i] - limiar) / MACIO + 0.5;
        if (fica <= 0) continue;
        o[i] = tinta[i];
        o[i + 1] = tinta[i + 1];
        o[i + 2] = tinta[i + 2];
        o[i + 3] = fica >= 1 ? a : a * fica;
      }
      ctx.putImageData(out, 0, 0);
      continueRender(hd);
    }).catch((e) => cancelRender(e));
  }, [chapa, mascara, v, x, y, w, h]);
  return <canvas ref={ref} width={w} height={h} style={{ position: 'absolute', left: x, top: y, width: w, height: h }} />;
};
