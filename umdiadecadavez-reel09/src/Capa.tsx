import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {R} from './data';
import {cores} from './theme';
import {Papel} from './texture/Papel';
import {Faixa} from './components/Faixa';
import {HeroEscrito} from './components/Hero';
import {Barra} from './motion/Barra';
import {Manuscrito} from './motion/Manuscrito';

// Capa do grid: a barra inteira, hachurada, com a marca e a seta, o Hero já escrito. Margem de 15% em volta.
const JA_ESCRITO = -1000;

export const Capa: React.FC = () => {
  const {width} = useVideoConfig();
  const c = R.capa;
  const margem = width * c.margem;
  // a seta sai do rótulo, embaixo à esquerda, e sobe até o meio da marca vermelha
  const marcaX = c.barra.x + (R.barra.marcar.posicao + R.barra.marcar.fracao / 2) * c.barra.largura;
  const seta = {x0: marcaX - 60, y0: c.barra.y + c.barra.altura + 105, x1: marcaX, y1: c.barra.y + c.barra.altura + 14};
  return (
    <AbsoluteFill>
      <Papel>
        <Barra
          x={c.barra.x}
          y={c.barra.y}
          largura={c.barra.largura}
          altura={c.barra.altura}
          desenha={JA_ESCRITO}
          rotulo={{texto: c.rotulo, de: JA_ESCRITO}}
          marcar={{...R.barra.marcar, de: JA_ESCRITO, rotulo: undefined}}
          hachura={{de: JA_ESCRITO, duracao: 45}}
          semente="capa"
        />
        {/* seta manuscrita apontando a marca */}
        <svg width={1080} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path
            d={`M${seta.x0},${seta.y0} Q${seta.x0 + 30},${seta.y0 - 40} ${seta.x1},${seta.y1} M${seta.x1 - 12},${seta.y1 + 16} L${seta.x1},${seta.y1} L${seta.x1 + 16},${seta.y1 + 10}`}
            fill="none"
            stroke={cores.esfero}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{position: 'absolute', left: seta.x0 - 150, top: seta.y0 - 10}}>
          <Manuscrito texto={c.seta.texto} inicio={JA_ESCRITO} tamanho={c.seta.tamanho} cor={cores.destaque} semente="seta" falha />
        </div>
        <HeroEscrito linhas={[c.hero.texto]} inicio={JA_ESCRITO} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={0} topo={c.hero.topo} centro />
      </Papel>
      <Faixa texto={R.handle} inicio={JA_ESCRITO} topo={c.faixa.topo} altura={c.faixa.altura} tamanho={c.faixa.tamanho} esquerda={margem} />
    </AbsoluteFill>
  );
};
