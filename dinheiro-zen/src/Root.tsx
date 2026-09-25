import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {carregarFontes} from './fonts';
import {formatos, tempo} from './theme';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Ad-9x16" component={Ad} durationInFrames={tempo.total} fps={tempo.fps} {...formatos['9x16']} />
    <Composition id="Ad-1x1" component={Ad} durationInFrames={tempo.total} fps={tempo.fps} {...formatos['1x1']} />
  </>
);
