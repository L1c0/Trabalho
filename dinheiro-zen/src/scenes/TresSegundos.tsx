import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {textos} from '../data/textos';
import {cores, curvas, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Contador} from '../motion/Contador';
import {TracoDePincel} from '../motion/Pincel';
import {Absorcao} from '../components/Absorcao';
import {Escrita, EscritaVertical} from '../components/Escrita';
import {Ruby} from '../components/Ruby';
import {TateColumn} from '../components/TateColumn';

export const perfilDoIntervalo = (px: (v: number) => number) => ({
  ...motion.pincel,
  inicio: px(motion.intervalo.inicio),
  fim: px(motion.intervalo.fim),
  amostra: px(motion.pincel.amostra * 4),
});

// O traço índigo entre querer e comprar. Também é o ponto de partida do nijimi.
export const Intervalo: React.FC<{progresso: number}> = ({progresso}) => {
  const L = useLayout();
  const c = L.tresSegundos;
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      <TracoDePincel d={`M${c.x},${c.y1} L${c.x},${c.y2}`} progresso={progresso} perfil={perfilDoIntervalo(L.px)} cor={cores.ai} />
    </svg>
  );
};

// 0200–0400 · OS TRÊS SEGUNDOS
export const TresSegundos: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const c = L.tresSegundos;
  const q = (f: number) => local('tresSegundos', f);
  const t = textos.tresSegundos;
  const T = tempo.tresSegundos;
  const inicioComprar = q(T.formas) + motion.escrita.vertical;
  const intervalo = interpolate(frame, [q(T.intervalo), q(T.intervalo) + motion.intervalo.duracao], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.pincel,
  });
  const kanji: React.CSSProperties = {
    fontFamily: fontes.display,
    fontWeight: fontes.peso.titulo,
    fontSize: c.tamanho,
    lineHeight: 1,
    color: cores.sumi,
  };
  return (
    <AbsoluteFill>
      <Intervalo progresso={intervalo} />
      <Absorcao inicio={q(T.absorcao)}>
        <TateColumn cx={c.x} topo={c.quererTopo} tamanho={c.tamanho}>
          <EscritaVertical inicio={q(T.formas)} estilo={kanji}>
            {t.querer.kanji}
          </EscritaVertical>
        </TateColumn>
        <Ruby texto={t.querer.ruby} x={c.rubyX} topo={c.quererTopo} inicio={q(T.formas) + motion.escrita.vertical} tamanho={L.tipo.ruby} />
        <TateColumn cx={c.x} topo={c.comprarTopo} tamanho={c.tamanho}>
          <EscritaVertical inicio={inicioComprar} estilo={kanji}>
            {t.comprar.kanji}
          </EscritaVertical>
        </TateColumn>
        <Ruby texto={t.comprar.ruby} x={c.rubyX} topo={c.comprarTopo} inicio={inicioComprar + motion.escrita.vertical} tamanho={L.tipo.ruby} />
        <Contador
          valores={t.contagem}
          inicio={q(T.contador)}
          passo={motion.contador.passoTresDoisUm}
          estilo={{
            position: 'absolute',
            left: 0,
            width: c.contador.direita,
            top: c.contador.centro - L.tipo.contador / 2,
            textAlign: 'right',
            fontFamily: fontes.display,
            fontWeight: fontes.peso.corpo,
            fontSize: L.tipo.contador,
            lineHeight: 1,
            color: cores.ai,
          }}
        />
        <Escrita
          linhas={t.legenda}
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
