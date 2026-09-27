import React from 'react';
import {useCurrentFrame} from 'remotion';

// EMPILHAR · linhas entrando uma a uma, de baixo pra cima: a nova entra na base e as
// anteriores sobem uma linha, por corte (nada desliza).
export const Empilhar: React.FC<{
  de: number;
  linhas: readonly string[];
  intervalo: number;
  estilo: React.CSSProperties;
  marcador?: (i: number) => React.ReactNode;
}> = ({de, linhas, intervalo, estilo, marcador}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const visiveis = Math.min(linhas.length, Math.floor((frame - de) / intervalo) + 1);
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', ...estilo}}>
      {linhas.slice(0, visiveis).map((l, i) => (
        <div key={i} style={{whiteSpace: 'nowrap'}}>
          {marcador ? marcador(i) : null}
          {l}
        </div>
      ))}
    </div>
  );
};
