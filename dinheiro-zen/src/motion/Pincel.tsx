import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import React, {useId} from 'react';

export type PerfilPincel = {
  inicio: number; // largura no começo do traço
  fim: number; // largura na saída
  curva: number; // >1 afina mais cedo, <1 segura a espessura
  toque: number; // fração inicial em que o pincel encosta no papel
  amostra: number; // distância entre amostras ao longo do traço
  mascara: number; // folga da máscara em relação à largura máxima
  angulo: number; // inclinação do pincel (graus): andar nessa direção dá o traço mais fino
  minimoDirecao: number; // espessura relativa quando o movimento é paralelo ao pincel
  entrada: number; // tamanho do apoio inicial (起筆) em relação à largura inicial; 0 desliga
};

const afinamento = (t: number, p: PerfilPincel) => {
  const base = p.fim + (p.inicio - p.fim) * (1 - t) ** p.curva;
  const encosta = p.toque > 0 ? Math.min(1, 0.82 + (0.18 * t) / p.toque) : 1;
  return base * encosta;
};

const fatorDirecao = (tx: number, ty: number, p: PerfilPincel) => {
  const a = Math.atan2(ty, tx) - (p.angulo * Math.PI) / 180;
  return p.minimoDirecao + (1 - p.minimoDirecao) * Math.abs(Math.sin(a));
};

const cache = new Map<string, {contorno: string; comprimento: number}>();

// Contorno preenchido de um traço de pincel: centro do traço + normal × largura,
// onde a largura afina ao longo do traço e depende da direção do movimento.
export const contornoDoPincel = (d: string, p: PerfilPincel) => {
  const chave = `${d}|${Object.values(p).join('|')}`;
  const salvo = cache.get(chave);
  if (salvo) return salvo;

  const comprimento = getLength(d);
  const n = Math.max(8, Math.ceil(comprimento / p.amostra));
  const amostras: {x: number; y: number; nx: number; ny: number; t: number; dir: number}[] = [];
  for (let i = 0; i <= n; i++) {
    const s = (i / n) * comprimento;
    const pt = getPointAtLength(d, s);
    const tg = getTangentAtLength(d, s);
    if (!pt || !tg) continue;
    const norma = Math.hypot(tg.x, tg.y) || 1;
    amostras.push({x: pt.x, y: pt.y, nx: -tg.y / norma, ny: tg.x / norma, t: i / n, dir: fatorDirecao(tg.x, tg.y, p)});
  }
  // suaviza a direção para quinas não virarem degraus
  const dirSuave = amostras.map((_, i) => {
    const viz = amostras.slice(Math.max(0, i - 2), i + 3);
    return viz.reduce((acc, a) => acc + a.dir, 0) / viz.length;
  });
  const larguras = amostras.map((a, i) => afinamento(a.t, p) * dirSuave[i]);
  const esq = amostras.map((a, i) => [a.x + (a.nx * larguras[i]) / 2, a.y + (a.ny * larguras[i]) / 2] as const);
  const dir = amostras.map((a, i) => [a.x - (a.nx * larguras[i]) / 2, a.y - (a.ny * larguras[i]) / 2] as const);

  const f = (v: number) => v.toFixed(2);
  const r0 = larguras[0] / 2;
  const r1 = larguras[larguras.length - 1] / 2;
  const partes = [
    `M${f(esq[0][0])},${f(esq[0][1])}`,
    ...esq.slice(1).map(([x, y]) => `L${f(x)},${f(y)}`),
    `A${f(r1)},${f(r1)} 0 0 0 ${f(dir[dir.length - 1][0])},${f(dir[dir.length - 1][1])}`,
    ...dir
      .slice(0, -1)
      .reverse()
      .map(([x, y]) => `L${f(x)},${f(y)}`),
    `A${f(r0)},${f(r0)} 0 0 0 ${f(esq[0][0])},${f(esq[0][1])}`,
    'Z',
  ];
  if (p.entrada > 0) {
    // apoio do pincel: elipse deitada a 45°, como a ponta encostando antes de correr
    const w0 = afinamento(0, p);
    const rx = (w0 * p.entrada) / 2;
    const ry = rx * 0.68;
    const giro = p.angulo + 45;
    const g = (giro * Math.PI) / 180;
    const {x, y} = amostras[0];
    partes.push(
      `M${f(x + rx * Math.cos(g))},${f(y + rx * Math.sin(g))}`,
      `A${f(rx)},${f(ry)} ${giro} 1 0 ${f(x - rx * Math.cos(g))},${f(y - rx * Math.sin(g))}`,
      `A${f(rx)},${f(ry)} ${giro} 1 0 ${f(x + rx * Math.cos(g))},${f(y + rx * Math.sin(g))}`,
      'Z',
    );
  }
  const resultado = {contorno: partes.join(' '), comprimento};
  cache.set(chave, resultado);
  return resultado;
};

// Um traço: o contorno de espessura variável é revelado por uma máscara
// cujo stroke-dashoffset anda junto com o pincel.
export const TracoDePincel: React.FC<{
  d: string;
  progresso: number;
  perfil: PerfilPincel;
  cor: string;
}> = ({d, progresso, perfil, cor}) => {
  const id = `pincel${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (progresso <= 0) return null;
  const {contorno, comprimento} = contornoDoPincel(d, perfil);
  if (progresso >= 1) return <path d={contorno} fill={cor} />;
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse">
        <path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={perfil.inicio * perfil.mascara}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${comprimento} ${comprimento}`}
          strokeDashoffset={comprimento * (1 - progresso)}
        />
      </mask>
      <path d={contorno} fill={cor} mask={`url(#${id})`} />
    </>
  );
};
