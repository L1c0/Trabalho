import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cores} from '../theme';
import {Dobra} from './Dobra';
import {Fibra} from './Fibra';
import {Pauta} from './Pauta';
import {Vinheta} from './Vinheta';

// A folha inteira: cor, fibra, dobra, pauta e a luz do abajur — sempre juntas.
export const Papel: React.FC<{pauta?: number; children?: React.ReactNode}> = ({pauta, children}) => (
  <AbsoluteFill style={{backgroundColor: cores.papel}}>
    <Fibra />
    <Dobra />
    <Pauta opacidade={pauta} />
    <AbsoluteFill>{children}</AbsoluteFill>
    <Vinheta />
  </AbsoluteFill>
);
