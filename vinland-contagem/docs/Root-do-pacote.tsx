import React from 'react';
import {Composition} from 'remotion';
import {ContagemScene} from './ContagemScene';
import timeline from './timeline.json';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Contagem"
      component={ContagemScene}
      durationInFrames={timeline.formato.frames} // 783
      fps={timeline.formato.fps} // 30
      width={timeline.formato.larg} // 1080
      height={timeline.formato.alt} // 1920
    />
  );
};
