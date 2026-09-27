import React from 'react';
import {Composition} from 'remotion';
import {V} from './data';
import {Thumb} from './Thumb';
import {Video} from './Video';
import {carregarFontes} from './fonts';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video-16x9" component={Video} durationInFrames={V.duracao} fps={V.fps} width={V.largura} height={V.altura} />
    <Composition id="Thumb-16x9" component={Thumb} durationInFrames={1} fps={V.fps} width={V.largura} height={V.altura} />
  </>
);
