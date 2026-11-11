import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, mix, prog, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Clarao } from '../kit/Cena';
import { Jogo } from '../kit/Jogo';
import { Carimbo, Centro, Etiqueta, Impacto, Sombra, Tarja } from '../kit/Letreiro';
import { em, M } from '../kit/tipos';
import { s } from '../tempo';

/**
 * Os clipes do jogo do primeiro terço: "é sobre isso", a competência e a
 * cobrança da dívida. O quadro do clipe é o do pacote (quadro da trilha
 * menos o quadro em que a cena começava lá).
 */
const P = (...seg: number[]) => seg.map(s);
/** Soco de zoom: aproxima de uma vez e volta devagar. */
export const soco = (f: number, t: number, forca = 0.05, dur = 24) => (f < t ? 0 : forca * (1 - saiCubica(prog(f, t, dur))));

type Cena = { f: number; clipes: boolean };

/** 52,6-62,0 s · "E eu não estou falando em metáfora... um documento específico, com data" */
export const SobreIsso: React.FC<Cena> = ({ f, clipes }) => {
  const ini = s(52.6);
  const blocos = '██ / ██ / 18██';
  return (
    <Jogo arq="c02-F.mp4" k={f - 1506} f={f} id="c02" clipes={clipes} cor={{ sat: 0.9, temp: 0.2 }} zoom={1.02 + 0.03 * prog(f, ini, 290) + soco(f, s(55.2), 0.04)} barras={saiExpo(prog(f, ini, 14))}>
      <Sombra f={f} ini={s(53.3)} fim={s(61.9)} />
      <Tarja f={f} ini={s(53.3)} fim={s(54.9)} texto="NÃO É METÁFORA" y={800} />
      <Impacto f={f} ini={s(55.1)} fim={s(59.0)} texto={'UM DOCUMENTO\nESPECÍFICO.'} tempos={P(55.12, 55.2, 55.72)} por="palavra" y={520} tam={150} />
      <Carimbo f={f} ini={s(56.95)} fim={s(59.0)} texto="COM DATA." x={1090} y={560} tam={120} giro={-7} />
      {f >= s(57.3) && f < s(59.1) && (
        <div style={{ ...em(1110, 760, M(44, COR.papel)), opacity: saiCubica(prog(f, s(57.3), 8)) * (1 - prog(f, s(59.0), 6)), letterSpacing: '0.12em' }}>
          {blocos}
        </div>
      )}
      <Tarja f={f} ini={s(59.3)} fim={s(61.85)} texto="VOU TE MOSTRAR DAQUI A ALGUNS MINUTOS" y={800} tempos={P(59.5, 59.7, 59.98, 60.5, 60.78, 60.94, 61.18)} />
    </Jogo>
  );
};

