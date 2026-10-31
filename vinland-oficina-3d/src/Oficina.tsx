import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Legenda } from './Legenda';
import { OficinaScene } from './OficinaScene';

/**
 * A OFICINA, 3D — 1080x1920, 30 fps, 1215 frames (docs/LEIA-PRIMEIRO.md).
 *
 * OficinaScene.tsx é a cena do pacote, sem alteração ("não reprojeta a
 * câmera"). Ela não traz a legenda queimada nem o áudio que o LEIA pede;
 * os dois entram aqui, por cima e fora da cena.
 */
export const Oficina: React.FC = () => (
  <AbsoluteFill>
    <OficinaScene />
    <Legenda />
    <Audio src={staticFile('audio/4-oficina.mp3')} />
  </AbsoluteFill>
);
