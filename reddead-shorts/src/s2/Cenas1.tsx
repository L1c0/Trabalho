import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, H, mix, prog, rnd, saiExpo, saiVolta, tremores, W } from '../kit/base';
import { Brasas, Camera, Clarao, Papel, Poeira, Raios, Sol } from '../kit/Cena';
import { Carimbo, Cruz, Maquina, Traco } from '../kit/Pecas';
import { A, Cinetico, Cz, Hodometro, Mq, O, Sl } from '../kit/Texto';
import { DentroDaTinta, Sangra, Tinta } from '../kit/Tinta';
import { C, q, qp } from './tempo';

/** Batida que vem grande e assenta: escala de um letreiro que entra em `t0`. */
const bate = (f: number, t0: number, forca = 0.9, dur = 5) => 1 + forca * Math.pow(1 - prog(f, t0, dur), 3);

/**
 * 0,7-8,4 · "Em 1899, quando o Arthur Morgan começa a tossir, a medicina
 * ocidental inteira não tinha nada para oferecer para ele."
 * O busto dele em tinta. No "tossir" uma mancha vermelha abre no peito.
 */
export const Tosse: React.FC<{ f: number }> = ({ f }) => {
  const tAno = qp('1899') - 1;
  const tTosse = qp('tossir');
  const tMed = qp('medicina') - 2;
  const tNao = qp('não');
  const tNada = qp('nada');
  const tr = tremores(f, [
    [tAno, 26, 12],
    [tTosse, 14, 7],
    [tTosse + 6, 11, 7],
    [tNada, 30, 14],
  ]);
  // o coração: a mancha pulsa a cada batida
  const pulso = f >= tTosse ? 1 + 0.035 * Math.pow(Math.max(0, Math.sin(((f - tTosse) / 27) * Math.PI * 2)), 6) : 1;
  const k = Math.min(166, f * 0.7);
  const anoSai = prog(f, tMed - 4, 6);
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.07 * prog(f, 0, 230)} origem="50% 62%">
        <Sol x={540} y={1000} r={470} cor={COR.ouro} op={0.9} />
        <DentroDaTinta take="busto" k={k} y={560}>
          {/* a mancha no peito: dois lóbulos, como um par de pulmões */}
          <Sangra n={1} k={(f - tTosse) * 0.9} x={130} y={640} w={520} cor={COR.vermelho} modo="clareia" giro={-12} escala={pulso} />
          <Sangra n={3} k={(f - tTosse - 5) * 0.8} x={430} y={690} w={520} cor={COR.vermelho} modo="clareia" giro={30} escala={pulso} />
          <Sangra n={2} k={(f - tNada) * 1.2} x={90} y={560} w={900} cor={COR.sangue} modo="clareia" giro={8} escala={pulso} />
        </DentroDaTinta>
        <div style={{ position: 'absolute', left: -200, top: 1800, width: W + 400, height: 800, background: COR.tinta }} />

        {/* 1899 */}
        {f >= tAno && anoSai < 1 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 150, textAlign: 'center', ...A(400, COR.sangue, { letterSpacing: '0.01em' }), transform: `scale(${bate(f, tAno, 1.2, 6).toFixed(4)})`, opacity: 1 - anoSai }}>1899</div>
        )}
        {/* a medicina ocidental inteira */}
        {f >= tMed && f < tNada && (
          <Cinetico
            texto={'A MEDICINA\nOCIDENTAL\nINTEIRA'}
            f={f}
            ini={tMed}
            tempos={[tMed, tMed + 2, qp('ocidental'), qp('inteira')]}
            por="palavra"
            dur={7}
            estilo="mascara"
            style={{ position: 'absolute', left: 0, width: W, top: 176, textAlign: 'center', ...Cz(96, COR.tinta, 0.16, { fontWeight: 700, lineHeight: 1.2, paddingLeft: '0.16em' }), opacity: 1 - prog(f, tNao - 3, 4) }}
          />
        )}
        {f >= tNao && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 176, textAlign: 'center', ...O(60, COR.tinta, 0.34, { paddingLeft: '0.34em' }), opacity: prog(f, tNao, 4) }}>não tinha</div>
        )}
        {f >= tNada && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 232, textAlign: 'center', ...A(390, COR.sangue), transform: `scale(${bate(f, tNada, 1.1, 6).toFixed(4)})` }}>NADA</div>
        )}
      </Camera>
      <Clarao f={f} ini={tAno} dur={6} forca={0.5} />
      <Clarao f={f} ini={tTosse} dur={5} forca={0.35} cor={COR.vermelho} />
      <Clarao f={f} ini={tNada} dur={6} forca={0.6} />
    </Papel>
  );
};

