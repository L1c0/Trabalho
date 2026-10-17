import {useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * O ÚNICO movimento do filme: deriva lenta de escala, 100% a 103% ao longo do plano
 * inteiro. Nada mais.
 */
export const useDeriva = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return 1 + 0.03 * Math.min(1, f / Math.max(1, durationInFrames - 1));
};
