import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import eventos from '../data/eventos.json';
import { Legenda } from '../lib/Legenda';
import { Chapa, Papel } from '../lib/Papel';
import { type Batida, escalaBatida, lerp, prog, tremor } from '../lib/movimento';

/**
 * 1 · A CONTAGEM — acumula. 781 frames.
 *
 * Cem impressões que não se substituem. O numeral da vez cai no centro com
 * a batida (1,18 a 1,00 em 3 frames, o quadro desloca e volta); quando o
 * próximo aparece, ele assenta na grade em 5 frames, perdendo tinta até
 * 0,30. A câmera recua de 1,06 a 1,00 ao longo das cem batidas. Os cinco
 * últimos batem devagar e pesado; o 100 cai em "no FIM". Na frase, o
 * arquivo inteiro recua (0,94, tinta 0,26) e "EU NÃO TENHO INIMIGOS" vem de
 * 1,08 com a batida final.
 */
type Num = {
  n: number; gw: number; gh: number; gcx: number; gcy: number; pw: number; ph: number;
  ax: number; ay: number; alvo: [number, number]; escala: number;
};
type Imp = { n: number; a: number; i: number; b: number; d: number; lado: number; sai: number };

const NUM = chapas.contagem as unknown as Num[];
const E = eventos['1-contagem'] as unknown as {
  impactos: Imp[]; frase: { a: number; i: number; d: number }; recuo: { ini: number; dur: number };
  camera: { ini: number; fim: number };
};
/** onde o numeral da vez cai: o meio da grade */
const CENTRO = { x: 540, y: 800 };
const ASSENTA = 5;
const TINTA_ARQ = 0.3;
const BATIDAS: Batida[] = [...E.impactos.map((x): Batida => [x.i, x.d, x.lado]), [E.frase.i, E.frase.d, 1]];

const pasta = (n: number, tipo: 'num' | 'arq') => staticFile(`1-contagem/${tipo}-${String(n).padStart(3, '0')}.png`);

/** O numeral da vez, grande, no centro. */
const Grande: React.FC<{ c: Num; escala: number }> = ({ c, escala }) => (
  <Img
    src={pasta(c.n, 'num')}
    style={{
      position: 'absolute',
      left: CENTRO.x - c.gw / 2,
      top: CENTRO.y - c.gh / 2,
      width: c.gw,
      height: c.gh,
      transformOrigin: `${c.gcx}px ${c.gcy}px`,
      transform: `scale(${escala})`,
    }}
  />
);

/** assentar: do centro até a posição de arquivo, encolhendo e perdendo tinta. */
const Viajando: React.FC<{ c: Num; u: number }> = ({ c, u }) => {
  const x0 = CENTRO.x - c.gw / 2 + c.gcx;
  const y0 = CENTRO.y - c.gh / 2 + c.gcy;
  const x = lerp(x0, c.alvo[0], u);
  const y = lerp(y0, c.alvo[1], u);
  return (
    <Img
      src={pasta(c.n, 'num')}
      style={{
        position: 'absolute',
        left: x - c.gcx,
        top: y - c.gcy,
        width: c.gw,
        height: c.gh,
        transformOrigin: `${c.gcx}px ${c.gcy}px`,
        transform: `scale(${lerp(1, c.escala, u)})`,
        opacity: lerp(1, TINTA_ARQ, u),
      }}
    />
  );
};

export const Contagem: React.FC = () => {
  const f = useCurrentFrame();
  const cam = lerp(1.06, 1.0, prog(f, E.camera.ini, E.camera.fim - E.camera.ini));
  const dx = tremor(f, BATIDAS);
  const r = prog(f, E.recuo.ini, E.recuo.dur);
  const arquivados: React.ReactNode[] = [];
  const viajando: React.ReactNode[] = [];
  const noCentro: React.ReactNode[] = [];
  E.impactos.forEach((x, k) => {
    const c = NUM[k];
    if (f < x.a) return;
    if (f < x.sai) {
      noCentro.push(<Grande key={c.n} c={c} escala={escalaBatida(f, x.i, x.b) ?? 1} />);
    } else if (f < x.sai + ASSENTA) {
      viajando.push(<Viajando key={c.n} c={c} u={(f - x.sai + 1) / ASSENTA} />);
    } else {
      arquivados.push(
        <Img
          key={c.n}
          src={pasta(c.n, 'arq')}
          style={{ position: 'absolute', left: c.ax - c.pw / 2, top: c.ay - c.ph / 2, width: c.pw, height: c.ph, opacity: TINTA_ARQ }}
        />,
      );
    }
  });
  const sFrase = escalaBatida(f, E.frase.i, 3, 1.08);
  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '540px 960px',
          transform: `translateX(${dx}px) scale(${cam})`,
        }}
      >
        <Papel nome="papel-socos" />
        <Chapa src="1-contagem/cartela.png" />
        {/* o arquivo: recua inteiro quando a frase chega */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '540px 960px',
            transform: `scale(${lerp(1, 0.94, r)})`,
            opacity: lerp(1, 0.26 / TINTA_ARQ, r),
          }}
        >
          {arquivados}
          {viajando}
        </div>
        {noCentro}
        {sFrase !== null && (
          <Chapa src="1-contagem/frase.png" style={{ transformOrigin: '305px 902px', transform: `scale(${sFrase})` }} />
        )}
      </div>
      <Legenda short="1-contagem" />
      <Audio src={staticFile('audio/mix-1-contagem.flac')} />
    </AbsoluteFill>
  );
};
