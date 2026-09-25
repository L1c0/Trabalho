import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {ordemDasCenas} from './data/cenas';
import {cenas} from './scenes';
import {audio, janelas, tempo} from './theme';
import {Fusuma} from './motion/Fusuma';
import {Washi} from './components/Washi';

export const Ad: React.FC = () => (
  <AbsoluteFill>
    <Washi />
    {ordemDasCenas.map((id) => {
      const Cena = cenas[id];
      const j = janelas[id];
      return (
        <Sequence key={id} name={id} from={j.de} durationInFrames={j.ate - j.de}>
          <Cena />
        </Sequence>
      );
    })}
    <Fusuma inicio={tempo.fusuma1} />
    <Fusuma inicio={tempo.fusuma2} />

    <Html5Audio src={staticFile(audio.narracao)} />

    {/* SFX a -24 dB — descomentar (e importar dbParaVolume de ./theme) quando existirem em public/audio/sfx/
    <Sequence from={tempo.ma.kakijun}><Html5Audio src={staticFile('audio/sfx/pincel.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={tempo.kakeibo.kakijun}><Html5Audio src={staticFile('audio/sfx/pincel.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={tempo.fusuma1}><Html5Audio src={staticFile('audio/sfx/painel-madeira.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={tempo.fusuma2}><Html5Audio src={staticFile('audio/sfx/painel-madeira.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={tempo.dinheiroZen.hanko}><Html5Audio src={staticFile('audio/sfx/hanko.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    */}

    {/* Trilha a -20 dB: koto ou shakuhachi solo, 55–65 BPM, sem percussão
    <Html5Audio src={staticFile('audio/trilha.mp3')} volume={dbParaVolume(audio.trilhaDb)} />
    */}
  </AbsoluteFill>
);
