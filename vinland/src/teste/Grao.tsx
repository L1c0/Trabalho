import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FolhaImpressa } from '../lib/Folha';

/** Calibração do grão: a cartela 1 parada (frame 0) e no fim do empurrão de 3,5% (frame 1). */
export const TesteGrao: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <FolhaImpressa
      id="c1"
      estado={1}
      camera={{ de: { s: 1, x: 0, y: 0 }, ate: { s: 1.035, x: 0, y: 0 } }}
      t={f}
    />
  );
};
