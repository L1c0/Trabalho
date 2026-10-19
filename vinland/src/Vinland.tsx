import React from 'react';
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { planos, type Plano } from './data/planos';
import { FRASE_SEM_INIMIGOS } from './data/timeline';
import { FolhaImpressa, type Camera, type Revela } from './lib/Folha';
import { CemSocos } from './scenes/CemSocos';
import { SemInimigos } from './scenes/SemInimigos';

/**
 * O ensaio inteiro: uma Sequence por plano de data/planos.ts, corte seco
 * entre eles, e a mixagem final por baixo (narração + trilha somadas, sem
 * ducking, limitadas a -1,6 dBTP: -15,9 LUFS / LRA 2,3, como no briefing).
 */

/** EMPURRÃO: 3,5% no plano inteiro. Se der pra ver o zoom, está grande demais. */
const EMPURRAO = 0.035;

/** TÊMPERA: o contraste bate de chapado pra duro em 10 quadros. Feita com o
 * papel da folha por cima (só a tinta muda), não com filtro no papel. */
const tempera = (f: number) => {
  const t = Math.min(1, Math.max(0, f / 10));
  return Math.min(1, t * 2.6) * (0.42 + 0.58 * t);
};

const PlanoFolha: React.FC<{ p: Plano }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = p.ate - p.de;
  const t = frame / Math.max(1, dur - 1);

  let camera: Camera;
  if (p.camera) camera = p.camera;
  else {
    const x = p.em?.x ?? 0;
    const y = p.em?.y ?? 0;
    const s = p.em?.s ?? 1;
    const fim = p.mov === 'parado' ? s : s + EMPURRAO;
    camera = { de: { s, x, y }, ate: { s: fim, x, y } };
  }

  // BROTO: lento, sem overshoot (movimentos.broto). Só no fecho.
  const broto = (f: number) =>
    spring({ frame: f, fps, config: { damping: 200, stiffness: 28, mass: 2.4 }, durationInFrames: 110 });

  const passos: Revela[] | undefined = p.passos?.map((x) =>
    x === 'feito'
      ? { em: -1e6, dur: 1 }
      : { em: x[0] - p.de, dur: x[1], curva: p.broto ? broto : undefined },
  );

  return (
    <FolhaImpressa
      id={p.folha!}
      camera={camera}
      t={t}
      passos={passos}
      tinta={p.entrada === 'tempera' ? tempera(frame) : 1}
    />
  );
};

export const Vinland: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#15130F' }}>
    {planos.map((p) => (
      <Sequence key={p.de} from={p.de} durationInFrames={p.ate - p.de} name={p.nota ?? p.folha ?? p.cena}>
        {p.cena === 'CemSocos' ? (
          <CemSocos />
        ) : p.cena === 'SemInimigos' ? (
          <SemInimigos inicioFala={FRASE_SEM_INIMIGOS - p.de} />
        ) : (
          <PlanoFolha p={p} />
        )}
      </Sequence>
    ))}
    <Audio src={staticFile('audio/mix.flac')} />
  </AbsoluteFill>
);
