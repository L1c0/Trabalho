import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

/** A EB Garamond 500 da pasta do projeto (a mesma das chapas). Local: o
 * render não depende de rede. */
export const FAMILIA = 'EB Garamond Vinland';

if (typeof document !== 'undefined' && !document.fonts.check(`500 40px "${FAMILIA}"`)) {
  const h = delayRender('fonte da legenda');
  const f = new FontFace(FAMILIA, `url(${staticFile('fontes/ebg-500.ttf')})`, { weight: '500' });
  f.load()
    .then((ff) => {
      // (a tipagem do DOM do TypeScript não traz o add do FontFaceSet)
      (document.fonts as unknown as { add: (x: FontFace) => void }).add(ff);
      continueRender(h);
    })
    .catch((e) => cancelRender(e));
}
