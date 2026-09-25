import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cues, inicioDoBloco} from '../data/roteiro';
import {cores, motion, useLayout} from '../theme';
import {Nijimi} from '../motion/Nijimi';
import {PaginaIntervalo} from './paginas';

// Bloco: nijimi (⚠ só legenda)
export const Controle: React.FC = () => {
  const L = useLayout();
  const q = (f: number) => f - inicioDoBloco('controle');
  const n = L.intervalo.nijimi;
  return (
    <AbsoluteFill>
      <PaginaIntervalo local={q} linhaAte={q(cues.nijimi) + motion.nijimi.crescer / 2} />
      <Nijimi cx={n.cx} cy={n.cy} raio={n.raio} inicio={q(cues.nijimi)} cor={cores.ai} secarEm={q(cues.nijimiSeca)} />
    </AbsoluteFill>
  );
};
