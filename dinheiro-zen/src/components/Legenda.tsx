import React from 'react';
import {useCurrentFrame} from 'remotion';
import {legenda} from '../data/roteiro';
import {cores, corpoFixo, fontes, motion, proporcoes, useLayout} from '../theme';

// Cada grupo sai quando o próximo entra ou pouco depois da última palavra.
const saidas = legenda.map((grupo, i) => {
  const fim = grupo[grupo.length - 1].ate + motion.legenda.permanencia;
  const proximo = legenda[i + 1]?.[0].de ?? Infinity;
  return Math.min(fim, proximo);
});

// Legenda: sem animação. Cada palavra aparece seca no frame em que é falada;
// as ainda não faladas ocupam o lugar invisíveis, para a linha não se mexer.
export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const i = legenda.findIndex((grupo, k) => frame >= grupo[0].de && frame < saidas[k]);
  if (i < 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: L.legenda.direita,
        top: L.legenda.topo,
        textAlign: 'right',
        fontFamily: fontes.apoio,
        fontWeight: fontes.peso.legenda,
        fontSize: corpoFixo.legenda,
        lineHeight: proporcoes.entrelinhaLegenda,
        color: cores.rikyu,
      }}
    >
      {legenda[i].map((palavra, j) => (
        <React.Fragment key={j}>
          {j > 0 ? ' ' : null}
          <span style={{visibility: frame >= palavra.de ? 'visible' : 'hidden'}}>{palavra.texto}</span>
        </React.Fragment>
      ))}
    </div>
  );
};
