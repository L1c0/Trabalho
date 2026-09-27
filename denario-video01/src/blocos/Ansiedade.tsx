import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from '../data';
import {cores, corDoBloco, escala} from '../theme';
import {Corte} from '../lettering/Corte';
import {Escrita, duracaoEscrita} from '../lettering/Escrita';
import {Resto} from '../lettering/Resto';
import {BarraDoDia} from '../lib/BarraDoDia';
import {Duotone} from '../lib/Duotone';
import {Centro, type Local, lettering} from './comum';

// 2 · Ansiedade. ESCRITA, a Barra do Dia (a imagem-chave) e o DIA dividido.
export const Ansiedade: React.FC<{q: Local}> = ({q}) => {
  const a = V.ansiedade;
  const cor = corDoBloco.verde;
  const [l1, l2] = a.titulo.linhas;
  const d1 = duracaoEscrita(l1);
  // a fração do dia que é do trabalho, tirada da própria barra
  const total = a.barra.segmentos.reduce((s, x) => s + x.horas, 0);
  const k = a.barra.segmentos.findIndex((x) => x.destaque);
  const antes = a.barra.segmentos.slice(0, k).reduce((s, x) => s + x.horas, 0);
  const parte = [antes / total, (antes + a.barra.segmentos[k].horas) / total] as const;
  return (
    <AbsoluteFill>
      <Corte de={q(a.titulo.de)} ate={q(a.titulo.ate)}>
        <Centro>
          <div style={lettering(escala.lettering * 0.87)}>
            <div>
              <Escrita de={q(a.titulo.de)} duracao={d1} estilo={{}}>
                {l1}
              </Escrita>
            </div>
            <div>
              <Escrita de={q(a.titulo.de) + d1} duracao={duracaoEscrita(l2)} estilo={{}}>
                {l2}
              </Escrita>
            </div>
          </div>
        </Centro>
      </Corte>
      <Corte de={q(a.barra.de)} ate={q(a.barra.ate)}>
        <Duotone modo="telaCheia" src={a.barra.foto} cor={cor} opacidade={a.barra.opacidade} />
        <BarraDoDia de={q(a.barra.de)} segmentos={a.barra.segmentos} cor={cor} x={escala.margem} y={330} largura={1920 - 2 * escala.margem} altura={76} />
      </Corte>
      <Corte de={q(a.dia.de)} ate={q(a.dia.ate)}>
        <Duotone modo="telaCheia" src={a.dia.foto} cor={cor} opacidade={a.dia.opacidade} />
        <Centro>
          <Resto texto={a.dia.texto} de={q(a.dia.de)} tamanho={440} corInteira={cores.branco} cor={cor} corResto={cores.apagado} parte={parte} />
        </Centro>
      </Corte>
    </AbsoluteFill>
  );
};
