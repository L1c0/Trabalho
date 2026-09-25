import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {reel02 as R} from './data/reel02';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroEscrito} from './components/Hero';
import {Legenda} from './components/Legenda';

// Capa do grid: mesmas texturas e o mesmo Hero do Reel, já escrito. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  return (
    <AbsoluteFill>
      <Papel>
        <HeroEscrito linhas={[c.hero.texto]} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={margem} topo={c.hero.topo} />
        <Legenda linhas={[c.sub.texto]} inicio={JA_ESCRITO} tamanho={c.sub.tamanho} cor={cores.esfero} esquerda={margem} topo={c.hero.topo + c.hero.tamanho + c.sub.tamanho} />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
