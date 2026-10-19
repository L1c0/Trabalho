import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { papel, Papel, grao } from '../theme';
import { empurrao, golpe, tempera } from './movimentos';

/**
 * Um quadro de mangá sobre o chão da cena.
 *
 * As PNGs em public/manga são cinza com papel branco. Em vez de recortar
 * o branco (alpha), o quadro entra em `multiply`: o branco da página VIRA
 * o tom de papel da cena e só a tinta sobra. O desenho fica impresso
 * direto na superfície, sem moldura branca e sem recorte, numa
 * propriedade de CSS.
 *
 * Só funciona sobre PAPEL CLARO. Testei sobre base escura e sobre
 * meio-tom: achata o traço e a tela fica cor de barro. Por isso `base` só
 * aceita os tons de `papel`, nunca os de `cartela`.
 */

export type Movimento = 'parado' | 'golpe' | 'tempera';

export const Quadro: React.FC<{
  src: string;                 // 'manga/v11-sem-inimigos.png'
  base?: Papel;                // tom de papel da cena
  movimento?: Movimento;
  /** 0 = sem empurrão. 0.035 é o padrão da casa. */
  zoom?: number;
  /** abre o meio-tom antes do multiply. 0 a 1. sobe junto com base escura. */
  levantar?: number;
  /** cobertura do quadro na tela, 0 a 1 da largura */
  largura?: number;
  deslocX?: number;
  deslocY?: number;
  golpeOpts?: Parameters<typeof golpe>[1];
  temperaInicio?: number;
}> = ({
  src,
  base = 'guerra',
  movimento = 'parado',
  zoom = 0.035,
  levantar = 0.3,
  largura = 0.78,
  deslocX = 0,
  deslocY = 0,
  golpeOpts,
  temperaInicio = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  const escala = empurrao(frame, durationInFrames, zoom);

  let tx = deslocX;
  let ty = deslocY;
  let filtro = `contrast(${1 - levantar * 0.38}) brightness(${1 + levantar * 0.34})`;
  let opacidade = 1;

  if (movimento === 'golpe' && golpeOpts) {
    const g = golpe(frame, golpeOpts);
    tx += g.x;
    ty += g.y;
  }

  if (movimento === 'tempera') {
    const t = tempera(frame, temperaInicio);
    filtro = `${filtro} ${t.filter}`;
    opacidade = t.opacidade;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: papel[base] }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          mixBlendMode: 'multiply',
          opacity: opacidade,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: width * largura,
            height: 'auto',
            transform: `translate(${tx}px, ${ty}px) scale(${escala})`,
            filter: filtro,
          }}
        />
      </AbsoluteFill>
      <Grao />
    </AbsoluteFill>
  );
};

/**
 * Grão de filme por SVG feTurbulence.
 * `baseFrequency` alto = grão fino. O valor abaixo bate no alvo medido
 * de desvio local 6–8 em 1920x1080. Não trocar no olho: medir.
 */
export const Grao: React.FC<{ opacidade?: number }> = ({
  opacidade = grao.opacidade,
}) => (
  <AbsoluteFill
    style={{ opacity: opacidade, mixBlendMode: 'overlay', pointerEvents: 'none' }}
  >
    <svg width="100%" height="100%">
      <filter id="grao-vin">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.78"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao-vin)" />
    </svg>
  </AbsoluteFill>
);
