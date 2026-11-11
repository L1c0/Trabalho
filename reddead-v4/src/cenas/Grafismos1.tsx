import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { c01, COR, mix, prog, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Barras, Clarao, Fundo, Grao, Neve, Poeira, Vinheta } from '../kit/Cena';
import { Etiqueta, Impacto, Tarja } from '../kit/Letreiro';
import { Chave, Datilo, Legenda, Papel, TINTA } from '../kit/Pecas';
import { Cinetico, conta, Hodometro, Risco, Traco } from '../kit/Texto';
import { A, em, M, O, S } from '../kit/tipos';
import { s } from '../tempo';

const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

/** 62-80 s · "Mas primeiro o homem. 1899." A montanha na neve. */
export const Neve1899: React.FC<Cena> = ({ f }) => {
  const ini = s(62.0);
  const anda = prog(f, ini, 540);
  const ano = conta(f, s(62.15), s(63.55) - s(62.15), 2026, 1899);
  const anoOp = saiExpo(prog(f, s(62.15), 8)) * (1 - prog(f, s(64.85), 8));
  const fimA = s(64.9);
  const fimB = s(72.45);
  const fimC = s(79.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070a', overflow: 'hidden' }}>
      <Img
        src={staticFile('arte/neve.jpg')}
        style={{
          position: 'absolute',
          left: -95,
          top: 0,
          width: 2110,
          height: 1080,
          transform: `scale(${(1.06 + 0.13 * anda).toFixed(5)}) translate(${(-34 * anda).toFixed(2)}px, 0)`,
          transformOrigin: '42% 62%',
          filter: 'saturate(0.5) brightness(0.95) contrast(1.14)',
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(3,6,10,0.86) 0%, rgba(3,6,10,0.4) 46%, rgba(3,6,10,0) 76%)' }} />
      <Neve f={f} n={150} />
      <Vinheta forca={0.55} />

      {/* 1899: o ano volta de hoje até lá */}
      <Tarja f={f} ini={s(62.04)} fim={fimA} texto="MAS PRIMEIRO, O HOMEM." y={215} tempos={P(62.04, 62.2, 62.58, 62.82)} />
      {anoOp > 0 && (
        <div style={{ ...em(128, 300), opacity: anoOp }}>
          <Hodometro valor={ano} casas={4} style={A(330)} />
        </div>
      )}

      {/* Arthur Morgan */}
      <Impacto f={f} ini={s(65.28)} fim={fimB} texto={'ARTHUR\nMORGAN'} y={280} tam={190} passo={2} />
      <Tarja f={f} ini={s(66.2)} fim={fimB} texto="SOBE UMA MONTANHA NA NEVE" y={724} tam={36} tempos={P(66.24, 66.58, 66.72, 67.12, 67.24)} />
      <Tarja f={f} ini={s(67.7)} fim={fimB} texto="ATRÁS DE UM BANDO QUE ERROU O ASSALTO" y={790} tam={36} tempos={P(67.74, 68.18, 68.26, 68.4, 68.6, 69.24, 69.6, 70.44)} />
      <Tarja f={f} ini={s(71.0)} fim={fimB} texto="FUGINDO COM O QUE SOBROU" y={856} tam={36} cor={COR.creme} tempos={P(71.2, 71.78, 72.08, 72.16, 72.22)} />

      {/* a competência */}
      <Tarja f={f} ini={s(72.6)} fim={fimC} texto="AS PRIMEIRAS HORAS DO JOGO" y={270} tempos={P(72.64, 73.46, 73.84, 74.18, 74.36)} />
      <Tarja f={f} ini={s(74.6)} fim={fimC} texto="SERVEM PRA UMA COISA SÓ:" y={342} tempos={P(74.64, 75.06, 75.26, 75.42, 75.72)} />
      <Legenda f={f} ini={s(76.14)} fim={fimC} x={140} y={452} texto="FAZER VOCÊ SENTIR A" tam={34} cor={COR.papel} />
      <Impacto f={f} ini={s(77.2)} fim={fimC} texto="COMPETÊNCIA" y={500} tam={224} passo={1.5} barra={false} />
      {f < fimC + 8 && <div style={{ opacity: 1 - prog(f, fimC, 6) }}><Traco f={f} ini={s(77.95)} dur={14} x={135} y={742} w={1196} h={12} /></div>}
      <Etiqueta f={f} ini={s(78.44)} fim={fimC} texto="DELE." x={135} y={786} tam={48} fundo={COR.vermelho} cor={COR.papel} />

      {/* a frase seguinte começa aqui e atravessa o corte */}
      <Tarja f={f} ini={s(79.46)} fim={s(83.25)} texto="ARTHUR SABE" y={560} tempos={P(79.46, 79.96)} />
      <Grao f={f} forca={0.16} />
      <Barras />
      <Clarao f={f} ini={ini} dur={8} forca={0.45} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Tuberculose: 146,9 a 207,1 s                                        */
/* ------------------------------------------------------------------ */

/** 194 riscos de contagem, em grupos de cinco, que acompanham o contador. */
const Riscos: React.FC<{ n: number; x: number; y: number }> = ({ n, x, y }) => {
  const marcas: React.ReactNode[] = [];
  for (let i = 0; i < 194; i++) {
    const t = c01(n - i);
    if (t <= 0) break;
    const g = Math.floor(i / 5);
    const j = i % 5;
    const gx = x + (g % 13) * 74;
    const gy = y + Math.floor(g / 13) * 118;
    if (j < 4) {
      marcas.push(<div key={i} style={{ position: 'absolute', left: gx + j * 13, top: gy, width: 6, height: 84, background: COR.creme, opacity: 0.9, transform: `scaleY(${t.toFixed(3)})`, transformOrigin: 'top' }} />);
    } else {
      marcas.push(
        <div key={i} style={{ position: 'absolute', left: gx - 9, top: gy + 39, width: 64, height: 6, background: COR.vermelho, transform: `rotate(-32deg) scaleX(${t.toFixed(3)})`, transformOrigin: 'left center' }} />,
      );
    }
  }
  return <>{marcas}</>;
};

/** 146,9-157,2 · "Tuberculose. ... 194 pessoas a cada 100 mil por ano." */
const Numero: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(157.15);
  const sobe = saiExpo(prog(f, s(149.45), 12));
  const t = tremor(f, s(147.34), 18, 10);
  const n = conta(f, s(150.0), s(151.2) - s(150.0), 0, 194);
  const sai = 1 - prog(f, fim, 8);
  return (
    <AbsoluteFill style={{ opacity: sai }}>
      <Fundo f={f} tom="sangue" luz={0.6} semente={3} />
      <Poeira f={f} n={30} cor="#e9b9a0" />
      <div style={{ ...em(135 + t.x, mix(360, 176, sobe) + t.y), transform: `scale(${mix(1, 0.3, sobe).toFixed(4)})`, transformOrigin: 'left top' }}>
        <Cinetico texto="TUBERCULOSE." f={f} ini={s(147.34)} por="letra" passo={0.7} dur={7} estilo="bate" style={A(262)} />
      </div>
      {f >= s(149.9) && (
        <>
          <div style={{ ...em(120, 286), opacity: saiExpo(prog(f, s(149.9), 6)) }}>
            <Hodometro valor={n} casas={3} style={A(440)} />
          </div>
          <Riscos n={n} x={820} y={330} />
        </>
      )}
      <Cinetico texto="PESSOAS A CADA 100 MIL, POR ANO" f={f} ini={0} tempos={P(151.92, 152.98, 153.22, 153.4, 153.66, 153.82, 154.04)} por="palavra" dur={7} estilo="sobe" style={em(140, 744, O(42, COR.papel, 0.26))} />
      <Tarja f={f} ini={s(148.06)} fim={s(154.5)} texto="EM 1900 · NOS ESTADOS UNIDOS" y={846} tempos={P(148.06, 148.34, 148.9, 149.08, 149.22, 149.52)} />
      <Tarja f={f} ini={s(154.7)} fim={fim} texto="NENHUMA OUTRA DOENÇA, SOZINHA, MATAVA MAIS." y={840} tam={48} cor={COR.creme} tempos={P(154.72, 155.32, 155.54, 155.96, 156.46, 156.86)} />
      <Clarao f={f} ini={s(147.34)} dur={6} cor={COR.vermelho} forca={0.5} />
    </AbsoluteFill>
  );
};

/** 157,3-164,8 · "o que existia pra tratar aquilo em 1899?" */
const Pergunta: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(164.72);
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(f, fim + 2, 5) }}>
      <Fundo f={f} tom="neutro" semente={5} />
      <Poeira f={f} n={26} />
      <Papel f={f} ini={s(157.6)} x={1120} y={190} w={600} h={720} giro={3.2} de="dir" pautas={72}>
        <div style={{ ...em(44, 30, A(54, TINTA)) }}>TRATAMENTO</div>
        <div style={{ ...em(44, 96, M(22, '#6b5a45')) }}>TUBERCULOSE · 1899</div>
        <div style={{ ...em(44, 132), width: 512, height: 4, background: TINTA }} />
        <Datilo f={f} ini={s(161.3)} texto="" style={{ ...em(44, 154), fontSize: 40 }} />
      </Papel>
      <Cinetico texto="E EU PRECISO QUE VOCÊ ENTENDA" f={f} ini={0} tempos={P(157.42, 157.84, 157.94, 158.18, 158.34, 158.56)} por="palavra" dur={7} estilo="sobe" style={em(140, 286, O(36, COR.cinza, 0.3))} />
      <Impacto f={f} ini={s(158.9)} fim={fim} texto={'O QUE EXISTIA\nPRA TRATAR\nAQUILO EM 1899?'} tempos={P(158.96, 159.3, 159.4, 159.92, 160.08, 160.4, 160.88, 161.24)} por="palavra" y={350} tam={128} destaque={{ 7: COR.vermelho }} />
      <Tarja f={f} ini={s(162.6)} fim={fim} texto="É ISSO QUE REDEFINE O JOGO INTEIRO" y={812} tempos={P(163.18, 163.26, 163.38, 163.48, 163.9, 164.0, 164.16)} />
    </AbsoluteFill>
  );
};

