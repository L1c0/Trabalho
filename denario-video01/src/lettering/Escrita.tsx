import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';

// ESCRITA · máscara de gradiente horizontal, esquerda → direita, borda suave de 6%.
export const duracaoEscrita = (texto: string) => Math.max(tempo.minimo, Math.round([...texto].length * tempo.escrita.quadrosPorLetra));

export const mascaraEscrita = (p: number): React.CSSProperties => {
  if (p >= 1) return {};
  const s = tempo.escrita.suave;
  const pos = -s + p * (100 + s);
  const img = `linear-gradient(to right, #000 ${pos}%, transparent ${pos + s}%)`;
  return {maskImage: img, WebkitMaskImage: img};
};

export const Escrita: React.FC<{de: number; duracao: number; children: React.ReactNode; estilo?: React.CSSProperties}> = ({
  de,
  duracao,
  children,
  estilo,
}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const p = interpolate(frame, [de, de + Math.max(tempo.minimo, duracao)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.linear,
  });
  // folga vertical para acentos (Á, Ê) ficarem dentro da caixa da máscara
  return <div style={{display: 'inline-block', padding: '0.2em 0', margin: '-0.2em 0', ...estilo, ...mascaraEscrita(p)}}>{children}</div>;
};
