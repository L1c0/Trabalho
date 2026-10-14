import React, {createContext, useContext} from 'react';
import type {Formato} from '../theme';
import {formatos} from '../theme';

// Coordenadas do campo em fração: x = avanço (0 = próprio gol, 1 = gol adversário),
// y = largura (0 = lado esquerdo de quem ataca, 1 = lado direito). O mesmo dado serve nas
// duas composições; a conversão para pixels acontece só aqui.
export type Pt = {x: number; y: number};

// Região do campo mostrada (a "área ampliada"). Quadrada em fração para manter 105 x 68.
export type Recorte = {x0: number; y0: number; lado: number};

const Ctx = createContext<Formato>(formatos.horizontal);
export const FormatoProvider: React.FC<{formato: Formato; children: React.ReactNode}> = ({formato, children}) => (
  <Ctx.Provider value={formato}>{children}</Ctx.Provider>
);
export const useFormato = () => useContext(Ctx);

export type Projetor = {
  p: (pt: Pt) => {X: number; Y: number};
  pxPorMetro: number;
  caixa: Formato['campo'];
  recorte: Recorte;
};

export const CAMPO_INTEIRO: Recorte = {x0: 0, y0: 0, lado: 1};

export const projetor = (f: Formato, r: Recorte = CAMPO_INTEIRO): Projetor => {
  const c = f.campo;
  const p = (pt: Pt) => {
    const u = (pt.x - r.x0) / r.lado;
    const v = (pt.y - r.y0) / r.lado;
    return f.vertical ? {X: c.x + v * c.w, Y: c.y + (1 - u) * c.h} : {X: c.x + u * c.w, Y: c.y + v * c.h};
  };
  const comprimentoPx = f.vertical ? c.h : c.w;
  return {p, pxPorMetro: comprimentoPx / (105 * r.lado), caixa: c, recorte: r};
};

const ProjCtx = createContext<Projetor>(projetor(formatos.horizontal));
export const ProjetorProvider: React.FC<{valor: Projetor; children: React.ReactNode}> = ({valor, children}) => (
  <ProjCtx.Provider value={valor}>{children}</ProjCtx.Provider>
);
export const useProjetor = () => useContext(ProjCtx);
