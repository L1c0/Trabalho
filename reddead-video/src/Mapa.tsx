import React from 'react';
import { Img, staticFile } from 'remotion';
import { c01, entrada, saida } from './comum';
import mapa from './data/mapa.json';
import textos from './data/textos.json';

/**
 * Cena 14 (p06b-mapa, 8850-9275). O pacote traz o atlas de 1890 na chapa e o
 * esquema vetorial à parte (mapa/eua-fronteira.svg), com a sugestão: a linha
 * de 1880 se desenha em 40 quadros, depois some e os 12 cacos aparecem, e os
 * 26 núcleos estalam um a um, 3 quadros entre eles.
 *
 * O SVG ocupa a chapa inteira e passava por cima do atlas e da legenda.
 * Então a cena tem dois tempos:
 * 1. o atlas (o documento), com a legenda e a nota de rodapé dele;
 * 2. o atlas sai, e o esquema entra no lugar, reduzido para caber acima da
 *    legenda. A nota de rodapé passa a dizer que é esquema, como o pacote
 *    pede, e a linha ganha o ano (1880, depois 1890). Os dois textos saem em
 *    PNG da ferramentas/prepara-v3.py, na fonte das notas das chapas.
 *
 * L é o quadro dentro da cena.
 */
export const INICIO = 8850;
const TROCA = 190; // o atlas começa a sair
const TROCA_DUR = 15;
const LINHA = 212; // a linha de 1880 começa a se desenhar...
const LINHA_DUR = 40; // ...em 40 quadros
const QUEBRA = 274; // a linha some e os cacos aparecem (4 quadros)
const NUCLEOS = 288; // o primeiro núcleo; depois um a cada 3 quadros
const NOTA_ESQUEMA = 206;

// o esquema reduzido: caixa da nação (322-2078 x 120-1230) entre y 200 e 1020
const ESC = 0.7387;
const CY = 610;
const naChapa = (x: number, y: number) => [1200 + (x - 1200) * ESC, CY + (y - 675) * ESC];

const CREME = '#E9C693';
const VERMELHO = '#CD120F';

type Dados = { nacao: string; estados: string[]; linha_1880: number[]; cacos: number[][]; nucleos: number[][] };
const M = mapa as unknown as Dados;
type Texto = { w: number; h: number; maiuscula: number };
const T = textos as unknown as Record<'nota_esquema' | 'ano_1880' | 'ano_1890', Texto>;

const pontos = (n: number[]) => {
  const p: string[] = [];
  for (let k = 0; k + 1 < n.length; k += 2) p.push(`${n[k]},${n[k + 1]}`);
  return p.join(' ');
};

/** Camadas de imagem (passam pela partitura de cor junto com o fundo). */
export const MapaImagem: React.FC<{ f: number }> = ({ f }) => {
  const L = f - INICIO;
  const t = c01((L - TROCA) / TROCA_DUR);
  return (
    <>
      {/* sombra sob a legenda e a nota, só enquanto o atlas está na tela: o
          texto claro sobre o papel claro não se lia */}
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 950,
          width: 1385,
          height: 300,
          opacity: 1 - t,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.7) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      />
      {t > 0 && (
        <Img
          src={staticFile('pecas/p06b-mapa/_fundo-sem-atlas.jpg')}
          style={{ position: 'absolute', left: 0, top: 0, width: 2400, height: 1350, opacity: t }}
        />
      )}
    </>
  );
};

/** O esquema vetorial e os rótulos (gráficos: ficam fora da partitura). */
export const MapaEsquema: React.FC<{ f: number }> = ({ f }) => {
  const L = f - INICIO;
  if (L < TROCA) return null;
  const opMapa = saida(c01((L - TROCA - 2) / TROCA_DUR));
  const [x1, y1, x2, y2] = M.linha_1880;
  const comp = Math.hypot(x2 - x1, y2 - y1);
  const desenho = c01((L - LINHA) / LINHA_DUR);
  const quebra = c01((L - QUEBRA) / 4);
  const [lx, ly] = naChapa(x1, y1);
  const ano1880 = entrada(f, INICIO + LINHA + 2);
  const nota = entrada(f, INICIO + NOTA_ESQUEMA);
  return (
    <>
      <svg width={2400} height={1350} viewBox="0 0 2400 1350" style={{ position: 'absolute', left: 0, top: 0 }}>
        <g transform={`translate(1200 ${CY}) scale(${ESC}) translate(-1200 -675)`}>
          <g opacity={opMapa} fill="none" stroke={CREME} strokeLinejoin="round">
            <g strokeWidth={1.5} strokeOpacity={0.42}>
              {M.estados.map((d, k) => (
                <path key={k} d={d} />
              ))}
            </g>
            <path d={M.nacao} strokeWidth={3} />
          </g>
          {desenho > 0 && quebra < 1 && (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={VERMELHO}
              strokeWidth={7}
              strokeDasharray={comp}
              strokeDashoffset={comp * (1 - desenho)}
              opacity={1 - quebra}
            />
          )}
          {quebra > 0 && (
            <g fill="none" stroke={VERMELHO} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={quebra}>
              {M.cacos.map((c, k) => (
                <polyline key={k} points={pontos(c)} />
              ))}
            </g>
          )}
          <g fill={CREME}>
            {M.nucleos.map(([cx, cy, r], k) => {
              const p = c01((L - NUCLEOS - 3 * k) / 4);
              if (p <= 0) return null;
              return <circle key={k} cx={cx} cy={cy} r={r * 1.25 * (0.35 + 0.65 * saida(p))} opacity={p} />;
            })}
          </g>
        </g>
      </svg>
      {/* o ano ao lado do topo da linha: 1880, e 1890 depois da quebra */}
      {desenho > 0 && (
        <Img
          src={staticFile('pecas/p06b-mapa/ano-1880.png')}
          style={{
            position: 'absolute',
            left: lx + 18,
            top: ly + 12 + ano1880.dy,
            width: T.ano_1880.w,
            height: T.ano_1880.h,
            opacity: ano1880.op * (1 - quebra),
          }}
        />
      )}
      {quebra > 0 && (
        <Img
          src={staticFile('pecas/p06b-mapa/ano-1890.png')}
          style={{ position: 'absolute', left: lx + 18, top: ly + 12, width: T.ano_1890.w, height: T.ano_1890.h, opacity: quebra }}
        />
      )}
      {/* a nota de rodapé nova: maiúsculas a partir de y=1154, como as das chapas */}
      {nota.op > 0 && (
        <Img
          src={staticFile('pecas/p06b-mapa/nota-esquema.png')}
          style={{
            position: 'absolute',
            left: 376,
            top: 1154 - T.nota_esquema.maiuscula + nota.dy,
            width: T.nota_esquema.w,
            height: T.nota_esquema.h,
            opacity: nota.op,
          }}
        />
      )}
    </>
  );
};
