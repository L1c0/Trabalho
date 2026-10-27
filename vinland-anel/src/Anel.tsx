import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Disco } from './Disco';
import { Legenda } from './Legenda';
import { Tipo } from './Tipo';

/**
 * O ANEL — 1080x1920, 30 fps, 1266 frames. Uma tomada, nenhum corte.
 *
 * Uma seção de tronco se constrói na tela, anel por anel, enquanto a
 * narração conta (docs/LEIA-PRIMEIRO.md). Três camadas: o disco (o
 * compositor, que lê a tabela do timeline.json frame a frame), a
 * tipografia impressa e a legenda. O som é a mixagem de
 * ferramentas/mixagem.py: narração, tiques e trilha somados e normalizados.
 */
export const Anel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#D2CEC4' }}>
    <Disco />
    <Tipo />
    <Legenda />
    <Audio src={staticFile('audio/mix.flac')} />
  </AbsoluteFill>
);
