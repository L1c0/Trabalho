import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from '../data';
import {corDoBloco, escala} from '../theme';
import {Corte} from '../lettering/Corte';
import {Duotone} from '../lib/Duotone';
import {Centro, Legenda, type Local, lettering} from './comum';

// 4 · O que valeu. O teclado, e o par de cortes: DINHEIRO VOLTA / TERÇA-FEIRA NÃO.
export const Valeu: React.FC<{q: Local}> = ({q}) => {
  const v = V.valeu;
  const cor = corDoBloco.laranja;
  return (
    <AbsoluteFill>
      <Corte de={q(v.teclado.de)} ate={q(v.teclado.ate)}>
        <Duotone modo="recorte" src={v.teclado.imagem} cor={cor} x={v.teclado.x} y={v.teclado.y} largura={v.teclado.largura} />
      </Corte>
      <Corte de={q(v.legenda.de)} ate={q(v.legenda.ate)}>
        <Legenda texto={v.legenda.texto} y={760} />
      </Corte>
      {v.cortes.map((c) => (
        <Corte key={c.texto} de={q(c.de)} ate={q(c.ate)}>
          <Centro>
            <div style={lettering(escala.lettering)}>{c.texto}</div>
          </Centro>
        </Corte>
      ))}
      <Corte de={q(v.sofa.de)} ate={q(v.sofa.ate)}>
        <Duotone modo="telaCheia" src={v.sofa.foto} cor={cor} opacidade={v.sofa.opacidade} />
      </Corte>
    </AbsoluteFill>
  );
};
