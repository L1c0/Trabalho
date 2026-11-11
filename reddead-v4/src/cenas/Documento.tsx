import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { c01, COR, entraSai, mix, prog, rnd, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Camera, Clarao, Fundo, Grao, Poeira, Vinheta } from '../kit/Cena';
import { Floresta } from '../kit/Floresta';
import { Carimbo, Impacto, Tarja } from '../kit/Letreiro';
import { Cam, camMix, CIDADE, curva, MAPA, MapaEUA, Ponto, proj, Rota, Rotulo } from '../kit/Mapa';
import { Datilo, Grade, Legenda, Papel, Seta, TINTA } from '../kit/Pecas';
import { Cinetico, conta, Hodometro, Risco } from '../kit/Texto';
import { A, em, M, O, S } from '../kit/tipos';
import { s } from '../tempo';

const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

const CAM_A: Cam = { cx: 1200, cy: 770, zoom: 0.72 };
const CAM_B: Cam = { cx: 1140, cy: 745, zoom: 0.86 };

/** Casinha de contagem. */
const Casa: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <svg width={24} height={24} viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y, transform: `scale(${mix(1.8, 1, saiExpo(t)).toFixed(3)})`, opacity: c01(t * 3) }}>
    <path d="M2,11 L12,2 L22,11 V22 H14 V15 H10 V22 H2 Z" fill={TINTA} />
  </svg>
);

