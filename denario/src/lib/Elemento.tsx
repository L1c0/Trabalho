import React from 'react';
import {getStaticFiles} from 'remotion';
import type {Elemento as E, Imagem} from '../data/tipos';
import {Cena} from './Cena';
import {Citacao} from './Citacao';
import {Credito} from './Credito';
import {Documento} from './Documento';
import {Numero} from './Numero';
import {Recorte} from './Recorte';
import {Titulo} from './Titulo';

const avisados = new Set<string>();
export const existe = (src: string) => {
  const ok = getStaticFiles().some((f) => f.name === src);
  if (!ok && !avisados.has(src)) {
    avisados.add(src);
    console.warn(`[colagem] arquivo ausente em public/: ${src}`);
  }
  return ok;
};

// Um elemento da composição, a partir dos dados. Imagem ausente: não desenha e avisa.
export const Elemento: React.FC<{e: E; imagens: Record<string, Imagem>}> = ({e, imagens}) => {
  const entra = e.entra ?? 0;
  switch (e.tipo) {
    case 'recorte':
    case 'cena':
    case 'documento': {
      const imagem = imagens[e.img];
      if (!imagem || !existe(imagem.src)) return null;
      const comum = {imagem, x: e.x, y: e.y, largura: e.largura, rotacao: e.rotacao, entra, zoom: e.zoom, origemZoom: e.origemZoom};
      if (e.tipo === 'recorte') return <Recorte {...comum} />;
      if (e.tipo === 'documento') return <Documento {...comum} quadro={e.quadro} />;
      return <Cena {...comum} quadro={e.quadro} forma={e.forma} />;
    }
    case 'titulo':
      return <Titulo texto={e.texto} x={e.x} y={e.y} tamanho={e.tamanho} rotacao={e.rotacao} entra={entra} />;
    case 'numero':
      return <Numero texto={e.texto} x={e.x} y={e.y} tamanho={e.tamanho} rotacao={e.rotacao} entra={entra} />;
    case 'citacao':
      return <Citacao linhas={e.linhas} x={e.x} y={e.y} largura={e.largura} rotacao={e.rotacao} entra={entra} />;
    case 'credito':
      return <Credito texto={e.texto} entra={entra} />;
  }
};
