import React from 'react';
import { Composition } from 'remotion';
import { Short } from './Short';
import agenda from './data/agenda.json';

const AG = agenda as unknown as Record<string, { dur: number }>;

export const RemotionRoot: React.FC = () => (
  <>
    {[1, 2, 3, 4].map((n) => (
      <Composition
        key={n}
        id={`S${n}`}
        component={Short}
        defaultProps={{ n }}
        durationInFrames={AG[`s${n}`].dur}
        fps={30}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
