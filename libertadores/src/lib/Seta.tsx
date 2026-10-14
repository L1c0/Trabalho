import React, {useId} from 'react';
import {curvas, medidas} from '../theme';

// SETA CURVA. Desenhada por stroke-dashoffset em 18 quadros; a ponta aparece nos últimos 4.
// Curvatura sempre (reta parece diagrama de manual). Cheia = passe ou condução;
// tracejada (8 4) = movimento sem a bola. A tracejada é revelada por uma máscara, para o
// tracejado não "andar" durante o desenho.
type P = {X: number; Y: number};

export const geometriaSeta = (a: P, b: P, curva: number, recuoInicio: number, recuoFim: number) => {
  const dx = b.X - a.X;
  const dy = b.Y - a.Y;
  const len = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / len, dy / len];
  const c = {X: (a.X + b.X) / 2 - uy * len * medidas.seta.curvatura * curva, Y: (a.Y + b.Y) / 2 + ux * len * medidas.seta.curvatura * curva};
  // recua o começo (sai da borda do jogador) e o fim (para antes do alvo)
  const ini = {X: a.X + ((c.X - a.X) / Math.hypot(c.X - a.X, c.Y - a.Y)) * recuoInicio, Y: a.Y + ((c.Y - a.Y) / Math.hypot(c.X - a.X, c.Y - a.Y)) * recuoInicio};
  const tf = {X: b.X - c.X, Y: b.Y - c.Y};
  const tl = Math.hypot(tf.X, tf.Y) || 1;
  const fim = {X: b.X - (tf.X / tl) * recuoFim, Y: b.Y - (tf.Y / tl) * recuoFim};
  return {ini, c, fim, dir: {X: tf.X / tl, Y: tf.Y / tl}};
};

export const Seta: React.FC<{de: P; para: P; quadro: number; tipo: 'passe' | 'movimento'; cor: string; curva?: number; alvoJogador?: boolean}> = ({
  de,
  para,
  quadro,
  tipo,
  cor,
  curva = 1,
  alvoJogador = false,
}) => {
  const id = useId().replace(/:/g, '');
  const s = medidas.seta;
  if (quadro < 0) return null;
  const r = medidas.jogador.diametro / 2 + 4;
  const g = geometriaSeta(de, para, curva, r, alvoJogador ? r : 0);
  // a linha termina na base da ponta; a ponta cobre até o fim
  const base = {X: g.fim.X - g.dir.X * s.pontaComp, Y: g.fim.Y - g.dir.Y * s.pontaComp};
  const d = `M${g.ini.X.toFixed(1)},${g.ini.Y.toFixed(1)} Q${g.c.X.toFixed(1)},${g.c.Y.toFixed(1)} ${base.X.toFixed(1)},${base.Y.toFixed(1)}`;
  const comp = 1.2 * (Math.hypot(g.c.X - g.ini.X, g.c.Y - g.ini.Y) + Math.hypot(base.X - g.c.X, base.Y - g.c.Y));
  const prog = curvas.saida(Math.min(1, quadro / (s.desenho - s.ponta)));
  const ponta = Math.min(1, Math.max(0, (quadro - (s.desenho - s.ponta)) / s.ponta));
  const n = {X: -g.dir.Y, Y: g.dir.X};
  const tri = [
    [g.fim.X, g.fim.Y],
    [base.X + (n.X * s.pontaLarg) / 2, base.Y + (n.Y * s.pontaLarg) / 2],
    [base.X - (n.X * s.pontaLarg) / 2, base.Y - (n.Y * s.pontaLarg) / 2],
  ]
    .map((q) => q.map((v) => v.toFixed(1)).join(','))
    .join(' ');
  return (
    <g>
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse">
          <path d={d} fill="none" stroke="#fff" strokeWidth={s.espessura + 6} strokeLinecap="round" strokeDasharray={comp} strokeDashoffset={comp * (1 - prog)} />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={s.espessura}
        strokeLinecap={tipo === 'passe' ? 'round' : 'butt'}
        strokeDasharray={tipo === 'movimento' ? s.tracejado : undefined}
        mask={`url(#m${id})`}
      />
      {ponta > 0 && <polygon points={tri} fill={cor} opacity={ponta} />}
    </g>
  );
};
