/**
 * A CONTAGEM — cena 3D
 * Canal @MangaEm60 · Vinland Saga, capítulo 96
 *
 * 1080×1920 · 30 fps · 783 frames
 *
 * O PRINCÍPIO
 * -----------
 * A chapa é um plano real no espaço. A tinta de cada soco fica alguns
 * pixels ACIMA do papel, em Z — como tinta de prensa senta na fibra.
 * A câmera faz dolly e orbita, então você vê a paralaxe entre a tinta e
 * o papel: a página tem espessura.
 *
 * Cada numeral chega voando na direção da câmera e ASSENTA na página.
 * São cem socos vindo na sua cara, um por vez. O 3D é o argumento.
 *
 * O QUE NÃO TEM, DE PROPÓSITO
 * ---------------------------
 * Sem luz, sem material, sem sombra, sem rim light, sem bloom, sem
 * profundidade de campo. Tudo isso destrói a leitura de papel impresso,
 * que é a identidade do canal.
 *
 * Sem spring. Nenhum. Esta peça é uma contagem — mola faz a imagem
 * respirar e vira efeito. Velocidade constante é o que faz parecer
 * medida. A única exceção é a batida do soco ao assentar: 3 frames,
 * parada seca, sem retorno elástico.
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import timeline from './timeline.json';

// ---------------------------------------------------------------- tipos
type Quadro = [
  frame: number,
  escala: number,
  camX: number,
  camY: number,
  k: number,
  tintaGrade: number,
  opacFrase: number
];

type Soco = {n: number; x: number; y: number; w: number; h: number};

// ------------------------------------------------------------ constantes
const W = 1080;
const H = 1920;

/** Largura/altura da chapa onde os cem socos vivem. */
const CHAPA_W = 1400;
const CHAPA_H = 2100;

/** Onde a chapa é ancorada na tela. Vem do timeline.json. */
const CY_TELA = timeline.camera.cy_tela; // 900

/**
 * Perspectiva da câmera, em px. Valor alto = lente longa (pouca
 * distorção, parece teleobjetiva). Valor baixo = grande angular.
 * 1400 dá profundidade visível sem entortar os numerais das bordas.
 */
const PERSPECTIVA = 1400;

/** Altura da tinta sobre o papel, em px de mundo. */
const TINTA_Z_MIN = 5;
const TINTA_Z_MAX = 13;

/** De onde o soco vem voando, em Z. */
const SOCO_Z_PARTIDA = 520;
/** Quantos frames o soco leva do ar até assentar. */
const SOCO_VOO = 7;
/** A batida: 3 frames de recuo seco, sem mola. */
const SOCO_BATIDA = 3;

const TOTAL = timeline.formato.frames; // 783

// ------------------------------------------------------------- utilidades
const qd = timeline.quadros as unknown as Quadro[];
const socos = timeline.posicoes as unknown as Soco[];
const framesDoSoco = timeline.socos.frames as number[];

/** Z de repouso da tinta do soco n. Varia pra dar textura à paralaxe. */
const zDeRepouso = (n: number) =>
  TINTA_Z_MIN + ((n * 37) % 100) / 100 * (TINTA_Z_MAX - TINTA_Z_MIN);

/**
 * A `escala` do timeline é uma escala ortográfica. Em perspectiva, um
 * plano a distância z aparece escalado por P / (P − z). Invertendo:
 *
 *     z = P · (1 − 1/escala)
 *
 * Assim o dolly em Z reproduz EXATAMENTE o enquadramento que eu conferi
 * quadro a quadro, só que agora com profundidade de verdade.
 */
const zDaCamera = (escala: number) => PERSPECTIVA * (1 - 1 / escala);

