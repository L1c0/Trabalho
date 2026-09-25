import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {cores, motion} from '../theme';
import {idSvg} from '../motion/Tinta';

// 鳥の子紙: papel com fibra. Textura estática, nunca anima.
export const Washi: React.FC<{semente?: number}> = ({semente = motion.washi.semente}) => {
  const id = `washi${idSvg(useId())}`;
  const w = motion.washi;
  return (
    <AbsoluteFill style={{backgroundColor: cores.torinoko}}>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: w.opacidade}}>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={w.frequencia} numOctaves={w.oitavas} seed={semente} />
          <feColorMatrix type="matrix" values={`0 0 0 0 ${w.fibra[0]} 0 0 0 0 ${w.fibra[1]} 0 0 0 0 ${w.fibra[2]} ${w.contraste} 0 0 0 ${-w.limiar}`} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
