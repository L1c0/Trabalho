import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores, escala, fontes, sombra} from '../theme';

// Citacao · texto em Inter, tinta, sobre um retângulo osso colado (com sombra de papel).
export const Citacao: React.FC<{linhas: readonly string[]; x: number; y: number; largura: number; rotacao: number; entra: number}> = ({linhas, x, y, largura, rotacao, entra}) =>
  useCurrentFrame() >= entra ? (
    <div style={{position: 'absolute', left: x, top: y, width: largura, filter: `drop-shadow(${sombra.deslocamento}px ${sombra.deslocamento}px ${sombra.desfoque}px ${cores.tinta})`}}>
      <div
        style={{
          transform: `rotate(${rotacao}deg)`,
          backgroundColor: cores.osso,
          padding: '28px 34px',
          fontFamily: fontes.texto,
          fontWeight: 500,
          fontSize: escala.citacao,
          lineHeight: 1.35,
          color: cores.tinta,
        }}
      >
        {linhas.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  ) : null;
