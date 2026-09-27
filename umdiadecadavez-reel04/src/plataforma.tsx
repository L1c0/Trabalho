import React, {createContext, useContext} from 'react';
import {useVideoConfig} from 'remotion';
import {plataforma, type Plataforma} from './theme';

const Contexto = createContext<Plataforma>(plataforma(false));

export const ComPlataforma: React.FC<{tiktok: boolean; children: React.ReactNode}> = ({tiktok, children}) => (
  <Contexto.Provider value={plataforma(tiktok)}>{children}</Contexto.Provider>
);

export const usePlataforma = () => useContext(Contexto);

// Topo de uma legenda já com o deslocamento da plataforma.
export const useTopoDaLegenda = () => {
  const p = usePlataforma();
  const {height} = useVideoConfig();
  return (topo: number) => topo - p.subirLegendas * height;
};
