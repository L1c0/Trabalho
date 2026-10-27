import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import tl from '../data/timeline/3-sagas.json';
import { Legenda } from '../lib/Legenda';
import { Chapa, Papel } from '../lib/Papel';
import { type Batida, escalaBatida, impacto, lerp, passo, tremor } from '../lib/movimento';
import { type Camada, ativa, centroTinta } from '../lib/timeline';

/**
 * 3 · AS DUAS SAGAS — sobrepõe. 1257 frames. Tudo sai de timeline/3-sagas.json.
 *
 * As camadas são 1080x1920 já posicionadas (âncora de quadro em 0,0). As
 * duas colunas vivem em planos diferentes sob perspective 2400: a esquerda
 * em translateZ 0, a direita em -40 (os planos do JSON), e a câmera deriva
 * 2% da largura ao longo dos 42 s. Em 282 uma cópia de dir-140 a 0,85 de
 * tinta desce fora de registro: de 1,03 a 1,00 enquanto anda -468, +19 em
 * 21 frames, e pousa com batida em cima do 60 (o original fica na coluna).
 * Em 432, o mesmo com o crédito. Em 627 as colunas recuam (0,94, tinta
 * 0,45, em 27 frames) e haukr entra em 636 de 1,08 em 4 frames. Entre os
 * eventos, o empurrão de 2% a cada 10 s do LEIA-PRIMEIRO (o JSON não fala
 * de empurrão).
 */
const T = tl as unknown as {
  fundo: string;
  frames: number;
  perspective: number;
  deriva_lateral_pct: number;
  planos: Record<string, number>;
  camadas: Camada[];
  recuo_das_colunas: { frame: number; escala: number; tinta: number; frames: number };
};
const R = T.recuo_das_colunas;
const DERIVA = (T.deriva_lateral_pct / 100) * 1080;
const EMPURRAO = 0.02 / 300;
/** o nome que chega não recua com as colunas: é quem está sendo lido */
const NOME = T.camadas.find((c) => c.efeito === 'batida')!;
/** o JSON não dá a tremida destas batidas: a de uma batida comum */
const TREMIDA = 3;
/** cada desregistro pousa com batida, e o nome bate ao chegar */
const BATIDAS: Batida[] = T.camadas
  .filter((c) => c.efeito === 'desregistro' || c.efeito === 'batida')
  .map((c) => (c.efeito === 'desregistro' ? c.entra + c.frames! - 1 : impacto(c.entra, c.batida_frames)))
  .sort((a, b) => a - b)
  .map((i, k): Batida => [i, TREMIDA, k % 2 ? -1 : 1]);

/** um plano da mesa: a deriva anda no espaço, antes da perspectiva; o recuo encolhe em volta do centro da lente */
const Plano: React.FC<{ z: number; deriva: number; recuo: number; children: React.ReactNode }> = ({ z, deriva, recuo, children }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transformOrigin: '540px 960px',
      transform: `translateX(${deriva}px) translateZ(${z}px) scale(${lerp(1, R.escala, recuo)})`,
      opacity: lerp(1, R.tinta, recuo),
    }}
  >
    {children}
  </div>
);

export const Sagas: React.FC = () => {
  const f = useCurrentFrame();
  const dx = tremor(f, BATIDAS);
  const emp = 1 + EMPURRAO * f;
  const deriva = lerp(-DERIVA / 2, DERIVA / 2, f / (T.frames - 1));
  const r = f < R.frame ? 0 : passo(f, R.frame, R.frames);

  const desenha = (c: Camada) => {
    if (c.efeito === 'desregistro') {
      const u = passo(f, c.entra, c.frames!);
      return (
        <Chapa
          src={c.arquivo}
          style={{
            transformOrigin: centroTinta(c.arquivo),
            transform: `translate(${c.dx! * u}px, ${c.dy! * u}px) scale(${lerp(c.escala_de!, 1, u)})`,
            opacity: c.tinta,
          }}
        />
      );
    }
    if (c.efeito === 'batida') {
      const s = escalaBatida(f, c.entra, c.batida_frames, c.escala_de);
      return <Chapa src={c.arquivo} style={{ transformOrigin: centroTinta(c.arquivo), transform: `scale(${s})` }} />;
    }
    return <Chapa src={c.arquivo} />;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 960px', transform: `translateX(${dx}px) scale(${emp})` }}>
        <div style={{ position: 'absolute', inset: 0, perspective: `${T.perspective}px`, perspectiveOrigin: '540px 960px' }}>
          <Plano z={0} deriva={deriva} recuo={0}>
            <Papel src={T.fundo} />
          </Plano>
          {T.camadas.map((c, k) =>
            ativa(c, f) ? (
              <Plano key={k} z={T.planos[c.arquivo] ?? 0} deriva={deriva} recuo={c === NOME ? 0 : r}>
                {desenha(c)}
              </Plano>
            ) : null,
          )}
        </div>
      </div>
      <Legenda short="3-sagas" />
      <Audio src={staticFile('audio/mix-3-sagas.flac')} />
    </AbsoluteFill>
  );
};
