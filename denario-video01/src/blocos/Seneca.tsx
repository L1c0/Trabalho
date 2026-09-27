import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {V} from '../data';
import {corDoBloco, escala, fontes, tempo} from '../theme';
import {Corte} from '../lettering/Corte';
import {Empilhar} from '../lettering/Empilhar';
import {Risco} from '../lettering/Risco';
import {Duotone} from '../lib/Duotone';
import {Centro, type Local, lettering} from './comum';

// Tamanho natural do busto (px), para enquadrar do queixo pra cima.
const BUSTO = {largura: 1006, altura: 1227};

// 1 · Sêneca. Grid verde, o busto à direita, a paráfrase empilhando.
export const Seneca: React.FC<{q: Local}> = ({q}) => {
  const {width} = useVideoConfig();
  const s = V.seneca;
  const cor = corDoBloco.verde;
  const b = s.busto;
  const largura = ((b.altura / b.queixo) * BUSTO.largura) / BUSTO.altura;
  return (
    <AbsoluteFill>
      <Corte de={q(b.de)} ate={q(b.ate)}>
        <Duotone modo="recorte" src={b.imagem} cor={cor} x={width - largura - b.direita} y={1080 - b.altura} largura={largura} altura={b.altura} />
      </Corte>
      <Corte de={q(s.citacao.de)} ate={q(s.citacao.ate)}>
        <div style={{position: 'absolute', left: escala.margem, top: 200, height: 560, width: 1000}}>
          <Empilhar
            de={q(s.citacao.de)}
            linhas={s.citacao.linhas}
            intervalo={tempo.empilhar}
            estilo={{fontFamily: fontes.texto, fontWeight: fontes.peso.forte, fontSize: escala.empilhar, lineHeight: escala.entrelinhaTexto, color: '#FFFFFF'}}
          />
        </div>
      </Corte>
      <Corte de={q(s.burro.de)} ate={q(s.burro.ate)}>
        <Centro>
          <div style={{position: 'relative', ...lettering(escala.lettering * 1.15)}}>
            {s.burro.texto}
            <Risco de={q(s.burro.risco)} cor={cor} tamanho={escala.lettering * 1.15} semente="burro" />
          </div>
        </Centro>
      </Corte>
    </AbsoluteFill>
  );
};
