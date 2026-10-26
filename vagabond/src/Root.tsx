import React from 'react';
import { Composition } from 'remotion';
import montagem from './data/montagem.json';
import { Vagabond } from './Vagabond';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Vagabond"
      component={Vagabond}
      durationInFrames={montagem.frames}
      fps={montagem.fps}
      width={1920}
      height={1080}
      defaultProps={{ semSom: false }}
    />
  </>
);
