import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import montagem from './data/montagem.json';
import { FolhaNoPlano } from './lib/Folha';
import { saturacao } from './lib/partitura';
import type { Montagem } from './lib/tipos';

const M = montagem as unknown as Montagem;

/** O plano que está no ar no frame `f` (os planos se encostam: corte seco). */
const planoEm = (f: number) => {
  let lo = 0;
  let hi = M.planos.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (M.planos[mid].de <= f) lo = mid;
    else hi = mid - 1;
  }
  return M.planos[lo];
};

export const Vagabond: React.FC<{ semSom?: boolean }> = ({ semSom }) => {
  const f = useCurrentFrame();
  const pl = planoEm(f);
  return (
    <AbsoluteFill style={{ backgroundColor: '#E8E4DA' }}>
      <FolhaNoPlano m={M} pl={pl} f={f} sat={saturacao(M, f)} />
      {!semSom && <Audio src={staticFile('audio/vag-mix.flac')} />}
    </AbsoluteFill>
  );
};
