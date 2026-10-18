import React from 'react';
import {Img, staticFile} from 'remotion';
import {recortes} from '../data/recortes';
import type {Peca} from '../data/assets';
import {altura, cor, grade, largura} from '../theme';
import {useDeriva} from './deriva';
import type {Ancora} from './layout';
import {MOLDURA, RESPIRO, dimensao, medidasPainel, posicionar} from './layout';

/**
 * PAINEL — os quadros de mangá. Moldura de 2 px em cor.tinta e 20 px de respiro branco
 * interno. 70% da altura da tela (55%–78%), nas âncoras esquerda-alta, direita-baixa,
 * centro-alto. Os muito estreitos (phosVertical) usam a altura total menos as margens.
 *
 * Âncora CHEIO (tiras largas, o andYet de página inteira e o minuscula em 16:9): sem moldura,
 * com a margem branca do escaneamento recortada. A tira ocupa a largura toda; o quadro de
 * página ocupa a altura toda, na espinha; o quadro 16:9 preenche a tela inteira.
 */
export const Painel: React.FC<{peca: Peca; ancora: Ancora}> = ({peca, ancora}) => {
  const escala = useDeriva();
  if (ancora === 'CHEIO') return <Cheio peca={peca} escala={escala} />;
  const m = medidasPainel(peca.arq);
  const r = posicionar(ancora, m.W, m.H);
  const y = m.estreito ? grade.topo : r.y;
  return (
    <div
      style={{
        position: 'absolute',
        left: r.x,
        top: y,
        width: m.W,
        height: m.H,
        boxSizing: 'border-box',
        border: `${MOLDURA}px solid ${cor.tinta}`,
        padding: RESPIRO,
        backgroundColor: '#FFFFFF',
        transform: `scale(${escala})`,
        transformOrigin: 'center',
      }}
    >
      <Img src={staticFile(peca.arq)} style={{width: '100%', height: '100%', display: 'block'}} />
    </div>
  );
};

const Cheio: React.FC<{peca: Peca; escala: number}> = ({peca, escala}) => {
  const rc = recortes[peca.id];
  const {w: W, h: H} = dimensao(peca.arq);
  const c = rc ?? {x: 0, y: 0, w: W, h: H};
  const r = c.w / c.h;
  // tira (bem mais larga que a tela): largura da tela; página (retrato): altura da tela,
  // encostada na espinha; quadro de tela (16:9, o último plano): cobre a tela inteira
  const forma = r > 2.5 ? 'tira' : r < 1.2 ? 'pagina' : 'tela';
  const k = forma === 'tira' ? largura / c.w : forma === 'pagina' ? altura / c.h : Math.max(largura / c.w, altura / c.h);
  const [vw, vh] = [c.w * k, c.h * k];
  const x = forma === 'pagina' ? grade.esq : (largura - vw) / 2;
  const y = (altura - vh) / 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: vw, height: vh, overflow: 'hidden', transform: `scale(${escala})`, transformOrigin: 'center'}}>
      <Img src={staticFile(peca.arq)} style={{position: 'absolute', left: -c.x * k, top: -c.y * k, width: W * k, height: H * k}} />
    </div>
  );
};
