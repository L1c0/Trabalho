import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Plano, inclina, type Assenta, type Pose } from '../lib/Plano';
import { Legenda } from '../lib/Legenda';
import { Cristal } from '../lib/Arame';
import { C, Pagina, R, SOBE, Som } from '../lib/montagem';

/**
 * 4 · A PEDRA — 1159 frames.
 *
 * A régua de Mohs em coluna (V2 §5.4): 1 em cima, 10 embaixo, marcas para a
 * direita. Primeiro a régua existe — a linha desce e cada tique aparece
 * quando ela passa —, depois ela mede: a marca do 3,5 sai da régua e o
 * número entra grande; o 10 entra quando ele diz "diamante".
 *
 * O cristal de fosfofilita em arame entra no nome (262: o AUDIO.md marca
 * 293, que é a pausa DEPOIS de "Fosfofilita") e gira devagar, meia volta ao
 * longo do Short, parando na pergunta. Ele mora no alto, à direita, e tudo
 * o que vem depois deixa esse canto livre.
 */
const pagina = (f: number, de: Pose, para: Pose, sobe: number[] = []): Assenta[] => {
  const out: Assenta[] = [
    { f, pose: de, dur: 0 },
    { f, pose: para, dur: 22 },
  ];
  sobe.forEach((g, i) => out.push({ f: g, pose: { ...para, y: para.y + SOBE * (i + 1) }, dur: 10 }));
  return out;
};

export const Pedra: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#DEDAD0' }}>
    <Pagina de={0} ate={262}>
      <Plano
        id="ped-a"
        camera={pagina(0, inclina(10, 7, 1.05), inclina(6, 4), [196, 210, 230])}
        tinta={{ a3: R(155, 14), a4: R(203, 12), a5: R(212, 12), a6: R(232, 12) }}
      />
    </Pagina>
    <Pagina de={262} ate={455}>
      <Plano
        id="ped-regua"
        camera={pagina(262, inclina(-8, -6, 1.04), inclina(-6, -3))}
        tinta={{ regua: [290, 18], m35: R(314, 14), fos: R(328), m10: R(405, 14) }}
      />
    </Pagina>
    <Pagina de={455} ate={624}>
      <Plano id="ped-foto" camera={pagina(455, inclina(9, -7, 1.04), inclina(6, -4))} />
    </Pagina>
    <Pagina de={624} ate={1159}>
      <Plano
        id="ped-tipo"
        camera={[
          ...pagina(624, inclina(-9, 6, 1.04), inclina(-6, 4)),
          ...pagina(855, inclina(7, -5, 1.04), inclina(5, -3)),
          ...pagina(946, inclina(-7, -4, 1.03), inclina(-5, -2)),
          ...pagina(1055, inclina(6, 3, 1.03), inclina(4, 2)),
        ]}
        tinta={{
          p1: R(635),
          p2: R(682),
          p3: R(705, 14),
          p4: R(723),
          p5: R(770, 14),
          'corte-855': C(855),
          q1: R(864),
          q2: R(895, 14),
          q3: R(916),
          'corte-946': C(946),
          r1: R(953),
          r2: R(988, 14),
          r3: R(1005),
          'corte-1055': C(1055),
          s1: R(1071),
          s2: R(1108, 14),
          s3: R(1120),
        }}
      />
    </Pagina>
    <div style={{ position: 'absolute', left: 630, top: 290, width: 320, height: 420 }}>
      <Cristal largura={320} altura={420} de={262} ate={1055} visivel />
    </div>
    <Legenda
      short="pedra"
      soPalavra={[
        [196, 262],
        [312, 328],
        [403, 455],
        [703, 723],
        [893, 916],
        [986, 1005],
        [1106, 1159],
      ]}
    />
    <Som n="4-pedra" />
  </AbsoluteFill>
);