/** 276,5-293,4 · o boletim: um papel de escritório */
const Boletim: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(293.38);
  const z = saiCubica(prog(f, s(291.0), 66));
  const casas: React.ReactNode[] = [];
  const total = 78;
  const feitas = Math.floor(prog(f, s(287.3), s(289.5) - s(287.3)) * total);
  for (let i = 0; i < total; i++) {
    if (i > feitas) break;
    const lin = i % 6;
    const col = Math.floor(i / 6);
    casas.push(<Casa key={i} x={300 + col * 30} y={268 + lin * 54} t={prog(f, s(287.3) + (i / total) * (s(289.5) - s(287.3)), 5)} />);
  }
  const soma = f >= s(289.6) ? 1000 + (f - s(289.6)) * 37.7 : 0;
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(f, fim, 3) }}>
      <Fundo f={f} tom="quente" semente={21} />
      <Poeira f={f} n={34} />
      <Camera escala={1 + 0.2 * z} x={-190 * z} y={-150 * z} origem="72% 50%">
        <Papel f={f} ini={s(277.3)} x={1030} y={100} w={760} h={890} giro={-1.6}>
          <div style={{ ...em(0, 34, M(19, '#5a4a38')), width: 760, textAlign: 'center' }}>DEPARTMENT OF THE INTERIOR · CENSUS OFFICE</div>
          <div style={{ ...em(50, 70), width: 660, height: 3, background: TINTA }} />
          <div style={{ ...em(0, 88, A(64, TINTA)), width: 760, textAlign: 'center' }}>EXTRA CENSUS BULLETIN</div>
          <div style={{ ...em(0, 172, M(21, TINTA)), width: 760, textAlign: 'center' }}>No. 2 — WASHINGTON, D. C. — APRIL 20, 1891</div>
          <div style={{ ...em(50, 214), width: 660, height: 3, background: TINTA }} />
          <div style={{ ...em(50, 221), width: 660, height: 1, background: TINTA }} />
          {/* as linhas da tabela: um rótulo ilegível e as casas contadas */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div style={{ ...em(50, 274 + i * 54), width: (120 + 90 * rnd(i, 4)) * saiExpo(prog(f, s(284.6) + i * 6, 12)), height: 12, background: 'rgba(29,23,18,0.62)' }} />
              <div style={{ ...em(50, 302 + i * 54), width: 660, height: 1, background: 'rgba(29,23,18,0.3)' }} />
            </React.Fragment>
          ))}
          {casas}
          {/* a soma */}
          {f >= s(289.2) && (
            <>
              <div style={{ ...em(50, 606), width: 660 * saiExpo(prog(f, s(289.2), 10)), height: 4, background: TINTA }} />
              <div style={em(50, 624, A(40, TINTA))}>TOTAL</div>
              {soma > 0 && (
                <div style={{ position: 'absolute', right: 50, top: 618 }}>
                  <Hodometro valor={soma} casas={6} style={{ ...M(46, TINTA), fontWeight: 500, letterSpacing: '0.08em' }} />
                </div>
              )}
            </>
          )}
          {/* o parágrafo: linhas ilegíveis, e o marca-texto na frase */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...em(50, 716 + i * 30), width: i === 4 ? 380 : 660, height: 9, background: 'rgba(29,23,18,0.5)' }} />
          ))}
          {[1, 2, 3].map((i) => (
            <div
              key={`m${i}`}
              style={{ ...em(44, 707 + i * 30), width: 672, height: 27, background: COR.vermelho, opacity: 0.55, transform: `scaleX(${saiExpo(prog(f, s(291.7) + (i - 1) * 9, 12)).toFixed(4)})`, transformOrigin: 'left center', mixBlendMode: 'multiply' }}
            />
          ))}
        </Papel>
      </Camera>
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 55%)' }} />
      {/* à esquerda, a fala */}
      <Impacto f={f} ini={s(276.6)} fim={s(277.42)} texto={'AGORA,\nO DOCUMENTO.'} y={360} tam={150} tempos={P(276.66, 277.08, 277.18)} por="palavra" />
      <Impacto f={f} ini={s(277.5)} fim={s(284.3)} texto={'CENSO\nDE 1890'} y={300} tam={200} tempos={P(277.56, 277.9, 278.08)} por="palavra" destaque={{ 2: COR.vermelho }} />
      <Tarja f={f} ini={s(281.2)} fim={s(284.3)} texto="DEPARTAMENTO DO CENSO DOS ESTADOS UNIDOS" y={760} tam={38} tempos={P(281.34, 281.84, 282.1, 282.36, 282.6, 282.78)} />
      <Tarja f={f} ini={s(283.0)} fim={s(284.3)} texto="PUBLICOU UM BOLETIM." y={828} cor={COR.creme} tempos={P(283.08, 283.56, 283.68)} />
      <Impacto f={f} ini={s(284.45)} fim={s(290.8)} texto={'UM PAPEL\nDE ESCRITÓRIO'} y={320} tam={140} tempos={P(284.5, 285.04, 285.24, 285.36)} por="palavra" />
      <Tarja f={f} ini={s(286.0)} fim={s(290.8)} texto="FEITO POR FUNCIONÁRIOS CONTANDO CASAS" y={690} tempos={P(286.02, 286.26, 286.44, 287.5, 288.02)} />
      <Tarja f={f} ini={s(289.0)} fim={s(290.8)} texto="E SOMANDO COLUNAS." y={762} cor={COR.creme} tempos={P(289.1, 289.78, 290.14)} />
      <Tarja f={f} ini={s(291.0)} fim={fim} texto="DENTRO DESSE BOLETIM" y={440} tam={44} tempos={P(291.18, 291.4, 291.6)} />
      <Tarja f={f} ini={s(292.1)} fim={fim} texto="ESTÁ ESCRITO O SEGUINTE:" y={516} tam={44} cor={COR.creme} tempos={P(292.16, 292.52, 292.86, 293.02)} />
      <Legenda f={f} ini={s(283.7)} fim={fim} x={140} y={972} texto="Extra Census Bulletin nº 2 · 20 abr. 1891" tam={22} />
    </AbsoluteFill>
  );
};

