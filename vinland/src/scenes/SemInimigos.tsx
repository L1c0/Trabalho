import React from 'react';
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadGaramond } from '@remotion/google-fonts/EBGaramond';
import { cor } from '../theme';
import { FolhaImpressa, meta } from '../lib/Folha';

const { fontFamily: oswald } = loadOswald();
// EB Garamond, não Cormorant: o briefing trocou a fonte por causa dos
// acentos, e "INVENCÍVEL" tem um agudo em cima de maiúscula
const { fontFamily: garamond } = loadGaramond('normal', { weights: ['700'] });

/* --- medidas do balão, tiradas da própria PNG, não do olho ---------- *
 * v11-sem-inimigos.png é 1528x2082. O balão foi localizado por
 * componente conexo branco: centro em 78,8% x / 21,4% y, 20,2% de
 * largura, 14,4% de altura. Se trocar o recorte da página, remedir.      */
const BALAO = { cx: 0.788, cy: 0.214, w: 0.202, h: 0.144 };
const PANEL = { w: 1528, h: 2082 };

const FALA = ['EU', 'NÃO', 'TENHO', 'INIMIGOS'];

/**
 * Capítulo 96. O plano que o vídeo inteiro existe pra chegar.
 *
 * Dois tempos, e o segundo resolve um problema real: balão de mangá é
 * pequeno. Letra dentro dele, em 1920x1080, dá uns 20px — honesto na
 * página, ilegível no celular, que é onde o público está.
 *
 * Então a câmera entra NO balão. Beat A mostra o homem inteiro cercado
 * de lanças, balão vazio. Beat B escala 3x com a origem ancorada no
 * balão, e aí a fala entra palavra por palavra em tamanho que se lê no
 * ônibus. O recurso é de quadrinho, não de editor.
 *
 * `inicioFala`: quadro (local) em que a primeira palavra cai. Sozinha a
 * cena usa 164; no filme ela entra na pausa depois de "soco." e a fala tem
 * que cair no 7042, então o beat A fica mais curto. A mola da câmera
 * sempre começa 52 quadros antes da fala (46 de mola + 6 pra assentar),
 * como na cena original.
 */