/** 80-106 s · a competência do Arthur */
export const Competencia: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 2400;
  const barra3 = prog(f, s(84.3), s(86.2) - s(84.3));
  return (
    <Jogo
      arq="c04-B.mp4"
      k={f - ini}
      f={f}
      id="c04"
      clipes={clipes}
      cor={{ sat: 1.0, temp: 0.5 }}
      zoom={1.02 + 0.04 * prog(f, ini, 780) + soco(f, s(89.72), 0.06) + soco(f, s(80.26), 0.025, 14) + soco(f, s(81.3), 0.025, 14) + soco(f, s(82.34), 0.025, 14)}
    >
      <Sombra f={f} ini={s(79.46)} fim={s(105.4)} />
      {/* sabe laçar, sabe atirar, sabe cobrar: a palavra troca na batida */}
      <Tarja f={f} ini={s(79.46)} fim={s(83.25)} texto="ARTHUR SABE" y={560} tempos={P(79.46, 79.96)} />
      <Impacto f={f} ini={s(80.26)} fim={s(81.22)} texto="LAÇAR" y={640} tam={210} passo={0.8} />
      <Impacto f={f} ini={s(81.3)} fim={s(82.26)} texto="ATIRAR" y={640} tam={210} passo={0.8} />
      <Impacto f={f} ini={s(82.34)} fim={s(83.3)} texto="COBRAR" y={640} tam={210} passo={0.8} cor={COR.vermelho} />
      {/* três segundos para decidir */}
      <Impacto f={f} ini={s(84.2)} fim={s(86.4)} texto="3 SEGUNDOS" y={640} tam={170} por="palavra" passo={6} />
      {f >= s(84.2) && f < s(86.5) && (
        <div style={{ ...em(135, 840), width: 700, height: 12, background: 'rgba(233,198,147,0.25)', opacity: 1 - prog(f, s(86.4), 4) }}>
          <div style={{ width: `${(barra3 * 100).toFixed(2)}%`, height: '100%', background: COR.vermelho }} />
        </div>
      )}
      <Tarja f={f} ini={s(85.2)} fim={s(87.0)} texto="VAI PRECISAR DE VIOLÊNCIA?" y={860} tempos={P(85.68, 85.84, 86.32, 86.44)} />
      <Tarja f={f} ini={s(87.1)} fim={s(89.0)} texto="OU O SUJEITO JÁ ENTENDEU" y={800} tempos={P(87.1, 87.64, 87.74, 88.14, 88.3)} />
      {/* vinte anos de ofício */}
      <Impacto f={f} ini={s(89.6)} fim={s(93.0)} texto="20 ANOS DE OFÍCIO" tempos={P(89.72, 90.02, 90.3, 90.48)} por="palavra" y={610} tam={176} />
      <Tarja f={f} ini={s(91.1)} fim={s(93.0)} texto="E O OFÍCIO É SER BANDIDO" y={810} tempos={P(91.08, 91.3, 91.4, 91.76, 91.86, 92.08)} />
      {/* método, ferramenta, manha */}
      <Tarja f={f} ini={s(93.1)} fim={s(94.5)} texto="NÃO É UM TALENTO VAGO" y={800} />
      <Impacto f={f} ini={s(94.56)} fim={s(99.2)} texto="É UM OFÍCIO" por="palavra" passo={4} y={590} tam={160} />
      <Etiqueta f={f} ini={s(95.9)} fim={s(99.2)} texto="MÉTODO" x={135} y={790} tam={44} />
      <Etiqueta f={f} ini={s(96.46)} fim={s(99.2)} texto="FERRAMENTA" x={390} y={790} tam={44} />
      <Etiqueta f={f} ini={s(97.6)} fim={s(99.2)} texto="MANHA APRENDIDA APANHANDO" x={770} y={790} tam={44} fundo={COR.vermelho} cor={COR.papel} />
      {/* o produto */}
      <Tarja f={f} ini={s(100.7)} fim={s(102.75)} texto="PRODUTO: TOMAR O QUE É DOS OUTROS" y={800} tempos={P(100.82, 101.38, 101.72, 101.92, 102.04, 102.14, 102.34)} />
      <Impacto f={f} ini={s(102.8)} fim={s(105.5)} texto={'E O JOGO TE DEIXA\nFICAR BOM NELE.'} tempos={P(102.84, 103.1, 103.2, 103.46, 103.66, 103.94, 104.26, 104.52)} por="palavra" y={560} tam={136} destaque={{ 6: COR.vermelho }} />
    </Jogo>
  );
};