/** 165-169 · "Nada. ... Não havia tratamento." */
const Nada: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(168.95);
  const t = tremor(f, s(165.0), 26, 12);
  const cede = saiCubica(prog(f, s(165.8), 10));
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: 1 - prog(f, fim, 4) }}>
      <div style={{ ...em(t.x, mix(250, 170, cede) + t.y), width: W, textAlign: 'center', opacity: mix(1, 0.22, cede), transform: `scale(${mix(1, 0.8, cede).toFixed(4)})` }}>
        <Cinetico texto="NADA." f={f} ini={s(165.0)} por="letra" passo={1} dur={7} estilo="bate" style={A(470)} />
      </div>
      {f < s(167.86) && (
        <div style={{ ...em(0, 700), width: W, display: 'flex', justifyContent: 'center', gap: 18, opacity: 1 - prog(f, s(167.7), 5) }}>
          <Cinetico texto="NÃO É QUE O TRATAMENTO ERA" f={f} ini={0} tempos={P(165.84, 166.26, 166.34, 166.42, 166.5, 166.9)} por="palavra" dur={6} estilo="sobe" style={O(54, COR.papel, 0.22)} />
          <Risco f={f} ini={s(167.42)} dur={7} alt={10}>
            <Cinetico texto="PRECÁRIO." f={f} ini={s(167.12)} por="palavra" dur={6} estilo="sobe" style={O(54, COR.papel, 0.22)} />
          </Risco>
        </div>
      )}
      <Cinetico texto="NÃO HAVIA TRATAMENTO." f={f} ini={0} tempos={P(167.92, 168.12, 168.42)} por="palavra" dur={6} estilo="bate" style={{ ...em(0, 610), width: W, textAlign: 'center', ...A(156, COR.vermelho) }} />
      <Grao f={f} forca={0.12} />
      <Clarao f={f} ini={s(165.0)} dur={5} forca={0.6} />
    </AbsoluteFill>
  );
};

