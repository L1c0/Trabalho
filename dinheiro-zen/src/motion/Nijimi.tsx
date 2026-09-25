import React, {useId} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {motion} from '../theme';
import {FiltroTinta, idSvg} from './Tinta';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ANEIS = [0, 0.2, 0.4, 0.6, 0.8];

// 滲み: tinta tocando o papel. O raio cresce como difusão (√t) e a opacidade
// sobe de dentro para fora; a borda irregular vem do ruído no deslocamento.
export const Nijimi: React.FC<{
  cx: number;
  cy: number;
  raio: number;
  inicio: number;
  cor: string;
  secarEm?: number;
}> = ({cx, cy, raio, inicio, cor, secarEm}) => {
  const frame = useCurrentFrame();
  const id = idSvg(useId());
  const n = motion.nijimi;
  if (frame < inicio) return null;

  const t = interpolate(frame, [inicio, inicio + n.crescer], [0, 1], clamp);
  const r = raio * Math.sqrt(t);
  const seco =
    secarEm === undefined ? 1 : interpolate(frame, [secarEm, secarEm + n.secar], [1, 0], clamp);
  const opacidadeDoAnel = (o: number) =>
    n.opacidade *
    (n.frente +
      (1 - n.frente) * interpolate(t, [n.atrasoBorda * o, n.atrasoBorda * o + (1 - n.atrasoBorda)], [0, 1], clamp));
  const borda = Math.min(1, opacidadeDoAnel(1) * (1 + n.orla));
  const margem = raio * (1 + n.deslocamento);

  return (
    <svg
      width={margem * 2}
      height={margem * 2}
      viewBox={`${cx - margem} ${cy - margem} ${margem * 2} ${margem * 2}`}
      style={{position: 'absolute', left: cx - margem, top: cy - margem, overflow: 'visible', opacity: seco}}
    >
      <defs>
        <FiltroTinta
          id={`f${id}`}
          frequencia={n.frequencia}
          oitavas={n.oitavas}
          deslocamento={raio * n.deslocamento * Math.sqrt(t)}
          semente={n.semente}
        />
        <radialGradient id={`g${id}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={Math.max(r, 0.001)}>
          {ANEIS.map((o) => (
            <stop key={o} offset={o} stopColor={cor} stopOpacity={opacidadeDoAnel(o)} />
          ))}
          <stop offset={1 - n.orla} stopColor={cor} stopOpacity={opacidadeDoAnel(1)} />
          <stop offset={1} stopColor={cor} stopOpacity={borda} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#g${id})`} filter={`url(#f${id})`} />
    </svg>
  );
};
