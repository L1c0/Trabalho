import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {carregarFontes} from './fonts';
import {formatos, video} from './theme';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Ad-9x16" component={Ad} durationInFrames={video.duracao} fps={video.fps} {...formatos['9x16']} />
    <Composition id="Ad-1x1" component={Ad} durationInFrames={video.duracao} fps={video.fps} {...formatos['1x1']} />
  </>
);
