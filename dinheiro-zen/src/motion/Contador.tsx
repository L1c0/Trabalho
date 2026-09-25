import React from 'react';
import {useCurrentFrame} from 'remotion';
import {motion} from '../theme';
import {mascaraDeEscrita, useEscrita} from '../components/Escrita';

// Números trocando no lugar: cada dígito numa célula de largura fixa, sem deslizar.
// A primeira aparição escreve de cima para baixo; depois as trocas são secas.
export const Contador: React.FC<{
  valores: readonly string[];
  inicio: number;
  passo: number;
  estilo: React.CSSProperties;
}> = ({valores, inicio, passo, estilo}) => {
  const frame = useCurrentFrame();
  const entrada = useEscrita(inicio, motion.contador.entrada);
  if (frame < inicio) return null;
  const indice = Math.min(valores.length - 1, Math.floor((frame - inicio) / passo));
  return (
    <div style={{...estilo, fontVariantNumeric: 'tabular-nums', ...mascaraDeEscrita('ttb', entrada)}}>
      {[...valores[indice]].map((digito, i) => (
        <span
          key={i}
          style={{display: 'inline-block', width: `${motion.contador.larguraDigito}em`, textAlign: 'center'}}
        >
          {digito}
        </span>
      ))}
    </div>
  );
};