export const SemInimigos: React.FC<{ inicioFala?: number }> = ({ inicioFala = 164 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const inicioCamera = inicioFala - 52;

  /* --- geometria do quadro na tela --------------------------------- */
  const alturaQuadro = height * 0.92;
  const larguraQuadro = alturaQuadro * (PANEL.w / PANEL.h);
  // quadro retrato não preenche 16:9. Em vez de fingir que preenche,
  // joga pra esquerda e usa o papel vazio da direita como composição.
  const esq = width * 0.10;
  const topo = (height - alturaQuadro) / 2;

  const balaoX = esq + BALAO.cx * larguraQuadro;
  const balaoY = topo + BALAO.cy * alturaQuadro;

  /* --- beat A: têmpera + empurrão imperceptível --------------------- *
   * a têmpera da casa (contraste 0,42 -> 1 e opacidade em 12 quadros) é
   * feita deixando o papel da folha por cima: só a tinta muda de força  */
  const tt = Math.min(1, Math.max(0, frame / 12));
  const tinta = Math.min(1, tt * 2.6) * (0.42 + 0.58 * tt);
  const empurra = 1 + interpolate(frame, [0, inicioCamera - 2], [0, 0.02], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* --- beat B: a câmera entra no balão ------------------------------ *
   * spring com damping 120 / stiffness 42: chega e para. Overshoot num
   * movimento de câmera em cima de rosto arrebentado vira comédia.      */
  const entrada = spring({
    frame: frame - inicioCamera,
    fps,
    config: { damping: 120, stiffness: 42, mass: 1.6 },
    durationInFrames: 46,
  });

  /* O balão NÃO vai pro centro. Vai pra 74% x / 40% y, e a escala sobe
   * até 3,6. Esses dois números foram escolhidos juntos pra que o quadro
   * cubra os 1920x1080 inteiros no fim do movimento — centralizar o balão
   * deixava uma faixa de papel nu à direita, que lia como erro de corte.
   * Com esse destino, entra a cabeça dele à esquerda e o balão à direita,
   * e a tela fecha. */
  const escala = empurra + entrada * 2.6;            // 1,02 -> 3,62
  const dx = entrada * (width * 0.74 - balaoX);
  const dy = entrada * (height * 0.40 - balaoY);

  /* --- o balão clareia conforme a câmera chega ---------------------- */
  const luzBalao = interpolate(entrada, [0.25, 0.85], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* --- lettering: uma palavra a cada 11 frames ---------------------- *
   * O corpo é 15px no espaço do quadro, NÃO dividido pela escala. Ou
   * seja: a letra é do tamanho que letra de balão tem (15px num balão de
   * 147px) e cresce junto com a câmera, chegando em ~45px na tela. É
   * autêntico no começo e legível no fim, sem truque.                    */
  const corpo = 15;

  // a folha "si" tem o quadro exatamente onde a cena punha a PNG; a origem
  // da câmera é o balão, em coordenadas da folha (que tem sangria em volta)
  const m = meta('si');
  const ox = balaoX - (960 - m.uw / 2);
  const oy = balaoY - (540 - m.uh / 2);

  return (
    <AbsoluteFill>
      <FolhaImpressa
        id="si"
        estado={1}
        tinta={tinta}
        transform={`translate(${dx}px, ${dy}px) scale(${escala})`}
        transformOrigin={`${ox}px ${oy}px`}
      />

      {/* --- a fala, ancorada no balão e levada junto pela câmera --- */}
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(${escala})`,
          transformOrigin: `${balaoX}px ${balaoY}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: balaoX - (BALAO.w * larguraQuadro) / 2,
            top: balaoY - (BALAO.h * alturaQuadro) / 2,
            width: BALAO.w * larguraQuadro,
            height: BALAO.h * alturaQuadro,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* a luz do balão: levanta o interior pra tinta cravar */}
          <div
            style={{
              position: 'absolute',
              inset: '-4%',
              borderRadius: '50%',
              backgroundColor: cor.papel,
              opacity: luzBalao * 0.55,
            }}
          />
          {FALA.map((p, i) => {
            const nasce = inicioFala + i * 11;
            // tinta entrando: opacidade + o traço fechando de borrado pra seco
            const a = interpolate(frame, [nasce, nasce + 9], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            // sangria de tinta: 0,8px no espaço do quadro, ~2,4px na tela
            const borrao = (1 - a) * 0.8;
            return (
              <span
                key={p}
                style={{
                  fontFamily: oswald,
                  fontWeight: 600,
                  fontSize: corpo,
                  lineHeight: 1.04,
                  position: 'relative',
                  letterSpacing: '0.01em',
                  color: cor.tinta,
                  opacity: a * luzBalao,
                  filter: `blur(${borrao}px)`,
                }}
              >
                {p}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* --- crédito de fonte, no papel vazio da direita --------------- *
       * O canal vende pesquisa. Dizer o capítulo na tela custa quatro
       * palavras e é o sinal mais barato de que o vídeo foi conferido.
       * Sai de cena quando a câmera entra no balão.                       */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.60,
          top: height * 0.40,
          // some no primeiro terço da mola: o balão passa por cima de onde
          // o crédito estava, e o crédito meio apagado aparecia DENTRO dele
          opacity: Math.max(0, 1 - entrada * 3) * interpolate(frame, [14, 34], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: oswald, fontWeight: 500, fontSize: 25,
            letterSpacing: '0.17em', color: cor.fraco,
          }}
        >
          CAPÍTULO 96
        </div>
        <div
          style={{
            width: 190, height: 2, backgroundColor: cor.tinta,
            margin: '20px 0 22px',
          }}
        />
        <div
          style={{
            fontFamily: garamond, fontWeight: 700, fontSize: 74,
            color: cor.tinta, lineHeight: 1,
          }}
        >
          INVENCÍVEL
        </div>
      </div>
    </AbsoluteFill>
  );
};
