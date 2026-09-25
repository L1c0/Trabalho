import React from 'react';

// Borda irregular de tinta sobre washi: ruído deslocando o contorno.
export const FiltroTinta: React.FC<{
  id: string;
  frequencia: number;
  oitavas: number;
  deslocamento: number;
  semente: number;
}> = ({id, frequencia, oitavas, deslocamento, semente}) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency={frequencia} numOctaves={oitavas} seed={semente} result="ruido" />
    <feDisplacementMap in="SourceGraphic" in2="ruido" scale={deslocamento} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

export const idSvg = (bruto: string) => bruto.replace(/[^a-zA-Z0-9]/g, '');
