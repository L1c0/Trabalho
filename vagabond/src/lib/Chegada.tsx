import React, { useLayoutEffect, useRef } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import type { Camada } from './tipos';

/**
 * A tinta chegando. Sangramento, não revelação: a tinta entra no papel
 * úmido e anda pela fibra, a partir de um ponto de entrada.
 *
 *   t(x, y)  campo de chegada (geodésico, da prensa... do pincel: montagem.py),
 *            ampliado aqui e somado à fibra fina, para a frente sair desfiada
 *   no quadro T:  tinta = t < T
 *                 borda (logo atrás da frente) escurece `borda` (18 a 26%)
 *                 miolo = densidade normal
 *
 * Nada aqui é desenhado por cima: a saída é a transmitância da camada, que
 * o navegador multiplica sobre o papel, como as camadas paradas.
 */

const K_SUMI = [0x1a / 0xe8, 0x17 / 0xe4, 0x14 / 0xda];
const K_MEDIO = (K_SUMI[0] + K_SUMI[1] + K_SUMI[2]) / 3;
/** largura da borda molhada, em fração do campo (~2 frames de avanço) */
const LARGURA = 0.1;
/** a frente não é um corte: a tinta enche em ~2% do campo */
const MACIO = 0.02;
/** a água da frente leva um pouco de pigmento: só onde já há tinta (no
 * papel vazio ela desenhava nuvem de sujeira) */
const MOLHADO = 0.0;
/** amplitude da fibra fina somada ao campo */
const FIBRA = 0.05;
/** a tinta corre mais no começo e desacelera, como toda mancha */
const EXPO = 0.8;

type Dados = { t: Float32Array; mono: Uint8ClampedArray; cor: Uint8ClampedArray | null; w: number; h: number };

const imagens = new Map<string, Promise<HTMLImageElement>>();
const carregar = (src: string) => {
  let p = imagens.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((ok, erro) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = () => erro(new Error(`não carregou ${src}`));
      im.src = staticFile(src);
    });
    imagens.set(src, p);
  }
  return p;
};

const pixels = (im: HTMLImageElement, w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(im, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
};

const LN = new Float32Array(256);
for (let v = 0; v < 256; v++) LN[v] = Math.log(Math.max(v, 0.5) / 255);

/** semente estável por camada: a fibra fina não se repete igual entre camadas */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

const prontos = new Map<string, Dados>();
const preparando = new Map<string, Promise<Dados>>();

const preparar = (c: Camada, fibraSrc: string, lado: number): Promise<Dados> => {
  let p = preparando.get(c.id);
  if (!p) {
    p = Promise.all([
      carregar(c.src),
      c.cor ? carregar(c.cor) : Promise.resolve(null),
      carregar(c.campo!),
      carregar(fibraSrc),
    ]).then(([im, ic, ica, ifi]) => {
      const w = c.iw;
      const h = c.ih;
      const mono = pixels(im, w, h);
      const cor = ic ? pixels(ic, w, h) : null;
      const fw = ica.naturalWidth;
      const fh = ica.naturalHeight;
      const cr = pixels(ica, fw, fh);
      const campo = new Float32Array(fw * fh);
      for (let i = 0, j = 0; i < campo.length; i++, j += 4) campo[i] = ((cr[j] << 8) | cr[j + 1]) / 65535;
      const fib = pixels(ifi, lado, lado);
      const sem = hash(c.id);
      const ox = sem % lado;
      const oy = (sem >>> 12) % lado;
      const t = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        const gy = Math.min(fh - 1, Math.max(0, ((y + 0.5) * fh) / h - 0.5));
        const y0 = Math.floor(gy);
        const y1 = Math.min(fh - 1, y0 + 1);
        const ay = gy - y0;
        const linhaFibra = ((y + oy) % lado) * lado;
        for (let x = 0; x < w; x++) {
          const gx = Math.min(fw - 1, Math.max(0, ((x + 0.5) * fw) / w - 0.5));
          const x0 = Math.floor(gx);
          const x1 = Math.min(fw - 1, x0 + 1);
          const ax = gx - x0;
          const a = campo[y0 * fw + x0] + (campo[y0 * fw + x1] - campo[y0 * fw + x0]) * ax;
          const b = campo[y1 * fw + x0] + (campo[y1 * fw + x1] - campo[y1 * fw + x0]) * ax;
          t[y * w + x] = a + (b - a) * ay + FIBRA * (fib[(linhaFibra + ((x + ox) % lado)) * 4] / 255 - 0.5);
        }
      }
      const d = { t, mono, cor, w, h };
      prontos.set(c.id, d);
      // três camadas por aba bastam (cada chegada dura menos de um segundo)
      while (prontos.size > 3) prontos.delete(prontos.keys().next().value!);
      preparando.delete(c.id);
      return d;
    });
    preparando.set(c.id, p);
  }
  return p;
};

