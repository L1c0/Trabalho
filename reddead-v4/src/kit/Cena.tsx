import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { c01, COR, H, prog, rnd, saiCubica, saiExpo, W } from './base';

/**
 * Peças de cena: o fundo vivo, a poeira, a câmera, o grão, os clarões e as
 * barras de cinema.
 */

/** Papel escuro que respira: a textura deriva devagar e uma luz passeia por cima. */
export const Fundo: React.FC<{ f: number; tom?: 'frio' | 'quente' | 'neutro' | 'sangue'; luz?: number; semente?: number }> = ({
  f,
  tom = 'frio',
  luz = 1,
  semente = 0,
}) => {
  const t = f / 30;
  const x = Math.sin(t * 0.21 + semente) * 26;
  const y = Math.cos(t * 0.17 + semente * 1.7) * 16;
  const filtro =
    tom === 'quente'
      ? 'sepia(0.55) saturate(1.5) hue-rotate(-12deg) brightness(0.95)'
      : tom === 'neutro'
        ? 'saturate(0.15) brightness(0.92)'
        : tom === 'sangue'
          ? 'sepia(0.9) saturate(3.2) hue-rotate(-38deg) brightness(0.8)'
          : 'saturate(1.15)';
  const lx = 50 + Math.sin(t * 0.13 + semente * 2.1) * 22;
  const ly = 42 + Math.cos(t * 0.11 + semente) * 14;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto, overflow: 'hidden' }}>
      <Img
        src={staticFile('arte/fundo.jpg')}
        style={{
          position: 'absolute',
          left: -240,
          top: -135,
          width: 2400,
          height: 1350,
          transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(1.06)`,
          filter: filtro,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at ${lx.toFixed(2)}% ${ly.toFixed(2)}%, rgba(190,205,225,${(0.1 * luz).toFixed(3)}) 0%, rgba(0,0,0,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Poeira no ar: pontos desfocados que sobem devagar, em três profundidades. */
export const Poeira: React.FC<{ f: number; n?: number; cor?: string; semente?: number; forca?: number }> = ({ f, n = 46, cor = '#d9cdb8', semente = 7, forca = 1 }) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const prof = rnd(i, semente, 1); // 0 longe, 1 perto
    const vel = 0.25 + prof * 0.9;
    const x0 = rnd(i, semente, 2) * (W + 200) - 100;
    const y0 = rnd(i, semente, 3) * (H + 200);
    const y = ((((y0 - f * vel) % (H + 200)) + (H + 200)) % (H + 200)) - 100;
    const x = x0 + Math.sin(f * 0.012 * (0.5 + prof) + i) * (20 + 50 * prof);
    const tam = 2 + prof * 7;
    const pisca = 0.55 + 0.45 * Math.sin(f * 0.05 + i * 1.7);
    pts.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: tam,
          height: tam,
          borderRadius: '50%',
          background: cor,
          opacity: (0.05 + 0.2 * prof) * pisca * forca,
          filter: `blur(${(0.6 + prof * 2.2).toFixed(1)}px)`,
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{pts}</AbsoluteFill>;
};

/** Neve: como a poeira, mas cai e vem de lado. */
export const Neve: React.FC<{ f: number; n?: number; semente?: number; forca?: number }> = ({ f, n = 140, semente = 3, forca = 1 }) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const prof = rnd(i, semente, 1);
    const vy = 3 + prof * 9;
    const vx = -2 - prof * 6;
    const x0 = rnd(i, semente, 2) * (W + 600);
    const y0 = rnd(i, semente, 3) * (H + 100);
    const y = ((y0 + f * vy) % (H + 100)) - 50;
    const x = ((((x0 + f * vx + Math.sin(f * 0.05 + i) * 18) % (W + 600)) + (W + 600)) % (W + 600)) - 300;
    const tam = 2 + prof * 6;
    pts.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: tam * (1 + prof * 1.5),
          height: tam,
          borderRadius: '50%',
          background: '#eef3f7',
          opacity: (0.18 + 0.5 * prof) * forca,
          filter: `blur(${(0.5 + prof * 1.8).toFixed(1)}px)`,
          transform: 'rotate(-28deg)',
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>{pts}</AbsoluteFill>;
};

/** Grão de filme: o ladrilho anda a cada quadro. */
export const Grao: React.FC<{ f: number; forca?: number }> = ({ f, forca = 0.14 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${staticFile('grao.png')})`,
      backgroundSize: '512px 512px',
      backgroundPosition: `${(f * 97) % 512}px ${(f * 53) % 512}px`,
      mixBlendMode: 'overlay',
      opacity: forca,
      pointerEvents: 'none',
    }}
  />
);

export const Vinheta: React.FC<{ forca?: number }> = ({ forca = 0.5 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${forca}) 100%)`, pointerEvents: 'none' }} />
);

/** Clarão de corte: a tela acende e apaga em poucos quadros. */
export const Clarao: React.FC<{ f: number; ini: number; dur?: number; cor?: string; forca?: number }> = ({ f, ini, dur = 6, cor = '#fff', forca = 0.85 }) => {
  if (f < ini || f >= ini + dur) return null;
  const t = (f - ini) / dur;
  return <AbsoluteFill style={{ backgroundColor: cor, opacity: forca * Math.pow(1 - t, 2), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/** Barras de cinema (2,39:1). `aberta` de 0 (tela cheia) a 1 (barras no lugar). */
export const Barras: React.FC<{ aberta?: number; alt?: number }> = ({ aberta = 1, alt = 138 }) => {
  const h = alt * c01(aberta);
  if (h <= 0) return null;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: h, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: W, height: h, background: '#000' }} />
    </>
  );
};

/** Câmera: escala, deslocamento e giro aplicados ao conteúdo. */
export const Camera: React.FC<{ escala?: number; x?: number; y?: number; rot?: number; origem?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  escala = 1,
  x = 0,
  y = 0,
  rot = 0,
  origem = '50% 50%',
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${escala.toFixed(5)}) rotate(${rot.toFixed(3)}deg)`,
      transformOrigin: origem,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * A linha vermelha que varre a tela: é a marca do vídeo (a linha de
 * fronteira) usada como passagem. Vai da esquerda para a direita em `dur`
 * quadros; o que está em `children` aparece atrás dela.
 */
export const VarreLinha: React.FC<{ f: number; ini: number; dur?: number; children?: React.ReactNode; cor?: string }> = ({ f, ini, dur = 14, children, cor = COR.vermelho }) => {
  const t = prog(f, ini, dur);
  if (t <= 0) return null;
  const x = saiCubica(t) * (W + 40) - 20;
  return (
    <>
      <AbsoluteFill style={{ clipPath: `inset(0 ${Math.max(0, W - x).toFixed(1)}px 0 0)` }}>{children}</AbsoluteFill>
      {t < 1 && (
        <div style={{ position: 'absolute', left: x - 5, top: 0, width: 10, height: H, background: cor, boxShadow: `0 0 40px 8px ${cor}` }} />
      )}
    </>
  );
};

/** Aparece e some por opacidade. */
export const some = (f: number, ini: number, fim: number, entra = 8, sai = 8) => Math.min(saiExpo(prog(f, ini, entra)), 1 - prog(f, fim - sai, sai));
