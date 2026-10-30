import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { ContagemScene } from './ContagemScene';
import { Legenda } from './Legenda';

/**
 * A CONTAGEM — 1080x1920, 30 fps, 783 frames (docs/LEIA-PRIMEIRO.md).
 *
 * ContagemScene.tsx é a cena 3D do pacote, sem alteração ("não reescreve a
 * câmera"). Ela não traz a legenda queimada nem o áudio que o LEIA pede;
 * os dois entram aqui, por cima e fora da cena.
 */
export const Contagem: React.FC = () => (
  <AbsoluteFill>
    <ContagemScene />
    <Legenda />
    <Audio src={staticFile('audio/1-contagem.mp3')} />
  </AbsoluteFill>
);
