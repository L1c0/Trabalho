import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cores, motion} from '../theme';
import {Washi} from '../components/Washi';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 襖: painel de correr. Entra pela direita em velocidade constante, para seco
// fechado, e sai pela esquerda revelando a página nova (direita primeiro, como se lê).
export const Fusuma: React.FC<{inicio: number}> = ({inicio}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const f = motion.fusuma;
  const fechado = inicio + f.fechar;
  const abre = fechado + f.segurar;
  if (frame < inicio || frame > abre + f.abrir) return null;

  const x =
    frame <= fechado
      ? interpolate(frame, [inicio, fechado], [width + f.moldura, 0], clamp)
      : interpolate(frame, [abre, abre + f.abrir], [0, -(width + f.moldura)], clamp);

  const montante = (lado: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [lado]: -f.moldura,
    width: f.moldura,
    backgroundColor: cores.koshi,
    [lado === 'left' ? 'borderLeft' : 'borderRight']: `${f.fio}px solid ${cores.sumi}`,
  });

  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Washi semente={motion.washi.semente + 1} />
      </AbsoluteFill>
      <div style={montante('left')} />
      <div style={montante('right')} />
      <div
        style={{
          position: 'absolute',
          left: f.puxadorRecuo - f.puxador / 2,
          top: height / 2 - f.puxador / 2,
          width: f.puxador,
          height: f.puxador,
          borderRadius: '50%',
          border: `${f.fio * 1.5}px solid ${cores.rikyu}`,
          backgroundColor: cores.koshi,
          boxSizing: 'border-box',
        }}
      />
    </AbsoluteFill>
  );
};
