import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { cor } from '../theme';
import { FolhaImpressa } from '../lib/Folha';
import { golpe } from '../lib/movimentos';

const { fontFamily: oswald } = loadOswald();

/**
 * Capítulo 96, a contagem.
 *
 * Aqui mora a única tremida do vídeo inteiro, e ela é contada: um pulso
 * por soco, na cadência, decaindo soco a soco porque ele vai aguentando.
 * Shake aleatório viraria ruído de ação; shake metronômico É a contagem.
 *
 * O número entra na tela junto com o impacto e some em 8 frames. Quem
 * assistir vai contar junto sem perceber que está contando — e é por isso
 * que a frase do plano seguinte pesa.
 *
 * O quadro (v10b-soco-detalhe, 86% da largura, centrado) vem impresso na
 * folha "cs" da prensa, no papel dos socos. O golpe move a folha inteira:
 * é a câmera que treme, não a tinta que escorrega no papel.
 */
export const CemSocos: React.FC = () => {
  const frame = useCurrentFrame();

  const OPTS = { inicio: 24, intervalo: 14, n: 10, forca: 30, decaimento: 0.9 };
  const g = golpe(frame, OPTS);

  // o número que acabou de bater
  const idx = Math.max(0, g.soco - 1);
  const nascimento = OPTS.inicio + idx * OPTS.intervalo;
  const vidaNumero = interpolate(frame, [nascimento, nascimento + 8], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // entrada seca, sem fade longo: a tinta do quadro chega em 7 frames
  const entrada = interpolate(frame, [0, 7], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <FolhaImpressa id="cs" estado={1} tinta={entrada} transform={`translate(${g.x}px, ${g.y}px)`} />

      {/* a contagem, canto inferior esquerdo, ancorada na grade da casa */}
      {g.soco > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 240,
            bottom: 150,
            fontFamily: oswald,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 0.9,
            color: cor.tinta,
            opacity: 0.25 + vidaNumero * 0.75,
            transform: `translate(${g.x * 0.4}px, ${g.y * 0.4}px)`,
          }}
        >
          {g.soco}
        </div>
      )}
    </AbsoluteFill>
  );
};
