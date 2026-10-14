import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {curvas, medidas, paleta} from '../theme';
import {useFormato} from './formato';

// FECHO: fundo cheio e o logo da Libertadores (texto recolorido para o osso, para ler no
// escuro). Entra em 12 quadros.
export const Fecho: React.FC = () => {
  const f = useCurrentFrame();
  const fm = useFormato();
  const h = fm.altura * (fm.vertical ? 0.3 : medidas.fecho.logo);
  const o = curvas.saida(Math.min(1, f / medidas.fecho.entrada));
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo, alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('logo/libertadores.png')} style={{height: h, opacity: o, marginTop: fm.vertical ? -fm.altura * 0.06 : 0}} />
    </AbsoluteFill>
  );
};
