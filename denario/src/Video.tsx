import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {V} from './data';
import {Audio} from './audio/Audio';
import {Elemento} from './lib/Elemento';
import {Fundo} from './lib/Fundo';
import {Marca} from './lib/Marca';
import {checarRegras} from './lib/regras';

const avisos = checarRegras(V);
if (avisos.length > 0) console.warn(`[regras]\n${avisos.join('\n')}`);

// O vídeo: o fundo chapado, as composições em sequência (cada uma troca por corte seco),
// a marca no canto, e o áudio.
export const Video: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    {V.composicoes.map((c) => (
      <Sequence key={c.id} name={c.nome} from={c.de} durationInFrames={c.ate - c.de}>
        {c.elementos.map((e, i) => (
          <Elemento key={i} e={e} imagens={V.imagens} />
        ))}
      </Sequence>
    ))}
    <Marca />
    <Audio v={V} />
  </AbsoluteFill>
);
