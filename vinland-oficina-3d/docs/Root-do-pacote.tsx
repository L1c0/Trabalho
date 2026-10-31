import React from 'react';
import {Composition} from 'remotion';
import {OficinaScene} from './OficinaScene';
import cam from './of-camera.json';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Oficina"
    component={OficinaScene}
    durationInFrames={cam.formato.frames} // 1215
    fps={cam.formato.fps}                 // 30
    width={cam.formato.larg}              // 1080
    height={cam.formato.alt}              // 1920
  />
);
