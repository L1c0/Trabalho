import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { c01, COR, H, prog, rnd, saiExpo, W } from './base';

/** Peças de cena: papel, acabamento, câmera, clarão, brasas, poeira, sol, raios e a pincelada de corte. */

/** Folha de cor chapada. A textura do papel entra por cima de tudo, no Acabamento. */
export const Papel: React.FC<{ cor?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ cor = COR.papel, children, style }) => (
  <AbsoluteFill style={{ backgroundColor: cor, overflow: 'hidden', ...style }}>{children}</AbsoluteFill>
);

/** Textura de papel (multiplica), grão que anda a cada quadro e escurecimento das bordas. Vai por cima da cena inteira. */
export const Acabamento: React.FC<{ f: number; grao?: number; vinheta?: number; papel?: number }> = ({ f, grao = 0.07, vinheta = 0.28, papel = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <Img src={staticFile('papel.jpg')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, mixBlendMode: 'multiply', opacity: papel }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(10,4,2,${vinheta}) 100%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('grao.png')})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${(f * 97) % 512}px ${(f * 53) % 512}px`,
        mixBlendMode: 'overlay',
        opacity: grao,
      }}
    />
    {/* o grão é imagem de fundo em CSS; esta cópia invisível faz o render esperar o arquivo */}
    <Img src={staticFile('grao.png')} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
  </AbsoluteFill>
);

/** Clarão de corte: a tela acende e apaga em poucos quadros. */
export const Clarao: React.FC<{ f: number; ini: number; dur?: number; cor?: string; forca?: number }> = ({ f, ini, dur = 6, cor = '#fff', forca = 0.9 }) => {
  if (f < ini || f >= ini + dur) return null;
  const t = (f - ini) / dur;
  return <AbsoluteFill style={{ backgroundColor: cor, opacity: forca * Math.pow(1 - t, 1.6), pointerEvents: 'none' }} />;
};

/**
 * Câmera: escala, deslocamento e giro aplicados à cena inteira.
 *
 * `fundo` é a cor do papel. Ela precisa estar aqui dentro: a tinta entra por
 * modo de mistura, e a mistura só enxerga o que está no mesmo grupo. Um
 * elemento com `transform` forma um grupo novo; sem o fundo dentro dele, a
 * tinta multiplicaria sobre o vazio e o branco do take apareceria.
 */
export const Camera: React.FC<{ escala?: number; x?: number; y?: number; rot?: number; origem?: string; fundo?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  escala = 1,
  x = 0,
  y = 0,
  rot = 0,
  origem = '50% 50%',
  fundo,
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${escala.toFixed(5)})`,
      transformOrigin: origem,
      ...style,
    }}
  >
    {fundo ? <div style={{ position: 'absolute', left: -400, top: -1000, right: -400, bottom: -1000, background: fundo }} /> : null}
    {children}
  </AbsoluteFill>
);

/** Brasas: fagulhas que sobem, tremem e apagam. */
export const Brasas: React.FC<{ f: number; n?: number; semente?: number; cor?: string; forca?: number; de?: number }> = ({ f, n = 36, semente = 5, cor = '#ffb347', forca = 1, de = H }) => {
  if (forca <= 0) return null;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const vida = 70 + rnd(i, semente, 1) * 90;
    const fase = (f + rnd(i, semente, 2) * vida) % vida;
    const t = fase / vida;
    const x0 = rnd(i, semente, 3) * W;
    const sobe = 500 + rnd(i, semente, 4) * 900;
    const x = x0 + Math.sin(t * 6 + i) * 46 + (rnd(i, semente, 5) - 0.5) * 220 * t;
    const y = de - t * sobe;
    const tam = 3 + rnd(i, semente, 6) * 7;
    const pisca = 0.6 + 0.4 * Math.sin(f * 0.9 + i * 2.1);
    const op = Math.sin(Math.PI * t) * pisca * forca;
    pts.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: tam,
          height: tam * (1.4 + rnd(i, semente, 7)),
          borderRadius: '50%',
          background: cor,
          boxShadow: `0 0 ${tam * 2.2}px ${tam * 0.6}px rgba(255,120,30,0.55)`,
          opacity: c01(op),
          transform: `rotate(${(Math.sin(t * 5 + i) * 30).toFixed(1)}deg)`,
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', mixBlendMode: 'screen' }}>{pts}</AbsoluteFill>;
};

/** Poeira no ar: pontos que derivam devagar. */
export const Poeira: React.FC<{ f: number; n?: number; cor?: string; semente?: number; forca?: number }> = ({ f, n = 34, cor = COR.tinta, semente = 9, forca = 0.5 }) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const prof = rnd(i, semente, 1);
    const vel = 0.2 + prof * 0.7;
    const x = (rnd(i, semente, 2) * (W + 200) + f * vel * 0.9) % (W + 200) - 100;
    const y = (rnd(i, semente, 3) * (H + 200) - f * vel * 0.5 + 4000 * (H + 200)) % (H + 200) - 100;
    const tam = 2 + prof * 5;
    pts.push(
      <div
        key={i}
        style={{ position: 'absolute', left: x, top: y + Math.sin(f * 0.03 + i) * 12, width: tam, height: tam, borderRadius: '50%', background: cor, opacity: (0.15 + prof * 0.5) * forca, filter: `blur(${((1 - prof) * 1.6).toFixed(1)}px)` }}
      />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>{pts}</AbsoluteFill>;
};

