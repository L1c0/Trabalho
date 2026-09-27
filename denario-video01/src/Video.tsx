import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {V, blocoNoFrame, corNoFrame} from './data';
import {blocos} from './blocos';
import {cores} from './theme';
import {Audio} from './audio/Audio';
import {agendaDaBarra} from './lib/BarraDoDia';
import {Grid} from './lib/Grid';
import {Logo} from './lib/Logo';
import {Marcas} from './lib/Marcas';

// Quando o segmento de destaque da Barra do Dia entra, tudo para (o grid inclusive).
const pausa = agendaDaBarra(V.ansiedade.barra.de, V.ansiedade.barra.segmentos).pausa;
const tempoDoGrid = (frame: number) => frame - Math.min(Math.max(frame - pausa[0], 0), pausa[1] - pausa[0]);

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const bloco = blocoNoFrame(frame);
  const cor = corNoFrame(frame);
  return (
    <AbsoluteFill style={{backgroundColor: cores.preto}}>
      {frame >= V.grid.de && frame < V.grid.ate ? <Grid cor={cor} t={tempoDoGrid(frame)} fuga={V.grid.fuga} /> : null}
      {V.blocos.map((b) => {
        const Bloco = blocos[b.id];
        return (
          <Sequence key={b.id} name={b.nome} from={b.de} durationInFrames={b.ate - b.de}>
            <Bloco q={(f) => f - b.de} />
          </Sequence>
        );
      })}
      {frame >= V.marcas.de && frame < V.marcas.ate ? <Marcas codigo={V.codigo} bloco={bloco.nome} total={V.duracao} /> : null}
      {frame >= V.logo.de ? <Logo cor={cor} x={40} y={V.altura - 40 - 104 - 12} /> : null}
      <Audio />
    </AbsoluteFill>
  );
};
