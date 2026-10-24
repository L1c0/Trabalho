import React from 'react';
import { Composition, Folder } from 'remotion';
import { Leviata } from './shorts/Leviata';
import { Navio } from './shorts/Navio';
import { Memoria } from './shorts/Memoria';
import { Pedra } from './shorts/Pedra';

/** Os quatro Shorts, na ordem de publicação: um por dia. 1080x1920, 30 fps. */
export const RemotionRoot: React.FC = () => (
  <Folder name="shorts">
    <Composition id="S1-Leviata" component={Leviata} durationInFrames={983} fps={30} width={1080} height={1920} />
    <Composition id="S2-Navio" component={Navio} durationInFrames={1347} fps={30} width={1080} height={1920} />
    <Composition id="S3-Memoria" component={Memoria} durationInFrames={1026} fps={30} width={1080} height={1920} />
    <Composition id="S4-Pedra" component={Pedra} durationInFrames={1159} fps={30} width={1080} height={1920} />
  </Folder>
);