/** 169-182,2 · a linha do tempo: 1899, 1943, 1944 e os 44 anos. */
const Linha44: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(182.15);
  const X = (ano: number) => 230 + (ano - 1899) * 31.5;
  const EIXO = 570;
  const anda = prog(f, s(169.06), s(172.7) - s(169.06));
  const cabeca = X(1899 + 44 * anda);
  const anoAgora = Math.min(1943, 1899 + Math.floor(44 * anda));
  const quarenta = conta(f, s(179.0), 26, 0, 44);
  const ticks: React.ReactNode[] = [];
  for (let a = 1899; a <= 1944; a++) {
    if (X(a) > cabeca + 1 && a < 1944) continue;
    if (a === 1944 && f < s(177.5)) continue;
    const grande = a === 1899 || a === 1943 || a === 1944 || a % 10 === 0;
    ticks.push(<div key={a} style={{ position: 'absolute', left: X(a) - 1.5, top: EIXO - (grande ? 34 : 16), width: 4, height: grande ? 68 : 32, background: COR.creme, opacity: grande ? 0.95 : 0.5 }} />);
  }
  return (
    <AbsoluteFill style={{ opacity: Math.min(saiExpo(prog(f, s(169.0), 8)), 1 - prog(f, fim, 8)) }}>
      <Fundo f={f} tom="frio" semente={9} />
      <Poeira f={f} n={30} />
      <Tarja f={f} ini={s(169.06)} texto="O PRIMEIRO REMÉDIO QUE DE FATO FUNCIONOU" y={186} tempos={P(169.06, 169.62, 169.84, 170.14, 170.32, 170.48, 170.68)} />
      {/* o eixo: os anos passam um a um */}
      <div style={{ ...em(X(1899), EIXO - 4), width: Math.max(0, (f >= s(177.5) ? X(1944) : cabeca) - X(1899)), height: 8, background: COR.creme }} />
      {ticks}
      <div style={{ ...em(X(1899) - 18, EIXO - 18), width: 36, height: 36, borderRadius: 18, background: COR.vermelho, boxShadow: `0 0 30px ${COR.vermelho}` }} />
      <div style={em(160, 290, A(150))}>1899</div>
      <Legenda f={f} ini={s(169.2)} x={166} y={454} texto="ARTHUR ADOECE" tam={34} cor={COR.vermelho} />
      {anda > 0.02 && anda < 1 && <div style={{ ...em(cabeca - 70, EIXO - 96, M(40, COR.papel)), width: 140, textAlign: 'center' }}>{anoAgora}</div>}
      {/* a estreptomicina */}
      {f >= s(172.7) && (
        <div style={{ ...em(X(1943) - 18, EIXO - 18), width: 36, height: 36, borderRadius: 18, background: COR.creme, transform: `scale(${mix(3, 1, saiExpo(prog(f, s(172.7), 8))).toFixed(3)})`, opacity: c01(prog(f, s(172.7), 3)) }} />
      )}
      <Cinetico texto="ESTREPTOMICINA" f={f} ini={s(172.74)} por="letra" passo={0.8} dur={7} estilo="bate" style={{ position: 'absolute', right: 150, top: 262, ...A(112) }} />
      <Legenda f={f} ini={s(174.14)} x={1770} y={390} alinhar="dir" texto="ISOLADA EM 1943" tam={36} cor={COR.papel} />
      <Legenda f={f} ini={s(176.64)} x={1770} y={440} alinhar="dir" texto="TESTADA EM PACIENTES EM 1944" tam={36} cor={COR.papel} />
      {/* 44 anos */}
      <Chave f={f} ini={s(178.95)} dur={18} x1={X(1899)} x2={X(1943)} y={656} alt={30} larg={7} />
      {f >= s(179.0) && (
        <div style={{ ...em(X(1921) - 700, 668), width: 1400, textAlign: 'center', opacity: saiExpo(prog(f, s(179.0), 6)) }}>
          <Hodometro valor={quarenta} casas={2} style={A(210, COR.vermelho)} />
          <Cinetico texto=" ANOS" f={f} ini={s(179.78)} por="letra" passo={1} dur={6} estilo="mascara" style={{ display: 'inline-block', ...A(210), verticalAlign: 'top' }} />
        </div>
      )}
      <Cinetico texto="DEPOIS DO ANO EM QUE O ARTHUR ADOECE" f={f} ini={0} tempos={P(180.26, 180.56, 180.76, 180.88, 181.0, 181.04, 181.14, 181.38)} por="palavra" dur={6} estilo="sobe" style={{ ...em(X(1921) - 700, 886), width: 1400, textAlign: 'center', ...O(34, COR.papel, 0.3) }} />
    </AbsoluteFill>
  );
};

