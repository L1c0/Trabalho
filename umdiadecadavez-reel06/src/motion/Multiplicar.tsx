import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';
import {AnelDesenho} from './Anel';
import {estadoNo, type EstadoDoAnel, type Quadro} from './trajeto';
import {Vao} from './Vao';

// MULTIPLICAR. O anel se divide em N cópias menores que se afastam do centro para
// posições dadas e, na volta, convergem e se fundem de novo. Todas giram juntas
// (um só trajeto de giro). Cada cópia carrega o seu próprio vão, menor.
export const Multiplicar: React.FC<{
  origem: {x: number; y: number; raio: number; traco: number};
  destinos: readonly {x: number; y: number}[];
  raio: number;
  traco: number;
  divide: number; // frame em que se divide
  espalha: number; // frames até chegar nos destinos
  volta: number; // frame em que começa a convergir
  converge: number; // frames até se fundir
  giro: readonly Quadro[]; // giro compartilhado
  cor: string;
  vaos: readonly {abre: number; fecha?: number; conteudo: (e: EstadoDoAnel) => React.ReactNode}[];
  deslocamentoVao?: number;
}> = ({origem, destinos, raio, traco, divide, espalha, volta, converge, giro, cor, vaos, deslocamentoVao = 0}) => {
  const frame = useCurrentFrame();
  if (frame < divide || frame >= volta + converge) return null;
  const opts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curvas.corpo} as const;
  const copia = (i: number, f: number): EstadoDoAnel => {
    const ida = interpolate(f, [divide, divide + espalha], [0, 1], opts);
    const vinda = interpolate(f, [volta, volta + converge], [0, 1], opts);
    const lerp = (a: number, b: number) => a + (b - a) * ida + (a - b) * vinda * ida;
    const d = destinos[i];
    return {x: lerp(origem.x, d.x), y: lerp(origem.y, d.y), raio: lerp(origem.raio, raio), traco: lerp(origem.traco, traco), giro: estadoNo(giro, f).giro};
  };
  // o rastro do giro, como no anel inteiro
  const girando = Math.abs(estadoNo(giro, frame - 1).giro - estadoNo(giro, frame).giro) > 1e-6;
  return (
    <>
      {destinos.map((_, i) => {
        const e = copia(i, frame);
        const v = vaos[i];
        return (
          <React.Fragment key={i}>
            {v ? (
              <Vao e={e} abre={v.abre} fecha={v.fecha} deslocamento={deslocamentoVao}>
                {v.conteudo(e)}
              </Vao>
            ) : null}
            {girando
              ? tempo.anel.rastro.map((r) => <AnelDesenho key={r.atras} e={copia(i, Math.max(divide, frame - r.atras))} cor={cor} opacidade={r.opacidade} />)
              : null}
            <AnelDesenho e={e} cor={cor} />
          </React.Fragment>
        );
      })}
    </>
  );
};
