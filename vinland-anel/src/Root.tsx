import React from 'react';
import { Composition } from 'remotion';
import { Anel } from './Anel';
import tl from './data/timeline.json';

const F = tl.formato;

export const RemotionRoot: React.FC = () => (
  <Composition id="Anel" component={Anel} durationInFrames={F.frames} fps={F.fps} width={F.larg} height={F.alt} />
);