const desenhar = (cv: HTMLCanvasElement, d: Dados, p: number, sat: number, borda: number) => {
  const ctx = cv.getContext('2d')!;
  const out = ctx.createImageData(d.w, d.h);
  const o = out.data;
  const { t, mono, cor } = d;
  // no último frame toda a camada já passou da borda: o frame seguinte (a
  // imagem parada) não pula
  const T = -MACIO + Math.pow(Math.min(1, Math.max(0, p)), EXPO) * (1 + FIBRA / 2 + LARGURA + 2 * MACIO);
  const si = Math.round(sat * 256);
  const mr = 1 - MOLHADO * (1 - K_SUMI[0]);
  const mg = 1 - MOLHADO * (1 - K_SUMI[1]);
  const mb = 1 - MOLHADO * (1 - K_SUMI[2]);
  for (let i = 0, j = 0; i < t.length; i++, j += 4) {
    o[j + 3] = 255;
    const dt = T - t[i];
    if (dt <= 0) {
      o[j] = o[j + 1] = o[j + 2] = 255;
      continue;
    }
    let r = mono[j];
    let g = mono[j + 1];
    let b = mono[j + 2];
    if (cor) {
      r += ((cor[j] - r) * si) >> 8;
      g += ((cor[j + 1] - g) * si) >> 8;
      b += ((cor[j + 2] - b) * si) >> 8;
    }
    if (dt >= LARGURA && dt >= MACIO) {
      o[j] = r;
      o[j + 1] = g;
      o[j + 2] = b;
      continue;
    }
    const m = dt >= MACIO ? 1 : dt / MACIO;
    let R = m < 1 ? Math.exp(LN[r] * m) : r / 255;
    let G = m < 1 ? Math.exp(LN[g] * m) : g / 255;
    let B = m < 1 ? Math.exp(LN[b] * m) : b / 255;
    const q = 1 - dt / LARGURA;
    if (q > 0) {
      const bb = Math.pow(q, 1.3) * m;
      let c = (1 - (r + g + b) / 765) / (1 - K_MEDIO);
      c = c <= 0 ? 0 : c >= 1 ? 1 : Math.sqrt(c);
      const f = 1 - borda * bb * c;
      R *= f * (1 - (1 - mr) * bb);
      G *= f * (1 - (1 - mg) * bb);
      B *= f * (1 - (1 - mb) * bb);
    }
    o[j] = R * 255;
    o[j + 1] = G * 255;
    o[j + 2] = B * 255;
  }
  ctx.putImageData(out, 0, 0);
};

export const Chegada: React.FC<{
  c: Camada;
  f: number;
  sat: number;
  fibra: { src: string; lado: number };
}> = ({ c, f, sat, fibra }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ini, dur] = c.chega!;
  const p = (f - ini + 1) / Math.max(1, dur);
  const borda = c.borda ?? 0.22;

  useLayoutEffect(() => {
    const d = prontos.get(c.id);
    if (d && ref.current) {
      desenhar(ref.current, d, p, sat, borda);
      return;
    }
    const h = delayRender(`chegada ${c.id}`);
    preparar(c, fibra.src, fibra.lado)
      .then((dd) => {
        if (ref.current) desenhar(ref.current, dd, p, sat, borda);
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, [c, p, sat, borda, fibra.src, fibra.lado]);

  return (
    <canvas
      ref={ref}
      width={c.iw}
      height={c.ih}
      style={{
        position: 'absolute',
        left: c.x,
        top: c.y,
        width: c.w,
        height: c.h,
        mixBlendMode: 'multiply',
      }}
    />
  );
};
