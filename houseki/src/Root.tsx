import React from 'react';
import {Composition} from 'remotion';
import {TOTAL} from './data/timeline';
import {Ensaio} from './Ensaio';
import {altura, fps, largura} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ensaio" component={Ensaio} defaultProps={{soSom: false}} durationInFrames={TOTAL} fps={fps} width={largura} height={altura} />
);
