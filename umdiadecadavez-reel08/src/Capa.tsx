import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {R} from './data';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroEscrito} from './components/Hero';
import {Balanca} from './motion/Balanca';

// Capa do grid: a balança já desenhada e inclinada, o Hero já escrito, as mesmas texturas. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  return (
    <AbsoluteFill>
      <Papel>
        <Balanca
          x={c.balanca.x}
          y={c.balanca.y}
          escala={c.balanca.escala}
          inclinacao={c.balanca.inclinacao}
          desenha={JA_ESCRITO}
          cor={cores.esfero}
          esquerda={{texto: R.balanca.esquerda.texto, de: JA_ESCRITO, tamanho: c.balanca.tamanhoTexto}}
          direita={{texto: R.balanca.direita.texto, de: JA_ESCRITO, tamanho: c.balanca.tamanhoTexto}}
        />
        <HeroEscrito linhas={[c.hero.texto]} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={0} topo={c.hero.topo} centro />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
