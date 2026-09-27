import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {textura} from '../theme';

// Fibra do papel: ruído fractal dessaturado, estático. Mistura "overlay" para
// texturizar sem mudar a cor média da folha.
export const Fibra: React.FC = () => {
  const id = `fibra${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const f = textura.fibra;
  return (
    <AbsoluteFill style={{opacity: f.opacidade, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={f.frequencia} numOctaves={f.oitavas} seed={f.semente} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
