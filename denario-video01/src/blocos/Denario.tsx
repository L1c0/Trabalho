import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {V} from '../data';
import {corDoBloco, escala} from '../theme';
import {Escrita, duracaoEscrita} from '../lettering/Escrita';
import {Duotone} from '../lib/Duotone';
import {Centro, Legenda, type Local, lettering} from './comum';

// 6 · Denário. A moeda em close, no centro. Cabia na mão.
export const Denario: React.FC<{q: Local}> = ({q}) => {
  const frame = useCurrentFrame();
  const d = V.denario;
  const cor = corDoBloco.roxo;
  return (
    <AbsoluteFill>
      <Duotone modo="recorte" src={d.moeda.imagem} cor={cor} x={(1920 - d.moeda.tamanho) / 2} y={d.moeda.y} largura={d.moeda.tamanho} />
      <Centro topo={690}>
        <Escrita de={q(d.titulo.de)} duracao={duracaoEscrita(d.titulo.texto)} estilo={lettering(escala.lettering * 0.8)}>
          {d.titulo.texto}
        </Escrita>
      </Centro>
      {frame >= q(d.legenda.de) ? <Legenda texto={d.legenda.texto} y={880} centro /> : null}
    </AbsoluteFill>
  );
};
