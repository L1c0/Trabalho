import React from 'react';
import { COR, FONTE } from './base';

/** Estilos de letra prontos: A = Anton (impacto), O = Oswald (caixa alta espaçada), M = mono, S = serifa itálica. */
export const A = (tam: number, cor: string = COR.creme, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.anton,
  fontSize: tam,
  color: cor,
  lineHeight: 1.04,
  letterSpacing: '0.012em',
  ...extra,
});
export const O = (tam: number, cor: string = COR.papel, esp = 0.2, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.oswald,
  fontWeight: 600,
  fontSize: tam,
  color: cor,
  letterSpacing: `${esp}em`,
  lineHeight: 1.15,
  ...extra,
});
export const M = (tam: number, cor: string = COR.cinza, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.mono,
  fontSize: tam,
  color: cor,
  letterSpacing: '0.05em',
  lineHeight: 1.3,
  ...extra,
});
export const S = (tam: number, cor: string = COR.papel, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.serif,
  fontStyle: 'italic',
  fontSize: tam,
  color: cor,
  lineHeight: 1.28,
  ...extra,
});

/** Caixa posicionada na tela. */
export const em = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', left: x, top: y, ...extra });
