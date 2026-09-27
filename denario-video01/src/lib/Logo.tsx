import React from 'react';
import {cores, fontes} from '../theme';

// Círculo preto com borda na cor do bloco, "DENÁRIO" em duas linhas, 70% de opacidade.
export const Logo: React.FC<{cor: string; x: number; y: number; tamanho?: number}> = ({cor, x, y, tamanho = 104}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: tamanho,
      height: tamanho,
      borderRadius: '50%',
      backgroundColor: cores.preto,
      border: `${Math.max(2, tamanho * 0.03)}px solid ${cor}`,
      boxSizing: 'border-box',
      opacity: 0.7,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fontes.lettering,
      fontSize: tamanho * 0.2,
      lineHeight: 1,
      letterSpacing: '0.04em',
      color: cores.branco,
    }}
  >
    <span>DENÁ</span>
    <span>RIO</span>
  </div>
);
