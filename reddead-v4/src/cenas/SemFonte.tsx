import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, mix, prog, rnd, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Clarao, Fundo, Grao, Poeira, Vinheta } from '../kit/Cena';
import { Carimbo, Etiqueta, Tarja } from '../kit/Letreiro';
import { Datilo, Seta, Tique } from '../kit/Pecas';
import { Cinetico, Traco } from '../kit/Texto';
import { A, em, M, O, S } from '../kit/tipos';
import { s } from '../tempo';

/**
 * 457-518,9 s · o parêntese do canal: a frase famosa sobre a Pinkerton, a
 * procura pela fonte, os quatro "não achei" e o convite para se inscrever.
 */
const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

const FRASE = '“A agência, no auge, tinha mais agentes\ndo que o Exército dos Estados Unidos\ntinha de soldados.”';

/** 457-479,4 · a frase e por que ela é tentadora */
const AFrase: React.FC<{ f: number }> = ({ f }) => {
  const abre = saiExpo(prog(f, s(459.3), 14));
  const fimTitulo = s(462.6);
  const fim = s(479.35);
  const copias: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const t = saiExpo(prog(f, s(463.3) + i * 5, 10));
    if (t <= 0) continue;
    const lado = i % 2 === 0;
    const x = lado ? 60 + rnd(i, 1) * 330 : 1500 + rnd(i, 1) * 300;
    const y = 90 + rnd(i, 2) * 860;
    copias.push(
      <div key={i} style={{ ...em(x, y), width: 150, padding: '10px 12px', border: '2px solid rgba(233,198,147,0.4)', background: 'rgba(0,0,0,0.5)', transform: `rotate(${((rnd(i, 3) - 0.5) * 16).toFixed(1)}deg) scale(${mix(1.6, 1, t).toFixed(3)})`, opacity: 0.6 * t * (1 - prog(f, s(471.9), 20) * 0.6) }}>
        <div style={A(34, COR.vermelho, { lineHeight: 0.7 })}>“</div>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: k === 2 ? 70 : 126, height: 6, background: 'rgba(233,198,147,0.55)', marginTop: 8 }} />
        ))}
      </div>,
    );
  }
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(f, fim, 6) }}>
      {/* o parêntese */}
      {f < fimTitulo + 10 && (
        <div style={{ opacity: 1 - prog(f, fimTitulo, 8) }}>
          <Tarja f={f} ini={s(457.22)} fim={s(459.25)} texto="JÁ QUE EU ESTOU FALANDO DE PINKERTON…" y={500} x={540} tempos={P(457.22, 457.4, 457.54, 457.6, 457.66, 457.98, 458.14)} />
          {abre > 0 && (
            <>
              <div style={{ ...em(W / 2 - 80 - 700 * abre, 250), width: 70, height: 580, borderLeft: `18px solid ${COR.vermelho}`, borderTop: `18px solid ${COR.vermelho}`, borderBottom: `18px solid ${COR.vermelho}`, boxSizing: 'border-box' }} />
              <div style={{ ...em(W / 2 + 10 + 700 * abre, 250), width: 70, height: 580, borderRight: `18px solid ${COR.vermelho}`, borderTop: `18px solid ${COR.vermelho}`, borderBottom: `18px solid ${COR.vermelho}`, boxSizing: 'border-box' }} />
            </>
          )}
          <Cinetico texto="DEIXA EU FAZER AQUI" f={f} ini={0} tempos={P(459.3, 459.56, 459.64, 459.88)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 300), width: W, textAlign: 'center', ...O(44, COR.papel, 0.34) }} />
          <Cinetico texto={'A ÚNICA COISA QUE\nJUSTIFICA ESTE CANAL\nEXISTIR.'} f={f} ini={0} tempos={P(460.1, 460.2, 460.4, 460.72, 461.24, 461.72, 461.86, 462.08)} por="palavra" dur={7} estilo="mascara" destaque={{ 7: COR.vermelho }} style={{ ...em(0, 390), width: W, textAlign: 'center', ...A(128) }} />
        </div>
      )}
      {/* a frase que aparece em todo lugar */}
      {copias}
      <Tarja f={f} ini={s(462.86)} fim={s(467.0)} texto="UMA FRASE QUE APARECE EM TODO VÍDEO, TODO ARTIGO" y={470} x={420} tempos={P(463.12, 463.26, 463.54, 463.68, 464.14, 464.88, 465.32, 465.72, 465.86)} />
      <Cinetico
        texto={FRASE}
        f={f}
        ini={0}
        tempos={P(467.62, 467.72, 468.14, 468.32, 468.62, 468.82, 469.02, 469.4, 469.58, 469.66, 469.76, 470.12, 470.32, 470.58, 470.98, 471.22, 471.34)}
        por="palavra"
        dur={7}
        estilo="foco"
        style={{ ...em(0, 340), width: W, textAlign: 'center', ...S(78, COR.papel, { lineHeight: 1.26, fontWeight: 600 }) }}
      />
      {/* por que ela é tentadora */}
      <Etiqueta f={f} ini={s(472.7)} fim={fim} texto="UMA FRASE ÓTIMA  ✓" x={420} y={214} tam={44} giro={-3} />
      <Etiqueta f={f} ini={s(474.12)} fim={fim} texto="EXPLICA TUDO  ✓" x={1130} y={196} tam={44} giro={2} />
      <Etiqueta f={f} ini={s(475.7)} fim={fim} texto="ASSUSTA  ✓" x={330} y={720} tam={44} giro={2} />
      <Etiqueta f={f} ini={s(476.56)} fim={fim} texto="ENCAIXARIA PERFEITAMENTE NO VÍDEO  ✓" x={760} y={760} tam={44} giro={-2} fundo={COR.vermelho} cor={COR.papel} />
    </AbsoluteFill>
  );
};

