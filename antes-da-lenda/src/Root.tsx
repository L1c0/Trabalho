import React from 'react';
import {Composition} from 'remotion';
import {IntroScene} from './IntroScene';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Intro"
    component={IntroScene}
    durationInFrames={315}   // 10,5 s
    fps={30}
    width={1920}
    height={1080}
  />
);
