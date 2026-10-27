import React from 'react';
import { Img, staticFile } from 'remotion';
import chapas from '../data/chapas.json';

/** O papel de cada Short, com espelho em volta (preparar.py): a batida
 * desloca o quadro, a deriva anda e a mesa inclina, e a borda nunca aparece. */
export const Papel: React.FC<{ src: string }> = ({ src }) => {
  const p = chapas.pad;
  return (
    <Img
      src={staticFile(src.replace('.jpg', '-ext.jpg'))}
      style={{ position: 'absolute', left: -p, top: -p, width: 1080 + 2 * p, height: 1920 + 2 * p }}
    />
  );
};

/** Uma camada de âncora quadro: 1080x1920 com alfa, em x=0, y=0. */
export const Chapa: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, ...style }} />
);

/** Uma camada de âncora centro: a imagem no tamanho dela, com o centro em (x, y). */
export const Centro: React.FC<{ src: string; x: number; y: number; escala?: number; tinta?: number }> = ({
  src,
  x,
  y,
  escala = 1,
  tinta = 1,
}) => (
  <Img
    src={staticFile(src)}
    style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${escala})`, opacity: tinta }}
  />
);
