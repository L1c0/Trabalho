import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';
import type {Video} from '../data/tipos';
import {dbParaVolume} from '../theme';
import {existe} from '../lib/Elemento';

// Quanto a voz está presente neste frame (0–1): ataque curto antes da fala, release depois.
const presenca = (frame: number, fala: Video['audio']['fala'], ataque: number, release: number) =>
  fala.reduce((max, [de, ate]) => {
    let e = 0;
    if (frame >= de && frame <= ate) e = 1;
    else if (frame < de && frame >= de - ataque) e = 1 - (de - frame) / ataque;
    else if (frame > ate && frame <= ate + release) e = 1 - (frame - ate) / release;
    return Math.max(max, e);
  }, 0);

// Narração e trilha. Sem efeitos sonoros: colagem é silenciosa.
export const Audio: React.FC<{v: Video}> = ({v}) => {
  const a = v.audio;
  const t = a.trilha;
  return (
    <>
      {existe(a.narracao) ? (
        <Sequence name="narração" from={0} durationInFrames={v.duracao} layout="none">
          <Html5Audio src={staticFile(a.narracao)} />
        </Sequence>
      ) : null}
      {existe(t.arquivo) ? (
        <Sequence name="trilha" from={t.de} durationInFrames={t.ate - t.de} layout="none">
          <Html5Audio
            src={staticFile(t.arquivo)}
            loop
            volume={(f) => dbParaVolume(t.db - t.picoDoArquivo + t.duckingDb * presenca(f + t.de, a.fala, t.ataque, t.release))}
          />
        </Sequence>
      ) : null}
    </>
  );
};
