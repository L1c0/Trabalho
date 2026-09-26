import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cores, tempo} from '../theme';
import {rgba} from '../texture/Dobra';

// Página virando: a folha nova aparece da direita para a esquerda, com a sombra
// da página levantada atravessando. Linear, parada seca. Não é slide: nada desliza.
export const Virada: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const v = tempo.virada;
  const borda = interpolate(frame, [inicio, inicio + v.duracao], [width, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < inicio) return null;
  const virando = borda > 0;
  return (
    <AbsoluteFill style={virando ? {clipPath: `inset(0 0 0 ${borda}px)`} : undefined}>
      {children}
      {virando ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: borda,
            width: v.sombra,
            background: `linear-gradient(to right, ${rgba(cores.breu, v.sombraOpacidade)}, ${rgba(cores.breu, 0)})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
