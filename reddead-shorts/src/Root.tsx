import React from 'react';
import { Composition } from 'remotion';
import './kit/fontes';
import { DUR_S1, Short1 } from './s1/Short1';
import { Teste } from './Teste';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short1" component={Short1} defaultProps={{ som: false }} durationInFrames={DUR_S1} fps={30} width={1080} height={1920} />
    <Composition id="Teste" component={Teste} durationInFrames={50} fps={30} width={1080} height={1920} />
  </>
);
