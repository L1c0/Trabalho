import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {edit} from '../data/edit';
import {cores, fecho, fontes} from '../theme';
import {existe} from './existe';

// O CARD FINAL. O preto entra por opacidade em 20 frames e para em 75%: o último quadro
// do g01 fica visível por trás, congelado, a 25%. Ao centro, o escudo e a pergunta.
export const Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, fecho.entrada], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const escudo = edit.escudos.Corinthians;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: cores.barra, opacity: t * fecho.fundoFinal}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: t, gap: 18}}>
        {existe(escudo) ? (
          <Img src={staticFile(escudo)} style={{width: fecho.escudo, height: fecho.escudo, objectFit: 'contain', opacity: 0.9}} />
        ) : (
          <div style={{width: fecho.escudo, height: fecho.escudo, borderRadius: '50%', border: `2px solid ${cores.cardNomes}`, opacity: 0.5, boxSizing: 'border-box'}} />
        )}
        <div style={{fontFamily: fontes.texto, fontWeight: 600, fontSize: fecho.titulo, color: cores.luz, marginTop: 10}}>o que você acha?</div>
        <div style={{fontFamily: fontes.texto, fontWeight: 400, fontSize: fecho.sub, color: cores.cardNomes}}>deixe sua opinião nos comentários</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
