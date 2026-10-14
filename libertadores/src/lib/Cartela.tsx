import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {curvas, fontes, medidas, paleta} from '../theme';
import {useFormato} from './formato';

// CARTELA DE SEÇÃO. Fundo cheio, barra dourada de 4 px entrando da esquerda em 14 quadros,
// título em display entrando por máscara horizontal, subtítulo opcional. Corte seco na saída.
export const Cartela: React.FC<{titulo: string; sub?: string}> = ({titulo, sub}) => {
  const f = useCurrentFrame();
  const fm = useFormato();
  const m = medidas.cartela;
  const tam = m.titulo * fm.k;
  const barra = curvas.saida(Math.min(1, f / m.barraEntrada));
  const titulo_ = curvas.saida(Math.min(1, Math.max(0, (f - 6) / m.mascara)));
  const subO = Math.min(1, Math.max(0, (f - 16) / 10));
  const topo = fm.altura * fm.tituloY;
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <div style={{position: 'absolute', left: fm.margem, top: topo - tam * 0.62 - 26, width: m.barraLarg * barra, height: m.barra, backgroundColor: paleta.taca}} />
      <div
        style={{
          position: 'absolute',
          left: fm.margem,
          right: fm.margem,
          top: topo - tam * 0.62,
          fontFamily: fontes.display,
          fontSize: tam,
          lineHeight: 1.08,
          color: paleta.texto,
          textTransform: 'uppercase',
          fontVariantNumeric: fontes.numeros,
          clipPath: `inset(-10% ${(1 - titulo_) * 100}% -10% 0)`,
        }}
      >
        {titulo}
      </div>
      {sub && (
        <div
          style={{
            position: 'absolute',
            left: fm.margem,
            right: fm.margem,
            top: topo + tam * 0.62 + 14,
            fontFamily: fontes.corpo,
            fontSize: m.sub * fm.k,
            color: paleta.secundario,
            opacity: subO,
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
