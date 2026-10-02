import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fontes, tempo} from '../theme';
import {Escrita, duracaoEscrita} from '../motion/Escrita';

// Palavra enorme ao fundo, quase apagada, estourando pela borda direita e andando devagar.
export const PalavraGigante: React.FC<{
  texto: string;
  inicio: number;
  ate: number;
  tamanho: number;
  cor: string;
  opacidade: number;
  esquerda: number;
  topo: number;
}> = ({texto, inicio, ate, tamanho, cor, opacidade, esquerda, topo}) => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [inicio, ate], [0, -tempo.deriva.px], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda,
        top: topo,
        opacity: opacidade,
        transform: `translateX(${deriva}px)`,
        fontFamily: fontes.hero,
        fontSize: tamanho,
        lineHeight: 1,
        color: cor,
        whiteSpace: 'nowrap',
      }}
    >
      <Escrita inicio={inicio} duracao={duracaoEscrita(texto)}>
        {texto}
      </Escrita>
    </div>
  );
};
