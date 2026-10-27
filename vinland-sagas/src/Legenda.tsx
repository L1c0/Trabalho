import React, { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import cues from './data/legenda.json';

/**
 * A legenda queimada: EB Garamond 500, corpo 40, #2A2622 a 80% (a cor da série),
 * centrada na faixa y=1480..1600 (LEIA-PRIMEIRO). Texto, quebras e tempos
 * são os da .srt de docs/, como estão.
 */
const FAMILIA = 'EB Garamond Vinland';
const FAIXA = { de: 1480, ate: 1600 };
let fonte: Promise<void> | null = null;
const carregaFonte = () =>
  (fonte ??= new FontFace(FAMILIA, `url(${staticFile('fontes/ebg-500.ttf')})`, { weight: '500' }).load().then((ff) => {
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(ff);
  }));

export const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h] = useState(() => delayRender('fonte da legenda'));
  useEffect(() => {
    carregaFonte()
      .then(() => continueRender(h))
      .catch((e) => cancelRender(e));
  }, [h]);
  const t = f / fps;
  const c = cues.find((x) => t >= x.de && t < x.ate);
  if (!c) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: 1080,
        top: (FAIXA.de + FAIXA.ate) / 2 - c.linhas.length * 24,
        textAlign: 'center',
        fontFamily: `"${FAMILIA}"`,
        fontWeight: 500,
        fontSize: 40,
        lineHeight: '48px',
        color: '#2A2622',
        opacity: 0.8,
        whiteSpace: 'pre',
      }}
    >
      {c.linhas.join('\n')}
    </div>
  );
};
