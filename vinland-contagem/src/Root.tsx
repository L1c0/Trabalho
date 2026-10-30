import React from 'react';
import { Composition } from 'remotion';
import { Contagem } from './Contagem';
import timeline from './timeline.json';

// O Root do pacote (docs/Root-do-pacote.tsx) registra a ContagemScene sozinha;
// aqui a composição é a cena + legenda + áudio (src/Contagem.tsx).
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Contagem"
      component={Contagem}
      durationInFrames={timeline.formato.frames} // 783
      fps={timeline.formato.fps} // 30
      width={timeline.formato.larg} // 1080
      height={timeline.formato.alt} // 1920
    />
  );
};
