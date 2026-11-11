import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Abertura, ABERTURA_FIM } from './cenas/Abertura';
import { Vinheta } from './cenas/Vinheta';
import { B0, DURACAO as D, VINHETA } from './tempo';

export const DURACAO = D;

export const Video: React.FC<{ clipes: boolean }> = () => {
  const f = useCurrentFrame();
  const fb = f - B0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {f < VINHETA + 4 && <Vinheta f={f} />}
      {fb >= 0 && fb < ABERTURA_FIM && <Abertura f={fb} />}
    </AbsoluteFill>
  );
};
