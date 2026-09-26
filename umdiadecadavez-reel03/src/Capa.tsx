import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {R} from './data';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroManuscrito} from './components/Hero';
import {Legenda} from './components/Legenda';

// Capa do grid: mesmas texturas e o mesmo Hero manuscrito do Reel, já escrito. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  return (
    <AbsoluteFill>
      <Papel>
        <HeroManuscrito texto={c.hero.texto} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={margem} base={c.hero.base} semente="capa" />
        <Legenda linhas={[c.sub.texto]} inicio={JA_ESCRITO} tamanho={c.sub.tamanho} cor={cores.esfero} esquerda={margem} topo={c.hero.base + c.sub.tamanho * 2} />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
