import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {R} from './data';
import {CamadaDoAnel, Frente, cenas} from './scenes';
import {cores} from './theme';
import {ComPlataforma} from './plataforma';
import {Narracao} from './audio/Narracao';
import {RoomTone, Sfx} from './audio/Sfx';
import {Trilha} from './audio/Trilha';

// Blocos em ordem: cada virada fica por cima do bloco anterior enquanto a página vira.
// `tiktok` escolhe a variação da plataforma (ver theme.plataforma); o data/ é o mesmo.
export const Reel: React.FC<{tiktok: boolean}> = ({tiktok}) => (
  <ComPlataforma tiktok={tiktok}>
    <AbsoluteFill style={{backgroundColor: cores.breu}}>
      {R.blocos.map((b) => {
        const Cena = cenas[b.id];
        return (
          <Sequence key={b.id} name={b.id} from={b.de} durationInFrames={b.ate - b.de}>
            <Cena />
          </Sequence>
        );
      })}
      {/* o anel e o vão atravessam os blocos; o que fica sobre o anel vem por último */}
      <CamadaDoAnel />
      <Frente />
      <Narracao />
      <Trilha />
      <RoomTone />
      <Sfx />
    </AbsoluteFill>
  </ComPlataforma>
);
