import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from './data';
import {cores, corDoBloco} from './theme';
import {Duotone} from './lib/Duotone';
import {Logo} from './lib/Logo';

// Thumb 16x9: cor chapada, UMA palavra estourando as bordas, a foto atrás dela,
// um objeto em amarelo-limão, o logo. Nada importante nos 10% das bordas.
export const Thumb: React.FC = () => {
  const t = V.thumb;
  const mx = V.largura * t.margem;
  const my = V.altura * t.margem;
  return (
    <AbsoluteFill style={{backgroundColor: cores.fundoThumb}}>
      <Duotone modo="recorte" src={t.foto} cor={corDoBloco.verde} x={mx} y={my} largura={V.largura - 2 * mx} altura={V.altura - 2 * my} posicao="center" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: '"Archivo Black", sans-serif', fontSize: t.tamanho, lineHeight: 1, color: cores.preto, whiteSpace: 'nowrap'}}>{t.texto}</div>
      </AbsoluteFill>
      <Duotone modo="recorte" src={t.objeto.imagem} cor={cores.limao} x={t.objeto.x} y={t.objeto.y} largura={t.objeto.tamanho} />
      <Logo cor={corDoBloco.verde} x={mx} y={V.altura - my - 120} tamanho={120} />
    </AbsoluteFill>
  );
};
