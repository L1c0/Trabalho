import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame,
} from 'remotion';
import folhas from '../data/folhas.json';
import { papel } from '../theme';

/**
 * Uma folha que saiu da prensa (prensa/folhas.py), com a câmera por cima.
 *
 * A folha é impressa UMA vez, em 1,16x o quadro e na escala de 1440p. O
 * Remotion não imprime nada: ele escolhe que pedaço da folha mostrar (a
 * câmera) e, quando a folha tem estados, descobre a tinta do estado
 * seguinte por cima do anterior, na ordem de um campo que também veio da
 * prensa. Nenhum pixel é inventado aqui, então o papel não ferve.
 */

type Passo = { caixa: number[]; largura: number; modo: string };
type Meta = {
  id: string; w: number; h: number; uw: number; uh: number; escala: number;
  tom: string; estados: number; passos: Passo[];
};
const META = folhas as unknown as Record<string, Meta>;

export const meta = (id: string) => {
  const m = META[id];
  if (!m) throw new Error(`folha ${id} não foi impressa (rode prensa/folhas.py ${id})`);
  return m;
};

/** Onde a câmera olha: escala e o ponto da folha (em px de quadro, a partir do centro dela) que fica no centro da tela. */
export type Pose = { s: number; x: number; y: number };
export type Camera = { de: Pose; ate: Pose };

/** Revelação de um passo: começa em `em` (frame local do plano) e dura `dur`
 * frames. `curva` troca o avanço linear por outro (o broto). */
export type Revela = { em: number; dur: number; curva?: (f: number) => number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const pose = (c: Camera, t: number): Pose => ({
  s: lerp(c.de.s, c.ate.s, t),
  x: lerp(c.de.x, c.ate.x, t),
  y: lerp(c.de.y, c.ate.y, t),
});

/* ------------------------------------------------------------------ *
 * pixels da caixa que muda, por (folha, passo): estado anterior, estado
 * novo e o campo. Carregados uma vez por aba de render.
 * ------------------------------------------------------------------ */
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

const dadosDoPasso = (id: string, k: number, caixa: number[]) => {
  const chave = `${id}:${k}`;
  let p = cache.get(chave);
  if (!p) {
    const [x, y, w, h] = caixa;
    p = Promise.all([
      carregar(staticFile(`folhas/${id}-${k - 1}.jpg`)),
      carregar(staticFile(`folhas/${id}-${k}.jpg`)),
      carregar(staticFile(`folhas/${id}-o${k}.png`)),
    ]).then(([ia, ib, ic]) => ({
      a: recorte(ia, x, y, w, h),
      b: recorte(ib, x, y, w, h),
      campo: recorte(ic, 0, 0, w, h),
      w,
      h,
    }));
    cache.set(chave, p);
  }
  return p;
};

/** A tinta do passo k entrando: estado k-1 + (k - (k-1)) × r(campo). */
const Revelacao: React.FC<{ id: string; k: number; progresso: number; escala: number }> = ({
  id, k, progresso, escala,
}) => {
  const m = meta(id);
  const passo = m.passos[k - 1];
  const [x, y, w, h] = passo.caixa;
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender(`revelação ${id} passo ${k}`));

  useLayoutEffect(() => {
    let vivo = true;
    dadosDoPasso(id, k, passo.caixa).then((d) => {
      if (!vivo || !ref.current) return;
      const ctx = ref.current.getContext('2d')!;
      const out = ctx.createImageData(d.w, d.h);
      // r = clamp((limite - campo) / largura): a borda do avanço tem a
      // largura de uma gota, não de um degradê. O campo vem em 16 bits
      // (alto no vermelho, baixo no verde); um campo cinza de 8 bits lê
      // igual (v * 257 / 65535 = v / 255).
      const lw = passo.largura;
      const limite = -lw + progresso * (1 + 2 * lw);
      const lut = new Uint16Array(65536);
      for (let v = 0; v < 65536; v++) {
        lut[v] = Math.round(Math.min(1, Math.max(0, (limite - v / 65535) / lw)) * 256);
      }
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
  }, [id, k, progresso, passo.caixa, passo.largura, handle]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      style={{ position: 'absolute', left: x / escala, top: y / escala, width: w / escala, height: h / escala }}
    />
  );
};

/**
 * A folha. `passos`: uma revelação por estado (na ordem); quem não passar
 * `passos` vê a folha pronta. `estado` força um estado fixo. `tinta` (0..1)
 * deixa o papel do estado 0 por cima: é a têmpera e a entrada de quadro sem
 * mexer no tom do papel.
 */
export const FolhaImpressa: React.FC<{
  id: string;
  camera?: Camera;
  /** 0..1 ao longo do plano; quem chama decide a curva (sulco = linear) */
  t?: number;
  passos?: Revela[];
  estado?: number;
  tinta?: number;
  transform?: string;
  transformOrigin?: string;
}> = ({ id, camera, t = 0, passos, estado, tinta = 1, transform, transformOrigin }) => {
  const frame = useCurrentFrame();
  const m = meta(id);
  const n = m.estados - 1;

  // em que estado a folha está, e se tem um passo no meio da revelação
  let base = n;
  let ativo = 0;
  let progresso = 0;
  if (estado !== undefined) {
    base = estado;
  } else if (passos) {
    base = 0;
    for (let k = 1; k <= passos.length; k++) {
      const r = passos[k - 1];
      if (frame >= r.em + r.dur) base = k;
      else if (frame >= r.em) {
        ativo = k;
        progresso = r.curva ? r.curva(frame - r.em) : (frame - r.em) / Math.max(1, r.dur);
        break;
      } else break;
    }
    if (ativo) base = ativo - 1;
  }

  // a câmera nunca mostra a borda da folha: o ponto olhado fica dentro da
  // sangria que sobra naquela escala
  const p0 = camera ? pose(camera, Math.min(1, Math.max(0, t))) : { s: 1, x: 0, y: 0 };
  const mx = Math.max(0, (m.uw - 1920 / p0.s) / 2);
  const my = Math.max(0, (m.uh - 1080 / p0.s) / 2);
  const p = { s: p0.s, x: Math.min(mx, Math.max(-mx, p0.x)), y: Math.min(my, Math.max(-my, p0.y)) };
  const e = m.escala;
  const tom = (papel as Record<string, string>)[m.tom] ?? '#000';

  return (
    <AbsoluteFill style={{ backgroundColor: tom, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: m.uw,
          height: m.uh,
          left: 960 - m.uw / 2,
          top: 540 - m.uh / 2,
          transform: transform ?? `translate(${-p.x * p.s}px, ${-p.y * p.s}px) scale(${p.s})`,
          transformOrigin: transformOrigin ?? 'center',
        }}
      >
        <Img src={staticFile(`folhas/${id}-${base}.jpg`)} style={{ position: 'absolute', inset: 0, width: m.uw, height: m.uh }} />
        {ativo > 0 && <Revelacao id={id} k={ativo} progresso={progresso} escala={e} />}
        {tinta < 1 && (
          <Img
            src={staticFile(`folhas/${id}-0.jpg`)}
            style={{ position: 'absolute', inset: 0, width: m.uw, height: m.uh, opacity: 1 - tinta }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