/** Disco de sol (ou de lua), com halo. */
export const Sol: React.FC<{ x: number; y: number; r: number; cor?: string; halo?: string; escala?: number; op?: number }> = ({ x, y, r, cor = COR.sangue, halo, escala = 1, op = 1 }) => {
  if (escala <= 0 || op <= 0) return null;
  return (
    <>
      {halo ? (
        <div
          style={{
            position: 'absolute',
            left: x - r * 2.2,
            top: y - r * 2.2,
            width: r * 4.4,
            height: r * 4.4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${halo} 0%, rgba(0,0,0,0) 68%)`,
            opacity: op,
            transform: `scale(${escala.toFixed(4)})`,
          }}
        />
      ) : null}
      <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: cor, opacity: op, transform: `scale(${escala.toFixed(4)})` }} />
    </>
  );
};

/** Raios que giram devagar em volta de um ponto, como nos cartazes. */
export const Raios: React.FC<{ f: number; x: number; y: number; cor?: string; op?: number; n?: number; vel?: number }> = ({ f, x, y, cor = 'rgba(18,10,7,0.5)', op = 0.16, n = 18, vel = 0.12 }) => {
  const passo = 360 / n;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 2400,
        top: y - 2400,
        width: 4800,
        height: 4800,
        background: `repeating-conic-gradient(from ${(f * vel).toFixed(3)}deg, ${cor} 0deg ${(passo * 0.42).toFixed(3)}deg, rgba(0,0,0,0) ${(passo * 0.42).toFixed(3)}deg ${passo.toFixed(3)}deg)`,
        opacity: op,
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,0) 4%, #000 12%, #000 40%, rgba(0,0,0,0) 62%)',
        maskImage: 'radial-gradient(circle, rgba(0,0,0,0) 4%, #000 12%, #000 40%, rgba(0,0,0,0) 62%)',
      }}
    />
  );
};

/**
 * Pincelada de corte: uma faixa de tinta atravessa a tela e leva a cena
 * junto. `t` vai de 0 (fora, antes) a 1 (fora, depois); em 0,5 ela cobre tudo.
 */
export const Pincelada: React.FC<{ t: number; cor?: string; semente?: number; lado?: 'baixo' | 'cima' | 'esq' | 'dir' }> = ({ t, cor = COR.tinta, semente = 1, lado = 'baixo' }) => {
  if (t <= 0 || t >= 1) return null;
  const vertical = lado === 'baixo' || lado === 'cima';
  const comp = vertical ? H : W;
  const larg = vertical ? W : H;
  // a frente e a cauda da faixa, com dentes
  const dentes = 22;
  const frente = -0.25 + 1.5 * c01(t * 2) ; // 0..0,5: a frente cruza
  const cauda = -0.25 + 1.5 * c01(t * 2 - 1); // 0,5..1: a cauda cruza
  const pts: string[] = [];
  for (let i = 0; i <= dentes; i++) {
    const u = i / dentes;
    const d = (rnd(i, semente, 1) - 0.5) * 0.16 + (i % 2 ? 0.035 : -0.035);
    pts.push(`${(u * larg).toFixed(1)},${((frente + d) * comp).toFixed(1)}`);
  }
  for (let i = dentes; i >= 0; i--) {
    const u = i / dentes;
    const d = (rnd(i, semente, 2) - 0.5) * 0.16 + (i % 2 ? 0.035 : -0.035);
    pts.push(`${(u * larg).toFixed(1)},${((cauda + d) * comp).toFixed(1)}`);
  }
  const giro = lado === 'baixo' ? 'scaleY(-1)' : lado === 'cima' ? '' : lado === 'esq' ? 'rotate(-90deg) scaleY(-1)' : 'rotate(90deg) scaleY(-1)';
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width={larg}
        height={comp}
        viewBox={`0 0 ${larg} ${comp}`}
        style={{ position: 'absolute', left: (W - larg) / 2, top: (H - comp) / 2, transform: giro, overflow: 'visible' }}
      >
        <polygon points={pts.join(' ')} fill={cor} />
      </svg>
    </AbsoluteFill>
  );
};

/** Progresso de uma pincelada que cobre a tela no quadro `corte`: começa `antes` quadros antes e termina `depois` quadros depois. */
export const tPincel = (f: number, corte: number, antes = 5, depois = 6) => (f < corte ? 0.5 * prog(f, corte - antes, antes) : 0.5 + 0.5 * prog(f, corte, depois));

/** Linhas finas de moldura, que se desenham. */
export const Moldura: React.FC<{ t: number; x: number; y: number; w: number; h: number; cor?: string; larg?: number }> = ({ t, x, y, w, h, cor = COR.tinta, larg = 4 }) => {
  const e = saiExpo(c01(t));
  if (e <= 0) return null;
  const per = 2 * (w + h);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={cor} strokeWidth={larg} strokeDasharray={`${(per * e).toFixed(1)} ${per}`} />
    </svg>
  );
};
