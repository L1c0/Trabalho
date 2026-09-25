import React from 'react';
import {AbsoluteFill} from 'remotion';
import {textos} from '../data/textos';
import {cores, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Kakijun} from '../motion/Kakijun';
import {Escrita} from '../components/Escrita';
import {Pauta, type Linha} from '../components/Pauta';
import {Ruby} from '../components/Ruby';
import {TateColumn} from '../components/TateColumn';

// 0000–0200 · 間 (MA)
export const Ma: React.FC = () => {
  const L = useLayout();
  const c = L.ma;
  const q = (f: number) => local('ma', f);
  const t = textos.ma;
  const {verticais, topo, base, esq, dir} = c.pauta;
  const trelica: Linha[] = [
    {x1: dir, y1: topo, x2: esq, y2: topo},
    ...verticais.map((x) => ({x1: x, y1: topo, x2: x, y2: base})),
    {x1: dir, y1: base, x2: esq, y2: base},
  ];
  return (
    <AbsoluteFill>
      <Pauta linhas={trelica} inicio={q(tempo.ma.pauta)} espessura={L.px(motion.pauta.espessura)} />
      <TateColumn cx={c.kanji.cx} topo={c.kanji.topo} tamanho={c.kanji.tamanho}>
        <Kakijun kanji={t.kanji} tamanho={c.kanji.tamanho} inicio={q(tempo.ma.kakijun)} ritmo={motion.kakijun.ma} cor={cores.sumi} />
      </TateColumn>
      <Ruby texto={t.ruby} x={c.ruby.x} topo={c.ruby.topo} inicio={q(tempo.ma.ruby)} tamanho={L.tipo.ruby} />
      <Escrita
        linhas={t.legenda}
        inicio={q(tempo.ma.legenda)}
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
    </AbsoluteFill>
  );
};
