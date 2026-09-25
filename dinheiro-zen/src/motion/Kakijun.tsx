import React, {useId} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {KANJIVG_VIEWBOX, kanjiStrokes} from '../data/kanjivg';
import {curvas, motion} from '../theme';
import {TracoDePincel} from './Pincel';
import {FiltroTinta, idSvg} from './Tinta';

export type Ritmo = {traco: number; pausa: number};

export const duracaoKakijun = (kanji: string, ritmo: Ritmo) =>
  kanjiStrokes[kanji].length * (ritmo.traco + ritmo.pausa);

// 書き順: um traço por vez, na ordem correta, pincel grosso → fino.
export const Kakijun: React.FC<{
  kanji: string;
  tamanho: number;
  inicio: number;
  ritmo: Ritmo;
  cor: string;
}> = ({kanji, tamanho, inicio, ritmo, cor}) => {
  const frame = useCurrentFrame();
  const filtro = `tinta${idSvg(useId())}`;
  const tracos = kanjiStrokes[kanji];
  const t = motion.tinta;
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${KANJIVG_VIEWBOX} ${KANJIVG_VIEWBOX}`}
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <FiltroTinta id={filtro} frequencia={t.frequencia} oitavas={t.oitavas} deslocamento={t.deslocamento} semente={t.semente} />
      </defs>
      <g filter={`url(#${filtro})`}>
        {tracos.map((d, i) => {
          const t0 = inicio + i * (ritmo.traco + ritmo.pausa);
          const progresso = interpolate(frame, [t0, t0 + ritmo.traco], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: curvas.pincel,
          });
          return <TracoDePincel key={d} d={d} progresso={progresso} perfil={motion.pincel} cor={cor} />;
        })}
      </g>
    </svg>
  );
};