/** 106-146,9 s · a cobrança da dívida */
export const Divida: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 3180;
  const t = tremor(f, s(122.74), 20, 12);
  // depois da tosse a cor vai embora
  const dreno = prog(f, s(133.0), s(146.5) - s(133.0));
  const sangue = f >= s(132.6) ? Math.max(0, Math.sin(c01((f - s(132.6)) / 30) * Math.PI)) : 0;
  const sub = saiExpo(prog(f, s(142.9), 8)) * (1 - saiExpo(prog(f, s(143.45), 8)));
  return (
    <Jogo
      arq="c05-A.mp4"
      k={f - ini}
      f={f}
      id="c05"
      clipes={clipes}
      cor={{ sat: mix(0.95, 0.28, dreno), temp: mix(0.35, -0.15, dreno) }}
      zoom={1.02 + 0.04 * prog(f, ini, 1228) + soco(f, s(122.74), 0.07, 20)}
      dx={t.x}
      dy={t.y}
    >
      <Sombra f={f} ini={s(106.0)} fim={s(138.5)} />
      <Tarja f={f} ini={s(106.0)} fim={s(109.0)} texto="20 HORAS DE JOGO DEPOIS" y={190} />
      <Tarja f={f} ini={s(107.3)} fim={s(109.0)} texto="ELE VAI COBRAR UMA DÍVIDA" y={800} tempos={P(107.34, 107.54, 107.7, 108.02, 108.24)} />
      <Impacto f={f} ini={s(109.1)} fim={s(113.1)} texto="SERVIÇO DE ROTINA" tempos={P(109.16, 109.68, 109.82)} por="palavra" y={620} tam={150} />
      <Tarja f={f} ini={s(111.5)} fim={s(113.1)} texto="JÁ FEZ CENTENAS DE VEZES" y={800} tempos={P(111.64, 111.78, 112.04, 112.56, 112.76)} />

      {/* o devedor e o ancinho */}
      <Tarja f={f} ini={s(113.3)} fim={s(118.8)} texto="O DEVEDOR ESTÁ NO ROÇADO DA PRÓPRIA CASA" y={748} tempos={P(113.34, 113.68, 114.04, 114.26, 114.38, 114.86, 115.0, 115.28)} />
      <Tarja f={f} ini={s(116.8)} fim={s(118.8)} texto="TENTA SE DEFENDER COM UM ANCINHO" y={820} cor={COR.creme} tempos={P(116.88, 117.16, 117.28, 117.64, 117.86, 117.92)} />
      <Tarja f={f} ini={s(119.0)} fim={s(122.3)} texto="ARTHUR TOMA O ANCINHO" y={748} tempos={P(119.0, 119.46, 119.86, 119.94)} />
      <Tarja f={f} ini={s(120.8)} fim={s(122.3)} texto="E DERRUBA O HOMEM NO CHÃO." y={820} cor={COR.creme} tempos={P(120.86, 121.0, 121.3, 121.4, 121.6, 121.74)} />
      <Impacto f={f} ini={s(122.6)} fim={s(123.7)} texto="E BATE." estilo="bate" por="palavra" passo={3} y={600} tam={230} barra={false} />
      <Tarja f={f} ini={s(123.9)} fim={s(125.2)} texto="O SUJEITO ESTÁ DOENTE" y={800} />
      <Tarja f={f} ini={s(125.3)} fim={s(127.1)} texto="DOENTE DE UM JEITO QUE DÁ PRA VER" y={800} tempos={P(125.34, 125.86, 126.0, 126.08, 126.3, 126.46, 126.58, 126.76)} />
      <Impacto f={f} ini={s(127.5)} fim={s(130.5)} texto={'ELE BATE\nASSIM MESMO'} tempos={P(127.6, 127.94, 128.64, 128.86)} por="palavra" y={500} tam={150} />
      <Tarja f={f} ini={s(129.2)} fim={s(130.5)} texto="PORQUE É O SERVIÇO" y={830} cor={COR.creme} />

      {/* a tosse */}
      <Tarja f={f} ini={s(130.7)} fim={s(134.2)} texto="ENCOSTADO NA CERCA, SEM AR, O HOMEM" y={540} tempos={P(130.78, 131.26, 131.46, 131.72, 132.02, 132.28, 132.32)} />
      <Impacto f={f} ini={s(132.5)} fim={s(134.2)} texto="TOSSE SANGUE" y={620} tam={176} cor={COR.vermelho} tempos={P(132.54, 132.88)} por="palavra" />
      <Tarja f={f} ini={s(133.1)} fim={s(134.2)} texto="NA CARA DO ARTHUR." y={830} cor={COR.creme} tempos={P(133.16, 133.3, 133.52, 133.7)} />
      <Tarja f={f} ini={s(134.4)} fim={s(138.4)} texto="A MULHER E O FILHO CHEGAM CORRENDO" y={748} tempos={P(134.4, 134.6, 134.8, 134.92, 135.02, 135.26, 135.7)} />
      <Tarja f={f} ini={s(136.4)} fim={s(138.4)} texto="PRA LEVANTAR ELE DO CHÃO." y={820} cor={COR.creme} tempos={P(136.44, 137.08, 137.58, 137.78, 137.96)} />
      <Tarja f={f} ini={s(138.7)} fim={s(139.25)} texto="É ASSIM:" y={800} />
      {/* um pulso vermelho nas bordas */}
      {sangue > 0 && (
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(205,18,15,0) 45%, rgba(205,18,15,0.75) 100%)', opacity: sangue * 0.8, mixBlendMode: 'multiply' }} />
      )}

      <Centro
        f={f}
        ini={s(139.3)}
        fim={s(141.85)}
        y={330}
        escurece={0.45}
        vao={6}
        linhas={[
          { texto: 'SEM MÚSICA.', t: s(139.36), tam: 130 },
          { texto: 'SEM CÂMERA LENTA.', t: s(140.24), tam: 130 },
          { texto: 'SEM AVISO.', t: s(141.08), tam: 130, cor: COR.vermelho },
        ]}
      />
      {/* "o jogo não sublinha nada": o sublinhado começa e volta atrás */}
      <Centro f={f} ini={s(141.95)} fim={s(143.95)} y={430} escurece={0.45} linhas={[{ texto: 'O JOGO NÃO SUBLINHA NADA.', tempos: P(141.98, 142.44, 142.72, 142.92, 143.4), tam: 130 }]} />
      {sub > 0.001 && <div style={{ ...em(W / 2 - 94, 588), width: 462, height: 12, background: COR.vermelho, transform: `scaleX(${sub.toFixed(4)})`, transformOrigin: 'left center' }} />}
      <Sombra f={f} ini={s(144.0)} fim={s(146.6)} />
      <Tarja f={f} ini={s(144.0)} fim={s(146.5)} texto="VOCÊ PASSA POR ALI E SEGUE." y={800} tempos={P(144.06, 144.46, 144.74, 144.96, 145.14, 145.32)} />
      <Clarao f={f} ini={s(122.74)} dur={5} forca={0.35} />
    </Jogo>
  );
};

