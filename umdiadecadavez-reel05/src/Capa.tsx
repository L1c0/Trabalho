import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {R} from './data';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroEscrito} from './components/Hero';
import {Osso} from './motion/Osso';
import {Legenda} from './components/Legenda';

// Capa do grid: a linha já quebrada, o Hero já escrito, as mesmas texturas. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  return (
    <AbsoluteFill>
      <Papel>
        <Osso x={c.osso.x} y={c.osso.y} altura={c.osso.altura} espessura={c.osso.espessura} dente={c.osso.dente} afasta={c.osso.afasta} cor={cores.esfero} escreve={JA_ESCRITO} entorta={JA_ESCRITO} quebra={JA_ESCRITO} />
        <HeroEscrito linhas={[c.hero.texto]} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={0} topo={c.hero.topo} centro />
        <Legenda linhas={[c.sub.texto]} inicio={JA_ESCRITO} tamanho={c.sub.tamanho} cor={cores.esfero} esquerda={margem} topo={c.sub.topo} />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
