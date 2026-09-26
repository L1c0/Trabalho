import React from 'react';
import {Composition} from 'remotion';
import {Capa} from './Capa';
import {Reel} from './Reel';
import {R} from './data';
import {carregarFontes} from './fonts';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel-9x16" component={Reel} durationInFrames={R.duracao} fps={R.fps} width={1080} height={1920} />
    <Composition id="Capa-1x1" component={Capa} durationInFrames={1} fps={R.fps} width={1080} height={1080} />
  </>
);
