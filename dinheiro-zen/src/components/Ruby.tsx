import React from 'react';
import {cores, fontes, proporcoes} from '../theme';
import {EscritaVertical} from './Escrita';

// 振り仮名 em romaji, deitado na vertical ao lado do kanji (tategaki).
export const Ruby: React.FC<{texto: string; x: number; topo: number; inicio: number; tamanho: number}> = ({
  texto,
  x,
  topo,
  inicio,
  tamanho,
}) => (
  <EscritaVertical
    inicio={inicio}
    estilo={{
      position: 'absolute',
      left: x,
      top: topo,
      writingMode: 'vertical-rl',
      fontFamily: fontes.apoio,
      fontWeight: fontes.peso.legenda,
      fontSize: tamanho,
      letterSpacing: proporcoes.espacoRuby,
      lineHeight: 1,
      color: cores.sumi,
    }}
  >
    {texto}
  </EscritaVertical>
);