/**
 * 8,4-11,9 · "Não é que o tratamento era ruim. É que não existia tratamento."
 * Uma ficha: o campo "tratamento" recebe "ruim", que é riscado; o carimbo
 * diz o que vale.
 */
export const Tratamento: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.tratamento);
  const tRuim = qp('ruim');
  const tE = qp('é', 2);
  const tEx = qp('existia');
  const tTr = qp('tratamento', 2);
  const tr = tremores(f, [
    [tRuim, 18, 9],
    [tEx, 30, 14],
  ]);
  const some = 1 - prog(f, tE + 5, 6);
  return (
    <Papel cor={COR.sangue}>
      <Camera fundo={COR.sangue} x={tr.x} y={tr.y} rot={tr.rot} escala={1.0 + 0.05 * prog(f, f0, 110)}>
        <Brasas f={f} n={22} semente={21} forca={0.7} />
        {/* a ficha */}
        <div style={{ position: 'absolute', left: 0, width: W, top: 360, textAlign: 'center', ...Cz(84, COR.osso, 0.2, { fontWeight: 700, paddingLeft: '0.2em' }), opacity: saiExpo(prog(f, f0, 8)) }}>TRATAMENTO</div>
        <Traco f={f} t0={f0 + 2} dur={12} x={150} y={478} w={780} h={5} cor={COR.osso} origem="center" />
        <div style={{ position: 'absolute', left: 90, top: 560, width: 900, height: 470, border: `8px solid ${COR.osso}`, boxSizing: 'border-box', opacity: saiExpo(prog(f, f0 + 3, 8)) }} />
        {/* "ruim", que não era o caso */}
        {f >= tRuim && some > 0 && (
          <div style={{ position: 'absolute', left: 90, width: 900, top: 596, textAlign: 'center', ...A(360, COR.osso), opacity: some, transform: `scale(${bate(f, tRuim).toFixed(4)})` }}>RUIM</div>
        )}
        {some > 0 && <div style={{ opacity: some }}><Traco f={f} t0={tE - 3} dur={7} x={170} y={786} w={740} h={26} cor={COR.tinta} giro={-5} /></div>}
        {/* o campo vazio */}
        {f >= tE + 8 && <div style={{ position: 'absolute', left: 170, top: 880, width: 740, height: 8, background: COR.osso, opacity: 0.55 * (Math.floor(f / 7) % 2 ? 1 : 0.4) }} />}
        <Carimbo f={f} t0={tEx} x={540} y={792} linhas={['NÃO', 'EXISTIA']} tam={146} cor={COR.osso} giro={-8} escalas={[0.8, 1]} />
        {/* e o próprio título é riscado */}
        <Traco f={f} t0={tTr} dur={8} x={130} y={404} w={820} h={18} cor={COR.tinta} giro={-1.5} />
      </Camera>
      <Clarao f={f} ini={tEx} dur={6} forca={0.7} />
    </Papel>
  );
};

/** Garrafa de leite, em tinta. */
const Garrafa: React.FC<{ x: number; y: number; alt: number; t: number }> = ({ x, y, alt, t }) => (
  <svg width={alt * 0.48} height={alt} viewBox="0 0 200 420" style={{ position: 'absolute', left: x, top: y, transform: `scale(${saiVolta(c01(t), 1.4).toFixed(4)})`, transformOrigin: '50% 100%', overflow: 'visible' }}>
    <rect x={66} y={0} width={68} height={30} rx={6} fill={COR.sangue} />
    <path d="M75,26 L75,96 C75,132 30,142 30,192 L30,384 Q30,406 52,406 L148,406 Q170,406 170,384 L170,192 C170,142 125,132 125,96 L125,26 Z" fill={COR.osso} stroke={COR.tinta} strokeWidth={10} strokeLinejoin="round" />
    <path d="M30,230 L170,230 L170,384 Q170,406 148,406 L52,406 Q30,406 30,384 Z" fill="#fff" stroke={COR.tinta} strokeWidth={10} strokeLinejoin="round" />
    <rect x={50} y={250} width={12} height={120} rx={6} fill={COR.tinta} opacity={0.22} />
  </svg>
);

