import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import tl from '../data/timeline/2-anel.json';
import { Legenda } from '../lib/Legenda';
import { Centro, Chapa } from '../lib/Papel';
import { lerp, prog } from '../lib/movimento';
import { type Camada, type Ponto, ativa, curva } from '../lib/timeline';

/**
 * 2 · O ANEL — atravessa. 1261 frames. Uma tomada só, nenhum corte.
 * Tudo sai de timeline/2-anel.json.
 *
 * A chapa alta (1080x9000) é percorrida por uma janela de 1920 de altura na
 * posição camera_y do JSON, sem mudar de escala. Ela vive num plano
 * inclinado 5° sob a lente (perspective 2600): a borda de baixo passa mais
 * rápido que a de cima. De 0 a 660 a câmera quase não anda (y de 0 a 60);
 * de 660 a 915 a travessia é linear, com deriva lateral de 1,5% da largura,
 * e para seco. Em cada tique o contador corta para o ano seguinte com 1 px
 * de solavanco. Depois da parada, o empurrão de 1,00 a 1,03 até o fim.
 *
 * A inclinação gira em torno da linha de medição: o ponto da chapa na linha
 * é sempre camera_y + linha, e cada borda cruza no frame que o JSON dá.
 */
const T = tl as unknown as {
  chapa: { arquivo: string; largura: number; altura: number; rotateX_graus: number; perspective: number; deriva_lateral_pct: number };
  camera_y: Ponto[];
  tiques_frames: number[];
  empurrao_final: { de_frame: number; ate_frame: number; escala_de: number; escala_ate: number };
  camadas: Camada[];
};
const C = T.chapa;
const LINHA = chapas.anel.linha;
/** a chapa estendida com espelho (preparar.py): a borda de cima, inclinada, recua e abriria os cantos */
const P = chapas.pad_anel;
const TRAVESSIA = { ini: T.tiques_frames[0], fim: T.tiques_frames[T.tiques_frames.length - 1] };
const DERIVA = (C.deriva_lateral_pct / 100) * C.largura;
const E = T.empurrao_final;

export const Anel: React.FC = () => {
  const f = useCurrentFrame();
  const y = curva(T.camera_y, 'y', f);
  const deriva = lerp(-DERIVA / 2, DERIVA / 2, prog(f, TRAVESSIA.ini, TRAVESSIA.fim - TRAVESSIA.ini));
  const emp = lerp(E.escala_de, E.escala_ate, prog(f, E.de_frame, E.ate_frame - E.de_frame));
  return (
    <AbsoluteFill style={{ backgroundColor: chapas.legenda['2-anel'] }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `540px ${LINHA}px`, transform: `scale(${emp})` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            perspective: `${C.perspective}px`,
            perspectiveOrigin: '540px 960px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1080,
              height: 1920,
              transformOrigin: `540px ${LINHA}px`,
              transform: `translateX(${deriva}px) rotateX(${C.rotateX_graus}deg)`,
            }}
          >
            <Img
              src={staticFile(C.arquivo.replace('.jpg', '-ext.jpg'))}
              style={{ position: 'absolute', left: -P, top: -y - P, width: C.largura + 2 * P, height: C.altura + 2 * P }}
            />
          </div>
        </div>
        {T.camadas.map((c) => {
          if (!ativa(c, f)) return null;
          if (c.ancora === 'quadro') return <Chapa key={c.arquivo} src={c.arquivo} />;
          // corte: o ano seguinte entra 1 px fora do lugar e volta no frame seguinte
          const solavanco = f === c.entra && c.entra > 0 ? (c.solavanco_px ?? 0) : 0;
          return <Centro key={c.arquivo} src={c.arquivo} x={c.x!} y={c.y! + solavanco} />;
        })}
      </div>
      <Legenda short="2-anel" />
      <Audio src={staticFile('audio/mix-2-anel.flac')} />
    </AbsoluteFill>
  );
};
