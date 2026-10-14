import React from 'react';
import {fitText} from '@remotion/layout-utils';
import {curvas, fontes, medidas, paleta} from '../theme';
import {useFormato} from './formato';

// TEXTO EM DISPLAY sobre o campo ("180 MINUTOS", "CONTROLAR SEM A BOLA"...). Centrado no
// campo, numa faixa escura para ler sobre as linhas. Entra por máscara horizontal, linha a
// linha. O corpo é o maior que cabe na largura do campo, até o teto do theme.
export const TextoDisplay: React.FC<{linhas: string[]; quadro: number; atrasos?: number[]}> = ({linhas, quadro, atrasos}) => {
  const fm = useFormato();
  const c = fm.campo;
  const larguraUtil = c.w - 120;
  const teto = medidas.texto.display * fm.k;
  const tamanho = Math.min(teto, ...linhas.map((l) => fitText({text: l, withinWidth: larguraUtil, fontFamily: 'Anton'}).fontSize));
  const alturaLinha = tamanho * 1.08;
  const bloco = alturaLinha * linhas.length;
  const fundo = curvas.saida(Math.min(1, quadro / 10));
  return (
    <div style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', padding: `${tamanho * 0.28}px ${tamanho * 0.45}px`}}>
        <div style={{position: 'absolute', inset: 0, backgroundColor: paleta.fundo, opacity: 0.78 * fundo}} />
        <div style={{position: 'relative', height: bloco}}>
          {linhas.map((l, i) => {
            const p = curvas.saida(Math.min(1, Math.max(0, (quadro - (atrasos?.[i] ?? i * 6)) / medidas.cartela.mascara)));
            return (
              <div
                key={i}
                style={{
                  fontFamily: fontes.display,
                  fontSize: tamanho,
                  lineHeight: `${alturaLinha}px`,
                  color: paleta.texto,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  fontVariantNumeric: fontes.numeros,
                  clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
