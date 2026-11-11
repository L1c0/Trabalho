import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, H, mix, prog, rnd, saiCubica, saiExpo, W } from '../kit/base';
import { Jogo } from '../kit/Jogo';
import { Carimbo, Centro, Impacto, Maquina, Sombra, Tarja } from '../kit/Letreiro';
import { Cinetico, conta, Hodometro } from '../kit/Texto';
import { A, em, O, S } from '../kit/tipos';
import { s } from '../tempo';
import { soco } from './Jogadas1';

const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

/** 207,1-225 s · o médico de mãos vazias */
export const Medico: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 6212;
  return (
    <Jogo arq="c10-A.mp4" k={f - ini} f={f} id="c10" clipes={clipes} cor={{ sat: 0.35, temp: -0.2 }} zoom={1.02 + 0.04 * prog(f, ini, 539) + soco(f, s(218.82), 0.05)}>
      <Sombra f={f} ini={s(207.7)} fim={s(224.9)} />
      <Tarja f={f} ini={s(208.8)} fim={s(212.75)} texto="O MÉDICO OLHA PRO ARTHUR E MANDA:" y={500} tempos={P(208.94, 209.08, 209.24, 209.52, 209.74, 210.06, 210.26)} />
      <Impacto f={f} ini={s(210.6)} fim={s(212.75)} texto={'CLIMA SECO\nE DESCANSO.'} tempos={P(211.22, 211.5, 211.88, 211.96)} por="palavra" y={590} tam={146} />
      <Tarja f={f} ini={s(212.86)} fim={s(214.7)} texto="AQUELE MÉDICO NÃO É INCOMPETENTE" y={800} tempos={P(212.86, 213.42, 213.72, 213.88, 213.94)} />
      <Impacto f={f} ini={s(214.8)} fim={s(218.6)} texto={'É A MEDICINA\nOCIDENTAL INTEIRA\nEM 1899.'} tempos={P(215.44, 215.56, 215.68, 216.02, 216.46, 217.16, 217.46)} por="palavra" y={470} tam={128} destaque={{ 6: COR.vermelho }} />
      <Centro f={f} ini={s(218.7)} fim={s(219.72)} y={410} escurece={0.5} linhas={[{ texto: 'DE MÃOS VAZIAS.', tempos: P(218.72, 218.82, 219.08), tam: 200 }]} />
      <Tarja f={f} ini={s(220.25)} fim={s(224.95)} texto="AQUI COMEÇA A SEGUNDA COISA QUE ESSE JOGO FAZ" y={748} tempos={P(220.34, 220.46, 220.76, 220.9, 221.12, 221.42, 221.56, 221.72, 221.92)} />
      <Tarja f={f} ini={s(222.5)} fim={s(224.95)} texto="E QUE EU QUASE NÃO VEJO EM JOGO NENHUM" y={820} cor={COR.creme} tempos={P(222.58, 223.14, 223.24, 223.42, 224.02, 224.18, 224.46, 224.54, 224.72)} />
    </Jogo>
  );
};

