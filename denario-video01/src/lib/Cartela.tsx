import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores, escala, fontes, tempo} from '../theme';

// Bullets em Montserrat 28, branco; um a cada 20 frames, por corte.
export const Cartela: React.FC<{de: number; linhas: readonly string[]; cor: string; x: number; y: number}> = ({de, linhas, cor, x, y}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: fontes.texto, fontWeight: fontes.peso.texto, fontSize: escala.cartela, lineHeight: escala.entrelinhaTexto, color: cores.branco}}>
      {linhas.map((l, i) =>
        frame >= de + i * tempo.cartela ? (
          <div key={i} style={{display: 'flex', gap: 22, marginBottom: 26, whiteSpace: 'nowrap'}}>
            <span style={{color: cor, fontWeight: fontes.peso.forte}}>{String(i + 1).padStart(2, '0')}</span>
            <span>{l}</span>
          </div>
        ) : null,
      )}
    </div>
  );
};
