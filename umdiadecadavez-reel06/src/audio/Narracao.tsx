import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';
import {R} from '../data';

// Narração já tratada fora do Remotion (public/audio/reel03.mp3, -16 LUFS).
export const Narracao: React.FC = () => (
  <Sequence name="narração" from={0} durationInFrames={R.fim} layout="none">
    <Html5Audio src={staticFile(R.audio.narracao)} />
  </Sequence>
);
