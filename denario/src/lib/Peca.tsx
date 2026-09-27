import React, {useId} from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {Imagem} from '../data/tipos';
import {cores, movimento, sombra} from '../theme';
import {FiltroDeArquivo} from './Tratamento';

// Base de Recorte, Cena e Documento: papel colado. Entra por corte seco, rotação leve,
// sombra de papel sobre papel, tratamento de arquivo e, no principal, o zoom lento.
export const Peca: React.FC<{
  imagem: Imagem;
  x: number;
  y: number;
  largura: number;
  rotacao: number;
  entra: number;
  zoom?: boolean;
  origemZoom?: string;
  quadro?: {x: number; y: number; w: number; h: number};
  forma?: 'retangulo' | 'circulo';
  recortada?: boolean; // PNG com alfa: sem moldura
}> = ({imagem, x, y, largura, rotacao, entra, zoom, origemZoom = 'center', quadro, forma = 'retangulo', recortada}) => {
  const frame = useCurrentFrame();
  const id = `arq${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (frame < entra) return null;
  const q = quadro ?? {x: 0, y: 0, w: imagem.w, h: imagem.h};
  const s = largura / q.w;
  const altura = q.h * s;
  const z = zoom
    ? interpolate(frame, [entra, entra + movimento.zoomDuracao], [movimento.zoomDe, movimento.zoomAte], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const semente = [...imagem.src].reduce((a, c) => a + c.charCodeAt(0), 0) % 97;
  const foto = (
    <Img
      src={staticFile(imagem.src)}
      style={{
        position: 'absolute',
        left: -q.x * s,
        top: -q.y * s,
        width: imagem.w * s,
        height: imagem.h * s,
        maxWidth: 'none',
        filter: `url(#${id})`,
      }}
    />
  );
  return (
    // a sombra fica fora da rotação: a luz vem sempre do mesmo lado
    <div style={{position: 'absolute', left: x, top: y, width: largura, height: altura, filter: `drop-shadow(${sombra.deslocamento}px ${sombra.deslocamento}px ${sombra.desfoque}px ${cores.tinta})`}}>
      <FiltroDeArquivo id={id} semente={semente} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `rotate(${rotacao}deg)${recortada ? ` scale(${z})` : ''}`,
          transformOrigin: recortada ? origemZoom : 'center',
          overflow: recortada ? 'visible' : 'hidden',
          borderRadius: forma === 'circulo' ? '50%' : 0,
        }}
      >
        {recortada ? foto : <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: origemZoom}}>{foto}</div>}
      </div>
    </div>
  );
};
