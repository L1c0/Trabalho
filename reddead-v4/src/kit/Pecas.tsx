import React from 'react';
import { c01, COR, mix, prog, saiExpo } from './base';
import { M, O } from './tipos';

/**
 * Peças de desenho: folha de papel, marcas de conferência, setas, chaves e
 * grades. Tudo função do quadro.
 */

/** Folha de papel creme que sobe de baixo e assenta com um leve giro. */
export const Papel: React.FC<{
  f: number;
  ini: number;
  fim?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  giro?: number;
  de?: 'baixo' | 'dir' | 'esq' | 'cima';
  pautas?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ f, ini, fim, x, y, w, h, giro = 0, de = 'baixo', pautas = 0, style, children }) => {
  if (f < ini) return null;
  const e = saiExpo(prog(f, ini, 18));
  const sai = fim === undefined ? 0 : prog(f, fim, 10);
  if (sai >= 1) return null;
  const d = (1 - e) * 1200 + sai * sai * 1300;
  const tx = de === 'dir' ? d : de === 'esq' ? -d : 0;
  const ty = de === 'baixo' ? d : de === 'cima' ? -d : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${(giro + (1 - e) * 7).toFixed(3)}deg)`,
        background: 'linear-gradient(155deg, #EFE7D4 0%, #E4D8BD 60%, #D6C7A6 100%)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.65), inset 0 0 90px rgba(120,90,40,0.22)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {pautas > 0 && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${pautas - 2}px, rgba(60,40,20,0.16) ${pautas - 2}px, rgba(60,40,20,0.16) ${pautas}px)` }} />
      )}
      {children}
    </div>
  );
};

/** Tinta de máquina sobre papel. */
export const TINTA = '#1d1712';

/** Texto de máquina de escrever sem caixa (para dentro do papel). */
export const Datilo: React.FC<{ f: number; ini: number; texto: string; cps?: number; style?: React.CSSProperties; cursor?: boolean }> = ({ f, ini, texto, cps = 24, style, cursor = true }) => {
  if (f < ini) return null;
  const n = Math.floor(((f - ini) / 30) * cps);
  const pronto = n >= texto.length;
  return (
    <div style={{ ...M(34, TINTA), whiteSpace: 'pre-wrap', ...style }}>
      {texto.slice(0, n)}
      {cursor && (!pronto || Math.floor(f / 8) % 2 === 0) && <span style={{ color: COR.vermelho }}>▌</span>}
    </div>
  );
};

/** Marca de conferido (✓) ou de riscado (✗) que se desenha. */
export const Tique: React.FC<{ f: number; ini: number; x: number; y: number; tam?: number; cor?: string; tipo?: 'ok' | 'x'; larg?: number }> = ({ f, ini, x, y, tam = 60, cor = COR.vermelho, tipo = 'ok', larg = 9 }) => {
  const t = saiExpo(prog(f, ini, 9));
  if (t <= 0) return null;
  return (
    <svg width={tam} height={tam} viewBox="0 0 100 100" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      {tipo === 'ok' ? (
        <path d="M10,55 L40,85 L92,15" fill="none" stroke={cor} strokeWidth={(larg * 100) / tam} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      ) : (
        <>
          <path d="M14,14 L86,86" fill="none" stroke={cor} strokeWidth={(larg * 100) / tam} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(t * 2)} />
          <path d="M86,14 L14,86" fill="none" stroke={cor} strokeWidth={(larg * 100) / tam} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(t * 2 - 1)} />
        </>
      )}
    </svg>
  );
};

