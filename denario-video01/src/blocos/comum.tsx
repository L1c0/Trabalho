import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cores, escala, fontes} from '../theme';

export type Local = (f: number) => number;

export const Centro: React.FC<{children: React.ReactNode; topo?: number}> = ({children, topo}) =>
  topo === undefined ? (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>{children}</AbsoluteFill>
  ) : (
    <div style={{position: 'absolute', left: 0, right: 0, top: topo, display: 'flex', justifyContent: 'center', textAlign: 'center'}}>{children}</div>
  );

export const lettering = (tamanho: number, cor: string = cores.branco): React.CSSProperties => ({
  fontFamily: fontes.lettering,
  fontSize: tamanho,
  lineHeight: escala.entrelinha,
  color: cor,
  whiteSpace: 'nowrap',
});

export const Legenda: React.FC<{texto: string; x?: number; y: number; centro?: boolean}> = ({texto, x = escala.margem, y, centro}) => {
  const estilo: React.CSSProperties = {
    fontFamily: fontes.texto,
    fontWeight: fontes.peso.texto,
    fontSize: escala.legenda,
    color: cores.branco,
    whiteSpace: 'nowrap',
  };
  return centro ? (
    <Centro topo={y}>
      <div style={estilo}>{texto}</div>
    </Centro>
  ) : (
    <div style={{...estilo, position: 'absolute', left: x, top: y}}>{texto}</div>
  );
};
