import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cores, textura} from '../theme';
import {rgba} from './Dobra';

// A luz do abajur: transparente no centro, cor de dobra nas bordas.
export const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: textura.vinheta.opacidade,
      background: `radial-gradient(ellipse at 50% 45%, ${rgba(cores.dobra, 0)} ${textura.vinheta.centro * 100}%, ${rgba(cores.dobra, 1)} 100%)`,
    }}
  />
);
