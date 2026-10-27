import React from 'react';
import { Img, staticFile } from 'remotion';
import chapas from '../data/chapas.json';

/** O papel de cada Short, com 64 px de espelho em volta (preparar.py): a
 * batida desloca o quadro e a deriva anda, e a borda nunca aparece. */
export const Papel: React.FC<{ nome: string }> = ({ nome }) => {
  const p = chapas.pad;
  return (
    <Img
      src={staticFile(`comum/${nome}-ext.jpg`)}
      style={{ position: 'absolute', left: -p, top: -p, width: 1080 + 2 * p, height: 1920 + 2 * p }}
    />
  );
};

/** Uma chapa de quadro inteiro (1080x1920 com alfa). */
export const Chapa: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, ...style }} />
);
