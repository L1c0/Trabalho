import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {textos} from '../data/textos';
import {cores, escala, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Enso} from '../motion/Enso';
import {Losango} from '../motion/Hanko';
import {duracaoDaLinha, mascaraDeEscrita, useEscrita} from '../components/Escrita';
import {Pauta, type Linha} from '../components/Pauta';

const Pergunta: React.FC<{texto: string; inicio: number; direita: number; topo: number}> = ({texto, inicio, direita, topo}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const p = useEscrita(inicio, duracaoDaLinha(texto));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: direita,
        top: topo,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: L.px(motion.losango.afastamento),
        fontFamily: fontes.display,
        fontWeight: fontes.peso.corpo,
        fontSize: L.tipo.pergunta,
        lineHeight: proporcoes.entrelinha,
        color: cores.sumi,
      }}
    >
      <Losango lado={L.px(escala.losango)} inicio={inicio - motion.losango.antecedencia} />
      <span style={{whiteSpace: 'nowrap', visibility: frame >= inicio ? 'visible' : 'hidden', ...mascaraDeEscrita('rtl', p)}}>
        {texto}
      </span>
    </div>
  );
};

// 0600–0800 · AS QUATRO PERGUNTAS
export const QuatroPerguntas: React.FC = () => {
  const L = useLayout();
  const c = L.quatroPerguntas;
  const q = (f: number) => local('quatroPerguntas', f);
  const T = tempo.quatroPerguntas;
  const caderno: Linha[] = c.linhas.map((y) => ({x1: c.dir, y1: y, x2: c.esq, y2: y}));
  return (
    <AbsoluteFill>
      <Pauta linhas={caderno} inicio={q(T.pauta)} espessura={L.px(motion.pauta.espessura)} />
      {textos.quatroPerguntas.perguntas.map((texto, i) => (
        <Pergunta key={texto} texto={texto} inicio={q(T.perguntas[i])} direita={c.direita} topo={c.perguntas[i].topo} />
      ))}
      <Enso cx={c.enso.cx} cy={c.enso.cy} raio={c.enso.raio} inicio={q(T.enso)} cor={cores.sumi} escala={L.k} />
    </AbsoluteFill>
  );
};
