/**
 * ANTES DA LENDA — abertura · Red Dead Redemption 2
 * 1920×1080 · 30 fps · 690 frames (23,0 s)
 *
 * ESTRUTURA
 * ---------
 * ATO 1 (f0–511) · A LENDA. Onze planos, corte a cada 1 a 1,5 s, na
 *   batida. Cada ambiente tem a sua cor, **já gravada no arquivo de
 *   vídeo** — não aplica filtro aqui. A tipografia é tingida na cor do
 *   ambiente onde está.
 *
 * f511 · A VIRADA. Corte seco para a mesma cena em nanquim sobre washi.
 *   A lenda vira registro. Segura 2,5 s.
 *
 * f585 · A MÚSICA MORRE e entra o close do Arthur. Ele diz "I'm afraid".
 *   A legenda ESTOU COM MEDO imprime e fica. O áudio já vem montado em
 *   `audio-intro.mp3`: música até 19,5 s, corte seco, fala sozinha.
 *
 * f690 · acaba com a legenda na tela e o ambiente rodando. É a deixa pra
 *   narração entrar por cima, sem emenda.
 *
 * O QUE JÁ VEM PRONTO NO ARQUIVO (não refazer aqui)
 * -------------------------------------------------
 * · a cor de cada ambiente, a vinheta e a halação
 * · o "ATRAVESSA" do terceiro plano, que passa ATRÁS do Arthur — a
 *   silhueta dele foi extraída quadro a quadro e o texto fica por baixo.
 *   Esse plano é `planicie-texto.mp4` e já traz o texto embutido.
 * · o áudio inteiro, com o corte da música no lugar certo
 *
 * SEM MOLA. Corte seco, entrada de palavra em 4 frames com parada seca.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import tip from './pos.json';

const W = 1920;
const H = 1080;
const BARRA = 104;          // letterbox 2.39:1
const VIRADA = 511;
const FALA = 585;           // a música morre e entra o close
const FIM = 690;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Peca = {peca: string; x: number; y: number; w: number; h: number; texto: string};
const T = tip as unknown as Record<string, Peca>;

/** PLANOS: [início, fim, arquivo, frame de entrada no arquivo, zoom] */
const PLANOS: [number, number, string, number, number][] = [
  [0, 64, 'sol.mp4', 0, 1.04],
  [64, 124, 'planicie.mp4', 0, 1.02],
  [124, 169, 'planicie-texto.mp4', 17, 1.0],   // o ATRAVESSA já vem embutido
  [169, 229, 'cidade.mp4', 0, 1.03],
  [229, 274, 'cidade.mp4', 60, 1.22],
  [274, 319, 'mercado.mp4', 0, 1.03],
  [319, 364, 'mercado.mp4', 60, 1.26],
  [364, 409, 'sol.mp4', 90, 1.3],
  [409, 454, 'planicie.mp4', 90, 1.28],
  [454, 484, 'cidade.mp4', 138, 1.1],
  [484, 513, 'mercado.mp4', 147, 1.1],
];

/** PALAVRAS: [id, entra, sai] — tudo em cima de batida (15 em 15, do f4) */
const PALAVRAS: [string, number, number][] = [
  ['w01', 4, 59],      // EM 1899
  ['w02', 64, 119],    // um homem
  // ATRAVESSA: embutido no plano, f124–169
  ['w03', 169, 224],   // uma terra
  ['w04', 199, 269],   // QUE JÁ TINHA ACABADO
  ['w05', 274, 314],   // ninguém
  ['w06', 304, 359],   // AVISOU
  ['w07', 364, 404],   // o bando
  ['w08', 409, 449],   // TUDO QUE VOCÊ SABE
  ['w09', 454, 479],   // foi escrito
  ['w10', 484, VIRADA],// DEPOIS
  ['w11', 615, FIM],   // ESTOU COM MEDO
];

const Plano: React.FC<{src: string; de: number; zoom: number}> = ({src, de, zoom}) => (
  <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
    <OffthreadVideo
      src={staticFile(src)}
      startFrom={de}
      muted
      style={{width: W, height: H, objectFit: 'cover', transform: `scale(${zoom})`}}
    />
  </AbsoluteFill>
);

const Palavra: React.FC<{id: string; ent: number; sai: number}> = ({id, ent, sai}) => {
  const f = useCurrentFrame();
  if (f < ent || f > sai + 6) return null;
  const p = T[id];
  const ab = interpolate(f, [ent, ent + 4], [0, 1], clamp);
  const fe = interpolate(f, [sai, sai + 6], [1, 0], clamp);
  // assenta 1,5% em 4 frames e PARA. Sem mola.
  const s = interpolate(f, [ent, ent + 4], [1.015, 1.0], clamp);
  return (
    <Img
      src={staticFile(p.peca)}
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: p.w,
        height: p.h,
        opacity: ab * fe,
        transform: `scale(${s})`,
      }}
    />
  );
};

/** Grão de filme: um ladrilho de 512 px que anda a cada frame. */
const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const x = (f * 97) % 512;
  const y = (f * 53) % 512;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('grao.png')})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: 'overlay',
        opacity: 0.17,
        pointerEvents: 'none',
      }}
    />
  );
};

export const IntroScene: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* ------------------------------------------------- ATO 1: a lenda */}
      {f < VIRADA
        ? PLANOS.map(([a, b, src, de, z], i) => (
            <Sequence key={i} from={a} durationInFrames={b - a}>
              <Plano src={src} de={de} zoom={z} />
            </Sequence>
          ))
        : null}

      {/* ------------------------------------------ A VIRADA: o registro */}
      {f >= VIRADA && f < FALA ? (
        <Img
          src={staticFile('virada.jpg')}
          style={{width: W, height: H, objectFit: 'cover'}}
        />
      ) : null}

      {/* ------------------------------- A FALA: a música morre, ele fala */}
      {f >= FALA ? (
        <Sequence from={FALA} durationInFrames={FIM - FALA}>
          <Plano src="arthur.mp4" de={0} zoom={1.0} />
        </Sequence>
      ) : null}

      {/* ----------------------------------------------------- tipografia */}
      {PALAVRAS.map(([id, ent, sai]) => (
        <Palavra key={id} id={id} ent={ent} sai={sai} />
      ))}

      <Grao />

      {/* --------------------------------------------- letterbox 2.39:1 */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: BARRA, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, top: H - BARRA, width: W, height: BARRA, background: '#000'}} />
      </AbsoluteFill>

      {/* o áudio já vem montado: música até 19,5 s, corte seco, fala sozinha */}
      <Audio src={staticFile('audio-intro.mp3')} />
    </AbsoluteFill>
  );
};
