import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {cores, curvas, tempo} from '../theme';
import {escalaX, type EstadoDoAnel} from './trajeto';

// O VÃO. O interior do anel é uma máscara que revela uma SEGUNDA CAMADA da cena:
// preto, sem textura, sem pauta — o mundo onde ninguém vê. A máscara acompanha o
// scaleX do anel: de perfil o vão tem largura zero. O que está aqui dentro some por
// oclusão, nunca por fade.
export const Vao: React.FC<{
  e: EstadoDoAnel;
  abre: number; // frame em que o vão se abre (do centro para a borda)
  fecha?: number; // depois de fechado por um giro, ele não reabre
  deslocamento?: number; // paralaxe da camada B, em px
  children?: React.ReactNode;
}> = ({e, abre, fecha = Infinity, deslocamento = 0, children}) => {
  const frame = useCurrentFrame();
  if (frame < abre || frame >= fecha) return null;
  const abertura = interpolate(frame, [abre, abre + tempo.vao.abre], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curvas.corpo});
  // o vão fica por dentro do traço
  const ry = Math.max(0, e.raio - (tempo.anel.tracoLateral * e.traco) / 2) * abertura;
  const rx = ry * Math.abs(escalaX(e.giro));
  if (rx < 0.5) return null;
  return (
    <AbsoluteFill style={{clipPath: `ellipse(${rx}px ${ry}px at ${e.x}px ${e.y}px)`}}>
      <AbsoluteFill style={{backgroundColor: cores.vao}} />
      <AbsoluteFill style={{transform: `translateX(${deslocamento}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
