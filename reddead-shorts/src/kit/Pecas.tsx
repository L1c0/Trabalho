import React from 'react';
import { c01, COR, FONTE, mix, prog, rnd, saiCubica, saiExpo } from './base';

/** Peças de papelaria: carimbo, máquina de escrever, assinatura, tarja de censura, riscos, etiquetas. */

/** Filtros SVG usados pelas peças. Vai uma vez em cada Short. */
export const Filtros: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      {/* tinta gasta de carimbo: a borda falha e o miolo ganha poros */}
      <filter id="gasto" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.25" result="poros" />
        <feComposite in="SourceGraphic" in2="poros" operator="in" result="furado" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="fino" />
        <feDisplacementMap in="furado" in2="fino" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {/* borda de pincel seco para faixas e etiquetas */}
      <filter id="rasgo" x="-5%" y="-20%" width="110%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.4" numOctaves="2" seed="11" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/**
 * Carimbo: bate grande e assenta no lugar em 4 quadros, com um repique.
 * `t0` é o quadro da batida.
 */
export const Carimbo: React.FC<{
  f: number;
  t0: number;
  fim?: number;
  x: number;
  y: number;
  linhas: string[];
  tam?: number;
  cor?: string;
  giro?: number;
  borda?: boolean;
  fonte?: string;
  /** tamanho de cada linha em relação a `tam` */
  escalas?: number[];
  esp?: number;
}> = ({ f, t0, fim = 1e9, x, y, linhas, tam = 96, cor = COR.sangue, giro = -7, borda = true, fonte = FONTE.slab, escalas, esp = 0.04 }) => {
  if (f < t0 || f >= fim) return null;
  const t = prog(f, t0, 4);
  const e = 1 - Math.pow(1 - t, 3);
  const repique = f - t0 >= 4 ? 1 + 0.045 * Math.exp(-(f - t0 - 4) / 2.5) * Math.cos((f - t0 - 4) * 1.9) : 1;
  const escala = mix(2.3, 1, e) * repique;
  const sai = 1 - prog(f, fim - 5, 5);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${giro}deg) scale(${escala.toFixed(4)})`,
        opacity: c01(t * 3) * sai,
        filter: 'url(#gasto)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ border: borda ? `${Math.max(6, tam * 0.085)}px solid ${cor}` : undefined, padding: borda ? `${tam * 0.2}px ${tam * 0.42}px ${tam * 0.14}px` : 0, borderRadius: tam * 0.1, textAlign: 'center' }}>
        {linhas.map((l, i) => (
          <div key={i} style={{ fontFamily: fonte, fontSize: tam * (escalas?.[i] ?? 1), color: cor, lineHeight: 1.08, letterSpacing: `${esp}em`, textTransform: 'uppercase' }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Máquina de escrever: os caracteres aparecem um a um. `cps` é a velocidade. Devolve também quantos já saíram. */
export const digitados = (f: number, t0: number, texto: string, cps: number) => Math.max(0, Math.min(texto.length, Math.floor(((f - t0) / 30) * cps)));

export const Maquina: React.FC<{ f: number; t0: number; texto: string; cps?: number; style?: React.CSSProperties; cursor?: boolean; corCursor?: string }> = ({
  f,
  t0,
  texto,
  cps = 22,
  style,
  cursor = true,
  corCursor = COR.sangue,
}) => {
  if (f < t0) return null;
  const n = digitados(f, t0, texto, cps);
  const acabou = n >= texto.length;
  const pisca = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ whiteSpace: 'pre-wrap', ...style }}>
      <span>{texto.slice(0, n)}</span>
      {cursor && (!acabou || pisca) ? <span style={{ display: 'inline-block', width: '0.55em', height: '0.95em', background: corCursor, verticalAlign: '-0.12em', marginLeft: '0.04em' }} /> : null}
      <span style={{ opacity: 0 }}>{texto.slice(n)}</span>
    </div>
  );
};

/** Assinatura: a letra cursiva aparece da esquerda para a direita, como se a pena corresse. */
export const Assinatura: React.FC<{ f: number; t0: number; dur?: number; texto: string; x: number; y: number; tam?: number; cor?: string; giro?: number; larg?: number }> = ({
  f,
  t0,
  dur = 30,
  texto,
  x,
  y,
  tam = 120,
  cor = COR.tinta,
  giro = -4,
  larg = 900,
}) => {
  if (f < t0) return null;
  const t = prog(f, t0, dur);
  // a pena corre aos trancos: acelera e freia três vezes
  const e = c01(t + 0.045 * Math.sin(t * Math.PI * 6) * (1 - t));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: larg, transform: `rotate(${giro}deg)`, transformOrigin: 'left center' }}>
      <div style={{ width: `${(e * 100).toFixed(2)}%`, overflow: 'hidden', whiteSpace: 'nowrap', paddingBottom: tam * 0.35, paddingTop: tam * 0.2 }}>
        <span style={{ fontFamily: FONTE.assina, fontSize: tam, color: cor, lineHeight: 1.1, paddingRight: tam * 0.4 }}>{texto}</span>
      </div>
    </div>
  );
};

/** Tarja preta de censura: bate sobre um trecho e cobre. */
export const Censura: React.FC<{ f: number; t0: number; x: number; y: number; w: number; h: number; cor?: string; giro?: number }> = ({ f, t0, x, y, w, h, cor = COR.tinta, giro = 0 }) => {
  if (f < t0) return null;
  const e = saiExpo(prog(f, t0, 5));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        background: cor,
        transform: `rotate(${giro}deg) scaleX(${e.toFixed(4)})`,
        transformOrigin: 'left center',
        filter: 'url(#rasgo)',
      }}
    />
  );
};

/** Traço que se desenha (sublinhado, régua, risco). */
export const Traco: React.FC<{ f: number; t0: number; dur?: number; x: number; y: number; w: number; h?: number; cor?: string; origem?: 'left' | 'right' | 'center'; giro?: number }> = ({
  f,
  t0,
  dur = 10,
  x,
  y,
  w,
  h = 6,
  cor = COR.sangue,
  origem = 'left',
  giro = 0,
}) => {
  const e = saiExpo(prog(f, t0, dur));
  if (e <= 0) return null;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: cor, transform: `rotate(${giro}deg) scaleX(${e.toFixed(4)})`, transformOrigin: `${origem} center` }} />;
};

/** Etiqueta de tinta com texto claro (a mesma tira da legenda, para rótulos fixos). */
export const Etiqueta: React.FC<{ f: number; t0: number; fim?: number; x: number; y: number; texto: string; tam?: number; cor?: string; fundo?: string; giro?: number; centro?: boolean }> = ({
  f,
  t0,
  fim = 1e9,
  x,
  y,
  texto,
  tam = 44,
  cor = COR.osso,
  fundo = COR.tinta,
  giro = -2,
  centro,
}) => {
  if (f < t0 || f >= fim) return null;
  const e = saiExpo(prog(f, t0, 7));
  const sai = 1 - prog(f, fim - 4, 4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `${centro ? 'translateX(-50%) ' : ''}rotate(${giro}deg)`, opacity: sai, whiteSpace: 'nowrap' }}>
      <div style={{ position: 'relative', padding: `${tam * 0.16}px ${tam * 0.5}px ${tam * 0.2}px` }}>
        <div style={{ position: 'absolute', inset: 0, background: fundo, transform: `scaleX(${e.toFixed(4)})`, transformOrigin: 'left center' }} />
        <span style={{ position: 'relative', fontFamily: FONTE.oswald, fontWeight: 700, fontSize: tam, letterSpacing: '0.12em', textTransform: 'uppercase', color: cor, opacity: c01((e - 0.4) * 2.5), lineHeight: 1.1 }}>{texto}</span>
      </div>
    </div>
  );
};

/** Cruz de cemitério desenhada em tinta (dois traços), para a contagem dos mortos. */
export const Cruz: React.FC<{ x: number; y: number; tam: number; cor?: string; t: number; semente?: number }> = ({ x, y, tam, cor = COR.osso, t, semente = 1 }) => {
  if (t <= 0) return null;
  const e = saiCubica(c01(t));
  const giro = (rnd(semente, 1) - 0.5) * 9;
  const larg = Math.max(3, tam * 0.16);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: tam, height: tam * 1.4, transform: `rotate(${giro.toFixed(2)}deg) scale(${(0.6 + 0.4 * e).toFixed(3)})`, opacity: c01(t * 3) }}>
      <div style={{ position: 'absolute', left: (tam - larg) / 2, top: 0, width: larg, height: tam * 1.4 * e, background: cor }} />
      <div style={{ position: 'absolute', left: tam * 0.12, top: tam * 0.36, width: tam * 0.76 * e, height: larg, background: cor }} />
    </div>
  );
};
