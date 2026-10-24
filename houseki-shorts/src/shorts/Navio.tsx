import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Plano, inclina, type Assenta, type Pose } from '../lib/Plano';
import { Legenda } from '../lib/Legenda';
import { FERRUGEM, Navios, TABUAS, TINTA_LINHA } from '../lib/Arame';
import { C, Pagina, R, SOBE, Som } from '../lib/montagem';

/**
 * 2 · O NAVIO — 1347 frames.
 *
 * Quatro pranchas e o navio em arame (V2 §5.2). As pranchas entram cada
 * uma na sua batida, com o plano assentando numa inclinação nova; o tipo
 * acumula embaixo, no papel limpo. O arame aparece quando ele fala em
 * trocar as tábuas: as originais (ferrugem) dão lugar às novas uma a uma e
 * param secas em "nenhuma das originais". Na pergunta do Hobbes as velhas
 * voltam, uma a uma, e montam o segundo casco ao lado. Os dois ficam até o
 * fim, iguais, e nenhum é destacado.
 */

/** Entra inclinado e assenta; cada pedaço novo do tipo faz o conjunto subir. */
const pagina = (f: number, de: Pose, para: Pose, sobe: number[] = []): Assenta[] => {
  const out: Assenta[] = [
    { f, pose: de },
    { f, pose: para, dur: 22 },
  ];
  sobe.forEach((g, i) => out.push({ f: g, pose: { ...para, y: para.y + SOBE * (i + 1) }, dur: 10 }));
  return out;
};

// ordem em que as tábuas são trocadas: salteada, mas fixa
const ORDEM = TABUAS.map((_, k) => k).sort((a, b) => ((a * 37) % 24) - ((b * 37) % 24));
const vez = (k: number) => ORDEM.indexOf(k);

// W1: 24 trocas entre "Cada tábua" (321) e "originais" (449)
const T0 = 321;
const DT = (449 - T0) / 24;
const corTroca = (_c: number, k: number, f: number) => {
  const t = T0 + vez(k) * DT;
  if (f < t) return FERRUGEM;
  if (f < t + 2) return null;          // a tábua some e reaparece nova
  return TINTA_LINHA;
};
// W2: o casco A é todo novo; o B se monta com as velhas, uma a uma (836–953)
const B0 = 838;
const DB = (953 - B0) / 24;
const corDois = (c: number, k: number, f: number) => {
  if (c === 0) return TINTA_LINHA;
  return f >= B0 + vez(k) * DB ? FERRUGEM : null;
};

const VISTA = { rx: 0.46, ry: -1.0 };

export const Navio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#DCE6E2' }}>
    <Pagina de={0} ate={157}>
      <Plano
        id="nav-vaso"
        camera={pagina(0, inclina(12, -8, 1.05), inclina(7, -4), [36, 57, 76])}
        tinta={{ p2: R(38, 14), p3: R(59, 14), p4: R(78) }}
      />
    </Pagina>
    <Pagina de={157} ate={287}>
      <Plano id="nav-teseu" camera={pagina(157, inclina(-10, 8, 1.05), inclina(-6, 5), [247])} tinta={{ p1: R(196), p2: R(251, 14) }} />
    </Pagina>
    <Pagina de={287} ate={475}>
      <Plano id="nav-tabuas" camera={[{ f: 287, pose: inclina(6, 3) }]} tinta={{ p1: R(410), p2: R(432, 14), p3: R(449, 14) }} />
      <div style={{ position: 'absolute', left: 0, top: 300, width: 1080, height: 580 }}>
        <Navios largura={1080} altura={580} cascos={[{ pos: [0, 0, 0] }]} cor={corTroca} poses={[{ f: 287, rx: 0.42, ry: -0.62 }]} zoom={88} />
      </div>
    </Pagina>
    <Pagina de={475} ate={726}>
      <Plano
        id="nav-busto"
        camera={pagina(475, inclina(10, 6, 1.05), inclina(6, 3), [529, 564, 628])}
        tinta={{ p1: R(486), p2: R(531, 14), p3: R(566), p4: R(630) }}
      />
    </Pagina>
    <Pagina de={726} ate={836}>
      <Plano id="nav-hobbes" camera={pagina(726, inclina(-11, -7, 1.05), inclina(-7, -4), [796])} tinta={{ p1: R(734), p2: R(798, 14) }} />
    </Pagina>
    <Pagina de={836} ate={1347}>
      <Plano
        id="nav-dois"
        camera={[{ f: 836, pose: inclina(5, -3) }]}
        tinta={{
          forma: R(990),
          materia: R(1025),
          q1: R(1051),
          q2: R(1068, 14),
          'corte-1104': C(1104),
          r1: R(1107),
          r2: R(1157),
          r3: R(1168, 14),
          r4: R(1180, 14),
          'corte-1291': C(1291),
          f1: R(1294),
          f2: R(1319, 14),
        }}
      />
      <div style={{ position: 'absolute', left: 0, top: 330, width: 1080, height: 460 }}>
        <Navios
          largura={1080}
          altura={460}
          cascos={[{ pos: [-4.4, 0, 0] }, { pos: [4.4, 0, 0] }]}
          cor={corDois}
          poses={[
            { f: 836, ...VISTA },
            { f: 963, rx: 0.3, ry: -0.78, dur: 28 },
          ]}
          zoom={63}
        />
      </div>
    </Pagina>
    <Legenda
      short="navio"
      soPalavra={[
        [36, 76],
        [249, 287],
        [430, 475],
        [529, 564],
        [796, 836],
        [1066, 1104],
        [1166, 1178],
        [1317, 1347],
      ]}
    />
    <Som n="2-navio" />
  </AbsoluteFill>
);
