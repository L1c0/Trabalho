import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from '../data';
import {corDoBloco, escala} from '../theme';
import {Corte} from '../lettering/Corte';
import {Escrita, duracaoEscrita} from '../lettering/Escrita';
import {Peso} from '../lettering/Peso';
import {Duotone} from '../lib/Duotone';
import {Centro, Legenda, type Local, lettering} from './comum';

// 0 · Abertura. Branco sobre preto, sem grid, sem cor.
export const Abertura: React.FC<{q: Local}> = ({q}) => {
  const a = V.abertura;
  const branco = corDoBloco.branco;
  return (
    <AbsoluteFill>
      <Corte de={q(a.titulo.de)} ate={q(a.titulo.ate)}>
        <Centro>
          <Escrita de={q(a.titulo.de)} duracao={duracaoEscrita(a.titulo.texto)} estilo={lettering(escala.lettering)}>
            {a.titulo.texto}
          </Escrita>
        </Centro>
      </Corte>
      <Corte de={q(a.mouse.de)} ate={q(a.mouse.ate)}>
        <Duotone modo="recorte" src={a.mouse.imagem} cor={branco} x={a.mouse.x} y={a.mouse.y} largura={a.mouse.largura} />
        <Legenda texto={a.legenda.texto} y={700} />
      </Corte>
      <Corte de={q(a.compra.de)} ate={q(a.compra.ate)}>
        <Centro>
          <div style={lettering(escala.lettering * 0.87)}>{a.compra.texto}</div>
        </Centro>
      </Corte>
      <Corte de={q(a.horas.de)} ate={q(a.horas.ate)}>
        <Centro>
          <Peso texto={a.horas.texto} de={q(a.horas.de)} duracao={a.horas.duracao} corpoInicial={a.horas.corpoInicial} corpoFinal={a.horas.corpoFinal} cor={branco} />
        </Centro>
      </Corte>
    </AbsoluteFill>
  );
};