/** 293,4-309,4 · a citação sobre o mapa: a linha de 1880, os núcleos, os cacos */
const MapaCitacao: React.FC<{ f: number; escuro?: number }> = ({ f, escuro = 0 }) => {
  const ini = s(293.4);
  const cam = camMix(CAM_A, CAM_B, entraSai(prog(f, ini, s(308.4) - ini)));
  const des = prog(f, ini, 46);
  const [x1, y1, x2, y2] = MAPA.linha_1880;
  const linha = saiCubica(prog(f, s(296.75), 32));
  const quebra = prog(f, s(301.82), 4);
  const tr = tremor(f, s(301.82), 14, 10);
  const [lx, ly] = proj(cam, x1, 300);
  const [ax, ay] = proj(cam, 640, 640);
  return (
    <AbsoluteFill>
      <Fundo f={f} tom="frio" semente={30} />
      <AbsoluteFill style={{ transform: `translate(${tr.x.toFixed(2)}px, ${tr.y.toFixed(2)}px)` }}>
        <MapaEUA cam={cam} desenho={des}>
          {linha > 0 && quebra < 1 && <line x1={x1} y1={y1} x2={x2} y2={y1 + (y2 - y1) * linha} stroke={COR.vermelho} strokeWidth={8 / cam.zoom} opacity={1 - quebra} />}
          {quebra > 0 && (
            <g fill="none" stroke={COR.vermelho} strokeWidth={8 / cam.zoom} strokeLinecap="round">
              {MAPA.cacos.map((c, k) => {
                const some = prog(f, s(305.3) + k * 5, 9);
                if (some >= 1) return null;
                const cai = some * some * 40;
                return <line key={k} x1={c[0] + (rnd(k, 1) - 0.5) * 20 * quebra} y1={c[1] + cai} x2={c[2] + (rnd(k, 2) - 0.5) * 20 * quebra} y2={c[3] + cai} opacity={quebra * (1 - some)} />;
              })}
            </g>
          )}
          <g fill={COR.creme}>
            {MAPA.nucleos.map(([cx, cy, r], k) => {
              const p = prog(f, s(302.5) + k * 2.1, 6);
              if (p <= 0) return null;
              return <circle key={k} cx={cx} cy={cy} r={r * 1.5 * (2.2 - 1.2 * saiExpo(p))} opacity={c01(p * 2)} />;
            })}
          </g>
        </MapaEUA>
      </AbsoluteFill>
      {/* rótulos */}
      {f >= s(297.1) && (
        <div style={{ ...em(lx + 26, ly - 30), opacity: saiExpo(prog(f, s(297.1), 8)) }}>
          <Risco f={f} ini={s(307.3)} dur={10} alt={8}>
            <span style={{ ...O(38, COR.papel, 0.16), textShadow: '0 2px 12px #000' }}>LINHA DE FRONTEIRA</span>
          </Risco>
          <div style={{ ...O(24, COR.vermelho, 0.28), marginTop: 2 }}>{f < s(298.74) ? 'ATÉ 1880' : 'CENSO DE 1890'}</div>
        </div>
      )}
      {f >= s(300.3) && f < s(309.6) && (
        <div style={{ ...em(ax - 250, ay), width: 500, textAlign: 'center', ...O(28, COR.cinza, 0.42), opacity: saiExpo(prog(f, s(300.3), 10)) * (1 - prog(f, s(302.4), 20) * 0.6) }}>ÁREA NÃO POVOADA</div>
      )}
      <Legenda f={f} ini={s(302.76)} x={135} y={96} texto="●  NÚCLEOS ISOLADOS DE POVOAMENTO" tam={24} cor={COR.creme} />
      {/* a citação, embaixo, no tempo da leitura */}
      <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.8) 16%, rgba(0,0,0,0) 34%)' }} />
      <Cinetico
        texto="“Até 1880, inclusive, o país tinha uma fronteira de povoamento.”"
        f={f}
        ini={0}
        fim={s(298.6)}
        tempos={P(293.52, 293.98, 295.16, 296.18, 296.42, 296.72, 296.98, 297.16, 297.66, 297.8)}
        por="palavra"
        dur={6}
        estilo="sobe"
        destaque={{ 7: COR.creme, 8: COR.creme, 9: COR.creme }}
        style={{ ...em(0, 912), width: W, textAlign: 'center', ...S(52, COR.papel) }}
      />
      <Cinetico
        texto={'“Mas, no presente, a área não povoada foi tão fragmentada\npor núcleos isolados de povoamento…'}
        f={f}
        ini={0}
        fim={s(304.36)}
        tempos={P(298.74, 299.3, 299.46, 300.18, 300.38, 300.58, 300.82, 301.42, 301.62, 301.82, 302.5, 302.76, 303.22, 303.72, 303.84)}
        por="palavra"
        dur={6}
        estilo="sobe"
        destaque={{ 9: COR.vermelho }}
        style={{ ...em(0, 876), width: W, textAlign: 'center', ...S(50, COR.papel, { lineHeight: 1.3 }) }}
      />
      <Cinetico
        texto={'…que dificilmente se pode dizer que existe\numa linha de fronteira.”'}
        f={f}
        ini={0}
        fim={s(309.3)}
        tempos={P(304.44, 305.34, 305.98, 306.16, 306.44, 306.8, 307.02, 307.26, 307.44, 307.64, 307.78)}
        por="palavra"
        dur={6}
        estilo="sobe"
        destaque={{ 1: COR.vermelho }}
        style={{ ...em(0, 876), width: W, textAlign: 'center', ...S(50, COR.papel, { lineHeight: 1.3 }) }}
      />
      <Legenda f={f} ini={s(294.2)} x={1785} y={96} alinhar="dir" texto="CENSO DOS EUA · BOLETIM DE 1891 · TRADUÇÃO LIVRE" tam={20} />
      {escuro > 0 && <AbsoluteFill style={{ background: '#000', opacity: escuro }} />}
    </AbsoluteFill>
  );
};

