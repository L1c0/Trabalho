import React from 'react';
import type {LinhasD} from '../data/tipos';
import {curvas, medidas, paleta} from '../theme';
import {useProjetor} from './formato';

// AS TRÊS LINHAS (defesa, meio, ataque): faixas tracejadas em dourado a 25%, atravessando
// o campo de lado a lado (perpendiculares ao ataque: em pé no 16:9, deitadas no 9:16).
// Cada uma é desenhada no seu frame; podem descer/subir juntas; a do meio pisca uma vez.
export const Linhas: React.FC<{d: LinhasD; f: number}> = ({d, f}) => {
  const {p} = useProjetor();
  const l = medidas.linhas;
  return (
    <g>
      {d.x.map((x0, i) => {
        const q = f - d.aparecem[i];
        if (q < 0) return null;
        let x = x0;
        if (d.mover && f > d.mover.frame) x = x0 + (d.mover.x[i] - x0) * curvas.suave(Math.min(1, (f - d.mover.frame) / medidas.formacao.duracao));
        const [a, b] = [p({x, y: 0}), p({x, y: 1})];
        const comp = Math.hypot(b.X - a.X, b.Y - a.Y);
        const prog = curvas.saida(Math.min(1, q / 18));
        let o = l.opacidade;
        if (i === 1 && d.pisca !== undefined && f >= d.pisca && f < d.pisca + l.pisca) o += 0.55 * Math.sin((Math.PI * (f - d.pisca)) / l.pisca);
        return (
          <line
            key={i}
            x1={a.X}
            y1={a.Y}
            x2={a.X + (b.X - a.X) * prog}
            y2={a.Y + (b.Y - a.Y) * prog}
            stroke={paleta.taca}
            strokeOpacity={o}
            strokeWidth={l.espessura}
            strokeDasharray={l.tracejado}
            data-comp={comp}
          />
        );
      })}
    </g>
  );
};
