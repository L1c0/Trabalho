import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import agenda from './data/agenda.json';

/**
 * VAGABOND · os quatro Shorts (docs/LEIA-PRIMEIRO.md)
 * 1080x1920, 30 fps. Tudo 2D: nada de 3D, perspectiva ou paralaxe.
 *
 * - Planos: a imagem de 1350x2400 mostrada a 1080x1920 cresce de 1,00 para
 *   1,05 ao longo do plano (nunca amplia um pixel). Corte seco com 4 quadros
 *   de ganho de opacidade.
 * - Legenda: no canto inferior esquerdo, x=135, sobre a tarja de papel.
 * - Papel: a folha impressa com as peças por cima, cada uma na posição do
 *   pos.json. Quando e como cada peça entra, e onde a folha está, vêm de
 *   src/data/agenda.json (ferramentas/agenda.py). A folha fica parada
 *   enquanto as peças entram e só desce, na vertical, quando a próxima peça
 *   cairia fora da caixa útil.
 */

const W = 1080;
const H = 1920;
const PAPEL = '#CDC7BB';
const TARJA = 'rgba(205,199,187,0.93)';
const ESPINHA = 135;
const GANHO = 4; // quadros de ganho de opacidade no corte

type Peca = { id: string; x: number; y: number; w: number; h: number; e: number; d: number; estilo: string; s?: number; sd?: number };
type Agenda = {
  dur: number;
  altura: number;
  estende: number;
  planos: [number, number, string, string | null, number, number][];
  papel: [number, number][];
  janela: [number, number, number, number][];
  pecas: Peca[];
};
const AG = agenda as unknown as Record<string, Agenda>;

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const freia = (p: number) => 1 - Math.pow(1 - p, 3); // sai rápido e assenta, sem passar do ponto
const seno = (p: number) => 0.5 - 0.5 * Math.cos(Math.PI * p);

const janelaEm = (j: Agenda['janela'], f: number) => {
  let t = 0;
  for (const [f0, f1, t0, t1] of j) {
    if (f >= f1) t = t1;
    else if (f >= f0) return t0 + (t1 - t0) * seno((f - f0) / (f1 - f0));
  }
  return t;
};

const varredura = (angulo: number, k: number, borda: number) => {
  const pos = -borda + k * (100 + 2 * borda);
  return `linear-gradient(${angulo}deg, #000 ${pos - borda}%, transparent ${pos + borda}%)`;
};

const PecaPapel: React.FC<{ n: number; p: Peca; f: number }> = ({ n, p, f }) => {
  const k = c01((f - p.e + 1) / p.d);
  let opacity = 1;
  let transform: string | undefined;
  let mascara: string | undefined;
  switch (p.estilo) {
    case 'letra':
    case 'digito': {
      const q = freia(k);
      opacity = q;
      transform = `translateY(${(1 - q) * 20}px)`;
      break;
    }
    case 'varre':
      mascara = varredura(90, k, 6);
      break;
    case 'risca':
      mascara = varredura(180, k, 8);
      break;
    case 'eixo':
      mascara = varredura(180, k, 1.5);
      break;
    case 'estala':
      opacity = k;
      break;
    case 'escala': {
      const q = freia(k);
      opacity = q;
      transform = `scale(${1.04 - 0.04 * q})`;
      break;
    }
  }
  if (p.s !== undefined && p.sd) opacity *= 1 - c01((f - p.s + 1) / p.sd);
  return (
    <Img
      src={staticFile(`papel/s${n}/${p.id}.png`)}
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: p.w,
        height: p.h,
        opacity,
        transform,
        transformOrigin: 'center',
        WebkitMaskImage: mascara,
        maskImage: mascara,
      }}
    />
  );
};

const Papel: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const a = AG[`s${n}`];
  const T = janelaEm(a.janela, f);
  const folha = staticFile(`papel/s${n}-folha.jpg`);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: a.altura + a.estende, transform: `translateY(${-T}px)` }}>
        <Img src={folha} style={{ position: 'absolute', left: 0, top: 0, width: W, height: a.altura }} />
        {a.estende > 0 ? (
          // só papel em branco: a mesma folha espelhada, para o fim do S1 caber na caixa
          <Img src={folha} style={{ position: 'absolute', left: 0, top: a.altura, width: W, height: a.altura, transform: 'scaleY(-1)' }} />
        ) : null}
        {a.pecas.map((p) => {
          if (f < p.e) return null;
          if (p.s !== undefined && p.sd && f >= p.s + p.sd) return null;
          if (p.y + p.h < T - 40 || p.y > T + H + 40) return null;
          return <PecaPapel key={p.id} n={n} p={p} f={f} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Plano: React.FC<{ f: number; a: number; b: number; src: string; leg: string | null; lw: number; lh: number }> = ({ f, a, b, src, leg, lw, lh }) => {
  const escala = 1 + 0.05 * ((f - a) / (b - a));
  const q = freia(c01((f - (a + 6) + 1) / 6));
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(`${src}.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${escala})` }} />
      {leg ? (
        <div
          style={{
            position: 'absolute',
            left: ESPINHA - 18,
            top: 1528 - (lh + 24),
            width: lw + 36,
            height: lh + 24,
            backgroundColor: TARJA,
            opacity: q,
            transform: `translateY(${(1 - q) * 20}px)`,
          }}
        >
          <Img src={staticFile(`${leg}.png`)} style={{ position: 'absolute', left: 18, top: 12, width: lw, height: lh }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Short: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const a = AG[`s${n}`];
  const trechos = [
    ...a.planos.map(([ini, fim, src, leg, lw, lh]) => ({ ini, fim, plano: { src, leg, lw, lh } })),
    ...a.papel.map(([ini, fim]) => ({ ini, fim, plano: null as null | { src: string; leg: string | null; lw: number; lh: number } })),
  ].sort((u, v) => u.ini - v.ini);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPEL }}>
      {trechos.map((t, i) => {
        // o trecho segue por baixo do seguinte enquanto ele ganha opacidade
        const ate = i < trechos.length - 1 ? t.fim + GANHO - 1 : t.fim;
        if (f < t.ini || f >= ate) return null;
        const op = t.ini > 0 ? c01((f - t.ini + 1) / GANHO) : 1;
        return (
          <AbsoluteFill key={i} style={{ opacity: op }}>
            {t.plano ? <Plano f={f} a={t.ini} b={t.fim} {...t.plano} /> : <Papel n={n} f={f} />}
          </AbsoluteFill>
        );
      })}
      <Audio src={staticFile(`s${n}.mp3`)} />
    </AbsoluteFill>
  );
};
