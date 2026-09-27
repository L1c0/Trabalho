import React from 'react';
import {Html5Audio, Sequence, getStaticFiles, staticFile} from 'remotion';
import {V} from '../data';
import {dbParaVolume} from '../theme';

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);
const a = V.audio;
const faltando = [a.narracao, a.trilha.arquivo, a.tensao.arquivo, ...a.efeitos.map((e) => e.arquivo)].filter((f) => !existe(f));
if (faltando.length > 0) console.warn(`[áudio] arquivos ausentes em public/: ${[...new Set(faltando)].join(', ')}`);

// Quanto a voz está presente neste frame (0–1): ataque curto antes da fala, release depois.
export const presencaDaVoz = (frame: number, fala: readonly (readonly [number, number])[], ataque: number, release: number) =>
  fala.reduce((max, [de, ate]) => {
    let e = 0;
    if (frame >= de && frame <= ate) e = 1;
    else if (frame < de && frame >= de - ataque) e = 1 - (de - frame) / ataque;
    else if (frame > ate && frame <= ate + release) e = 1 - (frame - ate) / release;
    return Math.max(max, e);
  }, 0);

// Narração tratada fora do Remotion (-16 LUFS). Manda em tudo.
const Narracao: React.FC = () => (
  <Sequence name="narração" from={0} durationInFrames={V.duracao} layout="none">
    <Html5Audio src={staticFile(a.narracao)} />
  </Sequence>
);

// Drone em loop no nível do data/, abaixando 3 dB sob a voz (release 400 ms). Corta seco no fim.
const Trilha: React.FC = () => {
  const t = a.trilha;
  return (
    <Sequence name="trilha" from={t.de} durationInFrames={t.ate - t.de} layout="none">
      <Html5Audio
        src={staticFile(t.arquivo)}
        loop
        volume={(f) => dbParaVolume(t.db - t.picoDoArquivo + t.duckingDb * presencaDaVoz(f + t.de, a.fala, t.ataque, t.release))}
      />
    </Sequence>
  );
};

// Segunda camada, por baixo da trilha: só no bloco da ansiedade.
const Tensao: React.FC = () => {
  const t = a.tensao;
  return (
    <Sequence name="tensão" from={t.de} durationInFrames={t.ate - t.de} layout="none">
      <Html5Audio src={staticFile(t.arquivo)} loop volume={dbParaVolume(t.db - t.picoDoArquivo)} />
    </Sequence>
  );
};

const Efeitos: React.FC = () => (
  <>
    {a.efeitos
      .filter((e) => existe(e.arquivo))
      .map((e) => (
        <Sequence key={`${e.frame}-${e.arquivo}`} name={e.arquivo} from={e.frame} durationInFrames={V.duracao - e.frame} layout="none">
          <Html5Audio src={staticFile(e.arquivo)} volume={dbParaVolume(e.db)} />
        </Sequence>
      ))}
  </>
);

export const Audio: React.FC = () => (
  <>
    {existe(a.narracao) ? <Narracao /> : null}
    {existe(a.trilha.arquivo) ? <Trilha /> : null}
    {existe(a.tensao.arquivo) ? <Tensao /> : null}
    <Efeitos />
  </>
);