/** As promessas do Dutch, empilhadas: a que acabou de ser dita fica acesa. */
const Falas: React.FC<{ f: number; fim: number }> = ({ f, fim }) => {
  const falas: [number, string][] = [
    [231.78, 'Um último golpe.'],
    [233.28, 'Mais um, e a gente sai.'],
    [235.06, 'Tahiti.'],
    [236.16, 'I have a plan.'],
    [238.16, 'Um lugar onde ninguém manda em ninguém.'],
  ];
  if (f < s(231.6) || f > fim + 10) return null;
  const some = 1 - prog(f, fim, 8);
  return (
    <div style={{ ...em(135, 290), opacity: some }}>
      {falas.map(([t, txt], i) => {
        const e = saiExpo(prog(f, s(t), 9));
        if (e <= 0) return null;
        const prox = i + 1 < falas.length ? falas[i + 1][0] : 999;
        const velha = saiCubica(prog(f, s(prox), 10));
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 18, height: 106, opacity: e * mix(1, 0.42, velha), transform: `translateX(${((1 - e) * -40).toFixed(2)}px)` }}>
            <span style={A(96, COR.vermelho, { lineHeight: 0.6 })}>“</span>
            <span style={{ ...S(72, COR.papel, { fontWeight: 600 }), textShadow: '0 4px 24px rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{txt}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Capítulo 1 ao capítulo 6: a mesma frase nas duas pontas. */
const Capitulos: React.FC<{ f: number }> = ({ f }) => {
  const ini = s(241.2);
  const fim = s(246.05);
  if (f < ini || f > fim + 10) return null;
  const some = Math.min(saiExpo(prog(f, ini, 8)), 1 - prog(f, fim, 8));
  const corre = saiCubica(prog(f, s(242.94), s(244.66) - s(242.94)));
  const X = (i: number) => 135 + i * 250;
  return (
    <div style={{ opacity: some }}>
      <div style={em(135, 380, O(44, COR.papel, 0.3))}>CAPÍTULO</div>
      <div style={{ ...em(X(0) + 56, 506), width: (X(5) - X(0)) * corre, height: 8, background: COR.vermelho }} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const aceso = i === 0 ? f >= s(242.94) : i === 5 ? f >= s(244.66) : corre * 5 >= i;
        const ponta = i === 0 || i === 5;
        return (
          <div
            key={i}
            style={{
              ...em(X(i), 454),
              width: 112,
              height: 112,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...A(78, aceso ? (ponta ? COR.preto : COR.creme) : COR.cinza),
              background: aceso && ponta ? COR.creme : 'rgba(0,0,0,0.75)',
              border: `4px solid ${aceso ? COR.creme : 'rgba(140,136,128,0.5)'}`,
              transform: `scale(${ponta && aceso ? 1.18 : 1})`,
            }}
          >
            {i + 1}
          </div>
        );
      })}
      {f >= s(242.94) && <div style={{ ...em(X(0) - 6, 590), ...S(46, COR.papel, { fontWeight: 600 }), whiteSpace: 'nowrap' }}>“I have a plan.”</div>}
      {f >= s(244.66) && <div style={{ ...em(X(5) - 150, 590), ...S(46, COR.papel, { fontWeight: 600 }), whiteSpace: 'nowrap' }}>“I have a plan.”</div>}
      <Impacto f={f} ini={s(245.0)} fim={fim} texto="A MESMA CONVICÇÃO." y={700} tam={150} tempos={P(245.04, 245.42, 245.62)} por="palavra" />
    </div>
  );
};

/** O quadro fecha pelos quatro lados e reabre: "o mundo em volta vai fechando". */
const Fecha: React.FC<{ f: number }> = ({ f }) => {
  const t = saiCubica(prog(f, s(246.26), s(249.0) - s(246.26))) * (1 - saiExpo(prog(f, s(249.25), 10)));
  if (t <= 0) return null;
  const v = 138 + 200 * t;
  const h = 520 * t;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: v, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: W, height: v, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: h, height: H, background: '#000' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, width: h, height: H, background: '#000' }} />
      <div style={{ position: 'absolute', left: h, top: v, width: W - 2 * h, height: H - 2 * v, border: `3px solid ${COR.vermelho}`, boxSizing: 'border-box', opacity: t }} />
    </>
  );
};

/** Medidor de volume que sobe até o vermelho. */
const Volume: React.FC<{ f: number }> = ({ f }) => {
  const ini = s(267.3);
  const fim = s(268.95);
  if (f < ini || f > fim + 8) return null;
  const t = saiCubica(prog(f, ini, s(268.6) - ini));
  const some = 1 - prog(f, fim, 6);
  const N = 22;
  return (
    <div style={{ opacity: some }}>
      <div style={{ ...em(0, 300), width: W, textAlign: 'center', transform: `scale(${(0.72 + 0.62 * t).toFixed(4)})`, transformOrigin: '50% 60%' }}>
        <Cinetico texto="ELE AUMENTA O VOLUME." f={f} ini={0} tempos={P(267.38, 267.56, 267.94, 268.04)} por="palavra" dur={5} estilo="bate" style={A(122, COR.creme, { textShadow: '0 8px 40px rgba(0,0,0,0.7)' })} />
      </div>
      {Array.from({ length: N }).map((_, i) => {
        const aceso = t * N * 1.05 >= i;
        const alt = (40 + i * 11) * (aceso ? 0.75 + 0.25 * rnd(i, Math.floor(f / 2)) : 0.12);
        return <div key={i} style={{ ...em(W / 2 - (N * 34) / 2 + i * 34, 880 - alt), width: 22, height: alt, background: i >= N - 6 ? COR.vermelho : COR.creme, opacity: aceso ? 1 : 0.35 }} />;
      })}
    </div>
  );
};

