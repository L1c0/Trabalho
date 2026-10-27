import React from 'react';
import { Composition, Folder } from 'remotion';
import { Anel } from './shorts/Anel';
import { Contagem } from './shorts/Contagem';
import { Oficina } from './shorts/Oficina';
import { Sagas } from './shorts/Sagas';

/** Os quatro Shorts, na ordem de publicação (um por dia, 19h). 1080x1920, 30 fps. */
export const RemotionRoot: React.FC = () => (
  <Folder name="vinland">
    <Composition id="Dia1-Anel" component={Anel} durationInFrames={1261} fps={30} width={1080} height={1920} />
    <Composition id="Dia2-Contagem" component={Contagem} durationInFrames={781} fps={30} width={1080} height={1920} />
    <Composition id="Dia3-Sagas" component={Sagas} durationInFrames={1257} fps={30} width={1080} height={1920} />
    <Composition id="Dia4-Oficina" component={Oficina} durationInFrames={1213} fps={30} width={1080} height={1920} />
  </Folder>
);
