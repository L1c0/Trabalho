import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import tl from './data/timeline.json';
import tam from './data/tipo.json';
import { quadro } from './tabela';

/**
 * A tipografia: tudo já impresso em tipo/, só posicionado (LEIA-PRIMEIRO).
 * Fica fora da câmera: a régua, o numeral e os rótulos não se movem com o
 * disco.
 *
 *   rot-lugar        centrado em (540, 165), a partir do frame 431
 *   n-1 … n-28       canto esquerdo x=150, base y=1255, o número de anéis contados
 *   n-1021           no mesmo lugar, a partir do frame 987
 *   rot-aneis        x = 150 + largura do numeral + 30, base y=1248
 *   rot-ano          no lugar de rot-aneis, a partir do frame 987
 *   regua-base       x=150, y=1306, a partir do frame 676
 *   tique, tique-5   a marca k em x = marcas_x[k], base y=1314; múltiplos de 5 em ferrugem
 *   regua-998 …      o rótulo debaixo da marca, y=1320
 *   arvore-1 … 12    posição e frames de entrada e saída do timeline.json
 */
const TAM = tam as Record<string, number[]>;
const R = tl.regua;
const DATA = 987;
const LUGAR = 431;
const REGUA = 676;

type Arvore = { peca: string; x: number; y: number; entra: number; entra_frames: number; sai: number; sai_frames: number };

const Peca: React.FC<{ nome: string; x: number; y: number; tinta?: number }> = ({ nome, x, y, tinta = 1 }) => (
  <Img
    src={staticFile(`tipo/${nome}.png`)}
    style={{ position: 'absolute', left: x, top: y, width: TAM[nome][0], height: TAM[nome][1], opacity: tinta }}
  />
);

/** as doze árvores: a tinta entra em entra_frames e sai em sai_frames, linear */
const tintaArvore = (a: Arvore, f: number) => {
  if (f < a.entra) return 0;
  const entra = Math.min(1, (f - a.entra + 1) / a.entra_frames);
  const sai = f < a.sai ? 1 : Math.max(0, 1 - (f - a.sai + 1) / a.sai_frames);
  return Math.min(entra, sai);
};

export const Tipo: React.FC = () => {
  const f = useCurrentFrame();
  const { contados } = quadro(f);
  const numeral = f >= DATA ? 'n-1021' : contados > 0 ? `n-${contados}` : null;
  const rotulo = f >= DATA ? 'rot-ano' : 'rot-aneis';
  const marcas: React.ReactNode[] = [];
  if (f >= REGUA) {
    for (let k = 1; k <= contados; k++) {
      const nome = k % 5 === 0 ? 'tique-5' : 'tique';
      const x = R.marcas_x[k];
      marcas.push(<Peca key={`t${k}`} nome={nome} x={x - TAM[nome][0] / 2} y={1314 - TAM[nome][1]} />);
      if (k % R.rotulo_a_cada === 0) {
        const r = `regua-${993 + k}`;
        marcas.push(<Peca key={`r${k}`} nome={r} x={x - TAM[r][0] / 2} y={1320} />);
      }
    }
  }
  return (
    <>
      {(tl.arvores as Arvore[]).map((a) => {
        const t = tintaArvore(a, f);
        const nome = a.peca.replace('.png', '');
        return t > 0 ? <Peca key={nome} nome={nome} x={a.x} y={a.y} tinta={t} /> : null;
      })}
      {f >= LUGAR && <Peca nome="rot-lugar" x={540 - TAM['rot-lugar'][0] / 2} y={165 - TAM['rot-lugar'][1] / 2} />}
      {f >= REGUA && <Peca nome="regua-base" x={R.x0} y={1306} />}
      {marcas}
      {numeral && (
        <>
          <Peca nome={numeral} x={R.num_x} y={R.num_base_y - TAM[numeral][1]} />
          <Peca nome={rotulo} x={R.num_x + TAM[numeral][0] + 30} y={1248 - TAM[rotulo][1]} />
        </>
      )}
    </>
  );
};
