import React, {useId, useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, motion} from '../theme';
import {TracoDePincel, type PerfilPincel} from './Pincel';
import {FiltroTinta, idSvg} from './Tinta';

const AMOSTRAS = 180;

// 円相: um único gesto, sentido horário a partir de baixo-esquerda,
// termina aberto. Raio levemente irregular, como mão.
const caminhoDoEnso = (cx: number, cy: number, raio: number) => {
  const e = motion.enso;
  const inicio = (e.inicioGraus * Math.PI) / 180;
  const volta = 2 * Math.PI * (1 - e.abertura);
  const pontos = Array.from({length: AMOSTRAS + 1}, (_, i) => {
    const a = inicio + (i / AMOSTRAS) * volta;
    const r = raio * (1 + e.ondulacao * Math.sin(2 * a + 0.7) + e.ondulacao * 0.5 * Math.sin(5 * a));
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pontos.join(' L')}`;
};

export const Enso: React.FC<{cx: number; cy: number; raio: number; inicio: number; cor: string; escala: number}> = ({
  cx,
  cy,
  raio,
  inicio,
  cor,
  escala,
}) => {
  const frame = useCurrentFrame();
  const id = `enso${idSvg(useId())}`;
  const e = motion.enso;
  const d = useMemo(() => caminhoDoEnso(cx, cy, raio), [cx, cy, raio]);
  const perfil: PerfilPincel = {
    ...motion.pincel,
    inicio: e.larguraInicio * escala,
    fim: e.larguraFim * escala,
    curva: e.curva,
    amostra: motion.pincel.amostra * 3,
  };
  const progresso = interpolate(frame, [inicio, inicio + e.traco], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.pincel,
  });
  const t = motion.tinta;
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      <defs>
        <FiltroTinta id={id} frequencia={t.frequencia / 4} oitavas={t.oitavas} deslocamento={t.deslocamento * 3 * escala} semente={t.semente} />
      </defs>
      <g filter={`url(#${id})`}>
        <TracoDePincel d={d} progresso={progresso} perfil={perfil} cor={cor} />
      </g>
    </svg>
  );
};
