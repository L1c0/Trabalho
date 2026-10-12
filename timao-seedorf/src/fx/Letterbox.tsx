import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {cores, curvas, fx} from '../theme';

// 6 · LETTERBOX. Barras de 54 px em cima e embaixo, fixas o vídeo inteiro. Entram nos
// primeiros 20 frames vindo de fora do quadro.
export const Letterbox: React.FC = () => {
  const frame = useCurrentFrame();
  const l = fx.letterbox;
  const fora = interpolate(frame, [0, l.entrada], [l.altura, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curvas.corpo});
  const barra: React.CSSProperties = {position: 'absolute', left: 0, right: 0, height: l.altura, backgroundColor: cores.barra};
  return (
    <>
      <div style={{...barra, top: 0, transform: `translateY(${-fora}px)`}} />
      <div style={{...barra, bottom: 0, transform: `translateY(${fora}px)`}} />
    </>
  );
};
