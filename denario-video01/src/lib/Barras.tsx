import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {cores, escala, fontes, tempo} from '../theme';

// Gráfico de barras vertical. Cada barra sobe da base; uma a cada 6 frames.
export const Barras: React.FC<{
  de: number;
  valores: readonly {rotulo: string; valor: number; destaque?: boolean}[];
  cor: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
}> = ({de, valores, cor, x, y, largura, altura}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...valores.map((v) => v.valor));
  const passo = largura / valores.length;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: largura, height: altura}}>
      {valores.map((v, i) => {
        const inicio = de + i * tempo.barras.intervalo;
        if (frame < inicio) return null;
        const p = interpolate(frame, [inicio, inicio + tempo.barras.subida], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const h = (v.valor / max) * altura;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: i * passo + passo * 0.15,
                width: passo * 0.7,
                bottom: 0,
                height: h,
                backgroundColor: v.destaque ? cor : cores.apagado,
                clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: i * passo,
                width: passo,
                top: altura + 14,
                textAlign: 'center',
                fontFamily: fontes.texto,
                fontSize: escala.rotulo,
                color: cores.marca,
              }}
            >
              {v.rotulo}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
