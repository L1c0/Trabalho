/**
 * ANTES DA LENDA — abertura
 * 1920×1080 · 30 fps · 660 frames (22 s)
 *
 * DOIS ATOS
 * ---------
 * ATO 1 (f0–511) · A LENDA. Três planos do jogo, cortes rápidos, e as
 *   palavras vivendo EM PROFUNDIDADE: cada uma tem o seu Z e a câmera
 *   faz dolly, então elas passam uma pela outra em velocidades
 *   diferentes. Maiúsculas na Playfair; as palavras de ligação em
 *   itálico, que é o contraste de textura da referência.
 *
 * f511 · A VIRADA. O acento mais forte da faixa cai aqui (17,02 s). O
 *   quadro inteiro é uma carta de duas faces: ela gira 180° em Y e a
 *   face de trás é a mesma imagem impressa em nanquim sobre washi.
 *   A lenda vira registro, girando.
 *
 * ATO 2 (f511–660) · O REGISTRO. A câmera recua e a folha vira uma de
 *   muitas, empilhadas em profundidade. A cartela imprime em 19,82 s.
 *
 * SEM MOLA. Nenhum spring, nenhum easing elástico. Dolly linear,
 * entrada de palavra em 5 frames com parada seca.
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

/** Perspectiva da câmera. Alto = lente longa, pouca distorção. */
const PERSP = 1600;

/** Zoom base dos planos. Também joga pra fora o contador "60 FPS"
 *  queimado no canto do clipe da planície. */
const ZOOM = 1.085;

/** Batida: 120 BPM, caindo no frame 4. Uma a cada 15 frames. */
const B = (n: number) => 4 + n * 15;

const CORTE_CIDADE = 184;
const CORTE_MERCADO = 325;
const VIRADA = 511;        // 17,02 s — o acento mais forte da faixa
const VIRADA_DUR = 18;
const MERGULHO = 583;      // 19,44 s — a câmera despenca pra dentro da pilha
const PRETO    = 595;       // 19,82 s — escuro total, em cima do acento
const FIM      = 630;       // 21,0 s — meio segundo de preto e entrega o vídeo

type Peca = {x: number; y: number; w: number; h: number; z: number; texto: string};
const P = pos as unknown as Record<string, Peca>;

/** entra / sai de cada palavra, em frames (tudo em cima de batida) */
const TEMPO: Record<string, [number, number]> = {
  't01.png': [B(0), B(9)],     //   4 → 139   EM 1899
  't02.png': [B(4), B(10)],    //  64 → 154   um homem
  't03.png': [B(7), B(11)],    // 109 → 169   ATRAVESSA
  't04.png': [B(9), B(12)],    // 139 → 184   uma terra
  't05.png': [B(13), B(19)],   // 199 → 289   QUE JÁ TINHA
  't06.png': [B(15), B(20)],   // 229 → 304   ACABADO
  't07.png': [B(22), B(27)],   // 334 → 409   ninguém
  't08.png': [B(24), B(28)],   // 364 → 424   AVISOU
  't09.png': [B(27), B(30)],   // 409 → 454   o bando
  't10.png': [B(30), VIRADA],  // 454 → 511   TUDO QUE VOCÊ SABE
  't11.png': [B(31), VIRADA],  // 469 → 511   foi escrito
  't12.png': [B(33), VIRADA],  // 499 → 511   DEPOIS
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Dolly da câmera em Z durante o ato 1. Linear, sem easing. */
const camZ = (f: number) => interpolate(f, [0, VIRADA], [0, 340], clamp);

/** Plano de vídeo. <Sequence> rebaseia o relógio, então o empurrão
 *  não precisa saber onde o corte caiu. */
const Plano: React.FC<{src: string}> = ({src}) => {
  const f = useCurrentFrame();
  const z = ZOOM + interpolate(f, [0, 150], [0, 0.04], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{
          width: W,
          height: H,
          objectFit: 'cover',
          transform: `scale(${z})`,
        }}
      />
    </AbsoluteFill>
  );
};

/** As palavras, cada uma no seu Z. É isto que dá paralaxe de verdade:
 *  elas não escalam juntas, porque não estão à mesma distância. */
const Palavras: React.FC = () => {
  const f = useCurrentFrame();
  const cz = camZ(f);
  return (
    <>
      {Object.entries(TEMPO).map(([nome, [ent, sai]]) => {
        if (f < ent || f > sai + 8) return null;
        const p = P[nome];
        const ab = interpolate(f, [ent, ent + 5], [0, 1], clamp);
        const fe = interpolate(f, [sai, sai + 8], [1, 0], clamp);
        // assentar: 1,5% em 5 frames e PARA. Nada de mola.
        const s0 = interpolate(f, [ent, ent + 5], [1.015, 1.0], clamp);
        return (
          <div
            key={nome}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              opacity: ab * fe,
              transform: `translateZ(${p.z - cz}px) scale(${s0})`,
              transformStyle: 'preserve-3d',
            }}
          >
            <Img src={staticFile(nome)} style={{width: p.w, height: p.h}} />
          </div>
        );
      })}
    </>
  );
};

