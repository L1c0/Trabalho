import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {R} from './data';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroEscrito} from './components/Hero';
import {AnelDesenho} from './motion/Anel';
import {Legenda} from './components/Legenda';

// Capa do grid: o anel de frente com o vão aberto, o Hero já escrito, as mesmas texturas. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  return (
    <AbsoluteFill>
      <Papel>
        {/* o vão aberto: preto absoluto */}
        <AbsoluteFill style={{clipPath: `ellipse(${c.anel.raio - 2}px ${c.anel.raio - 2}px at ${c.anel.x}px ${c.anel.y}px)`, backgroundColor: '#000000'}} />
        <AnelDesenho e={{...c.anel, giro: 0}} cor={cores.esfero} />
        <HeroEscrito linhas={[c.hero.texto]} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={0} topo={c.hero.topo} centro />
        <Legenda linhas={[c.sub.texto]} inicio={JA_ESCRITO} tamanho={c.sub.tamanho} cor={cores.esfero} esquerda={margem} topo={c.sub.topo} />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