/** 309,4-314,4 · a frase de novo, devagar */
const Repete: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Cinetico
      texto={'“Dificilmente se pode dizer\nque existe uma'}
      f={f}
      ini={0}
      tempos={P(310.04, 310.64, 310.92, 311.42, 312.32, 312.84, 313.14)}
      por="palavra"
      dur={8}
      estilo="foco"
      style={{ ...em(0, 250), width: W, textAlign: 'center', ...S(96, COR.papel, { lineHeight: 1.22 }) }}
    />
    <Cinetico texto="LINHA DE FRONTEIRA.”" f={f} ini={0} tempos={P(313.38, 313.62, 313.8)} por="palavra" dur={7} estilo="mascara" style={{ ...em(0, 540), width: W, textAlign: 'center', ...A(190, COR.vermelho) }} />
  </>
);

export const Documento: React.FC<Cena> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {f < s(293.5) && <Boletim f={f} />}
    {f >= s(293.4) && <MapaCitacao f={f} escuro={0.84 * saiCubica(prog(f, s(309.3), 16))} />}
    {f >= s(309.4) && <Repete f={f} />}
    <Vinheta forca={0.42} />
    <Grao f={f} forca={0.13} />
    <Clarao f={f} ini={s(293.4)} dur={7} forca={0.5} />
  </AbsoluteFill>
);

