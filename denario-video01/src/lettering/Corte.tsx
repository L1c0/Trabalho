import React from 'react';
import {useCurrentFrame} from 'remotion';

// CORTE · aparece inteira num frame, some no outro. Sem fade.
export const Corte: React.FC<{de: number; ate?: number; children: React.ReactNode}> = ({de, ate = Infinity, children}) => {
  const frame = useCurrentFrame();
  return frame >= de && frame < ate ? <>{children}</> : null;
};
