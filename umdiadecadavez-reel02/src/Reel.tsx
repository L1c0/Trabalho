import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {reel02 as R} from './data/reel02';
import {cenas} from './scenes';
import {cores} from './theme';
import {Narracao} from './audio/Narracao';
import {RoomTone, Sfx} from './audio/Sfx';
import {Trilha} from './audio/Trilha';

// Blocos em ordem: cada virada fica por cima do bloco anterior enquanto a página vira.
export const Reel: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: cores.breu}}>
    {R.blocos.map((b) => {
      const Cena = cenas[b.id];
      return (
        <Sequence key={b.id} name={b.id} from={b.de} durationInFrames={b.ate - b.de}>
          <Cena />
        </Sequence>
      );
    })}
    <Narracao />
    <Trilha />
    <RoomTone />
    <Sfx />
  </AbsoluteFill>
);
