import React, {useId} from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {cores, curvas, fontes, tempo} from '../theme';
import {Sangramento} from '../texture/Sangramento';
import {Escrita, duracaoEscrita} from './Escrita';

// A BARRA: um retângulo de esfero desenhado a traço contínuo, da esquerda para a direita
// (as bordas de cima e de baixo andam juntas), com a velocidade irregular da mão e a
// espessura variando com ela.
//   marcar  → um retângulo preenchido em vermelho, numa fração da largura, entra por
//             máscara horizontal
//   hachura → o resto da barra é riscado à mão: linhas a 45°, uma a uma, cada uma
//             desenhada de cima para baixo com entrada própria
// Rótulos: o de cima em Montserrat 24; o da marca dentro dela se couber, senão fora,
// com uma linha fina apontando.

const b = tempo.barra;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type P = readonly [number, number];

const tremor = (semente: string, i: number) => (random(`${semente}-${i}`) * 2 - 1) * b.tremor;

// Um traço por segmentos curtos: fino onde a mão corre (meio), grosso onde desacelera.
const Traco: React.FC<{pts: readonly P[]; q: number; cor: string}> = ({pts, q, cor}) => {
  if (q <= 0) return null;
  const n = pts.length - 1;
  const ate = q * n;
  const segs = [];
  for (let i = 0; i < Math.ceil(ate); i++) {
    const f = Math.min(1, ate - i);
    const [a, c] = [pts[i], pts[i + 1]];
    const largura = b.tracoMax - (b.tracoMax - b.tracoMin) * Math.sin((Math.PI * (i + 0.5)) / n);
    segs.push(<line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (c[0] - a[0]) * f} y2={a[1] + (c[1] - a[1]) * f} stroke={cor} strokeWidth={largura} strokeLinecap="round" />);
  }
  return <>{segs}</>;
};

// Um lado do contorno: começa no meio da borda esquerda, vai até o canto, atravessa e
// desce (ou sobe) pela borda direita até o meio dela.
const contorno = (x: number, y: number, w: number, h: number, lado: 1 | -1, semente: string): P[] => {
  const meio = y + h / 2;
  const borda = lado === -1 ? y : y + h;
  const n = 40;
  return [
    [x, meio],
    [x + tremor(semente, 0), borda],
    ...Array.from({length: n}, (_, i): P => [x + ((i + 1) / n) * w, borda + tremor(semente, i + 1)]),
    [x + w, meio],
  ];
};

export type Marca = {de: number; posicao: number; fracao: number; rotulo?: {texto: string; de: number}};

export const Barra: React.FC<{
  x: number;
  y: number;
  largura?: number;
  altura?: number;
  desenha: number;
  rotulo?: {texto: string; de: number};
  marcar?: Marca;
  hachura?: {de: number; duracao: number};
  semente?: string;
}> = ({x, y, largura = b.largura, altura = b.altura, desenha, rotulo, marcar, hachura, semente = 'barra'}) => {
  const frame = useCurrentFrame();
  const id = `barra${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (frame < desenha) return null;
  const q = interpolate(frame, [desenha, desenha + b.desenho], [0, 1], {...clamp, easing: curvas.mao});
  const m = marcar ? {x: x + marcar.posicao * largura, w: marcar.fracao * largura} : null;

  // hachura: linhas a 45° (como "/"), espaçadas b.passo px, recortadas pela barra e sem a marca
  const linhas = [];
  if (hachura && frame >= hachura.de) {
    const passoX = b.passo * Math.SQRT2;
    const n = Math.ceil((largura + altura) / passoX);
    for (let i = 0; i < n; i++) {
      // cada linha tem a sua entrada; a próxima começa antes de a anterior terminar
      const inicio = hachura.de + (i * (hachura.duracao - b.hachuraTraco)) / Math.max(1, n - 1);
      if (frame < inicio) break;
      const p = interpolate(frame, [inicio, inicio + b.hachuraTraco], [0, 1], clamp);
      const cx = x + i * passoX + tremor(`${semente}-h`, i) * 0.6;
      // de cima (direita) para baixo (esquerda)
      const [x0, y0, x1, y1] = [cx, y - 2, cx - altura - 4, y + altura + 2];
      linhas.push(<line key={i} x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={cores.esfero} strokeWidth={b.hachuraEspessura} strokeLinecap="round" />);
    }
  }

  const marcaP = marcar ? interpolate(frame, [marcar.de, marcar.de + b.marca], [0, 1], clamp) : 0;
  const rotuloDaMarca = marcar?.rotulo;
  // cabe dentro? estimativa da largura do texto em Montserrat 16
  const larguraRotulo = rotuloDaMarca ? [...rotuloDaMarca.texto].length * b.rotuloMarca * 0.66 + 10 : 0;
  const cabe = m ? larguraRotulo <= m.w : false;
  const textoMarca: React.CSSProperties = {fontFamily: fontes.legenda, fontWeight: fontes.peso.legendaForte, fontSize: b.rotuloMarca, letterSpacing: '0.04em', whiteSpace: 'nowrap'};

  return (
    <>
      {rotulo ? (
        <div style={{position: 'absolute', left: x, top: y - b.rotulo * 1.9, fontFamily: fontes.legenda, fontWeight: fontes.peso.legendaForte, fontSize: b.rotulo, letterSpacing: '0.06em', color: cores.esfero}}>
          <Escrita inicio={rotulo.de} duracao={duracaoEscrita(rotulo.texto)}>
            {rotulo.texto}
          </Escrita>
        </div>
      ) : null}
      <Sangramento estilo={{position: 'absolute', inset: 0}}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id={`${id}-fora`}>
              <path
                clipRule="evenodd"
                d={`M${x},${y} h${largura} v${altura} h${-largura} Z${m ? ` M${m.x},${y} v${altura} h${m.w} v${-altura} Z` : ''}`}
              />
            </clipPath>
          </defs>
          {m && marcaP > 0 ? (
            <rect x={m.x} y={y} width={m.w * marcaP} height={altura} fill={cores.destaque} />
          ) : null}
          <g clipPath={`url(#${id}-fora)`}>{linhas}</g>
          <Traco pts={contorno(x, y, largura, altura, -1, `${semente}-c`)} q={q} cor={cores.esfero} />
          <Traco pts={contorno(x, y, largura, altura, 1, `${semente}-b`)} q={q} cor={cores.esfero} />
          {m && rotuloDaMarca && !cabe && frame >= rotuloDaMarca.de ? (
            <line x1={m.x + m.w / 2} y1={y + altura + 6} x2={m.x + m.w / 2} y2={y + altura + b.ponteiro} stroke={cores.esfero} strokeWidth={1.5} />
          ) : null}
        </svg>
      </Sangramento>
      {m && rotuloDaMarca && frame >= rotuloDaMarca.de ? (
        cabe ? (
          <div style={{...textoMarca, position: 'absolute', left: m.x + m.w / 2, top: y + altura / 2, transform: 'translate(-50%, -50%)', color: cores.papel}}>{rotuloDaMarca.texto}</div>
        ) : (
          <div style={{...textoMarca, position: 'absolute', left: m.x + m.w / 2, top: y + altura + b.ponteiro + 8, transform: 'translateX(-50%)', color: cores.destaque}}>
            <Escrita inicio={rotuloDaMarca.de} duracao={duracaoEscrita(rotuloDaMarca.texto)}>
              {rotuloDaMarca.texto}
            </Escrita>
          </div>
        )
      ) : null}
    </>
  );
};
