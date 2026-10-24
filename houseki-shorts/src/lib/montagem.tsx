import React from 'react';
import { Audio, staticFile, useCurrentFrame } from 'remotion';

/** Só existe entre `de` e `ate` (frames absolutos do Short). Corte seco. */
export const Pagina: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  return f >= de && f < ate ? <>{children}</> : null;
};

/** Revelação por tinta de um pedaço: 12 frames (V2: 10 a 14), dois frames
 * antes da palavra, para a tinta chegar junto com a voz. */
export const R = (palavra: number, dur = 12): [number, number] => [palavra - 2, dur];
/** Corte seco (troca de batida grande). */
export const C = (f: number): [number, number] => [f, 0];

/** A mixagem pronta do Short (narração + trilha + leito + efeitos). */
export const Som: React.FC<{ n: string }> = ({ n }) => <Audio src={staticFile(`audio/shorts/mix-${n}.flac`)} />;

/** O conjunto sobe alguns pixels quando entra um pedaço novo por baixo. */
export const SOBE = 14;
