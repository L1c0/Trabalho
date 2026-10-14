import React from 'react';
import {Composition} from 'remotion';
import {video01} from './data/video01';
import {video02} from './data/video02';
import {carregarFontes} from './fonts';
import {formatos} from './theme';
import {Video} from './Video';

carregarFontes();

// Quatro composições, do mesmo data: V01/V02 × YouTube 16:9 / TikTok 9:16.
export const RemotionRoot: React.FC = () => (
  <>
    {[
      {id: 'V01', dados: video01},
      {id: 'V02', dados: video02},
    ].map(({id, dados}) =>
      [false, true].map((vertical) => {
        const f = vertical ? formatos.vertical : formatos.horizontal;
        return (
          <Composition
            key={`${id}-${vertical}`}
            id={`${id}-${vertical ? '9x16' : '16x9'}`}
            component={Video}
            durationInFrames={dados.duracao}
            fps={30}
            width={f.largura}
            height={f.altura}
            defaultProps={{dados, vertical}}
          />
        );
      }),
    )}
  </>
);
