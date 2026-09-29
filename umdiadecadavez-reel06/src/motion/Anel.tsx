import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cores, tempo} from '../theme';
import {escalaX, estadoNo, type EstadoDoAnel, type Quadro} from './trajeto';

// O ANEL. Um círculo de caneta que gira com uma transformada só: scaleX = cos(giro · π).
// A escala é aplicada à geometria, não ao traço: de perfil ele vira uma linha vertical
// com a espessura da caneta, não some.
//
// PRESSÃO DE CANETA: o traço é uma sequência de segmentos curtos com ponta redonda,
// cada um com sua espessura — 7 px na lateral, 4 px no topo e na base, e +2 px onde
// o círculo fecha (a caneta desacelera e a tinta acumula).

const a = tempo.anel;
const INICIO = -Math.PI / 2; // o desenho começa no topo

const espessura = (theta: number) => {
  const lateral = Math.abs(Math.cos(theta));
  // distância angular até o ponto de fechamento (o topo)
  const d = Math.atan2(Math.sin(theta - INICIO), Math.cos(theta - INICIO));
  return a.tracoTopo + (a.tracoLateral - a.tracoTopo) * lateral + a.acumulo * Math.exp(-((d / 0.16) ** 2));
};

// DESENHO INICIAL com velocidade irregular: acelera na lateral, desacelera ao fechar.
// Tabela tempo → fração do círculo, integrando 1/velocidade ao longo do ângulo.
const TABELA = (() => {
  const n = 400;
  const t: number[] = [0];
  for (let i = 1; i <= n; i++) {
    const s = i / n;
    const theta = INICIO + s * 2 * Math.PI;
    const velocidade = (0.55 + 0.9 * Math.abs(Math.cos(theta))) * (1 - 0.65 * s ** 4);
    t.push(t[i - 1] + 1 / velocidade);
  }
  const total = t[n];
  return t.map((v) => v / total);
})();
const fracaoDesenhada = (p: number) => {
  if (p >= 1) return 1;
  let i = 0;
  while (i < TABELA.length - 1 && TABELA[i + 1] < p) i++;
  const [t0, t1] = [TABELA[i], TABELA[i + 1]];
  return (i + (p - t0) / (t1 - t0)) / (TABELA.length - 1);
};

// Um anel num estado, sem tempo. `fracao` é quanto do círculo já foi desenhado.
export const AnelDesenho: React.FC<{e: EstadoDoAnel; cor: string; fracao?: number; opacidade?: number}> = ({e, cor, fracao = 1, opacidade = 1}) => {
  const {width, height} = useVideoConfig();
  const sx = escalaX(e.giro);
  const n = a.segmentos;
  const ate = Math.round(n * fracao);
  const ponto = (i: number) => {
    const th = INICIO + (i / n) * 2 * Math.PI;
    return [e.x + sx * e.raio * Math.cos(th), e.y + e.raio * Math.sin(th)] as const;
  };
  const segmentos = [];
  for (let i = 0; i < ate; i++) {
    const [x0, y0] = ponto(i);
    const [x1, y1] = ponto(i + 1);
    const th = INICIO + ((i + 0.5) / n) * 2 * Math.PI;
    segmentos.push(
      <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={cor} strokeWidth={espessura(th) * e.traco} strokeLinecap="round" />,
    );
  }
  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, opacity: opacidade, overflow: 'visible'}}>
      {segmentos}
    </svg>
  );
};

// O anel seguindo um trajeto de quadros-chave: desenho inicial, giro, rastro e clarão.
export const Anel: React.FC<{
  trajeto: readonly Quadro[];
  cor: string;
  desenha?: number; // frame em que o desenho inicial começa
  de?: number; // aparece a partir daqui (sem desenho)
  ate?: number;
}> = ({trajeto, cor, desenha, de, ate = Infinity}) => {
  const frame = useCurrentFrame();
  const inicio = desenha ?? de ?? -Infinity;
  if (frame < inicio || frame >= ate) return null;
  const e = estadoNo(trajeto, frame);
  const fracao = desenha === undefined ? 1 : fracaoDesenhada(interpolate(frame, [desenha, desenha + a.desenho], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  // RASTRO: só enquanto o anel gira; as cópias ficam nas posições de 4, 8 e 12 frames atrás
  const girando = Math.abs(estadoNo(trajeto, frame - 1).giro - e.giro) > 1e-6;
  const rastro = girando
    ? a.rastro.map((r) => ({e: estadoNo(trajeto, Math.max(inicio, frame - r.atras)), opacidade: r.opacidade}))
    : [];

  // CLARÃO: nos 2 frames em que o giro atravessa o perfil, a borda acende
  const perfil = (g: number) => Math.floor(g - 0.5);
  const g0 = estadoNo(trajeto, frame - 1).giro;
  const g1 = estadoNo(trajeto, frame + 1).giro;
  const clarao = girando && perfil(g0) !== perfil(g1);

  return (
    <>
      {rastro.map((r, i) => (
        <AnelDesenho key={i} e={r.e} cor={cor} opacidade={r.opacidade} />
      ))}
      <AnelDesenho e={clarao ? {...e, traco: e.traco * 1.25} : e} cor={clarao ? cores.metal : cor} fracao={fracao} />
    </>
  );
};
