import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import tl from '../data/timeline/4-oficina.json';
import { Descola } from '../lib/Descola';
import { Legenda } from '../lib/Legenda';
import { Chapa, Papel } from '../lib/Papel';
import { type Batida, clamp, escalaBatida, impacto, prog, tremor } from '../lib/movimento';
import { type Camada, type Ponto, ativa, centroTinta, curva } from '../lib/timeline';

/**
 * 4 · A OFICINA — subtrai. 1213 frames. Tudo sai de timeline/4-oficina.json.
 *
 * A planta está numa mesa (perspective 2200) e a câmera sobe: a inclinação
 * vai de 11° no frame 0 a 4° em 777 e fica. As oito casas estão no quadro
 * desde o frame 0, o rótulo entra em 12 e fica até o fim, os achados entram
 * em 330 e cortam em 900. De 777 em diante as casas saem uma a cada 15
 * frames pela própria máscara: a tinta descola em mancha em 14 frames e a
 * chapa sobe 6 px. De 900 a 918 o papel segura vazio; o fecho entra em 918
 * com batida de 1,06 em 4 frames e a câmera empurra 2% até o fim (o
 * empurrão é do LEIA-PRIMEIRO; o JSON não fala dele).
 */
const T = tl as unknown as { fundo: string; frames: number; perspective: number; camera_rotateX: Ponto[]; camadas: Camada[] };
const M = chapas.mascaras as Record<string, number[]>;
const FECHO = T.camadas.find((c) => c.efeito === 'batida')!;
const EMPURRAO = 0.02;
/** o JSON não dá a tremida da batida do fecho: a de uma batida comum */
const TREMIDA = 3;
const BATIDAS: Batida[] = [[impacto(FECHO.entra, FECHO.batida_frames), TREMIDA, 1]];

export const Oficina: React.FC = () => {
  const f = useCurrentFrame();
  const graus = curva(T.camera_rotateX, 'graus', f);
  const emp = 1 + EMPURRAO * prog(f, FECHO.entra, T.frames - FECHO.entra);
  const dx = tremor(f, BATIDAS);

  const desenha = (c: Camada) => {
    if (c.efeito === 'descolar' && f >= c.descolar_de!) {
      // a tinta descola em mancha: o limiar avança sobre o ruído da máscara, e a chapa sobe
      const u = clamp((f - c.descolar_de! + 1) / c.descolar_frames!);
      const [lo, hi] = M[c.mascara!];
      return (
        <Descola
          key={c.arquivo}
          chapa={c.arquivo}
          mascara={c.mascara!}
          u={u}
          lo={lo}
          hi={hi}
          style={{ transform: `translateY(${-c.sobe_px! * u}px)` }}
        />
      );
    }
    if (c.efeito === 'batida') {
      const s = escalaBatida(f, c.entra, c.batida_frames, c.escala_de);
      return <Chapa key={c.arquivo} src={c.arquivo} style={{ transformOrigin: centroTinta(c.arquivo), transform: `scale(${s})` }} />;
    }
    return <Chapa key={c.arquivo} src={c.arquivo} />;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#CCC6B8' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          perspective: `${T.perspective}px`,
          perspectiveOrigin: '540px 960px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transformOrigin: '540px 960px',
            transform: `translateX(${dx}px) rotateX(${graus}deg) scale(${emp})`,
          }}
        >
          <Papel src={T.fundo} />
          {T.camadas.map((c) => (ativa(c, f) ? desenha(c) : null))}
        </div>
      </div>
      <Legenda short="4-oficina" />
      <Audio src={staticFile('audio/mix-4-oficina.flac')} />
    </AbsoluteFill>
  );
};