/** 225-276,5 s · Dutch van der Linde */
export const Dutch: React.FC<Cena> = ({ f, clipes }) => {
  const segundo = f >= 7958;
  const ano = conta(f, s(259.66), 20, 1870, 1899);
  return (
    <Jogo
      arq={segundo ? 'c12-F.mp4' : 'c11-F.mp4'}
      k={segundo ? f - 7958 : f - 6750}
      f={f}
      id="c11"
      clipes={clipes}
      cor={{ sat: 0.7, temp: 0.3 }}
      zoom={1.02 + 0.035 * prog(f, segundo ? 7958 : 6750, segundo ? 353 : 1208) + soco(f, s(225.46), 0.05) + soco(f, s(252.78), 0.05) + soco(f, s(275.3), 0.06)}
    >
      <Sombra f={f} ini={s(225.2)} fim={s(246.1)} forca={0.86} />
      {/* o nome */}
      <Impacto f={f} ini={s(225.42)} fim={s(229.4)} texto="DUTCH" y={360} tam={270} passo={1.4} />
      <Tarja f={f} ini={s(225.85)} fim={s(229.4)} texto="VAN DER LINDE" y={650} tam={54} tempos={P(225.88, 226.1, 226.24)} />
      <Tarja f={f} ini={s(226.7)} fim={s(229.4)} texto="NÃO É UM VILÃO." y={752} tempos={P(226.76, 226.8, 226.88, 226.96)} />
      <Tarja f={f} ini={s(227.7)} fim={s(229.4)} texto="É UM HOMEM QUE TAMBÉM NÃO LÊ O PAPEL" y={822} cor={COR.creme} tempos={P(227.8, 227.94, 228.0, 228.18, 228.3, 228.54, 228.7, 228.82, 228.88)} />
      <Tarja f={f} ini={s(229.5)} fim={s(231.6)} texto="REPARA NO QUE ELE FALA, DO COMEÇO AO FIM" y={800} tempos={P(229.56, 230.08, 230.18, 230.2, 230.34, 230.8, 230.84, 231.14, 231.28)} />
      {/* as promessas */}
      <Falas f={f} fim={s(241.0)} />
      <Capitulos f={f} />
      {/* o mundo fechando */}
      <Fecha f={f} />
      <Cinetico
        texto={'ENQUANTO O MUNDO\nEM VOLTA VAI FECHANDO.'}
        f={f}
        ini={0}
        tempos={P(246.26, 247.12, 247.32, 247.64, 247.96, 248.24, 248.48)}
        por="palavra"
        dur={6}
        estilo="sobe"
        fim={s(249.2)}
        style={{ ...em(0, 446), width: W, textAlign: 'center', ...A(74, COR.creme, { textShadow: '0 4px 30px rgba(0,0,0,0.9)' }) }}
      />
      <Centro
        f={f}
        ini={s(249.42)}
        fim={s(253.7)}
        y={300}
        vao={16}
        linhas={[
          { texto: 'ELE NÃO ESTÁ MENTINDO.', tempos: P(249.94, 250.06, 250.2, 250.38), tam: 120 },
          { texto: 'ISSO É O QUE DÓI.', tempos: P(251.32, 251.74, 251.82, 251.88, 252.0), fonte: 'oswald', tam: 50, estilo: 'sobe' },
          { texto: 'ELE ACREDITA.', tempos: P(252.64, 252.78), tam: 200, cor: COR.vermelho },
        ]}
      />
      {/* a leitura de 1870 */}
      <Sombra f={f} ini={s(253.9)} fim={s(276.4)} forca={0.86} />
      <Tarja f={f} ini={s(254.6)} fim={s(259.4)} texto="UMA VIDA INTEIRA EM CIMA DE UMA LEITURA DO MUNDO" y={800} tempos={P(254.72, 254.88, 255.1, 255.66, 255.8, 256.02, 256.16, 256.3, 256.7, 256.86)} />
      <Impacto f={f} ini={s(257.4)} fim={s(259.4)} texto={'VERDADEIRA\nEM 1870.'} y={470} tam={150} tempos={P(257.54, 258.08, 258.16)} por="palavra" />
      {f >= s(259.55) && f < s(262.75) && (
        <div style={{ ...em(128, 420), opacity: Math.min(saiExpo(prog(f, s(259.55), 6)), 1 - prog(f, s(262.6), 6)) }}>
          <Hodometro valor={ano} casas={4} style={A(280, COR.creme, { textShadow: '0 8px 40px rgba(0,0,0,0.6)' })} />
        </div>
      )}
      <Tarja f={f} ini={s(261.0)} fim={s(262.6)} texto="É SÓ UMA FRASE BONITA." y={730} tam={56} cor={COR.creme} tempos={P(261.08, 261.7, 261.86, 262.0, 262.28)} />
      <Tarja f={f} ini={s(262.74)} fim={s(265.2)} texto="QUANDO A LEITURA PARA DE FUNCIONAR" y={800} tempos={P(262.74, 263.6, 263.7, 264.04, 264.42, 264.56)} />
      <Impacto f={f} ini={s(265.4)} fim={s(267.2)} texto={'ELE NÃO TROCA\nA LEITURA.'} y={520} tam={146} tempos={P(265.42, 266.02, 266.2, 266.56, 266.68)} por="palavra" />
      {f >= s(267.3) && f < s(269.2) && <AbsoluteFill style={{ background: 'rgba(0,0,0,0.5)', opacity: Math.min(prog(f, s(267.3), 6), 1 - prog(f, s(268.95), 6)) }} />}
      <Volume f={f} />
      {/* a roda de armas do jogo aparece no clipe entre 271,6 e 273,3 s: a frase vira um cartão preto */}
      {f >= s(268.9) && f < s(274.6) && <AbsoluteFill style={{ background: '#000', opacity: Math.min(saiCubica(prog(f, s(268.95), 10)), 1 - prog(f, s(274.28), 5)) }} />}
      <Cinetico texto="É O QUE ACONTECE COM TODO MUNDO" f={f} ini={0} fim={s(272.95)} tempos={P(269.04, 269.2, 269.24, 269.3, 269.76, 269.98, 270.38)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 300), width: W, textAlign: 'center', ...O(48, COR.papel, 0.3) }} />
      <Cinetico texto={'QUE FOI MUITO BOM\nNUMA COISA QUE ACABOU.'} f={f} ini={0} fim={s(272.95)} saida="sobe" tempos={P(270.72, 270.94, 271.12, 271.36, 271.58, 271.78, 272.12, 272.28)} por="palavra" dur={7} estilo="mascara" destaque={{ 7: COR.vermelho }} style={{ ...em(0, 400), width: W, textAlign: 'center', ...A(150) }} />
      <Cinetico texto="VOCÊ NÃO ACEITA." f={f} ini={0} fim={s(274.2)} tempos={P(273.08, 273.62, 273.76)} por="palavra" dur={6} estilo="bate" style={{ ...em(0, 410), width: W, textAlign: 'center', ...A(220) }} />
      {/* você repete mais alto: o eco cresce */}
      <Tarja f={f} ini={s(274.38)} fim={s(276.4)} texto="VOCÊ REPETE" y={236} tam={50} tempos={P(274.38, 274.8)} />
      {[0, 1, 2].map((i) => {
        const t0 = s(275.3) + i * 5;
        if (f < t0 || f > s(276.5)) return null;
        const e = saiExpo(prog(f, t0, 7));
        const tam = [84, 140, 262][i];
        const y = [330, 420, 560][i];
        return (
          <div key={i} style={{ ...em(135, y), ...A(tam, i === 2 ? COR.vermelho : COR.creme), opacity: [0.4, 0.7, 1][i] * c01(e * 3) * (1 - prog(f, s(276.35), 5)), transform: `scale(${mix(1.3, 1, e).toFixed(4)})`, transformOrigin: 'left center', whiteSpace: 'nowrap', textShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
            MAIS ALTO.
          </div>
        );
      })}
    </Jogo>
  );
};