/** 314,4-335 · Turner, 1893, Chicago */
export const Turner: React.FC<Cena> = ({ f }) => {
  const CAM1: Cam = { cx: 1450, cy: 560, zoom: 1.75 };
  const vai = entraSai(prog(f, s(319.0), 56));
  const volta = entraSai(prog(f, s(323.1), 50));
  const cam = camMix(camMix(CAM_B, CAM1, vai), { cx: 1320, cy: 700, zoom: 0.8 }, volta);
  const ano = conta(f, s(314.5), 16, 1890, 1893);
  const wa = CIDADE.washington;
  const ch = CIDADE.chicago;
  const rota = saiCubica(prog(f, s(321.2), s(322.6) - s(321.2)));
  const pt = curva(wa, ch, 0.22).em(rota);
  const [tx, ty] = proj(cam, pt[0], pt[1]);
  const tira = Math.min(saiExpo(prog(f, s(319.9), 10)), 1 - prog(f, s(327.6), 10));
  const tr = tremor(f, s(327.06), 16, 10);
  const tese = saiCubica(prog(f, s(327.8), 12));
  const fimA = s(323.0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Fundo f={f} tom="frio" semente={30} />
      <AbsoluteFill style={{ transform: `translate(${tr.x.toFixed(2)}px, ${tr.y.toFixed(2)}px)` }}>
        <MapaEUA cam={cam}>
          <g fill={COR.creme} opacity={0.5}>
            {MAPA.nucleos.map(([cx, cy, r], k) => (
              <circle key={k} cx={cx} cy={cy} r={r * 1.5} />
            ))}
          </g>
          <Rota de={wa} para={ch} t={rota} cam={cam} arco={0.22} larg={6} />
          <Ponto em={wa} t={prog(f, s(319.3), 8)} cam={cam} f={f} cor={COR.creme} />
          <Ponto em={ch} t={prog(f, s(322.5), 8)} cam={cam} f={f} />
        </MapaEUA>
      </AbsoluteFill>
      <Rotulo em={wa} cam={cam} t={prog(f, s(319.3), 8) * (1 - prog(f, s(327.6), 8))} texto="WASHINGTON" sub="O BOLETIM DO CENSO" lado="baixo" />
      <Rotulo em={ch} cam={cam} t={prog(f, s(322.5), 8) * (1 - prog(f, s(327.6), 8))} texto="CHICAGO" sub="CONFERÊNCIA · 1893" lado="cima" tam={44} />
      {/* a frase viaja de Washington a Chicago */}
      {tira > 0 && (
        <div style={{ ...em(tx - 190, ty - 74), width: 380, padding: '10px 16px', background: '#E8DFCB', boxShadow: '0 14px 36px rgba(0,0,0,0.7)', transform: `rotate(${(-3 + 5 * rota).toFixed(2)}deg) scale(${tira.toFixed(3)})`, ...S(22, TINTA, { lineHeight: 1.2, fontWeight: 600 }) }}>
          “…dificilmente se pode dizer que existe uma linha de fronteira.”
        </div>
      )}
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.5) 34%, rgba(0,0,0,0) 56%)', opacity: 1 - tese }} />
      {/* à esquerda: o ano e o nome */}
      {f < fimA + 10 && (
        <div style={{ ...em(128, 150), opacity: Math.min(saiExpo(prog(f, s(314.5), 6)), 1 - prog(f, fimA, 8)) }}>
          <Hodometro valor={ano} casas={4} style={A(230)} />
        </div>
      )}
      <Legenda f={f} ini={s(316.4)} fim={fimA} x={140} y={418} texto="UM HISTORIADOR CHAMADO" tam={32} cor={COR.papel} />
      <Impacto f={f} ini={s(317.7)} fim={fimA} texto={'FREDERICK\nJACKSON\nTURNER'} y={470} tam={124} tempos={P(317.74, 318.24, 318.82)} por="palavra" destaque={{ 2: COR.vermelho }} />
      <Tarja f={f} ini={s(319.2)} fim={fimA} texto="PEGOU ESSA FRASE E LEVOU PRA CHICAGO" y={880} tam={36} tempos={P(319.24, 320.06, 320.6, 320.9, 321.2, 321.54, 322.58)} />
      {/* um período encerrado */}
      <Tarja f={f} ini={s(323.3)} fim={s(327.7)} texto="USOU A FRASE PRA DIZER QUE" y={236} tempos={P(323.46, 323.7, 323.76, 323.86, 324.04, 324.38)} />
      <Impacto f={f} ini={s(325.3)} fim={s(327.7)} texto={'UM PERÍODO DA\nHISTÓRIA AMERICANA'} y={320} tam={124} tempos={P(325.38, 325.48, 325.74, 325.94, 326.26)} por="palavra" />
      <Carimbo f={f} ini={s(327.02)} fim={s(327.7)} texto="ENCERRADO" x={210} y={610} tam={190} giro={-6} />
      <Clarao f={f} ini={s(327.06)} dur={5} forca={0.4} />
      {/* a tese nasceu de um dado de tabela */}
      {tese > 0 && (
        <>
          <AbsoluteFill style={{ background: '#000', opacity: 0.86 * tese }} />
          <Cinetico texto="A TESE MAIS INFLUENTE" f={f} ini={0} tempos={P(327.98, 328.28, 328.56, 328.76)} por="palavra" dur={7} estilo="mascara" style={{ ...em(0, 150), width: W, textAlign: 'center', ...A(156) }} />
          <Cinetico texto="JÁ ESCRITA SOBRE O VELHO OESTE" f={f} ini={0} tempos={P(329.22, 329.4, 329.92, 330.24, 330.34, 330.6)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 336), width: W, textAlign: 'center', ...O(54, COR.papel, 0.3) }} />
          <Seta f={f} ini={s(330.8)} dur={14} de={[960, 440]} para={[960, 560]} cor={COR.vermelho} larg={7} />
          <Cinetico texto="NASCEU DE UM COMENTÁRIO" f={f} ini={0} tempos={P(330.9, 331.34, 331.48, 331.6)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 590), width: W, textAlign: 'center', ...A(92, COR.creme) }} />
          <Grade f={f} ini={s(331.9)} x={510} y={736} w={900} h={186} cols={6} lins={3} cor="rgba(233,198,147,0.35)" />
          {f >= s(332.3) && <div style={{ ...em(510 + 150 * 3, 736 + 62), width: 150, height: 62, background: COR.vermelho, opacity: 0.85 * saiExpo(prog(f, s(332.3), 8)) }} />}
          <Datilo f={f} ini={s(332.1)} texto="sobre um dado de recenseamento." cps={19} style={{ ...em(0, 946), width: W, textAlign: 'center', fontSize: 40, color: COR.papel }} />
        </>
      )}
      <Vinheta forca={0.42} />
      <Grao f={f} forca={0.13} />
    </AbsoluteFill>
  );
};

