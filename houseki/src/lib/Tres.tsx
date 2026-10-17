import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {pega} from '../data/assets';
import {tres as tempos} from '../data/componentes';
import {tres as textos} from '../data/textos';
import {cor, font, largura, tipo} from '../theme';
import {MOLDURA, RESPIRO, dimensao} from './layout';

/**
 * TRÊS — o tríptico das três espécies. Três quadros lado a lado, 28% da largura cada, 4% de
 * intervalo, entrando um por vez quando a narração nomeia cada um. Rótulo em caixa alta,
 * corpo 30, entreletra 0,22em, abaixo da imagem. Os quadros assentam na mesma linha de base.
 * O do meio (elenco) é a única imagem colorida do filme.
 */
const LARG = 0.28 * largura;
const INTERVALO = 0.04 * largura;
const X0 = (largura - 3 * LARG - 2 * INTERVALO) / 2;
const BASE = 905;

export const Tres: React.FC<{inicio: number}> = ({inicio}) => {
  const f = useCurrentFrame() + inicio;
  const rotulos = f >= tempos.trocaRotulos ? textos.depois : textos.primeiros;
  return (
    <AbsoluteFill>
      {tempos.pecas.map((id, i) => {
        if (f < tempos.entradas[i]) return null;
        const p = pega(id);
        const {w, h} = dimensao(p.arq);
        const borda = 2 * (MOLDURA + RESPIRO);
        const H = ((LARG - borda) * h) / w + borda;
        const x = X0 + i * (LARG + INTERVALO);
        return (
          <React.Fragment key={id}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: BASE - H,
                width: LARG,
                height: H,
                boxSizing: 'border-box',
                border: `${MOLDURA}px solid ${cor.tinta}`,
                padding: RESPIRO,
                backgroundColor: '#FFFFFF',
              }}
            >
              <Img src={staticFile(p.arq)} style={{width: '100%', height: '100%', display: 'block'}} />
            </div>
            <div style={{position: 'absolute', left: x, top: BASE + 26, fontFamily: font, fontSize: tipo.rotulo, letterSpacing: '0.22em', color: cor.tinta}}>{rotulos[i]}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
