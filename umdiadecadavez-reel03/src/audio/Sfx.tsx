import React from 'react';
import {Html5Audio, Sequence, getStaticFiles, interpolate, staticFile} from 'remotion';
import {R} from '../data';
import {dbParaVolume} from '../theme';

const existe = (arquivo: string) => getStaticFiles().some((f) => f.name === arquivo);

// Efeitos que faltam na pasta public/ são pulados (e avisados no console), nunca improvisados.
const faltando = [R.audio.roomtone.arquivo, ...R.audio.efeitos.map((e) => e.arquivo)].filter((a) => !existe(a));
if (faltando.length > 0) {
  console.warn(`[sfx] arquivos ausentes em public/: ${[...new Set(faltando)].join(', ')}`);
}

// Room tone em loop só até a virada; o fade termina antes da página virar.
export const RoomTone: React.FC = () => {
  const r = R.audio.roomtone;
  if (!existe(r.arquivo)) return null;
  const base = dbParaVolume(r.db);
  return (
    <Sequence name="roomtone" from={r.de} durationInFrames={r.ate - r.de} layout="none">
      <Html5Audio
        src={staticFile(r.arquivo)}
        loop
        volume={(f) =>
          base * interpolate(f + r.de, [r.fadeDe, r.fadeAte], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    </Sequence>
  );
};

// Mapa frame → arquivo vindo de data/. Nenhum efeito passa do fim (silêncio absoluto depois).
export const Sfx: React.FC = () => (
  <>
    {R.audio.efeitos
      .filter((e) => existe(e.arquivo))
      .map((e) => (
        <Sequence key={`${e.frame}-${e.arquivo}`} name={e.arquivo} from={e.frame} durationInFrames={R.fim - e.frame} layout="none">
          <Html5Audio src={staticFile(e.arquivo)} volume={dbParaVolume(e.db)} />
        </Sequence>
      ))}
  </>
);