/** Corte de carne com osso, em tinta. */
const Carne: React.FC<{ x: number; y: number; larg: number; t: number }> = ({ x, y, larg, t }) => (
  <svg width={larg} height={larg * 0.75} viewBox="0 0 400 300" style={{ position: 'absolute', left: x, top: y, transform: `scale(${saiVolta(c01(t), 1.4).toFixed(4)}) rotate(-8deg)`, overflow: 'visible' }}>
    <path d="M40,120 C30,56 96,22 168,30 C214,35 236,58 262,60 C314,64 372,86 366,150 C360,224 300,276 214,280 C150,283 112,262 86,226 C62,192 46,160 40,120 Z" fill={COR.osso} stroke={COR.tinta} strokeWidth={12} strokeLinejoin="round" />
    <path d="M76,122 C70,80 112,60 166,64 C206,67 226,90 258,94 C300,99 336,112 332,152 C327,206 286,244 216,248 C166,251 136,234 114,208 C94,184 80,156 76,122 Z" fill="#8f100b" stroke={COR.tinta} strokeWidth={7} />
    <path d="M150,84 L252,102 L247,126 L207,119 L188,214 L165,208 L184,115 L145,108 Z" fill={COR.osso} stroke={COR.tinta} strokeWidth={7} strokeLinejoin="round" />
    <path d="M108,150 C116,176 134,198 156,214" fill="none" stroke={COR.osso} strokeWidth={6} strokeLinecap="round" opacity={0.75} />
    <path d="M214,188 C232,196 252,194 268,182" fill="none" stroke={COR.osso} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    <path d="M226,112 C246,114 268,116 290,128" fill="none" stroke={COR.osso} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
  </svg>
);

/** O número do item da receita, numa bola. */
const Item: React.FC<{ n: number; f: number; t0: number; cor?: string; fundo?: string }> = ({ n, f, t0, cor = COR.osso, fundo = COR.tinta }) => (
  <div style={{ position: 'absolute', left: 84, top: 236, width: 150, height: 150, borderRadius: '50%', background: fundo, transform: `scale(${saiVolta(prog(f, t0, 9), 1.6).toFixed(4)})` }}>
    <div style={{ position: 'absolute', left: 0, width: 150, top: 16, textAlign: 'center', ...A(108, cor) }}>{n}</div>
  </div>
);

/** A palavra do item, grande, embaixo. */
const Palavra: React.FC<{ f: number; t0: number; linhas: string[]; tempos?: number[]; cor?: string; tam?: number; top?: number }> = ({ f, t0, linhas, tempos, cor = COR.tinta, tam = 190, top = 1090 }) => (
  <Cinetico texto={linhas.join('\n')} f={f} ini={t0} tempos={tempos} por="linha" passo={4} dur={6} estilo="bate" style={{ position: 'absolute', left: 0, width: W, top, textAlign: 'center', ...A(tam, cor, { lineHeight: 1.0 }) }} />
);

/**
 * 11,9-19,9 · "O que se prescrevia para a tuberculose era ar de montanha,
 * leite, carne vermelha, repouso e cavalgada vigorosa."
 * A receita, e depois um cartão para cada item.
 */
