import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import eventos from '../data/eventos.json';
import { Legenda } from '../lib/Legenda';
import { Chapa } from '../lib/Papel';
import { lerp, prog } from '../lib/movimento';

/**
 * 2 · O ANEL — atravessa. 1261 frames. Uma tomada só, nenhum corte.
 *
 * A chapa alta (1080x9000, impressa uma vez) vive num plano inclinado 5° sob
 * a lente (perspective 2600): a borda de baixo passa mais rápido que a de
 * cima. Os 22 segundos do começo quase parados (y de 0 a 60); depois a
 * travessia em velocidade constante, sem easing em ponta nenhuma, com deriva
 * lateral de 1,5% da largura; cada borda que cruza a linha troca o contador
 * (corte, 1 px de solavanco). Na 28ª o movimento para seco em 1021, e a
 * câmera empurra 3% em 11 s.
 *
 * A inclinação gira em torno da linha de medição (y=980): o ponto da chapa
 * que está na linha é sempre y + 980, então o cruzamento de cada borda não
 * depende da perspectiva.
 *
 * As faixas escuras da chapa ocupam a largura toda: passando por trás da
 * legenda (escura, #2A2622), apagavam a legenda. A chapa atravessa numa
 * janela até y=1300; embaixo fica uma faixa de papel fixa com a legenda,
 * como na página de catálogo do Houseki.
 */
const E = eventos['2-anel'];
/** a chapa cobre o quadro inteiro mesmo inclinada e com a deriva */
const COBRE = 1.06;
/** o contador fica logo abaixo da linha: no fim, é o único vão sem faixa escura atrás dele */
const CONTADOR = { x: 560, y: 927 };
/** onde a janela da chapa termina e começa a faixa de papel da legenda */
const JANELA = 1300;

export const Anel: React.FC = () => {
  const f = useCurrentFrame();
  const y =
    f <= E.ini ? lerp(0, E.y_ini, f / E.ini) : f <= E.fim ? E.y_ini + E.v * (f - E.ini) : E.y_fim;
  const deriva = lerp(-E.deriva / 2, E.deriva / 2, prog(f, E.ini, E.fim - E.ini));
  const emp = 1 + E.empurrao.ganho * prog(f, E.empurrao.ini, E.empurrao.fim - E.empurrao.ini);
  // quantas bordas já cruzaram a linha neste frame
  const cruzadas = E.tiques.filter((t) => t <= f).length;
  const ano = 993 + cruzadas;
  const solavanco = E.tiques.some((t) => Math.ceil(t) === f) ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <Img
        src={staticFile('comum/papel-anel.jpg')}
        style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, clipPath: `inset(${JANELA}px 0 0 0)` }}
      />
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 ${1920 - JANELA}px 0)` }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 980px', transform: `scale(${emp})` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            perspective: '2600px',
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
              transformOrigin: `540px ${E.linha}px`,
              transform: `translateX(${deriva}px) rotateX(5deg) scale(${COBRE})`,
            }}
          >
            <Img
              src={staticFile('2-anel/anel-9000.jpg')}
              style={{ position: 'absolute', left: 0, top: -y, width: 1080, height: 9000 }}
            />
          </div>
        </div>
        <Chapa src="2-anel/regua.png" />
        <Img
          src={staticFile(`2-anel/ano-${ano}.png`)}
          style={{ position: 'absolute', left: CONTADOR.x, top: CONTADOR.y + solavanco, width: 520, height: 270 }}
        />
      </div>
      </div>
      <Legenda short="2-anel" />
      <Audio src={staticFile('audio/mix-2-anel.flac')} />
    </AbsoluteFill>
  );
};
