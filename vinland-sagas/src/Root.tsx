import React from 'react';
import { Composition } from 'remotion';
import tl from './data/timeline.json';
import { Sagas } from './Sagas';

const F = tl.formato;

export const RemotionRoot: React.FC = () => (
  <Composition id="Sagas" component={Sagas} durationInFrames={F.frames} fps={F.fps} width={F.larg} height={F.alt} />
);
