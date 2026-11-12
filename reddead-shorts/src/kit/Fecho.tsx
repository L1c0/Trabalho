import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COR, H, prog, saiExpo, W } from './base';
import { Camera } from './Cena';
import { Traco } from './Pecas';
import { Cinetico, Cz } from './Texto';
import { QuadroDe } from './Tinta';

/**
 * "Mais um amanhã." · o fecho dos dois Shorts.
 * O pôr do sol, em cores. É o único plano que não é tinta.
 */
export const Fecho: React.FC<{ f: number; f0: number; tempos: number[] }> = ({ f, f0, tempos }) => {
  const entra = saiExpo(prog(f, f0, 14));
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0b05', overflow: 'hidden' }}>
      <Camera escala={1.12 - 0.07 * prog(f, f0, 70)} origem="46% 40%">
        <QuadroDe arq="takes/sol-cor.mp4" k={60 + (f - f0) * 1.0} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, filter: 'saturate(1.25) contrast(1.12) brightness(1.02)' }} />
        <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(20,8,3,0.25) 0%, rgba(20,8,3,0) 30%, rgba(20,8,3,0) 55%, rgba(20,8,3,0.75) 100%)' }} />
      </Camera>
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(20,8,3,0) 52%, rgba(20,8,3,0.62) 64%, rgba(20,8,3,0.62) 70%, rgba(20,8,3,0) 82%)' }} />
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: 0.9 * (1 - entra) }} />
      <Cinetico
        texto="MAIS UM AMANHÃ"
        f={f}
        ini={tempos[0]}
        tempos={tempos}
        por="palavra"
        dur={10}
        estilo="foco"
        style={{ position: 'absolute', left: 0, width: W, top: 1236, textAlign: 'center', ...Cz(80, COR.osso, 0.2, { fontWeight: 700, paddingLeft: '0.2em', textShadow: '0 4px 30px rgba(0,0,0,0.75)' }) }}
      />
      <Traco f={f} t0={tempos[2] + 4} dur={16} x={390} y={1360} w={300} h={5} cor={COR.vermelho} origem="center" />
    </AbsoluteFill>
  );
};