/** 182,3-207,1 · o que os manuais da época ofereciam. */
const Manuais: React.FC<{ f: number }> = ({ f }) => {
  const itens: [number, string, number][] = [
    [187.32, '1. Ar de montanha.', 24],
    [188.8, '2. Sanatório, longe de todo mundo.', 22],
    [191.34, '3. Dieta reforçada.', 24],
    [192.98, '4. Sangria, em alguns casos.', 24],
    [195.34, '5. Expectorantes.', 24],
    [199.06, '6. Cavalgada vigorosa.', 24],
    [203.92, '7. Nos últimos meses: opiáceos.', 14],
  ];
  const circ = saiExpo(prog(f, s(199.9), 14));
  const garrafa = saiExpo(prog(f, s(203.8), 14));
  return (
    <AbsoluteFill style={{ opacity: saiExpo(prog(f, s(182.2), 8)) }}>
      <Fundo f={f} tom="quente" semente={12} />
      <Poeira f={f} n={36} />
      <Tarja f={f} ini={s(182.36)} texto="O QUE A MEDICINA DE 1899" y={186} tempos={P(182.36, 182.84, 182.9, 183.0, 183.32, 183.44)} />
      <Tarja f={f} ini={s(184.2)} texto="TINHA PRA OFERECER" y={258} tempos={P(184.3, 184.7, 184.86)} />
      <Impacto f={f} ini={s(185.4)} fim={s(187.2)} texto={'ESTÁ NOS MANUAIS\nDA ÉPOCA.'} y={420} tam={112} tempos={P(185.4, 185.64, 185.88, 186.26, 186.4)} por="palavra" />
      <Papel f={f} ini={s(183.5)} x={1050} y={172} w={730} h={764} giro={1.6} de="dir">
        <div style={em(46, 30, A(58, TINTA))}>TUBERCULOSE</div>
        <div style={em(46, 100, M(21, '#6b5a45'))}>TRATAMENTO · CONFORME OS MANUAIS DA ÉPOCA</div>
        <div style={{ ...em(46, 138), width: 638, height: 4, background: TINTA }} />
        {itens.map(([t, txt, cps], i) => (
          <Datilo key={i} f={f} ini={s(t)} texto={txt} cps={cps} cursor={f < s(i + 1 < itens.length ? itens[i + 1][0] : 999)} style={{ ...em(46, 178 + i * 80), fontSize: 30, fontWeight: 500 }} />
        ))}
        {/* a anotação à margem e o círculo em volta da cavalgada */}
        <Cinetico texto={'isso está nos registros.\nnão é piada.'} f={f} ini={0} tempos={P(196.3, 196.38, 197.3, 197.4, 197.58, 198.26, 198.4, 198.52)} por="palavra" dur={5} estilo="sobe" style={{ ...em(384, 470), ...S(28, COR.vermelho, { fontWeight: 600, lineHeight: 1.1 }), transform: 'rotate(-4deg)' }} />
        {circ > 0 && (
          <svg width={730} height={764} style={{ position: 'absolute', left: 0, top: 0 }}>
            <ellipse cx={262} cy={598} rx={236} ry={36} fill="none" stroke={COR.vermelho} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circ} transform="rotate(-2 262 598)" />
          </svg>
        )}
      </Papel>
      {/* à esquerda, o item da vez em letra grande */}
      <Impacto f={f} ini={s(187.3)} fim={s(188.7)} texto={'AR DE\nMONTANHA'} y={400} tam={128} tempos={P(187.32, 187.84, 188.02)} por="palavra" />
      <Impacto f={f} ini={s(188.9)} fim={s(191.2)} texto="SANATÓRIO" y={430} tam={140} />
      <Legenda f={f} ini={s(189.78)} fim={s(191.2)} x={140} y={592} texto="LONGE DE TODO MUNDO" tam={36} cor={COR.papel} />
      <Impacto f={f} ini={s(191.3)} fim={s(192.85)} texto={'DIETA\nREFORÇADA'} y={400} tam={128} tempos={P(191.34, 191.78)} por="palavra" />
      <Impacto f={f} ini={s(192.98)} fim={s(195.2)} texto="SANGRIA" y={430} tam={150} cor={COR.vermelho} />
      <Legenda f={f} ini={s(193.58)} fim={s(195.2)} x={140} y={600} texto="EM ALGUNS CASOS" tam={36} cor={COR.papel} />
      <Impacto f={f} ini={s(195.34)} fim={s(196.25)} texto="EXPECTORANTES" y={440} tam={118} passo={0.8} />
      <Tarja f={f} ini={s(196.3)} fim={s(198.95)} texto="E ISSO ESTÁ NOS REGISTROS." y={420} tempos={P(196.3, 196.38, 197.3, 197.4, 197.58)} />
      <Impacto f={f} ini={s(198.2)} fim={s(198.95)} texto="NÃO É PIADA." y={500} tam={150} tempos={P(198.26, 198.4, 198.52)} por="palavra" />
      <Impacto f={f} ini={s(199.06)} fim={s(203.7)} texto={'CAVALGADA\nVIGOROSA.'} y={380} tam={150} cor={COR.vermelho} estilo="bate" tempos={P(199.06, 200.16)} por="palavra" barra={false} />
      <Tarja f={f} ini={s(201.3)} fim={s(203.7)} texto="PRESCREVIA-SE ANDAR A CAVALO." y={730} tam={46} tempos={P(201.36, 202.18, 202.6, 202.78)} />
      {/* os opiáceos */}
      {garrafa > 0 && (
        <div style={{ ...em(135, 330), width: 270, height: 356, transform: `rotate(${(-5 + (1 - garrafa) * -14).toFixed(2)}deg) translateY(${((1 - garrafa) * 700).toFixed(1)}px)`, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', border: `8px solid ${COR.papel}`, overflow: 'hidden' }}>
          <Img src={staticFile('arte/garrafa.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.45) saturate(0.8) contrast(1.05)' }} />
        </div>
      )}
      <Legenda f={f} ini={s(204.6)} x={135} y={716} texto="LÁUDANO · TINTURA DE ÓPIO" tam={22} cor={COR.cinza} />
      <Tarja f={f} ini={s(203.92)} texto="PROS ÚLTIMOS MESES" x={480} y={360} tempos={P(203.92, 204.12, 204.4)} />
      <Impacto f={f} ini={s(205.56)} fim={s(208)} texto="OPIÁCEOS." x={480} y={440} tam={126} />
      <Etiqueta f={f} ini={s(206.38)} fim={s(208)} texto="PRA DOR." x={480} y={600} tam={50} fundo={COR.vermelho} cor={COR.papel} />
    </AbsoluteFill>
  );
};

export const Tuberculose: React.FC<Cena> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {f < s(157.4) && <Numero f={f} />}
    {f >= s(157.3) && f < s(165.0) && <Pergunta f={f} />}
    {f >= s(165.0) && f < s(169.1) && <Nada f={f} />}
    {f >= s(169.0) && f < s(182.5) && <Linha44 f={f} />}
    {f >= s(182.2) && <Manuais f={f} />}
    <Vinheta forca={0.4} />
    <Grao f={f} forca={0.13} />
  </AbsoluteFill>
);
