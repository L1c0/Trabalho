import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import eventos from '../data/eventos.json';
import { Legenda } from '../lib/Legenda';
import { Chapa, Papel } from '../lib/Papel';
import { type Batida, escalaBatida, lerp, prog, tremor } from '../lib/movimento';

/**
 * 3 · AS DUAS SAGAS — sobrepõe. 1257 frames.
 *
 * Duas fontes que não ocupam o mesmo plano. A coluna da direita (a Saga de
 * Erik) está mais funda: menor (translateZ -40 em perspective 2400) e
 * andando menos na deriva lateral, então as duas colunas se separam
 * devagar ao longo dos 42 s.
 *
 * Em "cento e quarenta" a chapa da direita desce em Z (1,03 a 1,00)
 * atravessando 468 px até cair, fora de registro, em cima de "sessenta
 * homens", e pousa com batida: onde as duas discordam, a tinta sobrepõe.
 * O mesmo com o crédito, em "outras pessoas". Em "Haukr" as colunas
 * inteiras recuam (0,94, tinta 0,45) e o nome vem de 1,08 para 1,00.
 * A câmera nunca para: empurrão de 2% a cada 10 s.
 */
const E = eventos['3-sagas'];
const T = chapas.sagas as unknown as Record<string, { cx: number; cy: number }>;
const FRAMES = 1257;
/** a câmera empurra em volta do meio do conteúdo (cabeçalho a "200 anos") */
const ORIGEM = '540px 745px';
/** profundidade da coluna da direita: translateZ -40 em perspective 2400 */
const FUNDO = 2400 / (2400 + 40);
/** deriva da câmera: 2% da largura em 42 s. A coluna funda anda 35% disso
 * (paralaxe exagerada de propósito: com -40 de profundidade de verdade a
 * separação seria de 0,35 px, invisível) */
const DERIVA = 0.02 * 1080;
const DERIVA_FUNDO = 0.35;
/** a divisória termina logo abaixo de "200 anos": embaixo é a faixa da legenda */
const FIM_DIVISORIA = 1250;

const BATIDAS: Batida[] = [
  [E.esq60, 2, 1],
  [E.dir140.l, 3, -1],
  [E.esqcred, 2, 1],
  [E.dircred.l, 3, -1],
  [E.anos, 2, 1],
];

/** batida de chegada de uma chapa (1,18 a 1,00 em 3 frames) em volta da tinta */
const Chega: React.FC<{ nome: string; i: number; f: number }> = ({ nome, i, f }) => {
  const s = escalaBatida(f, i);
  if (s === null) return null;
  return <Chapa src={`3-sagas/${nome}.png`} style={{ transformOrigin: `${T[nome].cx}px ${T[nome].cy}px`, transform: `scale(${s})` }} />;
};

/** o desregistro: a chapa da direita desce em Z e atravessa até a da esquerda */
const Desce: React.FC<{ nome: string; ev: { a: number; l: number; dx: number; dy: number }; f: number }> = ({ nome, ev, f }) => {
  if (f < ev.a) return null;
  const u = prog(f, ev.a, ev.l - ev.a);
  return (
    <Chapa
      src={`3-sagas/${nome}.png`}
      style={{
        transformOrigin: `${T[nome].cx}px ${T[nome].cy}px`,
        transform: `translate(${ev.dx * u}px, ${ev.dy * u}px) scale(${lerp(1.03, 1, u)})`,
      }}
    />
  );
};

export const Sagas: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FRAMES;
  const emp = 1 + 0.002 * (f / 30);
  const dx = tremor(f, BATIDAS);
  // o recuo das colunas quando o nome chega
  const r = prog(f, E.haukr - 2, 8);
  const recuo: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transformOrigin: ORIGEM,
    transform: `scale(${lerp(1, 0.94, r)})`,
    opacity: lerp(1, 0.45, r),
  };
  const sHaukr = f >= E.haukr - 2 ? lerp(1.08, 1, prog(f, E.haukr - 2, 8)) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
        {/* a coluna funda: o papel, a divisória, a Saga de Erik e o fato comum */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: ORIGEM,
            transform: `translateX(${DERIVA * DERIVA_FUNDO * t}px) scale(${emp * FUNDO})`,
          }}
        >
          <Papel nome="papel-sagas" />
          <div style={recuo}>
            <Chapa src="3-sagas/divisor.png" style={{ clipPath: `inset(0 0 ${1920 - FIM_DIVISORIA}px 0)` }} />
            <Chapa src="3-sagas/cabecalho.png" style={{ clipPath: 'inset(0 0 0 540px)' }} />
            <Chega nome="200-anos" i={E.anos} f={f} />
          </div>
        </div>
        {/* a coluna da frente: a Saga dos Groenlandeses, e onde as chapas da direita caem */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: ORIGEM,
            transform: `translateX(${DERIVA * t}px) scale(${emp})`,
          }}
        >
          <div style={recuo}>
            <Chapa src="3-sagas/cabecalho.png" style={{ clipPath: 'inset(0 540px 0 0)' }} />
            <Chega nome="esq-60" i={E.esq60} f={f} />
            <Chega nome="esq-credito" i={E.esqcred} f={f} />
            <Desce nome="dir-140" ev={E.dir140} f={f} />
            <Desce nome="dir-credito" ev={E.dircred} f={f} />
          </div>
          {sHaukr !== null && (
            <Chapa
              src="3-sagas/haukr.png"
              style={{ transformOrigin: `${T.haukr.cx}px ${T.haukr.cy}px`, transform: `scale(${sHaukr})` }}
            />
          )}
        </div>
      </div>
      <Legenda short="3-sagas" />
      <Audio src={staticFile('audio/mix-3-sagas.flac')} />
    </AbsoluteFill>
  );
};