/** Seta que se desenha de um ponto a outro, com curva opcional. */
export const Seta: React.FC<{ f: number; ini: number; dur?: number; de: [number, number]; para: [number, number]; arco?: number; cor?: string; larg?: number; fim?: number }> = ({
  f,
  ini,
  dur = 12,
  de,
  para,
  arco = 0,
  cor = COR.creme,
  larg = 5,
  fim,
}) => {
  const t = saiExpo(prog(f, ini, dur));
  if (t <= 0) return null;
  const op = fim === undefined ? 1 : 1 - prog(f, fim, 8);
  if (op <= 0) return null;
  const mx = (de[0] + para[0]) / 2 + (para[1] - de[1]) * arco;
  const my = (de[1] + para[1]) / 2 - (para[0] - de[0]) * arco;
  // direção da ponta: tangente no fim da curva
  const ang = Math.atan2(para[1] - my, para[0] - mx);
  const a = 22;
  const p1 = [para[0] - a * Math.cos(ang - 0.45), para[1] - a * Math.sin(ang - 0.45)];
  const p2 = [para[0] - a * Math.cos(ang + 0.45), para[1] - a * Math.sin(ang + 0.45)];
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op, pointerEvents: 'none' }}>
      <path d={`M${de[0]},${de[1]} Q${mx},${my} ${para[0]},${para[1]}`} fill="none" stroke={cor} strokeWidth={larg} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      {t > 0.85 && <path d={`M${p1[0]},${p1[1]} L${para[0]},${para[1]} L${p2[0]},${p2[1]}`} fill="none" stroke={cor} strokeWidth={larg} strokeLinecap="round" strokeLinejoin="round" opacity={c01((t - 0.85) / 0.15)} />}
    </svg>
  );
};

/** Chave horizontal (colchete deitado) que abre do centro: marca um intervalo. */
export const Chave: React.FC<{ f: number; ini: number; dur?: number; x1: number; x2: number; y: number; alt?: number; cor?: string; larg?: number }> = ({ f, ini, dur = 16, x1, x2, y, alt = 26, cor = COR.vermelho, larg = 5 }) => {
  const t = saiExpo(prog(f, ini, dur));
  if (t <= 0) return null;
  const m = (x1 + x2) / 2;
  const a = mix(m, x1, t);
  const b = mix(m, x2, t);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={`M${a},${y - alt} L${a},${y} L${b},${y} L${b},${y - alt}`} fill="none" stroke={cor} strokeWidth={larg} strokeLinecap="square" />
    </svg>
  );
};

/** Grade de planilha que se desenha: linhas horizontais e verticais em cascata. */
export const Grade: React.FC<{ f: number; ini: number; x: number; y: number; w: number; h: number; cols: number; lins: number; cor?: string; larg?: number; passo?: number; op?: number }> = ({
  f,
  ini,
  x,
  y,
  w,
  h,
  cols,
  lins,
  cor = 'rgba(233,198,147,0.5)',
  larg = 2,
  passo = 1.2,
  op = 1,
}) => {
  if (f < ini) return null;
  const linhas: React.ReactNode[] = [];
  for (let i = 0; i <= lins; i++) {
    const t = saiExpo(prog(f, ini + i * passo, 14));
    linhas.push(<div key={`h${i}`} style={{ position: 'absolute', left: 0, top: (h * i) / lins - larg / 2, width: w, height: larg, background: cor, transform: `scaleX(${t.toFixed(4)})`, transformOrigin: 'left center' }} />);
  }
  for (let j = 0; j <= cols; j++) {
    const t = saiExpo(prog(f, ini + 4 + j * passo, 14));
    linhas.push(<div key={`v${j}`} style={{ position: 'absolute', top: 0, left: (w * j) / cols - larg / 2, height: h, width: larg, background: cor, transform: `scaleY(${t.toFixed(4)})`, transformOrigin: 'center top' }} />);
  }
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: op }}>{linhas}</div>;
};

/** Rótulo pequeno em caixa alta espaçada (legenda de gráfico). */
export const Legenda: React.FC<{ f: number; ini: number; fim?: number; x: number; y: number; texto: string; tam?: number; cor?: string; alinhar?: 'esq' | 'centro' | 'dir'; larg?: number }> = ({
  f,
  ini,
  fim,
  x,
  y,
  texto,
  tam = 26,
  cor = COR.cinza,
  alinhar = 'esq',
  larg = 800,
}) => {
  const e = saiExpo(prog(f, ini, 10));
  const sai = fim === undefined ? 0 : prog(f, fim, 8);
  if (e <= 0 || sai >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: alinhar === 'esq' ? x : alinhar === 'centro' ? x - larg / 2 : x - larg,
        top: y,
        width: larg,
        textAlign: alinhar === 'esq' ? 'left' : alinhar === 'centro' ? 'center' : 'right',
        ...O(tam, cor, 0.3),
        opacity: e * (1 - sai),
        transform: `translateY(${((1 - e) * 10).toFixed(2)}px)`,
        whiteSpace: 'pre',
      }}
    >
      {texto}
    </div>
  );
};
