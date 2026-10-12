import React from 'react';
import {Html5Audio, interpolate, Sequence, staticFile} from 'remotion';
import {edit} from '../data/edit';
import {dbParaVolume} from '../theme';
import {existe} from './existe';

const a = edit.audio;

// Quanto a voz está presente neste frame (0–1): ataque curto, release de 400 ms.
const presenca = (frame: number, ataque: number, release: number) =>
  a.fala.reduce((max, [de, ate]) => {
    let e = 0;
    if (frame >= de && frame <= ate) e = 1;
    else if (frame < de && frame >= de - ataque) e = 1 - (de - frame) / ataque;
    else if (frame > ate && frame <= ate + release) e = 1 - (frame - ate) / release;
    return Math.max(max, e);
  }, 0);

// Narração do 0 ao fim; trilha com ducking que some por completo em 3540; a voz real do
// Seedorf por baixo, 3 s, no apito final.
export const Audio: React.FC = () => {
  const t = a.trilha;
  return (
    <>
      {existe(a.narracao) ? (
        <Sequence name="narração" from={0} durationInFrames={edit.duracao} layout="none">
          <Html5Audio src={staticFile(a.narracao)} />
        </Sequence>
      ) : null}
      {existe(t.arquivo) ? (
        <Sequence name="trilha" from={t.de} durationInFrames={t.some - t.de} layout="none">
          <Html5Audio
            src={staticFile(t.arquivo)}
            loop
            volume={(f) => {
              const g = f + t.de;
              const sai = interpolate(g, [t.some - t.fade, t.some], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return dbParaVolume(t.db - t.picoDoArquivo + t.duckingDb * presenca(g, t.ataque, t.release)) * sai;
            }}
          />
        </Sequence>
      ) : null}
      {existe(a.recado.arquivo) ? (
        <Sequence name="recado" from={a.recado.de} durationInFrames={90} layout="none">
          <Html5Audio src={staticFile(a.recado.arquivo)} volume={dbParaVolume(a.recado.db)} />
        </Sequence>
      ) : null}
    </>
  );
};
