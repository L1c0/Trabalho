import React from 'react';
import { Composition } from 'remotion';
import cam from './of-camera.json';
import { Oficina } from './Oficina';

// O Root do pacote (docs/Root-do-pacote.tsx) registra a OficinaScene sozinha;
// aqui a composição é a cena + legenda + áudio (src/Oficina.tsx).
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Oficina"
    component={Oficina}
    durationInFrames={cam.formato.frames} // 1215
    fps={cam.formato.fps} // 30
    width={cam.formato.larg} // 1080
    height={cam.formato.alt} // 1920
  />
);
