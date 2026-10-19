import React from 'react';
import { Composition, Folder } from 'remotion';
import { SemInimigos } from './scenes/SemInimigos';
import { CemSocos } from './scenes/CemSocos';
import { TesteGrao } from './teste/Grao';
import { Vinland } from './Vinland';
import { DURACAO_NARRACAO, FPS } from './data/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Vinland"
      component={Vinland}
      durationInFrames={DURACAO_NARRACAO}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Folder name="cap96">
      <Composition
        id="CemSocos"
        component={CemSocos}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SemInimigos"
        component={SemInimigos}
        durationInFrames={260}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
    <Folder name="teste">
      <Composition id="TesteGrao" component={TesteGrao} durationInFrames={2} fps={30} width={1920} height={1080} />
    </Folder>
  </>
);
