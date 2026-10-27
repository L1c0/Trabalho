import React from 'react';
import { Composition } from 'remotion';
import tl from './data/timeline.json';
import { Oficina } from './Oficina';

const F = tl.formato;

export const RemotionRoot: React.FC = () => (
  <Composition id="Oficina" component={Oficina} durationInFrames={F.frames} fps={F.fps} width={F.larg} height={F.alt} />
);
