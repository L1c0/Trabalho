import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {curvas, tempo} from '../theme';

// A LINHA QUE QUEBRA. Uma linha vertical em três estados:
//   reta       → aparece por ESCRITA, de cima para baixo
//   entortando → curva lenta e contínua, de 0° até `anguloMax` de arco
//   quebrada   → num único frame vira duas metades com borda de fratura irregular,
//                afastadas `afasta` px em direções opostas. Sem câmera lenta, sem shake.
// A linha é desenhada como contorno preenchido (não stroke), para a fratura ter forma.

type Ponto = [number, number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Curva quadrática do topo à base, com o ponto de controle deslocado para o lado.
// O ângulo da tangente nas pontas é o "arco" da curva: tan(θ) = desvio / (altura / 2).
const curva = (x: number, y: number, altura: number, angulo: number) => {
  const desvio = (altura / 2) * Math.tan((angulo * Math.PI) / 180);
  const p0: Ponto = [x, y];
  const c: Ponto = [x + desvio, y + altura / 2];
  const p1: Ponto = [x, y + altura];
  const ponto = (t: number): Ponto => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1],
  ];
  const tangente = (t: number): Ponto => {
    const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
    const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
    const n = Math.hypot(dx, dy);
    return [dx / n, dy / n];
  };
  return {ponto, tangente};
};

// Contorno de um trecho [t0, t1] da curva, com a espessura dada.
const bordas = (ponto: (t: number) => Ponto, tangente: (t: number) => Ponto, t0: number, t1: number, espessura: number, amostras = 40) => {
  const esq: Ponto[] = [];
  const dir: Ponto[] = [];
  for (let i = 0; i <= amostras; i++) {
    const t = t0 + ((t1 - t0) * i) / amostras;
    const [px, py] = ponto(t);
    const [tx, ty] = tangente(t);
    const [nx, ny] = [-ty, tx];
    esq.push([px + (nx * espessura) / 2, py + (ny * espessura) / 2]);
    dir.push([px - (nx * espessura) / 2, py - (ny * espessura) / 2]);
  }
  return {esq, dir};
};

// A borda da fratura: um zigue-zague irregular atravessando a linha no ponto t,
// com dentes que avançam e recuam ao longo da tangente. As duas metades usam os mesmos
// pontos, então se encaixam.
const fratura = (ponto: (t: number) => Ponto, tangente: (t: number) => Ponto, t: number, espessura: number, dente: number, semente: string) => {
  const [px, py] = ponto(t);
  const [tx, ty] = tangente(t);
  const [nx, ny] = [-ty, tx];
  const n = 6;
  return Array.from({length: n + 1}, (_, i): Ponto => {
    const s = 0.5 - i / n; // de uma borda à outra
    const avanco = i === 0 || i === n ? 0 : (random(`${semente}-${i}`) * 2 - 1) * dente;
    return [px + nx * espessura * s + tx * avanco, py + ny * espessura * s + ty * avanco];
  });
};

const poligono = (pts: Ponto[]) => `M${pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L')} Z`;

export const Osso: React.FC<{
  x: number; // centro horizontal
  y: number; // topo
  altura: number;
  espessura: number;
  cor: string;
  escreve: number; // frame em que a ESCRITA de cima para baixo começa
  entorta: number; // frame em que a curva começa
  quebra: number; // frame da fratura
  anguloMax?: number;
  duracaoCurva?: number;
  afasta?: number;
  dente?: number;
  semente?: string;
}> = ({
  x,
  y,
  altura,
  espessura,
  cor,
  escreve,
  entorta,
  quebra,
  anguloMax = tempo.osso.anguloMax,
  duracaoCurva = tempo.osso.curva,
  afasta = tempo.osso.afasta,
  dente = tempo.osso.dente,
  semente = 'osso',
}) => {
  const frame = useCurrentFrame();
  if (frame < escreve) return null;
  const escrita = interpolate(frame, [escreve, escreve + tempo.osso.escrita], [0, 1], {...clamp, easing: curvas.linear});
  const angulo = interpolate(frame, [entorta, entorta + duracaoCurva], [0, anguloMax], {...clamp, easing: curvas.corpo});
  const {ponto, tangente} = curva(x, y, altura, angulo);
  const largura = altura; // caixa folgada para a curva e o afastamento
  const caixa = {left: x - largura / 2, top: y - afasta * 2 - dente, width: largura, height: altura + afasta * 4 + dente * 2};
  const svg = (conteudo: React.ReactNode) => (
    <svg
      viewBox={`${caixa.left} ${caixa.top} ${caixa.width} ${caixa.height}`}
      style={{position: 'absolute', left: caixa.left, top: caixa.top, width: caixa.width, height: caixa.height, overflow: 'visible'}}
    >
      {conteudo}
    </svg>
  );

  if (frame < quebra) {
    const {esq, dir} = bordas(ponto, tangente, 0, 1, espessura);
    // ESCRITA de cima para baixo: a linha se revela pelo recorte vertical
    const id = `osso-${semente}`;
    return svg(
      <>
        <defs>
          <clipPath id={id}>
            <rect x={caixa.left} y={caixa.top} width={caixa.width} height={y - caixa.top + altura * escrita} />
          </clipPath>
        </defs>
        <path d={poligono([...esq, ...dir.reverse()])} fill={cor} clipPath={`url(#${id})`} />
      </>,
    );
  }

  // quebrada: duas metades, a mesma fratura, afastadas ao longo da tangente do meio
  const meio = 0.5;
  const f = fratura(ponto, tangente, meio, espessura, dente, semente);
  const cima = bordas(ponto, tangente, 0, meio, espessura);
  const baixo = bordas(ponto, tangente, meio, 1, espessura);
  const [tx, ty] = tangente(meio);
  // metade de cima: borda esquerda descendo, a fratura de um lado ao outro, borda direita subindo
  const pCima = [...cima.esq, ...f, ...cima.dir.reverse()];
  const pBaixo = [...f, ...baixo.dir, ...baixo.esq.reverse()];
  return svg(
    <>
      <path d={poligono(pCima)} fill={cor} transform={`translate(${(-tx * afasta).toFixed(1)} ${(-ty * afasta).toFixed(1)})`} />
      <path d={poligono(pBaixo)} fill={cor} transform={`translate(${(tx * afasta).toFixed(1)} ${(ty * afasta).toFixed(1)})`} />
    </>,
  );
};
