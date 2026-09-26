import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';
import {R, type Fala} from '../data';
import {dbParaVolume} from '../theme';

// Quanto a voz está presente neste frame (0–1): ataque curto antes da fala, release depois.
export const presencaDaVoz = (frame: number, falas: readonly Fala[], ataque: number, release: number) =>
  falas.reduce((max, f) => {
    let e = 0;
    if (frame >= f.de && frame <= f.ate) e = 1;
    else if (frame < f.de && frame >= f.de - ataque) e = 1 - (f.de - frame) / ataque;
    else if (frame > f.ate && frame <= f.ate + release) e = 1 - (frame - f.ate) / release;
    return Math.max(max, e);
  }, 0);

// Trilha: entra com o papel no nível do data/, abaixa 3 dB sob a voz (release 400 ms), corta seco no fim.
export const Trilha: React.FC = () => {
  const t = R.audio.trilha;
  return (
    <Sequence name="trilha" from={t.de} durationInFrames={t.ate - t.de} layout="none">
      <Html5Audio
        src={staticFile(t.arquivo)}
        volume={(f) => dbParaVolume(t.db - t.picoDoArquivo + t.duckingDb * presencaDaVoz(f + t.de, R.falas, t.ataque, t.release))}
      />
    </Sequence>
  );
};
