import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import tl from './data/timeline.json';
import { Descola } from './Descola';
import { Legenda } from './Legenda';

/**
 * A OFICINA — 1080x1920, 30 fps, 1215 frames (docs/LEIA-PRIMEIRO.md).
 *
 * A planta do sítio está inteira no primeiro frame. Cada construção que a
 * narração manda embora some pela própria máscara (limiar subindo, não
 * fade), na ordem B C A E D G F J; no fim resta o papel com a frase. As
 * colunas da tabela do timeline.json dão, por frame, a opacidade de
 * terreno, rótulo, achados e fecho e o limiar de cada construção; nada é
 * recalculado. A escala (1,000 a 1,045, linear) vai num container em volta
 * de (540, 840). Os achados descem 260 px (achados.deslocar_y), porque na
 * posição original colidem com a planta.
 *
 * As máscaras são ruído genérico, sem estrutura por construção: a k-ésima
 * a sair usa mascara-k.
 */
const T = tl as unknown as {
  camera: { centro: number[] };
  ordem_saida: string[];
  achados: { deslocar_y: number };
  construcoes: { id: string; peca: string; caixa: number[] }[];
  colunas: string[];
  quadros: number[][];
};
const C = Object.fromEntries(T.colunas.map((c, i) => [c, i])) as Record<string, number>;
const CONS = Object.fromEntries(T.construcoes.map((c) => [c.id, c]));
const [CX, CY] = T.camera.centro;

const Chapa: React.FC<{ src: string; tinta?: number; dy?: number }> = ({ src, tinta = 1, dy = 0 }) => (
  <Img
    src={staticFile(src)}
    style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: tinta, transform: dy ? `translateY(${dy}px)` : undefined }}
  />
);

export const Oficina: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.quadros[Math.min(f, T.quadros.length - 1)];
  return (
    <AbsoluteFill style={{ backgroundColor: '#D3CFC4' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${CX}px ${CY}px`, transform: `scale(${q[C.escala]})` }}>
        {/* papel.jpg ladrilha sem emenda; com 2600 px e escala ≥ 1 ele já cobre o quadro */}
        <Img src={staticFile('papel.jpg')} style={{ position: 'absolute', left: 0, top: 0, width: 2600, height: 2600 }} />
        {q[C.terreno] > 0 && <Chapa src="terreno.png" tinta={q[C.terreno]} />}
        {T.ordem_saida.map((id, k) => {
          const v = q[C[`c-${id}`]];
          if (v <= 0) return null;
          if (v >= 1) return <Chapa key={id} src={CONS[id].peca} />;
          return <Descola key={id} chapa={CONS[id].peca} mascara={`mascara-${k + 1}.png`} caixa={CONS[id].caixa} v={v} />;
        })}
        {q[C.rotulo] > 0 && <Chapa src="rotulo.png" tinta={q[C.rotulo]} />}
        {q[C.achados] > 0 && <Chapa src="achados.png" tinta={q[C.achados]} dy={T.achados.deslocar_y} />}
        {q[C.fecho] > 0 && <Chapa src="fecho.png" tinta={q[C.fecho]} />}
      </div>
      <Legenda />
      <Audio src={staticFile('audio/4-oficina.mp3')} />
    </AbsoluteFill>
  );
};
