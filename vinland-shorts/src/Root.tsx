import React from 'react';
import { Composition, Folder } from 'remotion';
import contagem from './data/timeline/1-contagem.json';
import anel from './data/timeline/2-anel.json';
import sagas from './data/timeline/3-sagas.json';
import oficina from './data/timeline/4-oficina.json';
import { Anel } from './shorts/Anel';
import { Contagem } from './shorts/Contagem';
import { Oficina } from './shorts/Oficina';
import { Sagas } from './shorts/Sagas';

/** Os quatro Shorts, na ordem de publicação (um por dia, 19h). Tamanho, fps e duração vêm dos timeline.json. */
export const RemotionRoot: React.FC = () => (
  <Folder name="vinland">
    <Composition id="Dia1-Anel" component={Anel} durationInFrames={anel.frames} fps={anel.fps} width={anel.largura} height={anel.altura} />
    <Composition
      id="Dia2-Contagem"
      component={Contagem}
      durationInFrames={contagem.frames}
      fps={contagem.fps}
      width={contagem.largura}
      height={contagem.altura}
    />
    <Composition id="Dia3-Sagas" component={Sagas} durationInFrames={sagas.frames} fps={sagas.fps} width={sagas.largura} height={sagas.altura} />
    <Composition
      id="Dia4-Oficina"
      component={Oficina}
      durationInFrames={oficina.frames}
      fps={oficina.fps}
      width={oficina.largura}
      height={oficina.altura}
    />
  </Folder>
);
