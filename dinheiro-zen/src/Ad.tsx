import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {blocos, cues} from './data/roteiro';
import {cenas} from './scenes';
import {Fusuma} from './motion/Fusuma';
import {Legenda} from './components/Legenda';
import {Washi} from './components/Washi';

export const Ad: React.FC = () => (
  <AbsoluteFill>
    <Washi />
    {blocos.map((b) => {
      const Cena = cenas[b.id];
      return (
        <Sequence key={b.id} name={b.id} from={b.de} durationInFrames={b.ate - b.de}>
          <Cena />
        </Sequence>
      );
    })}
    <Fusuma inicio={cues.fusuma1} />
    <Fusuma inicio={cues.fusuma2} />
    <Legenda />

    <Html5Audio src={staticFile('audio/narracao.mp3')} />

    {/* SFX a -24 dB — descomentar (e importar heros, dbParaVolume e audio) quando existirem em public/audio/sfx/
    <Sequence from={heros.ma.kakijun}><Html5Audio src={staticFile('audio/sfx/pincel.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={heros.kakeibo.kakijun}><Html5Audio src={staticFile('audio/sfx/pincel.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={cues.fusuma1}><Html5Audio src={staticFile('audio/sfx/madeira.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={cues.fusuma2}><Html5Audio src={staticFile('audio/sfx/madeira.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    <Sequence from={cues.hanko}><Html5Audio src={staticFile('audio/sfx/hanko.mp3')} volume={dbParaVolume(audio.sfxDb)} /></Sequence>
    */}
  </AbsoluteFill>
);