const Caixa: React.FC<{ f: number; ini: number; x: number; y: number; texto: string; sub?: string; cor?: string }> = ({ f, ini, x, y, texto, sub, cor = COR.creme }) => {
  const e = saiExpo(prog(f, ini, 9));
  if (e <= 0) return null;
  return (
    <div style={{ ...em(x, y), width: 420, height: 190, boxSizing: 'border-box', border: `5px solid ${cor}`, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: c01(e * 3), transform: `scale(${mix(1.25, 1, e).toFixed(3)})` }}>
      <div style={O(44, cor, 0.12, { textAlign: 'center', lineHeight: 1.12, whiteSpace: 'pre' })}>{texto}</div>
      {sub && <div style={M(20, COR.cinza, { marginTop: 6 })}>{sub}</div>}
    </div>
  );
};

/** 479,4-489 · de onde a frase sai: uma citação que cita a outra */
const Corrente: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(489.0);
  const pulso = (f % 30) / 30;
  return (
    <AbsoluteFill style={{ opacity: Math.min(saiExpo(prog(f, s(479.4), 8)), 1 - prog(f, fim, 6)) }}>
      <Cinetico texto="FUI PROCURAR DE ONDE ELA SAI." f={f} ini={0} tempos={P(479.6, 480.08, 480.52, 480.66, 480.8, 480.98)} por="palavra" dur={6} estilo="mascara" style={em(135, 110, A(124))} />
      <Tarja f={f} ini={s(481.3)} texto="ACHEI ELA REPETIDA EM:" y={290} tempos={P(481.3, 482.24, 482.36, 482.86)} />
      <Caixa f={f} ini={s(482.98)} x={135} y={410} texto={'LISTA DE\nCURIOSIDADES'} />
      <Seta f={f} ini={s(484.2)} dur={10} de={[562, 505]} para={[608, 505]} cor={COR.creme} larg={7} />
      <Caixa f={f} ini={s(484.34)} x={615} y={410} texto={'SITE DE HISTÓRIA\nPOPULAR'} />
      <Seta f={f} ini={s(485.7)} dur={10} de={[1042, 505]} para={[1088, 505]} cor={COR.creme} larg={7} />
      <Caixa f={f} ini={s(485.88)} x={1095} y={410} texto="UM ARTIGO" />
      <Caixa f={f} ini={s(487.42)} x={1095} y={740} texto="OUTRO ARTIGO" />
      {/* o outro artigo cita o primeiro: a volta fechada */}
      <Seta f={f} ini={s(488.1)} dur={12} de={[1230, 734]} para={[1230, 612]} cor={COR.vermelho} larg={8} />
      <Seta f={f} ini={s(488.3)} dur={12} de={[1380, 606]} para={[1380, 728]} cor={COR.vermelho} larg={8} />
      <div style={{ ...em(1430, 650), ...O(32, COR.vermelho, 0.2), opacity: saiExpo(prog(f, s(488.22), 8)), whiteSpace: 'nowrap' }}>QUE CITA O PRIMEIRO</div>
      {/* a fonte que falta */}
      {f >= s(486.4) && (
        <div style={{ ...em(1585, 410), width: 200, height: 190, boxSizing: 'border-box', border: `5px dashed ${COR.vermelho}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...A(110, COR.vermelho), opacity: saiExpo(prog(f, s(486.4), 10)) * (0.55 + 0.45 * Math.abs(Math.sin(pulso * Math.PI))) }}>?</div>
      )}
      <div style={{ ...em(1535, 356), width: 300, textAlign: 'center', ...O(26, COR.cinza, 0.26), opacity: saiExpo(prog(f, s(486.6), 10)) }}>A FONTE ORIGINAL</div>
    </AbsoluteFill>
  );
};

/** 489-503 · não achei, não achei, não achei, não achei */
const NaoAchei: React.FC<{ f: number }> = ({ f }) => {
  const itens: [number, number, string, number[]][] = [
    [489.18, 489.46, 'O DOCUMENTO.', [489.76, 489.86]],
    [490.54, 490.66, 'FOLHA DE PAGAMENTO.', [490.88, 491.18, 491.3]],
    [492.0, 492.42, 'RELATÓRIO DA AGÊNCIA.', [492.6, 493.1, 493.26]],
    [493.86, 494.06, 'O EFETIVO DO EXÉRCITO NO MESMO ANO.', [494.32, 494.42, 494.9, 495.54, 496.0, 496.3, 496.56]],
  ];
  const fim = s(497.7);
  const tr = tremor(f, s(498.82), 20, 12);
  return (
    <AbsoluteFill style={{ opacity: Math.min(saiExpo(prog(f, s(489.0), 6)), 1 - prog(f, s(502.95), 6)) }}>
      {f < fim + 10 && (
        <div style={{ opacity: 1 - prog(f, fim, 6) }}>
          {itens.map(([t0, t1, txt, tempos], i) => (
            <React.Fragment key={i}>
              <Cinetico texto={txt} f={f} ini={0} tempos={P(...tempos)} por="palavra" dur={6} estilo="mascara" style={em(135, 150 + i * 200, A(i === 3 ? 76 : 100))} />
              <Carimbo f={f} ini={s(t1)} texto="NÃO ACHEI" x={1330} y={150 + i * 200} tam={78} giro={[-6, 4, -3, 5][i]} />
              <div style={{ ...em(135, 290 + i * 200), width: 1650 * saiExpo(prog(f, s(t0), 14)), height: 2, background: 'rgba(233,198,147,0.3)' }} />
            </React.Fragment>
          ))}
        </div>
      )}
      {/* então eu não vou usar */}
      {f >= s(497.8) && f < s(500.5) && (
        <div style={{ opacity: 1 - prog(f, s(500.3), 5), transform: `translate(${tr.x.toFixed(2)}px, ${tr.y.toFixed(2)}px)` }}>
          <div style={{ ...em(0, 170), width: W, textAlign: 'center', ...S(34, COR.cinza, { lineHeight: 1.2 }), whiteSpace: 'pre', opacity: 0.8 }}>{FRASE}</div>
          <Tique f={f} ini={s(498.6)} x={W / 2 - 70} y={160} tam={140} tipo="x" larg={14} />
          <Cinetico texto={'ENTÃO EU\nNÃO VOU USAR.'} f={f} ini={0} tempos={P(497.9, 498.42, 498.58, 498.68, 498.82)} por="palavra" dur={6} estilo="bate" style={{ ...em(0, 380), width: W, textAlign: 'center', ...A(220) }} />
        </div>
      )}
      {f >= s(500.5) && (
        <>
          <Cinetico texto="PODE SER VERDADE." f={f} ini={0} tempos={P(500.62, 501.14, 501.28)} por="palavra" dur={7} estilo="mascara" style={{ ...em(0, 300), width: W, textAlign: 'center', ...A(130) }} />
          <Cinetico texto="EU SÓ NÃO SEI." f={f} ini={0} tempos={P(501.92, 502.18, 502.32, 502.48)} por="palavra" dur={7} estilo="mascara" style={{ ...em(0, 480), width: W, textAlign: 'center', ...A(210, COR.vermelho) }} />
        </>
      )}
      <Clarao f={f} ini={s(498.82)} dur={5} forca={0.4} />
    </AbsoluteFill>
  );
};

/** 503-518,9 · o princípio e o convite */
const Acordo: React.FC<{ f: number }> = ({ f }) => {
  const fimA = s(510.9);
  const clique = s(515.74);
  const aperta = f >= clique ? 1 - 0.1 * (1 - saiExpo(prog(f, clique, 8))) : 1;
  const inscrito = f >= clique + 3;
  const seta = saiCubica(prog(f, s(515.2), 14));
  const botao = saiExpo(prog(f, s(514.9), 10));
  const sino = f >= clique + 3 ? Math.sin((f - clique) * 0.9) * 18 * Math.exp(-(f - clique) / 14) : 0;
  return (
    <AbsoluteFill style={{ opacity: saiExpo(prog(f, s(503.0), 8)) }}>
      {f < fimA + 10 && (
        <div style={{ opacity: 1 - prog(f, fimA, 6) }}>
          <Cinetico texto={'UM VÍDEO SOBRE COMO O REGISTRO ESCRITO\nDESTRUIU O MITO'} f={f} ini={0} tempos={P(503.76, 503.88, 504.06, 504.4, 505.02, 505.12, 505.48, 505.84, 506.42, 506.58)} por="palavra" dur={6} estilo="mascara" style={em(135, 120, A(88, COR.papel))} />
          <Cinetico
            texto={'NÃO PODE SER CONSTRUÍDO\nCOM UMA FRASE QUE NINGUÉM\nMOSTRA ONDE ESTÁ ESCRITA.'}
            f={f}
            ini={0}
            tempos={P(506.96, 507.18, 507.42, 507.58, 508.16, 508.44, 508.6, 508.94, 509.16, 509.4, 509.8, 510.0, 510.16)}
            por="palavra"
            dur={7}
            estilo="mascara"
            destaque={{ 10: COR.vermelho, 11: COR.vermelho, 12: COR.vermelho }}
            style={em(135, 380, A(128))}
          />
        </div>
      )}
      {f >= s(511.0) && f < s(516.5) && (
        <div style={{ opacity: 1 - prog(f, s(516.3), 5) }}>
          <Cinetico texto="SE É ISSO QUE VOCÊ QUER VER:" f={f} ini={0} tempos={P(511.24, 511.42, 511.46, 511.56, 511.64, 511.84, 512.02)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 130), width: W, textAlign: 'center', ...O(46, COR.papel, 0.3) }} />
          <Cinetico texto="ALGUÉM DIZENDO" f={f} ini={0} tempos={P(512.4, 512.7)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 250), width: W, textAlign: 'center', ...O(40, COR.cinza, 0.3) }} />
          <Cinetico texto="“NÃO ACHEI A FONTE”" f={f} ini={0} tempos={P(513.0, 513.28, 513.42, 513.54)} por="palavra" dur={6} estilo="mascara" style={{ ...em(0, 316), width: W, textAlign: 'center', ...A(170) }} />
          <Cinetico texto="EM VEZ DE ENCHER O VÍDEO" f={f} ini={0} tempos={P(513.86, 514.06, 514.12, 514.26, 514.88, 515.02)} por="palavra" dur={6} estilo="sobe" style={{ ...em(0, 520), width: W, textAlign: 'center', ...O(40, COR.cinza, 0.3) }} />
          {/* o botão */}
          {botao > 0 && (
            <div style={{ ...em(W / 2 - 300, 680), width: 600, height: 150, borderRadius: 75, background: inscrito ? '#2a2a2a' : COR.vermelho, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${(aperta * mix(0.6, 1, botao)).toFixed(4)})`, opacity: c01(botao * 2), boxShadow: inscrito ? 'none' : '0 18px 60px rgba(205,18,15,0.5)' }}>
              <span style={{ fontFamily: O(1).fontFamily, fontWeight: 700, fontSize: 62, color: '#fff', letterSpacing: '0.06em' }}>{inscrito ? 'INSCRITO' : 'INSCREVER-SE'}</span>
              {inscrito && (
                <svg width={56} height={62} viewBox="0 0 56 62" style={{ transform: `rotate(${sino.toFixed(2)}deg)`, transformOrigin: '50% 10%' }}>
                  <path d="M28,4 C16,4 10,14 10,26 L10,40 L3,48 L53,48 L46,40 L46,26 C46,14 40,4 28,4 Z" fill="#fff" />
                  <circle cx={28} cy={55} r={6} fill="#fff" />
                </svg>
              )}
            </div>
          )}
          {seta > 0 && (
            <svg width={70} height={90} viewBox="0 0 70 90" style={{ position: 'absolute', left: mix(1560, 1150, seta), top: mix(1000, 770, seta), opacity: c01(seta * 3) }}>
              <path d="M6,4 L6,70 L24,54 L36,84 L48,79 L36,50 L60,50 Z" fill="#fff" stroke="#000" strokeWidth={4} strokeLinejoin="round" />
            </svg>
          )}
        </div>
      )}
      {f >= s(516.45) && (
        <>
          <Cinetico texto={'É O ACORDO\nQUE EU FAÇO AQUI.'} f={f} ini={0} tempos={P(516.54, 516.88, 516.96, 517.24, 517.38, 517.44, 517.7)} por="palavra" dur={7} estilo="mascara" style={{ ...em(0, 320), width: W, textAlign: 'center', ...A(170) }} />
          <Traco f={f} ini={s(517.8)} dur={16} x={W / 2 - 420} y={712} w={840} h={12} />
        </>
      )}
    </AbsoluteFill>
  );
};

export const SemFonte: React.FC<Cena> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Fundo f={f} tom="frio" semente={61} luz={0.8} />
    <Poeira f={f} n={28} />
    {f < s(479.6) && <AFrase f={f} />}
    {f >= s(479.4) && f < s(489.2) && <Corrente f={f} />}
    {f >= s(489.0) && f < s(503.2) && <NaoAchei f={f} />}
    {f >= s(503.0) && <Acordo f={f} />}
    <Vinheta forca={0.45} />
    <Grao f={f} forca={0.13} />
    <Clarao f={f} ini={13710} dur={7} forca={0.5} />
  </AbsoluteFill>
);
