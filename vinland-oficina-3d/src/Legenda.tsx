import React, { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import cues from './data/legenda.json';

/**
 * A legenda queimada: EB Garamond 500, corpo 44, centrada, topo em y=1420
 * (LEIA-PRIMEIRO); entrelinha 1,2. Cor da série, #2A2622 a 80% (o LEIA não
 * diz). Texto, quebras e tempos são os de docs/4-oficina.srt, como estão.
 */
const FAMILIA = 'EB Garamond Vinland';
const TOPO = 1420;
const CORPO = 44;
const ENTRELINHA = Math.round(CORPO * 1.2);
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
        top: TOPO,
        textAlign: 'center',
        fontFamily: `"${FAMILIA}"`,
        fontWeight: 500,
        fontSize: CORPO,
        lineHeight: `${ENTRELINHA}px`,
        color: '#2A2622',
        opacity: 0.8,
        whiteSpace: 'pre',
      }}
    >
      {c.linhas.join('\n')}
    </div>
  );
};
