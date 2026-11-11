import React from 'react';
import { Composition } from 'remotion';
import './kit/fontes';
import { DURACAO, Video } from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="RedDead" component={Video} defaultProps={{ clipes: true }} durationInFrames={DURACAO} fps={30} width={1920} height={1080} />
);
