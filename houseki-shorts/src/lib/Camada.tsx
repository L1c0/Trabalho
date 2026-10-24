import React, { useLayoutEffect, useRef, useState } from 'react';
import { Img, continueRender, delayRender, staticFile } from 'remotion';
import { meta } from './pecas';

/**
 * Uma camada de um plano impresso (papel ou tinta), com os estados que a
 * prensa deixou prontos. Nada é desenhado aqui: no meio de um passo, a
 * caixa que muda é recomposta do estado anterior para o seguinte, pixel a
 * pixel, na ordem do campo do passo. Nada ferve.
 */

/** Quando cada passo acontece: [frame de início, duração em frames]. */
export type Tempos = Record<string, [number, number]> | ([number, number] | null)[];

type Dados = { a: Uint8ClampedArray; b: Uint8ClampedArray; campo: Uint8ClampedArray; w: number; h: number };
const cache = new Map<string, Promise<Dados>>();

const carregar = (src: string) =>
  new Promise<HTMLImageElement>((ok, erro) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => erro(new Error(`não carregou ${src}`));
    im.src = src;
  });

const recorte = (im: HTMLImageElement, x: number, y: number, w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(im, -x, -y);
  return ctx.getImageData(0, 0, w, h).data;
};

const dadosDoPasso = (id: string, camada: string, k: number, caixa: number[]) => {
  const chave = `${id}:${camada}:${k}`;
  let p = cache.get(chave);
  if (!p) {
    const [x, y, w, h] = caixa;
    p = Promise.all([
      carregar(staticFile(`pecas/${id}-${camada}-${k - 1}.jpg`)),
      carregar(staticFile(`pecas/${id}-${camada}-${k}.jpg`)),
      carregar(staticFile(`pecas/${id}-${camada}-o${k}.png`)),
    ]).then(([ia, ib, ic]) => ({ a: recorte(ia, x, y, w, h), b: recorte(ib, x, y, w, h), campo: recorte(ic, 0, 0, w, h), w, h }));
    cache.set(chave, p);
  }
  return p;
};

const Revelacao: React.FC<{ id: string; camada: string; k: number; progresso: number }> = ({ id, camada, k, progresso }) => {
  const passo = (meta(id) as any)[camada][k - 1];
  const [x, y, w, h] = passo.caixa;
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender(`revelação ${id} ${camada} ${k}`));
  useLayoutEffect(() => {
    let vivo = true;
    dadosDoPasso(id, camada, k, passo.caixa).then((d) => {
      if (!vivo || !ref.current) return;
      const ctx = ref.current.getContext('2d')!;
      const out = ctx.createImageData(d.w, d.h);
      // r = clamp((limite - campo) / largura); campo de 16 bits (vermelho alto, verde baixo)
      const lw = passo.largura;
      const limite = -lw + progresso * (1 + 2 * lw);
      const lut = new Uint16Array(65536);
      for (let v = 0; v < 65536; v++) lut[v] = Math.round(Math.min(1, Math.max(0, (limite - v / 65535) / lw)) * 256);
      const { a, b, campo } = d;
      const o = out.data;
      for (let i = 0; i < o.length; i += 4) {
        const r = lut[(campo[i] << 8) | campo[i + 1]];
        o[i] = a[i] + (((b[i] - a[i]) * r) >> 8);
        o[i + 1] = a[i + 1] + (((b[i + 1] - a[i + 1]) * r) >> 8);
        o[i + 2] = a[i + 2] + (((b[i + 2] - a[i + 2]) * r) >> 8);
        o[i + 3] = 255;
      }
      ctx.putImageData(out, 0, 0);
      continueRender(handle);
    });
    return () => {
      vivo = false;
    };
  }, [id, camada, k, progresso, passo.caixa, passo.largura, handle]);
  return <canvas ref={ref} width={w} height={h} style={{ position: 'absolute', left: x, top: y, width: w, height: h }} />;
};

/** Em que estado a camada está no frame `f` (absoluto), e se há passo correndo. */
export const estadoEm = (id: string, camada: 'papel' | 'tinta', tempos: Tempos | undefined, f: number) => {
  const passos = (meta(id) as any)[camada] ?? [];
  let base = 0;
  let ativo = 0;
  let progresso = 0;
  for (let k = 1; k <= passos.length; k++) {
    const p = passos[k - 1];
    const t = Array.isArray(tempos) ? tempos[k - 1] : tempos?.[p.nome ?? ''];
    if (!t) break;
    const [ini, dur] = t;
    if (p.modo === 'corte' || dur <= 0) {
      if (f >= ini) base = k;
      else break;
      continue;
    }
    if (f >= ini + dur) base = k;
    else if (f >= ini) {
      ativo = k;
      progresso = (f - ini) / dur;
      break;
    } else break;
  }
  if (ativo) base = ativo - 1;
  return { base, ativo, progresso };
};

export const Camada: React.FC<{ id: string; camada: 'papel' | 'tinta'; tempos?: Tempos; f: number }> = ({ id, camada, tempos, f }) => {
  const m = meta(id);
  const { base, ativo, progresso } = estadoEm(id, camada, tempos, f);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: m.w,
        height: m.h,
        // a tinta vai por cima do papel por multiplicação (tinta transparente)
        mixBlendMode: camada === 'tinta' ? 'multiply' : 'normal',
      }}
    >
      <Img src={staticFile(`pecas/${id}-${camada}-${base}.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: m.w, height: m.h }} />
      {ativo > 0 && <Revelacao id={id} camada={camada} k={ativo} progresso={progresso} />}
    </div>
  );
};