/** 344,2-376 s · não é derrota, é obsolescência */
export const Obsolescencia: React.FC<Cena> = ({ f, clipes }) => {
  const ini = 10326;
  const dreno = prog(f, ini, 954);
  const seca = saiCubica(prog(f, s(367.3), 12));
  return (
    <Jogo arq="c17-J.mp4" k={f - ini} f={f} id="c17" clipes={clipes} cor={{ sat: mix(0.5, 0.28, dreno) * mix(1, 0.45, seca), temp: mix(0.15, -0.1, dreno) }} zoom={1.02 + 0.04 * dreno + soco(f, s(367.3), 0.05)}>
      <Sombra f={f} ini={s(344.3)} fim={s(375.9)} forca={0.84} />
      <Tarja f={f} ini={s(344.36)} fim={s(346.95)} texto="PENSE NO QUE ISSO FAZ COM O JOGO QUE VOCÊ JOGOU" y={800} tempos={P(344.36, 344.96, 345.08, 345.2, 345.38, 345.64, 345.92, 346.06, 346.26, 346.38, 346.62)} />
      <Impacto f={f} ini={s(347.1)} fim={s(350.25)} texto={'O BANDO NÃO ESTÁ\nPERDENDO UMA GUERRA.'} y={540} tam={126} tempos={P(347.14, 347.58, 348.42, 348.7, 348.94, 349.4, 349.56)} por="palavra" />
      <Tarja f={f} ini={s(350.38)} fim={s(352.5)} texto="PERDER UMA GUERRA AINDA É ESTAR NUMA GUERRA" y={812} tempos={P(350.38, 350.6, 350.76, 351.08, 351.5, 351.56, 351.8, 352.02)} />
      <Tarja f={f} ini={s(353.12)} fim={s(357.5)} texto="TRABALHAM DENTRO DE UMA COISA QUE FOI" y={440} tempos={P(353.26, 353.9, 354.2, 354.38, 354.54, 354.82, 354.98)} />
      <Impacto f={f} ini={s(355.9)} fim={s(357.5)} texto={'DECLARADA\nENCERRADA'} y={530} tam={170} tempos={P(355.96, 356.54)} por="palavra" />
      <Carimbo f={f} ini={s(355.16)} fim={s(357.5)} texto="OFICIALMENTE" x={1010} y={560} tam={96} giro={-8} />
      <Maquina f={f} ini={s(357.7)} fim={s(361.35)} texto={'por escrito.\npor um funcionário público.\nquase uma década antes.'} y={590} tam={52} cps={18.5} />
      <Impacto f={f} ini={s(361.4)} fim={s(363.9)} texto={'ELES SÃO EXCELENTES\nNO QUE FAZEM.'} y={540} tam={126} tempos={P(361.48, 362.38, 362.56, 363.12, 363.26, 363.38)} por="palavra" />
      <Impacto f={f} ini={s(364.0)} fim={s(366.25)} texto={'O QUE ELES FAZEM\nNÃO EXISTE MAIS.'} y={540} tam={126} tempos={P(364.0, 364.22, 364.38, 364.62, 365.08, 365.3, 365.58)} por="palavra" destaque={{ 4: COR.vermelho, 5: COR.vermelho, 6: COR.vermelho }} />
      <Centro
        f={f}
        ini={s(366.4)}
        fim={s(368.75)}
        y={330}
        escurece={0.55}
        vao={10}
        linhas={[
          { texto: 'ISSO NÃO É DERROTA.', tempos: P(366.4, 366.58, 366.68, 366.78), tam: 96, cor: COR.papel },
          { texto: 'É OBSOLESCÊNCIA.', t: s(367.2), por: 'letra', passo: 0.55, estilo: 'embaralha', tam: 210, cor: COR.vermelho },
        ]}
      />
      <Tarja f={f} ini={s(368.2)} fim={s(370.6)} texto="A OBSOLESCÊNCIA NÃO TE DÁ UM INIMIGO PRA MATAR." y={812} tempos={P(368.2, 368.34, 368.96, 369.12, 369.24, 369.38, 369.5, 369.82, 370.0)} />
      <Tarja f={f} ini={s(370.78)} fim={s(373.75)} texto="MAS EU QUERO TE MOSTRAR" y={748} tempos={P(370.78, 371.3, 371.42, 371.48, 371.6)} />
      <Tarja f={f} ini={s(371.8)} fim={s(373.75)} texto="COMO ESSES HOMENS MORRERAM DE VERDADE" y={820} cor={COR.creme} tempos={P(371.9, 372.18, 372.36, 372.68, 373.08, 373.2)} />
      <Impacto f={f} ini={s(373.86)} fim={s(375.95)} texto={'NÃO OS DO JOGO.\nOS DE VERDADE.'} y={540} tam={140} tempos={P(374.14, 374.28, 374.44, 374.56, 375.26, 375.42, 375.52)} por="palavra" destaque={{ 4: COR.vermelho, 5: COR.vermelho, 6: COR.vermelho }} />
    </Jogo>
  );
};