/** 335-344,2 · "acabou numa tabela de densidade populacional" */
export const Tabela: React.FC<Cena> = ({ f }) => {
  const ini = 10050;
  const cede = saiCubica(prog(f, s(338.25), 10));
  const fimA = s(340.95);
  const atlas = Math.min(saiExpo(prog(f, s(339.3), 14)), 1 - prog(f, fimA, 8));
  return (
    <AbsoluteFill style={{ backgroundColor: COR.preto }}>
      <Camera escala={1.03 + 0.05 * prog(f, ini, 276)}>
        <Floresta f={f} camX={(f - ini) * 1.3} topo={-30} base={760} />
      </Camera>
      {/* a paisagem vira planilha */}
      <Grade f={f} ini={s(338.3)} x={-4} y={-4} w={1928} h={764} cols={12} lins={5} cor="rgba(233,198,147,0.5)" larg={3} passo={1} />
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' }} />
      {f < fimA + 10 && (
        <div style={{ opacity: 1 - prog(f, fimA, 8) }}>
          <div style={{ opacity: mix(1, 0.4, cede) }}>
            <Cinetico texto="O FAROESTE NÃO ACABOU" f={f} ini={0} tempos={P(335.34, 335.94, 336.46, 336.6)} por="palavra" dur={6} estilo="mascara" style={{ ...em(135, 110), ...A(100, COR.creme, { textShadow: '0 6px 30px rgba(0,0,0,0.7)' }) }} />
            <div style={em(135, 224)}>
              <Risco f={f} ini={s(338.25)} dur={9} alt={12}>
                <Cinetico texto="NUM TIROTEIO AO MEIO-DIA." f={f} ini={0} tempos={P(336.96, 337.14, 337.7, 337.82)} por="palavra" dur={6} estilo="mascara" style={A(100, COR.creme, { textShadow: '0 6px 30px rgba(0,0,0,0.7)' })} />
              </Risco>
            </div>
          </div>
          <Cinetico texto={'ACABOU\nNUMA TABELA'} f={f} ini={0} tempos={P(338.34, 338.74, 338.96)} por="palavra" dur={6} estilo="bate" style={{ ...em(135, 372), ...A(180, COR.creme, { textShadow: '8px 8px 0 #2a0403' }) }} />
          <Cinetico texto="DE DENSIDADE POPULACIONAL." f={f} ini={0} tempos={P(339.42, 339.58, 340.1)} por="palavra" dur={6} estilo="sobe" style={{ ...em(140, 800), ...O(58, COR.papel, 0.26) }} />
        </div>
      )}
      {atlas > 0 && (
        <>
          <div style={{ ...em(1320, 236), width: 480, height: 366, transform: `rotate(${(4 + (1 - atlas) * 10).toFixed(2)}deg) translateX(${((1 - atlas) * 900).toFixed(1)}px)`, border: `10px solid ${COR.papel}`, boxShadow: '0 30px 80px rgba(0,0,0,0.75)', overflow: 'hidden' }}>
            <Img src={staticFile('arte/atlas.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ ...em(1290, 650), width: 560, textAlign: 'center', ...O(22, COR.papel, 0.24), opacity: atlas, textShadow: '0 2px 10px #000' }}>MAPA DE DENSIDADE DA POPULAÇÃO · 1890</div>
        </>
      )}
      {/* o telegrama que ninguém mandou */}
      <Cinetico texto={'E NINGUÉM\nMANDOU TELEGRAMA'} f={f} ini={0} tempos={P(341.12, 341.86, 342.1, 342.4)} por="palavra" dur={6} estilo="mascara" style={{ ...em(135, 150), ...A(132, COR.creme, { textShadow: '0 6px 30px rgba(0,0,0,0.7)' }) }} />
      <Cinetico texto="PRO ACAMPAMENTO." f={f} ini={0} tempos={P(343.08, 343.22)} por="palavra" dur={6} estilo="mascara" style={{ ...em(135, 436), ...A(132, COR.vermelho, { textShadow: '0 6px 30px rgba(0,0,0,0.7)' }) }} />
      <Papel f={f} ini={s(341.4)} x={1060} y={600} w={740} h={380} giro={-2.2} de="dir">
        <div style={{ ...em(0, 0), width: 740, height: 92, background: TINTA }} />
        <div style={em(40, 14, A(58, '#E8DFCB', { letterSpacing: '0.12em' }))}>TELEGRAMA</div>
        <div style={em(40, 128, M(30, TINTA, { fontWeight: 500 }))}>PARA: ACAMPAMENTO</div>
        <div style={{ ...em(40, 180), width: 660, height: 2, background: 'rgba(29,23,18,0.4)' }} />
        <div style={em(40, 204, M(30, TINTA, { fontWeight: 500 }))}>MENSAGEM:</div>
        <Datilo f={f} ini={s(342.0)} texto="" style={{ ...em(240, 204), fontSize: 30 }} />
        <div style={{ ...em(40, 256), width: 660, height: 2, background: 'rgba(29,23,18,0.4)' }} />
        <div style={{ ...em(40, 312), width: 660, height: 2, background: 'rgba(29,23,18,0.4)' }} />
      </Papel>
      <Carimbo f={f} ini={s(343.3)} texto="NÃO ENVIADO" x={1220} y={800} tam={96} giro={-9} />
      <Vinheta forca={0.4} />
      <Grao f={f} forca={0.16} />
      <Clarao f={f} ini={ini} dur={7} forca={0.5} />
    </AbsoluteFill>
  );
};
