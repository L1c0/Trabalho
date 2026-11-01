/**
 * ANTES DA LENDA — vinheta de abertura
 * 1920×1080 · 30 fps · 315 frames (10,5 s)
 *
 * A ESTRUTURA
 * -----------
 * Três planos em ordem: planície vazia → cidadezinha com lampião →
 * mercado com luz elétrica. É a fronteira fechando, em ordem, em dez
 * segundos. Uma frase atravessa os três cortes:
 *
 *     TUDO QUE VOCÊ SABE / FOI ESCRITO / DEPOIS
 *
 * No fim a imagem CONGELA e vira nanquim sobre washi — a lenda virando
 * registro — e a cartela imprime em cima.
 *
 * A GRADE
 * -------
 * A faixa está em 120 BPM com a batida caindo no frame 4. Logo: batida a
 * cada 15 frames (4, 19, 34, 49, 64...). Toda palavra entra EM CIMA de
 * uma batida, e a cartela cai no primeiro acento forte da faixa, em
 * 9,1 s = frame 273. É isso que faz parecer edit e não slideshow.
 *
 * SEM MOLA. Sem spring, sem easing elástico. A palavra entra em 4 frames
 * e para seco. Movimento com mola lê como efeito; aqui tem que ler como
 * batida de chapa.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import pos from './pos.json';

const W = 1920;
const H = 1080;

/** Batida do frame 4 em diante, a cada 15 frames. */
const B = (n: number) => 4 + n * 15;

/** Zoom leve e constante. Também empurra o contador "60 FPS"
 *  queimado no canto do clipe da planície pra fora do quadro. */
const ZOOM = 1.085;

type Peca = {x: number; y: number; w: number; h: number; linha: number; ordem: number};
const PECAS = Object.entries(pos.posicoes as Record<string, Peca>);

// ---- quando cada palavra entra, em batidas ----
const ENTRADA: Record<string, number> = {
  'pal-1-0.png': B(0),   // TUDO     f4
  'pal-1-1.png': B(1),   // QUE      f19
  'pal-1-2.png': B(2),   // VOCÊ     f34
  'pal-1-3.png': B(3),   // SABE     f49
  'pal-2-0.png': B(5),   // FOI      f79
  'pal-2-1.png': B(6),   // ESCRITO  f94
  'pal-3-0.png': B(10),  // DEPOIS   f154
};
/** cada linha some junto, uma batida antes do corte seguinte */
const SAIDA: Record<number, number> = {1: B(4), 2: B(8), 3: B(13)};

const CORTE_2 = B(4);   // f64  -> cidade
const CORTE_3 = B(9);   // f139 -> mercado
const CONGELA = B(14);  // f214 -> congela e vira nanquim
const CARTELA = 273;    // 9,1 s: o primeiro acento forte da faixa
const FIM = 315;

/** Vídeo com zoom constante, cobrindo o quadro. */
const Plano: React.FC<{src: string; comecaEm: number; de: number}> = ({
  src,
  comecaEm,
  de,
}) => {
  const f = useCurrentFrame();
  // empurrão lento e linear: 0 easing, 0 mola
  const z = ZOOM + interpolate(f - de, [0, 90], [0, 0.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={comecaEm}
        muted
        style={{
          width: W,
          height: H,
          objectFit: 'cover',
          transform: `scale(${z})`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};

const Palavras: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {PECAS.map(([nome, p]) => {
        const ent = ENTRADA[nome];
        const sai = SAIDA[p.linha];
        if (ent === undefined || f < ent || f > sai + 6) return null;

        // entra em 4 frames e PARA. Sai em 6.
        const ab = interpolate(f, [ent, ent + 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fe = interpolate(f, [sai, sai + 6], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // assentar: 2% de escala em 4 frames, parada seca. Nada de spring.
        const s = interpolate(f, [ent, ent + 4], [1.02, 1.0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <Img
            key={nome}
            src={staticFile(nome)}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              opacity: ab * fe,
              transform: `scale(${s})`,
              transformOrigin: 'center bottom',
            }}
          />
        );
      })}
    </>
  );
};

const Cartela: React.FC = () => {
  const f = useCurrentFrame();
  if (f < CARTELA - 10) return null;
  // o papel chega seco, em 5 frames
  const pap = interpolate(f, [CARTELA - 10, CARTELA - 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // a cartela imprime NO acento
  const tinta = interpolate(f, [CARTELA, CARTELA + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: pap}}>
      <AbsoluteFill
        style={{
          backgroundColor: '#D6D1C6',
          backgroundImage: `url(${staticFile('papel.jpg')})`,
          backgroundSize: '2600px 2600px',
        }}
      />
      <AbsoluteFill style={{opacity: tinta}}>
        <Img
          src={staticFile('cartela.jpg')}
          style={{width: W, height: H, objectFit: 'cover'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IntroScene: React.FC = () => {
  const f = useCurrentFrame();

  // a virada pra nanquim: a imagem congela e a tinta toma conta em 8 frames
  const nanquim = interpolate(f, [CONGELA, CONGELA + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* ---------------------------------------------------- os três planos */}
      {f < CONGELA ? (
        <>
          {/* [montagem] os três clipes chegaram já cortados nos pontos de
              entrada (22 s, 16 s e 3,5 s do original): começam em 0. E dentro
              de uma <Sequence> o frame já é relativo ao começo dela, então o
              empurrão de cada plano conta de 0 (com de={CORTE_2}/{CORTE_3} a
              cidadezinha e o mercado ficavam parados em 1,085). */}
          <Sequence from={0} durationInFrames={CORTE_2}>
            {/* planície: começa aos 22 s do clipe original */}
            <Plano src="plano-planicie.mp4" comecaEm={0} de={0} />
          </Sequence>
          <Sequence from={CORTE_2} durationInFrames={CORTE_3 - CORTE_2}>
            {/* cidadezinha: começa aos 16 s do original */}
            <Plano src="plano-cidade.mp4" comecaEm={0} de={0} />
          </Sequence>
          <Sequence from={CORTE_3} durationInFrames={CONGELA - CORTE_3}>
            {/* mercado: começa aos 3,5 s do original */}
            <Plano src="plano-mercado.mp4" comecaEm={0} de={0} />
          </Sequence>
        </>
      ) : (
        // CONGELA: o movimento para. É o registro, e registro não se mexe.
        <Freeze frame={CONGELA - CORTE_3 - 1}>
          <Plano src="plano-mercado.mp4" comecaEm={0} de={0} />
        </Freeze>
      )}

      {/* ------------------------------------------- a lenda virando registro */}
      {f >= CONGELA ? (
        <AbsoluteFill style={{opacity: nanquim}}>
          <Img
            src={staticFile('tratado.jpg')}
            style={{width: W, height: H, objectFit: 'cover'}}
          />
        </AbsoluteFill>
      ) : null}

      <Palavras />
      <Cartela />

      <Audio src={staticFile('trilha.mp3')} volume={0.9} />
    </AbsoluteFill>
  );
};
