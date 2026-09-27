import React from 'react';
import {useCurrentFrame} from 'remotion';
import {fontes, tempo} from '../theme';

// RESTO · a palavra se divide: a parte que é do assunto numa cor, o resto em cinza.
// Entra inteira e, depois de `tempo.resto`, se divide por corte nas frações dadas (0–1).
export const Resto: React.FC<{
  texto: string;
  de: number;
  tamanho: number;
  corInteira: string;
  cor: string;
  corResto: string;
  parte: readonly [number, number];
}> = ({texto, de, tamanho, corInteira, cor, corResto, parte}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const dividida = frame >= de + tempo.resto;
  const [a, b] = parte.map((v) => `${(v * 100).toFixed(2)}%`);
  const fundo = dividida
    ? `linear-gradient(to right, ${corResto} ${a}, ${cor} ${a}, ${cor} ${b}, ${corResto} ${b})`
    : `linear-gradient(${corInteira}, ${corInteira})`;
  return (
    <div
      style={{
        fontFamily: fontes.lettering,
        fontSize: tamanho,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        backgroundImage: fundo,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {texto}
    </div>
  );
};
