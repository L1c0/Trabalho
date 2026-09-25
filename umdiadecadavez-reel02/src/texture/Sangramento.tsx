import React from 'react';
import {textura} from '../theme';

// Esfero borra em papel barato: uma cópia idêntica, borrada, deslocada, por baixo.
export const Sangramento: React.FC<{children: React.ReactNode; estilo?: React.CSSProperties}> = ({children, estilo}) => {
  const s = textura.sangramento;
  return (
    <div style={{position: 'relative', ...estilo}}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          filter: `blur(${s.blur}px)`,
          opacity: s.opacidade,
          transform: `translate(${s.desvio}px, ${s.desvio}px)`,
        }}
      >
        {children}
      </div>
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};
