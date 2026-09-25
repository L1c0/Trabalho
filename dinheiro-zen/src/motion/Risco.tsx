import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, motion} from '../theme';
import {TracoDePincel} from './Pincel';
import {mascaraDeEscrita, useEscrita} from '../components/Escrita';

type Tempo = {de: number; ate: number};

// Palavra riscada por um traço de tinta (esquerda → direita, como o 横画)
// e a palavra nova escrevendo por cima do riscado.
export const Risco: React.FC<{
  riscada: string;
  nova: string;
  entrada: Tempo; // quando a palavra riscada é falada
  risco: number;
  novaTempo: Tempo; // quando a palavra nova é falada
  tamanho: number;
  corTexto: string;
  corRisco: string;
  direita: number;
  topo: number;
  estilo: React.CSSProperties;
}> = ({riscada, nova, entrada, risco, novaTempo, tamanho, corTexto, corRisco, direita, topo, estilo}) => {
  const frame = useCurrentFrame();
  const r = motion.risco;
  const texto = useEscrita(entrada.de, entrada.ate - entrada.de);
  const traco = interpolate(frame, [risco, risco + r.traco], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.pincel,
  });
  const novaP = useEscrita(novaTempo.de, novaTempo.ate - novaTempo.de);
  if (frame < entrada.de) return null;

  const w = [...riscada].length * r.larguraLetra * tamanho;
  const h = tamanho;
  const d = `M${-0.04 * w},${h * (0.6 + r.subida)} L${1.04 * w},${h * (0.6 - r.subida)}`;

  return (
    <div style={{position: 'absolute', left: 0, width: direita, top: topo, textAlign: 'right', color: corTexto, ...estilo}}>
      <span style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap'}}>
        <span style={{display: 'inline-block', ...mascaraDeEscrita('rtl', texto)}}>{riscada}</span>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '1em', overflow: 'visible'}}
        >
          <TracoDePincel
            d={d}
            progresso={traco}
            perfil={{...motion.pincel, inicio: r.inicio * h, fim: r.fim * h, amostra: motion.pincel.amostra * 2}}
            cor={corRisco}
          />
        </svg>
        {frame >= novaTempo.de ? (
          <span
            style={{
              position: 'absolute',
              right: 0,
              bottom: `${r.alturaNova}em`,
              whiteSpace: 'nowrap',
              ...mascaraDeEscrita('rtl', novaP),
            }}
          >
            {nova}
          </span>
        ) : null}
      </span>
    </div>
  );
};
