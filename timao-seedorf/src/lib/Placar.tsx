import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {edit} from '../data/edit';
import {card, cores, fontes} from '../theme';
import {existe} from './existe';

// O CARD DE PLACAR. Largura pelo conteúdo, entra por opacidade em 8 frames e sai em 6.
// Sem deslizar. x e y em fração do quadro (canto superior esquerdo).
const Escudo: React.FC<{time: string}> = ({time}) => {
  const arquivo = edit.escudos[time];
  const s = card.escudo;
  if (arquivo && existe(arquivo)) return <Img src={staticFile(arquivo)} style={{width: s, height: s, objectFit: 'contain'}} />;
  // sem o PNG: só o lugar dele, um círculo vazio
  return <div style={{width: s, height: s, borderRadius: '50%', border: `1.5px solid ${cores.cardNomes}`, opacity: 0.5, boxSizing: 'border-box'}} />;
};

export const Placar: React.FC<{
  casa: string;
  golsCasa: number;
  fora: string;
  golsFora: number;
  rotulo: string;
  x: number;
  y: number;
  frame: number;
  dur: number;
}> = ({casa, golsCasa, fora, golsFora, rotulo, x, y, frame: de, dur}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (frame < de || frame >= de + dur) return null;
  const opacidade = Math.min(
    interpolate(frame, [de, de + card.entrada], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [de + dur - card.saida, de + dur], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const gols: React.CSSProperties = {fontFamily: fontes.texto, fontWeight: 700, fontSize: card.gols, lineHeight: 1, color: cores.luz, fontVariantNumeric: 'tabular-nums'};
  return (
    <div
      style={{
        position: 'absolute',
        left: x * width,
        top: y * height,
        height: card.altura,
        padding: '0 22px',
        boxSizing: 'border-box',
        borderRadius: card.raio,
        backgroundColor: cores.cardFundo,
        backdropFilter: `blur(${card.blur}px)`,
        WebkitBackdropFilter: `blur(${card.blur}px)`,
        opacity: opacidade,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <Escudo time={casa} />
        <span style={gols}>{golsCasa}</span>
        <span style={{fontFamily: fontes.texto, fontWeight: 600, fontSize: card.rotulo, letterSpacing: '0.08em', textTransform: 'uppercase', color: cores.cardNomes, minWidth: 64, textAlign: 'center'}}>{rotulo}</span>
        <span style={gols}>{golsFora}</span>
        <Escudo time={fora} />
      </div>
      <div style={{fontFamily: fontes.texto, fontWeight: 400, fontSize: card.nomes, lineHeight: 1, color: cores.cardNomes, whiteSpace: 'nowrap'}}>
        {casa} · {fora}
      </div>
    </div>
  );
};