export const Receita: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.receita);
  const cortes = [q(C.ar), q(C.leite), q(C.carne), q(C.repouso), q(C.cavalgada)];
  if (f < cortes[0]) {
    // a folha de receita
    return (
      <Papel cor={COR.papel}>
        <Camera fundo={COR.papel} escala={1.0 + 0.06 * prog(f, f0, 70)} origem="40% 40%">
          <div style={{ position: 'absolute', left: 84, top: 150, fontFamily: "'RS Assina', cursive", fontSize: 330, lineHeight: 1, color: COR.vermelho, opacity: saiExpo(prog(f, f0, 7)), transform: `scale(${bate(f, f0, 0.5).toFixed(4)})`, transformOrigin: '20% 60%' }}>Rx</div>
          <Cinetico texto="RECEITA" f={f} ini={f0 + 3} por="letra" passo={1} dur={7} estilo="foco" style={{ position: 'absolute', left: 500, top: 270, ...Cz(92, COR.tinta, 0.16, { fontWeight: 700 }) }} />
          <Traco f={f} t0={f0 + 6} dur={12} x={500} y={396} w={480} h={6} cor={COR.tinta} />
          <Maquina f={f} t0={f0 + 10} texto={'Paciente: A. Morgan\nMal: tuberculose\nAno: 1899'} cps={30} style={{ position: 'absolute', left: 110, top: 690, ...Mq(64, COR.tinta, { lineHeight: 1.7 }) }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 110, top: 1060 + i * 64, width: 860 * saiExpo(prog(f, f0 + 34 + i * 3, 10)), height: 4, background: COR.tinta, opacity: 0.35 }} />
          ))}
        </Camera>
        <Poeira f={f} forca={0.3} />
      </Papel>
    );
  }
  const caso = f >= cortes[4] ? 4 : f >= cortes[3] ? 3 : f >= cortes[2] ? 2 : f >= cortes[1] ? 1 : 0;
  const t0 = cortes[caso];
  const tr = tremores(f, [[t0, 20, 9]]);
  const cores = [COR.ouro, COR.papel, COR.sangue, COR.noite, COR.noite];
  const cor = cores[caso];
  return (
    <Papel cor={cor}>
      <Camera fundo={cor} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.05 * prog(f, t0, 50)} origem="50% 50%">
        {caso === 0 && (
          <>
            <Raios f={f} x={560} y={900} op={0.11} />
            <Sol x={560} y={900} r={310} cor={COR.sangue} />
            <Tinta take="morro" k={30 + (f - t0) * 1.4} y={270} />
            <div style={{ position: 'absolute', left: -200, top: 1700, width: W + 400, height: 800, background: COR.tinta }} />
            <Item n={1} f={f} t0={t0} />
            <Palavra f={f} t0={t0} linhas={['AR DE MONTANHA']} cor={COR.osso} tam={132} top={1330} />
          </>
        )}
        {caso === 1 && (
          <>
            <Garrafa x={300} y={300} alt={780} t={prog(f, t0, 9)} />
            <Item n={2} f={f} t0={t0} />
            <Palavra f={f} t0={t0 + 1} linhas={['LEITE']} tam={260} top={1120} />
          </>
        )}
        {caso === 2 && (
          <>
            <Carne x={170} y={400} larg={740} t={prog(f, t0, 9)} />
            <Item n={3} f={f} t0={t0} cor={COR.sangue} fundo={COR.osso} />
            <Palavra f={f} t0={t0 + 1} linhas={['CARNE', 'VERMELHA']} tempos={[t0 + 1, qp('vermelha')]} cor={COR.osso} tam={186} top={1070} />
          </>
        )}
        {caso === 3 && (
          <>
            <div style={{ position: 'absolute', left: 0, top: 420, width: W, height: 860, background: COR.ouro }} />
            <Tinta take="acampa" k={(f - t0) * 1.0} y={420} />
            <div style={{ position: 'absolute', left: 0, top: 412, width: W, height: 10, background: COR.osso }} />
            <div style={{ position: 'absolute', left: 0, top: 1278, width: W, height: 10, background: COR.osso }} />
            <Item n={4} f={f} t0={t0} cor={COR.tinta} fundo={COR.osso} />
            <Palavra f={f} t0={t0 + 1} linhas={['REPOUSO']} cor={COR.osso} tam={210} top={1330} />
          </>
        )}
        {caso === 4 && (
          <>
            <Sol x={560} y={720} r={330} cor={COR.vermelho} />
            <Tinta take="morro" k={296 + (f - t0) * 1.5} y={90} modo="clareia" cor={COR.sol} />
            <div style={{ position: 'absolute', left: -200, top: 1520, width: W + 400, height: 900, background: COR.sol }} />
            <Item n={5} f={f} t0={t0} cor={COR.tinta} fundo={COR.osso} />
            <Palavra f={f} t0={t0 + 1} linhas={['CAVALGADA', 'VIGOROSA']} tempos={[t0 + 1, qp('vigorosa')]} cor={COR.tinta} tam={166} top={1120} />
          </>
        )}
      </Camera>
      <Clarao f={f} ini={t0} dur={4} forca={0.45} />
    </Papel>
  );
};

