import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {textos} from '../data/textos';
import {cores, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Nijimi, QuadradosDeTinta} from '../motion/Nijimi';
import {Absorcao} from '../components/Absorcao';
import {Escrita} from '../components/Escrita';
import {Intervalo} from './TresSegundos';

// 0400–0600 · ONDE O DINHEIRO SOME
export const DinheiroSome: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const c = L.dinheiroSome;
  const q = (f: number) => local('dinheiroSome', f);
  const T = tempo.dinheiroSome;
  const tracoAbsorvido = interpolate(frame, [q(T.nijimi), q(T.nijimi) + motion.nijimi.crescer / 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: tracoAbsorvido}}>
        <Intervalo progresso={1} />
      </AbsoluteFill>
      <Absorcao inicio={q(T.absorcao)}>
        <Nijimi cx={c.centro.x} cy={c.centro.y} raio={c.raio} inicio={q(T.nijimi)} cor={cores.ai} secarEm={q(T.quadrados)} />
        <QuadradosDeTinta centros={c.quadrados.slice(0, textos.dinheiroSome.categorias)} lado={c.ladoQuadrado} inicio={q(T.quadrados)} cor={cores.ai} />
        <Escrita
          linhas={textos.dinheiroSome.legenda}
          inicio={q(T.legenda)}
          direita={c.legenda.direita}
          topo={c.legenda.topo}
          estilo={{
            fontFamily: fontes.display,
            fontWeight: fontes.peso.corpo,
            fontSize: L.tipo.corpo,
            lineHeight: proporcoes.entrelinha,
            color: cores.sumi,
          }}
        />
      </Absorcao>
    </AbsoluteFill>
  );
};
