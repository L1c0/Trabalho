import React from 'react';
import { Cor, matriz } from './cor';

export const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const saida = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Entrada das peças (regra do pacote): 8 quadros, sobe 24 px, opacidade.
 * Sem mola e sem passar do ponto.
 */
export const ENTRADA = 8;
export const SUBIDA = 24;
export const entrada = (f: number, entra: number) => {
  const e = saida(c01((f - entra) / ENTRADA));
  return { op: e, dy: SUBIDA * (1 - e) };
};

/** O filtro da partitura de cor, para um `filter: url(#id)`. */
export const FiltroCor: React.FC<{ id: string; cor: Cor }> = ({ id, cor }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
    <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
      <feColorMatrix type="matrix" values={matriz(cor)} />
    </filter>
  </svg>
);
