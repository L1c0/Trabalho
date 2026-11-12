import React from 'react';
import { Composition } from 'remotion';
import './kit/fontes';
import { DUR_S1, Short1 } from './s1/Short1';
import { DUR_S2, Short2 } from './s2/Short2';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short1" component={Short1} defaultProps={{ som: false }} durationInFrames={DUR_S1} fps={30} width={1080} height={1920} />
    <Composition id="Short2" component={Short2} defaultProps={{ som: false }} durationInFrames={DUR_S2} fps={30} width={1080} height={1920} />
  </>
);