// ============================================================== componente
export const ContagemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.max(0, Math.min(TOTAL - 1, Math.round(frame)));
  const [, escala, camX, camY, k, tintaGrade, opacFrase] = qd[f];

  const paginaZ = zDaCamera(escala);

  /**
   * ÓRBITA. Vai de −9°/+6° até zero ao longo da contagem e fica travada
   * em zero depois, pra página fechar chapada e legível.
   *
   * Linear, sem easing. A regra da casa é velocidade constante; o que
   * faz parecer caro aqui é paciência, não curva de aceleração.
   */
  const fimDaConta = timeline.marcos.conta[1]; // 518
  const giroY = interpolate(f, [0, fimDaConta], [-9, 0], {
    extrapolateRight: 'clamp',
  });
  const giroX = interpolate(f, [0, fimDaConta], [6, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#D6D1C6',
        backgroundImage: `url(${staticFile('papel.jpg')})`,
        backgroundSize: '2600px 2600px', // papel sem emenda, ladrilha limpo
        perspective: `${PERSPECTIVA}px`,
        perspectiveOrigin: `${W / 2}px ${CY_TELA}px`,
      }}
    >
      {/* ---------------------------------------------------- RIG DE CÂMERA
          Ordem importa: o CSS aplica da direita pra esquerda.
          rotate* primeiro gira a chapa em torno do próprio centro;
          translateZ depois faz o dolly. O inverso orbitaria a câmera
          em torno da origem e jogaria a página pra fora do quadro. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${paginaZ}px) rotateX(${giroX}deg) rotateY(${giroY}deg)`,
          transformOrigin: `${W / 2}px ${CY_TELA}px`,
        }}
      >
        {/* ------------------------------------------------------- A CHAPA
            O papel da chapa. Z = 0: é o plano de referência. */}
        <div
          style={{
            position: 'absolute',
            left: W / 2 - camX,
            top: CY_TELA - camY,
            width: CHAPA_W,
            height: CHAPA_H,
            transformStyle: 'preserve-3d',
            backgroundImage: `url(${staticFile('papel.jpg')})`,
            backgroundSize: '2600px 2600px',
          }}
        >
          {socos.map((s, i) => {
            const fEntra = framesDoSoco[i];
            if (f < fEntra - SOCO_VOO) return null;

            // --- voo: vem de +Z (perto da câmera) e assenta no papel
            const zRepouso = zDeRepouso(s.n);
            const voo = interpolate(
              f,
              [fEntra - SOCO_VOO, fEntra],
              [SOCO_Z_PARTIDA, zRepouso],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                // desacelera na chegada, mas NÃO volta: é impacto, não mola
                easing: Easing.out(Easing.quad),
              }
            );

            // --- batida: 3 frames afundando no papel, parada seca
            const batida =
              f >= fEntra && f < fEntra + SOCO_BATIDA
                ? interpolate(f, [fEntra, fEntra + SOCO_BATIDA], [-4, 0], {
                    extrapolateRight: 'clamp',
                  })
                : 0;

            // --- tinta: cheia ao cair, seca em 25 frames
            const secagem = interpolate(
              f,
              [fEntra, fEntra + timeline.socos.decaimento_frames],
              [timeline.socos.tinta_inicial, timeline.socos.tinta_final],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
            );
            const opacidade = secagem * tintaGrade;
            if (opacidade <= 0.004) return null;

            // enquanto voa, a tinta ainda não "existe" no papel: entra em 3 frames
            const aparicao = interpolate(
              f,
              [fEntra - SOCO_VOO, fEntra - SOCO_VOO + 3],
              [0, 1],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
            );

            return (
              <Img
                key={s.n}
                src={staticFile(`arq-${String(s.n).padStart(3, '0')}.png`)}
                style={{
                  position: 'absolute',
                  left: s.x,
                  top: s.y,
                  width: s.w,
                  height: s.h,
                  opacity: opacidade * aparicao,
                  transform: `translateZ(${voo + batida}px)`,
                  // nitidez: o navegador amolece PNG em 3D sem isso
                  imageRendering: 'auto',
                  backfaceVisibility: 'hidden',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------- CAMADAS CHAPADAS
          Rótulo, marcos e frase ficam FORA do 3D. Tipografia em
          perspectiva perde legibilidade, e num Short legibilidade ganha
          de profundidade sempre. */}
      <Img
        src={staticFile('cartela.png')}
        style={{position: 'absolute', left: 0, top: 0, width: W, height: H}}
      />

      {timeline.heros.map((h) => {
        const dentro = f >= h.frame && f < h.frame + h.frames;
        if (!dentro) return null;
        // o marco entra seco e sai seco: 2 frames cada ponta
        const op = interpolate(
          f,
          [h.frame, h.frame + 2, h.frame + h.frames - 2, h.frame + h.frames],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        return (
          <AbsoluteFill
            key={h.n}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              opacity: op,
            }}
          >
            <Img
              src={staticFile(h.peca)}
              style={{transform: `translateY(${CY_TELA - H / 2 - 230}px)`}}
            />
          </AbsoluteFill>
        );
      })}

      {opacFrase > 0.004 ? (
        <Img
          src={staticFile('frase.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            opacity: opacFrase,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
