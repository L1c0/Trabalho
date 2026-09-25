import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, motion} from '../theme';
import {TracoDePincel} from './Pincel';
import {duracaoDaLinha, mascaraDeEscrita, useEscrita} from '../components/Escrita';

// Palavra riscada por um traço de tinta (esquerda → direita, como o 横画),
// e a palavra nova escrevendo por cima.
export const Risco: React.FC<{
  antes: string;
  riscada: string;
  nova: string;
  inicioTexto: number;
  inicio: number;
  tamanho: number;
  corTexto: string;
  corRisco: string;
  direita: number;
  topo: number;
  estilo: React.CSSProperties;
}> = ({antes, riscada, nova, inicioTexto, inicio, tamanho, corTexto, corRisco, direita, topo, estilo}) => {
  const frame = useCurrentFrame();
  const r = motion.risco;
  const linha = `${antes} ${riscada}`;
  const texto = useEscrita(inicioTexto, duracaoDaLinha(linha));
  const risco = interpolate(frame, [inicio, inicio + r.traco], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curvas.pincel,
  });
  const inicioNova = inicio + r.traco + r.pausaAntesDaNova;
  const novaP = useEscrita(inicioNova, duracaoDaLinha(nova));
  if (frame < inicioTexto) return null;

  const w = [...riscada].length * r.larguraLetra * tamanho;
  const h = tamanho;
  const d = `M${-0.03 * w},${h * (0.6 + r.subida)} L${1.03 * w},${h * (0.6 - r.subida)}`;

  return (
    <div
      style={{position: 'absolute', left: 0, width: direita, top: topo, textAlign: 'right', color: corTexto, ...estilo}}
    >
      <span style={{display: 'inline-block', whiteSpace: 'nowrap', ...mascaraDeEscrita('rtl', texto)}}>
        {antes}{' '}
        <span style={{position: 'relative', display: 'inline-block'}}>
          {riscada}
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '1em', overflow: 'visible'}}
          >
            <TracoDePincel
              d={d}
              progresso={risco}
              perfil={{...motion.pincel, inicio: r.inicio * h, fim: r.fim * h, amostra: motion.pincel.amostra * 2}}
              cor={corRisco}
            />
          </svg>
          {frame >= inicioNova ? (
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${r.alturaNova}em`,
                textAlign: 'center',
                ...mascaraDeEscrita('rtl', novaP),
              }}
            >
              {nova}
            </span>
          ) : null}
        </span>
      </span>
    </div>
  );
};
