import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A tinta pegando o papel: máscara horizontal esquerda → direita, borda suave de 6%.
export const mascaraEscrita = (p: number): React.CSSProperties => {
  if (p >= 1) return {};
  const s = tempo.escrita.suave;
  const pos = -s + p * (100 + s);
  const img = `linear-gradient(to right, #000 ${pos}%, transparent ${pos + s}%)`;
  return {maskImage: img, WebkitMaskImage: img};
};

export const duracaoEscrita = (texto: string) =>
  Math.max(tempo.escrita.minimo, Math.round([...texto].length * tempo.escrita.quadrosPorLetra));

export const useProgresso = (inicio: number, duracao: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [inicio, inicio + duracao], [0, 1], {...clamp, easing: curvas.linear});
};

export const Escrita: React.FC<{
  inicio: number;
  duracao: number;
  children: React.ReactNode;
  estilo?: React.CSSProperties;
}> = ({inicio, duracao, children, estilo}) => {
  const frame = useCurrentFrame();
  const p = useProgresso(inicio, duracao);
  return (
    <div
      style={{
        display: 'inline-block',
        // folga para acentos e descendentes ficarem dentro da caixa da máscara
        padding: `${tempo.escrita.folga}em 0`,
        margin: `-${tempo.escrita.folga}em 0`,
        visibility: frame >= inicio ? 'visible' : 'hidden',
        ...estilo,
        ...mascaraEscrita(p),
      }}
    >
      {children}
    </div>
  );
};
