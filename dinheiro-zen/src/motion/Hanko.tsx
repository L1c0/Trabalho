import React, {useId} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {cores, fontes, motion} from '../theme';
import {idSvg} from './Tinta';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const usePressao = (inicio: number, duracao: number) => {
  const frame = useCurrentFrame();
  return {
    visivel: frame >= inicio,
    escala: interpolate(frame, [inicio, inicio + duracao], [motion.hanko.escalaInicial, 1], clamp),
  };
};

// 判子: pressiona (1.14 → 1.0 em 3 frames), para seco. Tinta irregular e borda sangrando.
export const Hanko: React.FC<{kanji: string; tamanho: number; inicio: number; direita: number; topo: number}> = ({
  kanji,
  tamanho,
  inicio,
  direita,
  topo,
}) => {
  const id = idSvg(useId());
  const h = motion.hanko;
  const t = motion.hankoTinta;
  const {visivel, escala} = usePressao(inicio, h.pressao);
  if (!visivel) return null;
  const s = tamanho;
  const borda = s * h.borda;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{
        position: 'absolute',
        left: direita - s,
        top: topo,
        overflow: 'visible',
        opacity: h.opacidade,
        transform: `rotate(${h.rotacao}deg) scale(${escala})`,
      }}
    >
      <defs>
        <filter id={`b${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={t.frequencia} numOctaves={t.oitavas} seed={t.semente} result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={t.deslocamento} xChannelSelector="R" yChannelSelector="G" result="borda" />
          <feTurbulence type="fractalNoise" baseFrequency={t.frequencia * 4} numOctaves={2} seed={t.semente + 1} result="grao" />
          <feColorMatrix in="grao" type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -6 ${6 * t.falhas + 0.5}`} result="falhas" />
          <feComposite in="borda" in2="falhas" operator="in" />
        </filter>
        <filter id={`s${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency={t.frequencia / 2} numOctaves={t.oitavas} seed={t.semente + 2} result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={t.deslocamento * 3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`m${id}`}>
          <rect width={s} height={s} fill="#fff" />
          <rect x={borda} y={borda} width={s - 2 * borda} height={s - 2 * borda} fill="none" stroke="#000" strokeWidth={borda * 0.5} />
          <text
            x={s / 2}
            y={s / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={fontes.display}
            fontWeight={fontes.peso.hanko}
            fontSize={s * h.glifo}
            fill="#000"
          >
            {kanji}
          </text>
        </mask>
      </defs>
      <rect
        x={(s - s * t.sangria) / 2}
        y={(s - s * t.sangria) / 2}
        width={s * t.sangria}
        height={s * t.sangria}
        fill={cores.shu}
        opacity={t.sangriaOpacidade}
        filter={`url(#s${id})`}
      />
      <g filter={`url(#b${id})`}>
        <rect width={s} height={s} fill={cores.shu} mask={`url(#m${id})`} />
      </g>
    </svg>
  );
};

// Losango de 12px entrando como um carimbo pequeno.
export const Losango: React.FC<{lado: number; inicio: number}> = ({lado, inicio}) => {
  const {visivel, escala} = usePressao(inicio, motion.losango.pressao);
  return (
    <span
      style={{
        display: 'inline-block',
        width: lado,
        height: lado,
        backgroundColor: cores.shu,
        visibility: visivel ? 'visible' : 'hidden',
        transform: `rotate(45deg) scale(${escala})`,
        opacity: motion.hanko.opacidade,
        flexShrink: 0,
      }}
    />
  );
};
