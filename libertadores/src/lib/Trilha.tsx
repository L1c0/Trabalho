import React from 'react';
import {Html5Audio, staticFile} from 'remotion';
import type {DadosVideo} from '../data/tipos';
import {dbParaVolume} from '../theme';

// ÁUDIO. A narração (tratada fora do Remotion: -16 LUFS) do início ao fim. A trilha a
// -24 dB, sem build, o vídeo inteiro, cedendo 3 dB quando há voz (ataque 2 quadros,
// release 400 ms = 12 quadros). Sem arquivo de trilha, só a voz.
export const Trilha: React.FC<{dados: DadosVideo}> = ({dados}) => {
  const t = dados.trilha;
  const presenca = (f: number) => {
    let p = 0;
    for (const [a, b] of dados.fala) {
      if (f >= a - 2 && f <= b + t!.release) {
        const sobe = Math.min(1, (f - (a - 2)) / 2);
        const desce = f > b ? 1 - (f - b) / t!.release : 1;
        p = Math.max(p, Math.min(sobe, desce));
      }
    }
    return p;
  };
  return (
    <>
      <Html5Audio src={staticFile(dados.narracao)} />
      {t && <Html5Audio src={staticFile(t.arquivo)} loop volume={(f) => dbParaVolume(t.db + t.duckingDb * presenca(f))} />}
    </>
  );
};
