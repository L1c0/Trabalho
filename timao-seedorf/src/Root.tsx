import React from 'react';
import {Composition} from 'remotion';
import {edit} from './data/edit';
import {Edit} from './Edit';
import {carregarFontes} from './fonts';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Edit-16x9" component={Edit} durationInFrames={edit.duracao} fps={edit.fps} width={1920} height={1080} />
    <Composition id="Edit-9x16" component={Edit} durationInFrames={edit.duracao} fps={edit.fps} width={1080} height={1920} />
  </>
);
