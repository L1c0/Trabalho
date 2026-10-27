import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import eventos from '../data/eventos.json';
import { Descola } from '../lib/Descola';
import { Legenda } from '../lib/Legenda';
import { Chapa, Papel } from '../lib/Papel';
import { type Batida, escalaBatida, lerp, prog, tremor } from '../lib/movimento';

/**
 * 4 · A OFICINA — subtrai. 1213 frames. A página começa cheia e termina vazia.
 *
 * A planta está numa mesa (perspective 2200). Ao longo da espera a câmera
 * sobe: a inclinação vai de 11° para 4°, devagar demais para ser notado.
 * Em "E eles foram embora em ordem" as casas saem, uma a cada 15 frames,
 * pela própria máscara: a tinta descola em mancha em 14 frames e a chapa
 * sobe 6 px, sendo levantada. O rótulo sai com a primeira e os achados com
 * a última, para sobrar papel vazio. O vazio segura (mais de 18 frames) e o
 * fecho entra com batida em "A terra prometida...", com empurrão de 2%.
 */
const E = eventos['4-oficina'];
const M = chapas.oficina as unknown as { mascaras: Record<string, [number, number]> };
const FRAMES = 1213;
const D = 2200;
/** folga para a batida e a subida das casas */
const FOLGA = 10;
const BATIDAS: Batida[] = [[E.fecho, 3, 1]];

/** a menor escala em que a mesa inclinada cobre o quadro inteiro */
const cobre = (graus: number) => {
  const a = (graus * Math.PI) / 180;
  const longe = D / (D + 960 * Math.sin(a));
  return Math.max((960 + FOLGA) / (960 * Math.cos(a) * longe), (540 + FOLGA) / (540 * longe));
};

const Sai: React.FC<{ nome: string; mascara: number; e: number; f: number }> = ({ nome, mascara, e, f }) => {
  if (f >= e + E.dur) return null;
  if (f < e) return <Chapa src={`4-oficina/${nome}.png`} />;
  const u = (f - e + 1) / E.dur;
  const [lo, hi] = M.mascaras[String(mascara)];
  return (
    <Descola
      chapa={`4-oficina/${nome}.png`}
      mascara={`4-oficina/mascara-${mascara}.png`}
      u={u}
      lo={lo}
      hi={hi}
      style={{ transform: `translateY(${-6 * u}px)` }}
    />
  );
};

export const Oficina: React.FC = () => {
  const f = useCurrentFrame();
  const graus = lerp(11, 4, prog(f, E.angulo.ini, E.angulo.fim - E.angulo.ini));
  const emp = 1 + 0.02 * prog(f, E.fecho, FRAMES - E.fecho);
  const dx = tremor(f, BATIDAS);
  const sFecho = escalaBatida(f, E.fecho);
  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', perspective: `${D}px`, perspectiveOrigin: '540px 960px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transformOrigin: '540px 960px',
            transform: `translateX(${dx}px) rotateX(${graus}deg) scale(${cobre(graus) * emp})`,
          }}
        >
          <Papel nome="papel-oficina" />
          <Sai nome="rotulo" mascara={1} e={E.rotulo} f={f} />
          {E.saidas.map((e, k) => (
            <Sai key={k} nome={`casa-${k + 1}`} mascara={k + 1} e={e} f={f} />
          ))}
          <Sai nome="achados" mascara={8} e={E.achados} f={f} />
          {sFecho !== null && (
            <Chapa src="4-oficina/fecho.png" style={{ transformOrigin: '539px 903px', transform: `scale(${sFecho})` }} />
          )}
        </div>
      </div>
      <Legenda short="4-oficina" />
      <Audio src={staticFile('audio/mix-4-oficina.flac')} />
    </AbsoluteFill>
  );
};