/** A pilha de folhas do ato 2: a folha impressa é uma de muitas. */
const Pilha: React.FC<{recuo: number}> = ({recuo}) => (
  <>
    {[1, 2, 3, 4, 5].map((k) => (
      <AbsoluteFill
        key={k}
        style={{
          // as folhas ficam LOGO ATRAS da da frente e recuam JUNTO com ela.
          // Com o sinal invertido elas vinham pra cima da camera e, passado
          // o valor da perspectiva, estouravam de tamanho.
          transform: `translateZ(${-k * 120 - recuo}px) rotateZ(${
            (k % 2 ? 1 : -1) * (0.6 + k * 0.3)
          }deg)`,
          backgroundColor: '#D6D1C6',
          backgroundImage: `url(${staticFile('papel.jpg')})`,
          backgroundSize: '2600px 2600px',
          opacity: Math.max(0, 0.9 - k * 0.14),
        }}
      />
    ))}
  </>
);

export const IntroScene: React.FC = () => {
  const f = useCurrentFrame();

  // A VIRADA: a carta gira 180° em Y. Linear — é uma folha sendo virada,
  // não um objeto com peso.
  const giro = interpolate(f, [VIRADA, VIRADA + VIRADA_DUR], [0, 180], clamp);

  // o recuo do ato 2 revela a pilha
  // o recuo revela a pilha e depois DESPENCA: a folha vai embora pro fundo
  const recuo =
    f < MERGULHO
      ? interpolate(f, [VIRADA + VIRADA_DUR, MERGULHO], [0, 700], clamp)
      : interpolate(f, [MERGULHO, PRETO], [700, 2600], clamp);

  // o preto fecha em cima do acento de 19,82 s
  const preto = interpolate(f, [MERGULHO + 4, PRETO], [0, 1], clamp);
  // a trilha entrega o vídeo limpo: cai a zero junto com a imagem
  const som = interpolate(f, [MERGULHO, PRETO + 6], [0.9, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: `${PERSP}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* ------------------------------------------------- a pilha, no ato 2 */}
      {/* [montagem] a pilha vem ANTES da carta: sem preserve-3d no pai, as camadas
          se empilham pela ordem do DOM, e depois da carta ela era desenhada por
          cima do tratado. */}
      {f > VIRADA + VIRADA_DUR ? <Pilha recuo={recuo} /> : null}

      {/* ------------------------------------------- A CARTA DE DUAS FACES */}
      {/* [montagem] translateZ antes do rotateY: depois de girar 180° o eixo Z
          da carta aponta para a câmera, e o recuo virava avanço (a carta crescia
          e, passado o valor da perspectiva, sumia atrás da câmera). */}
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(${-recuo}px) rotateY(${giro}deg)`,
        }}
      >
        {/* FRENTE: o jogo. A lenda. */}
        <AbsoluteFill style={{backfaceVisibility: 'hidden'}}>
          <Sequence from={0} durationInFrames={CORTE_CIDADE}>
            <Plano src="planicie-188f.mp4" />
          </Sequence>
          <Sequence
            from={CORTE_CIDADE}
            durationInFrames={CORTE_MERCADO - CORTE_CIDADE}
          >
            <Plano src="cidade-188f.mp4" />
          </Sequence>
          <Sequence from={CORTE_MERCADO} durationInFrames={VIRADA - CORTE_MERCADO + 2}>
            <Plano src="mercado-188f.mp4" />
          </Sequence>
          {/* [montagem] o clipe acaba no 512, no começo do giro; sem isto a face
              da frente girava vazia (preta) até ficar de perfil. Segura o último
              quadro até a carta virar. */}
          <Sequence from={VIRADA + 2} durationInFrames={VIRADA_DUR}>
            <Freeze frame={VIRADA - CORTE_MERCADO + 1}>
              <Plano src="mercado-188f.mp4" />
            </Freeze>
          </Sequence>
        </AbsoluteFill>

        {/* VERSO: a mesma imagem impressa. O registro. */}
        <AbsoluteFill
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Img
            src={staticFile('tratado.jpg')}
            style={{width: W, height: H, objectFit: 'cover'}}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ---------------------------------------- as palavras, em profundidade */}
      {f < VIRADA ? (
        <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
          <Palavras />
        </AbsoluteFill>
      ) : null}

      {/* ------------------------------- o preto, e o vídeo começa de verdade */}
      {preto > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#000', opacity: preto}} />
      ) : null}

      <Audio src={staticFile('trilha.mp3')} volume={som} />
    </AbsoluteFill>
  );
};
