import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import tl from '../data/timeline/1-contagem.json';
import { Legenda } from '../lib/Legenda';
import { Centro, Chapa, Papel } from '../lib/Papel';
import { type Batida, escalaBatida, impacto, lerp, passo, tremor } from '../lib/movimento';
import { type Camada, type Ponto, ativa, centroTinta, curva } from '../lib/timeline';

/**
 * 1 · A CONTAGEM — acumula. 781 frames. Tudo sai de timeline/1-contagem.json.
 *
 * Um numeral grande por vez, centrado em (540, 1152), entrando com a batida
 * (1,18 a 1,00 em 3 frames, tremida de 3 px; os cinco últimos em 5 frames e
 * 5 px). Quando ele sai, o arq do mesmo número assenta: viaja do centro até
 * a posição do JSON em 5 frames, perdendo tinta de 1,0 a 0,30, e fica até o
 * fim. A câmera recua de 1,06 a 1,00 batida a batida (camera_escala). Em 645
 * o arquivo inteiro recua para 0,26 de tinta (e 0,94 de escala, o recuo do
 * vocabulário) enquanto a frase entra de 1,08 com a batida final.
 */
const T = tl as unknown as {
  fundo: string;
  camera_escala: Ponto[];
  arquivo_recua_em: { frame: number; tinta: number };
  camadas: Camada[];
};
const FRASE = T.camadas.find((c) => c.arquivo.endsWith('/frase.png'))!;
const NUMS = T.camadas.filter((c) => c.ancora === 'centro' && c.efeito === 'batida');
/** o arquivo recua enquanto a frase entra: no tempo da batida dela */
const RECUO = { ini: T.arquivo_recua_em.frame, n: FRASE.batida_frames!, tinta: T.arquivo_recua_em.tinta, escala: 0.94 };
/** a tremida da frase o JSON não dá: a de uma batida comum */
const TREMIDA = 3;
const BATIDAS: Batida[] = [
  ...NUMS.map((c, k): Batida => [impacto(c.entra, c.batida_frames), c.tremida_px!, k % 2 ? -1 : 1]),
  [impacto(FRASE.entra, FRASE.batida_frames), TREMIDA, NUMS.length % 2 ? -1 : 1],
];

export const Contagem: React.FC = () => {
  const f = useCurrentFrame();
  const cam = curva(T.camera_escala, 'escala', f);
  const dx = tremor(f, BATIDAS);
  const r = passo(f, RECUO.ini, RECUO.n);
  const sr = lerp(1, RECUO.escala, f < RECUO.ini ? 0 : r);

  const desenha = (c: Camada) => {
    if (c.ancora === 'quadro') {
      if (c.efeito !== 'batida') return <Chapa key={c.arquivo} src={c.arquivo} />;
      const s = escalaBatida(f, c.entra, c.batida_frames, c.escala_de);
      return (
        <Chapa key={c.arquivo} src={c.arquivo} style={{ transformOrigin: centroTinta(c.arquivo), transform: `scale(${s})` }} />
      );
    }
    if (c.efeito === 'batida') {
      return <Centro key={c.arquivo} src={c.arquivo} x={c.x!} y={c.y!} escala={escalaBatida(f, c.entra, c.batida_frames)} />;
    }
    // assentar: do centro até a posição do arquivo, perdendo tinta; depois o recuo em volta do meio do quadro
    const u = passo(f, c.entra, c.assentar_frames!);
    const x = lerp(c.de_x!, c.x!, u);
    const y = lerp(c.de_y!, c.y!, u);
    const tinta = f < RECUO.ini ? lerp(1, c.tinta!, u) : lerp(c.tinta!, RECUO.tinta, r);
    return <Centro key={c.arquivo} src={c.arquivo} x={540 + (x - 540) * sr} y={960 + (y - 960) * sr} escala={sr} tinta={tinta} />;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 960px', transform: `translateX(${dx}px) scale(${cam})` }}>
        <Papel src={T.fundo} />
        {T.camadas.map((c) => (ativa(c, f) ? desenha(c) : null))}
      </div>
      <Legenda short="1-contagem" />
      <Audio src={staticFile('audio/mix-1-contagem.flac')} />
    </AbsoluteFill>
  );
};
