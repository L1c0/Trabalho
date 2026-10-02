import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {curvas, tempo} from '../theme';
import {Sangramento} from '../texture/Sangramento';
import {Manuscrito} from './Manuscrito';

// A BALANÇA, desenhada a traço contínuo, peça por peça:
//   1. haste vertical, de baixo para cima
//   2. travessão, do centro para fora nos dois lados
//   3. corda esquerda + prato esquerdo
//   4. corda direita + prato direito
// `inclinacao` (-1 a 1) gira o travessão em torno do pivô, até 14°. Os pratos NÃO giram:
// ficam na horizontal, pendurados, e sobem ou descem com a corda, que estica e encurta.
// A espessura do traço varia com a velocidade da mão: fina onde ela corre, 7 px onde
// ela desacelera e a tinta acumula.

type P = readonly [number, number];
const b = tempo.balanca;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const linha = (a: P, c: P, n = 16): P[] => Array.from({length: n + 1}, (_, i) => [a[0] + ((c[0] - a[0]) * i) / n, a[1] + ((c[1] - a[1]) * i) / n] as const);
const bojo = (esq: P, dir: P, fundo: number, n = 24): P[] =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const meio: P = [(esq[0] + dir[0]) / 2, esq[1] + fundo * 2];
    return [(1 - t) ** 2 * esq[0] + 2 * (1 - t) * t * meio[0] + t ** 2 * dir[0], (1 - t) ** 2 * esq[1] + 2 * (1 - t) * t * meio[1] + t ** 2 * dir[1]] as const;
  });

// Um traço desenhado até a fração `q`, com espessura dependendo de onde a caneta está.
const Traco: React.FC<{pts: readonly P[]; q: number; cor: string; escala: number}> = ({pts, q, cor, escala}) => {
  if (q <= 0) return null;
  const n = pts.length - 1;
  const ate = q * n;
  const segs = [];
  for (let i = 0; i < Math.ceil(ate); i++) {
    const fim = Math.min(1, ate - i);
    const a = pts[i];
    const c = pts[i + 1];
    const s = (i + 0.5) / n;
    // a velocidade da mão (ease in-out) é máxima no meio do traço: ali o traço afina
    const largura = (b.tracoMax - (b.tracoMax - b.tracoMin) * Math.sin(Math.PI * s)) * escala;
    segs.push(<line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (c[0] - a[0]) * fim} y2={a[1] + (c[1] - a[1]) * fim} stroke={cor} strokeWidth={largura} strokeLinecap="round" />);
  }
  return <>{segs}</>;
};

export type TextoDoPrato = {texto: string; de: number; tamanho: number};

// A geometria da balança num estado (pivô, escala, inclinação), em pixels da tela.
export const geometria = (x: number, y: number, escala: number, inclinacao: number) => {
  const ang = (inclinacao * b.anguloMax * Math.PI) / 180;
  const braco = b.braco * escala;
  const pontas = {
    esq: [x - braco * Math.cos(ang), y - braco * Math.sin(ang)] as P,
    dir: [x + braco * Math.cos(ang), y + braco * Math.sin(ang)] as P,
  };
  // a corda do lado que desce estica, a do lado que sobe encurta
  const corda = (lado: 1 | -1) => {
    const v = lado * inclinacao;
    return (b.corda + (v > 0 ? b.estica : b.encurta) * v) * escala;
  };
  const prato = (lado: 1 | -1) => {
    const ponta = lado === 1 ? pontas.dir : pontas.esq;
    const yBorda = ponta[1] + corda(lado);
    const meia = (b.pratoLargura / 2) * escala;
    return {ponta, esq: [ponta[0] - meia, yBorda] as P, dir: [ponta[0] + meia, yBorda] as P, centro: ponta[0], borda: yBorda};
  };
  return {pontas, base: [x, y + b.altura * escala] as P, topo: [x, y - 24 * escala] as P, prato};
};

export const Balanca: React.FC<{
  x: number; // o pivô
  y: number;
  escala?: number;
  inclinacao: number;
  desenha: number; // frame em que a primeira peça começa
  cor: string;
  esquerda?: TextoDoPrato;
  direita?: TextoDoPrato;
}> = ({x, y, escala = 1, inclinacao, desenha, cor, esquerda, direita}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  if (frame < desenha) return null;
  const g = geometria(x, y, escala, inclinacao);
  const t1 = desenha;
  const t2 = t1 + b.haste;
  const t3 = t2 + b.travessao;
  const t4 = t3 + b.prato;
  const progresso = (de: number, dur: number) => interpolate(frame, [de, de + dur], [0, 1], {...clamp, easing: curvas.mao});
  const pratoTraco = (lado: 1 | -1) => {
    const p = g.prato(lado);
    // um traço só: desce pela corda até a borda, faz o bojo, sobe pela outra corda
    return [...linha(p.ponta, p.esq), ...bojo(p.esq, p.dir, b.pratoFundo * escala).slice(1), ...linha(p.dir, p.ponta).slice(1)];
  };
  const texto = (t: TextoDoPrato | undefined, lado: 1 | -1, semente: string) => {
    if (!t || frame < t.de) return null;
    const p = g.prato(lado);
    const tam = t.tamanho * escala;
    // o texto vai pendurado logo abaixo do prato (por cima, as cordas o cortariam):
    // afunda e sobe junto com ele
    return (
      <div style={{position: 'absolute', left: p.centro, top: p.borda + (b.pratoFundo + 6) * escala, transform: 'translateX(-50%)'}}>
        <Sangramento estilo={{display: 'inline-block'}}>
          <Manuscrito texto={t.texto} inicio={t.de} tamanho={tam} cor={cor} semente={semente} falha />
        </Sangramento>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Sangramento estilo={{position: 'absolute', inset: 0}}>
        <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <Traco pts={linha(g.base, g.topo, 24)} q={progresso(t1, b.haste)} cor={cor} escala={escala} />
          <Traco pts={linha([x, y], g.pontas.esq, 20)} q={progresso(t2, b.travessao)} cor={cor} escala={escala} />
          <Traco pts={linha([x, y], g.pontas.dir, 20)} q={progresso(t2, b.travessao)} cor={cor} escala={escala} />
          <Traco pts={pratoTraco(-1)} q={progresso(t3, b.prato)} cor={cor} escala={escala} />
          <Traco pts={pratoTraco(1)} q={progresso(t4, b.prato)} cor={cor} escala={escala} />
        </svg>
      </Sangramento>
      {texto(esquerda, -1, 'prato-esq')}
      {texto(direita, 1, 'prato-dir')}
    </AbsoluteFill>
  );
};