/**
 * 19,9-21,9 · "Prescrevia-se andar a cavalo."
 * Vermelho, o cavalo empinando, e o carimbo da receita.
 */
export const Cavalo: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.cavalo);
  const tAndar = qp('andar');
  const tr = tremores(f, [[tAndar, 34, 15]]);
  return (
    <Papel cor={COR.sangue}>
      <Camera fundo={COR.sangue} x={tr.x} y={tr.y} rot={tr.rot} escala={1.03 + 0.05 * prog(f, f0, 60)} origem="50% 45%">
        <Sol x={560} y={820} r={470} cor="#d8351f" halo="rgba(255,160,70,0.3)" />
        <Tinta take="raio" k={Math.max(0, 2 + (f - f0) * 1.25)} y={300} />
        <Brasas f={f} n={40} semente={31} />
        <Carimbo f={f} t0={tAndar} x={540} y={1250} linhas={['ANDAR', 'A CAVALO']} tam={130} cor={COR.osso} giro={-7} escalas={[1.1, 1]} />
      </Camera>
      <Clarao f={f} ini={tAndar} dur={7} forca={0.8} />
    </Papel>
  );
};

/**
 * 21,9-28,2 · "A tuberculose matava 194 americanos a cada 100 mil habitantes
 * por ano."
 * O contador sobe até 194 e uma cruz aparece para cada um.
 */
const COLS = 18;
export const Mortes: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.mortes);
  const t0 = qp('194');
  const tFim = q(23.6);
  const valor = Math.round(194 * (1 - Math.pow(1 - prog(f, t0, tFim - t0), 1.6)));
  const tAno = qp('ano');
  const tr = tremores(f, [
    [tFim, 28, 13],
    [tAno, 14, 9],
  ]);
  const cruzes = [];
  for (let i = 0; i < 194; i++) {
    const col = i % COLS;
    const lin = Math.floor(i / COLS);
    const aparece = t0 + ((i + 1) / 194) * (tFim - t0) * 0.98;
    const tt = (f - aparece) / 4;
    if (tt <= 0) continue;
    cruzes.push(<Cruz key={i} x={96 + col * 50 + (rnd(i, 1) - 0.5) * 6} y={840 + lin * 50 + (rnd(i, 2) - 0.5) * 6} tam={26} t={tt} semente={i} cor={i === 193 ? COR.vermelho : COR.osso} />);
  }
  return (
    <Papel cor={COR.noite}>
      <Camera fundo={COR.noite} x={tr.x} y={tr.y} rot={tr.rot} escala={1.0 + 0.04 * prog(f, f0, 180)} origem="50% 40%">
        <div style={{ position: 'absolute', left: 0, width: W, top: 250, textAlign: 'center', ...A(520, f >= tFim ? COR.vermelho : COR.osso, { letterSpacing: '0.01em', fontVariantNumeric: 'tabular-nums' }), transform: `scale(${(f >= tFim ? bate(f, tFim, 0.35, 6) : 1).toFixed(4)})`, opacity: prog(f, t0 - 2, 3) }}>
          {String(valor)}
        </div>
        {cruzes}
        {f >= tAno && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 1418, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: COR.vermelho, padding: '4px 34px 2px', ...A(92, COR.osso), transform: `scale(${bate(f, tAno, 0.7).toFixed(4)}) rotate(-2deg)` }}>POR ANO</span>
          </div>
        )}
      </Camera>
      <Clarao f={f} ini={tFim} dur={6} forca={0.55} cor={COR.vermelho} />
    </Papel>
  );
};
