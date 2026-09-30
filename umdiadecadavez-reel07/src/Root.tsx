import React from 'react';
import {Composition} from 'remotion';
import {Capa} from './Capa';
import {Reel} from './Reel';
import {R} from './data';
import {carregarFontes} from './fonts';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel-IG" component={Reel} defaultProps={{tiktok: false}} durationInFrames={R.duracao} fps={R.fps} width={1080} height={1920} />
    <Composition id="Reel-TT" component={Reel} defaultProps={{tiktok: true}} durationInFrames={R.duracao} fps={R.fps} width={1080} height={1920} />
    <Composition id="Capa-1x1" component={Capa} durationInFrames={1} fps={R.fps} width={1080} height={1080} />
  </>
);
