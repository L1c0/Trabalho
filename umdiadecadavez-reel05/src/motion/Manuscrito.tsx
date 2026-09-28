import React, {useId} from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {curvas, fontes, tempo} from '../theme';
import {FiltroFalha} from '../texture/Falha';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Tempo = {de: number; dur: number};

// Tempo de cada palavra: proporcional às letras, com variação humana e a caneta levantando entre palavras.
export const temposManuscrito = (texto: string, inicio: number, semente: string) => {
  const m = tempo.manuscrito;
  let t = inicio;
  return texto.split(' ').map((palavra, i): Tempo => {
    const variacao = 1 + m.varia * (random(`${semente}-${i}`) * 2 - 1);
    const dur = Math.max(4, [...palavra].length * m.quadrosPorLetra * variacao);
    const de = t;
    t += dur + m.levantaCaneta;
    return {de, dur};
  });
};

export const fimManuscrito = (texto: string, inicio: number, semente: string) => {
  const ts = temposManuscrito(texto, inicio, semente);
  const ultimo = ts[ts.length - 1];
  return ultimo.de + ultimo.dur;
};

// Máscara de uma palavra: zigue-zague que a caneta percorre, revelado por stroke-dashoffset.
const mascara = (letras: number, p: number): React.CSSProperties => {
  if (p >= 1) return {};
  const z = Math.max(2, Math.round(letras * tempo.manuscrito.zigPorLetra));
  const pontos = Array.from({length: z * 2 + 1}, (_, i) => `${(i / 2).toFixed(2)},${i % 2 ? 10 : 0}`);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -1 ${z + 1} 12" preserveAspectRatio="none">` +
    `<path d="M${pontos.join(' L')}" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ` +
    `pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - p).toFixed(4)}"/></svg>`;
  const img = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return {maskImage: img, WebkitMaskImage: img, maskSize: '100% 100%', WebkitMaskSize: '100% 100%'};
};

// Letra humana não tem velocidade constante: acelera no meio da palavra, desacelera no fim,
// com uma pequena irregularidade própria de cada palavra.
const progressoDaMao = (t: number, semente: string) => {
  const base = curvas.mao(t);
  const tremor = 0.035 * Math.sin(Math.PI * 2 * t * (1.3 + random(semente))) * t * (1 - t);
  return Math.min(1, Math.max(0, base + tremor));
};

// MANUSCRITO: Caveat escrito palavra por palavra, com falha de caneta opcional.
export const Manuscrito: React.FC<{
  texto: string;
  inicio: number;
  tamanho: number;
  cor: string;
  semente: string;
  falha?: boolean;
  depois?: React.ReactNode; // o que vem colado ao fim da linha (ex.: o traço piscando)
  estilo?: React.CSSProperties;
}> = ({texto, inicio, tamanho, cor, semente, falha, depois, estilo}) => {
  const frame = useCurrentFrame();
  const id = `falha${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const palavras = texto.split(' ');
  const tempos = temposManuscrito(texto, inicio, semente);
  if (frame < inicio) return null;
  return (
    <div
      style={{
        fontFamily: fontes.mao,
        fontWeight: fontes.peso.mao,
        fontSize: tamanho,
        lineHeight: 1.15,
        color: cor,
        whiteSpace: 'nowrap',
        filter: falha ? `url(#${id})` : undefined,
        ...estilo,
      }}
    >
      {falha ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            <FiltroFalha id={id} />
          </defs>
        </svg>
      ) : null}
      {palavras.map((palavra, i) => {
        const {de, dur} = tempos[i];
        const t = interpolate(frame, [de, de + dur], [0, 1], clamp);
        const p = progressoDaMao(t, `${semente}-p${i}`);
        return (
          <React.Fragment key={i}>
            {i > 0 ? ' ' : null}
            <span
              style={{
                display: 'inline-block',
                padding: '0.12em 0.06em',
                margin: '-0.12em -0.06em',
                visibility: frame >= de ? 'visible' : 'hidden',
                ...mascara([...palavra].length, p),
              }}
            >
              {palavra}
            </span>
          </React.Fragment>
        );
      })}
      {depois}
    </div>
  );
};

// O traço em branco que fica piscando no fim da linha incompleta.
export const TracoPiscando: React.FC<{desde: number; largura: number; cor: string; semente: string}> = ({
  desde,
  largura,
  cor,
  semente,
}) => {
  const frame = useCurrentFrame();
  if (frame < desde) return null;
  const aceso = Math.floor((frame - desde) / tempo.manuscrito.pisca) % 2 === 0;
  const pontos = Array.from({length: 9}, (_, i) => `${((i / 8) * largura).toFixed(1)},${(6 + (random(`${semente}-${i}`) - 0.5) * 2).toFixed(1)}`);
  return (
    <svg
      width={largura}
      height={12}
      style={{display: 'inline-block', marginLeft: '0.3em', verticalAlign: 'baseline', visibility: aceso ? 'visible' : 'hidden'}}
    >
      <path d={`M${pontos.join(' L')}`} fill="none" stroke={cor} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};
