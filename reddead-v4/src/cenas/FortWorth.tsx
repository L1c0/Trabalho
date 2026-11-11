import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraSai, H, mix, prog, rnd, saiCubica, saiExpo, tremor, W } from '../kit/base';
import { Clarao, Fundo, Grao, Poeira, Vinheta } from '../kit/Cena';
import { Impacto, Tarja } from '../kit/Letreiro';
import { Cam, camMix, CIDADE, curva, MapaEUA, Ponto, proj, Rota, Rotulo } from '../kit/Mapa';
import { Legenda, Papel, TINTA } from '../kit/Pecas';
import { Cinetico, Risco } from '../kit/Texto';
import { A, em, M, O } from '../kit/tipos';
import { s } from '../tempo';

/**
 * 376-457 s · Fort Worth, 1900: o retrato, a vitrine, a Pinkerton e as
 * circulares. Não há a foto real no pacote; a cena é ilustração, e diz isso.
 */
const P = (...seg: number[]) => seg.map(s);
type Cena = { f: number; clipes: boolean };

/** Um homem de terno e chapéu-coco, em silhueta. Caixa de 200 x 460, pé no centro. */
const Figura: React.FC<{ x: number; base: number; esc?: number; chapeu: number; anel?: number; tracejado?: boolean }> = ({ x, base, esc = 1, chapeu, anel = 0, tracejado }) => {
  // `chapeu` de 0 a 1: o chapéu salta e volta para a cabeça
  const cai = chapeu > 0 && chapeu < 1 ? -46 * Math.sin(Math.PI * chapeu) : 0;
  return (
    <g transform={`translate(${x} ${base}) scale(${esc}) translate(-100 -460)`}>
      <path d="M14,460 L14,236 Q14,176 66,160 L100,186 L134,160 Q186,176 186,236 L186,460 Z" fill="#17110c" />
      <path d="M84,166 L100,192 L116,166 L108,148 L92,148 Z" fill="#d8c8a4" />
      <path d="M95,172 L100,214 L105,172 Z" fill="#0d0907" />
      <ellipse cx={100} cy={112} rx={31} ry={38} fill="#b99e73" />
      <g transform={`translate(0 ${cai.toFixed(1)}) rotate(${(cai * 0.25).toFixed(2)} 100 86)`}>
        <path d="M62,86 Q58,22 100,22 Q142,22 138,86 Z" fill="#0f0b08" />
        <ellipse cx={100} cy={86} rx={61} ry={10} fill="#0f0b08" />
      </g>
      {anel > 0 && <circle cx={100} cy={100} r={74 * (2 - saiExpo(c01(anel)))} fill="none" stroke={COR.vermelho} strokeWidth={10} strokeDasharray={tracejado ? '20 14' : undefined} opacity={c01(anel * 3)} />}
    </g>
  );
};

/** O retrato de gabinete: cartão creme, fundo de estúdio e os cinco. Tamanho-base 1000 x 740. */
const Foto: React.FC<{ f: number; x: number; y: number; esc?: number; giro?: number; chapeus?: number; aneis?: number[]; legenda?: string; op?: number }> = ({
  f,
  x,
  y,
  esc = 1,
  giro = 0,
  chapeus = -999,
  aneis,
  legenda = 'FORT WORTH, TEXAS · 1900',
  op = 1,
}) => {
  const xs = [150, 320, 490, 660, 830];
  const es = [1.0, 1.05, 0.99, 1.06, 1.0];
  const quem = [0, 4, 2];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 1000, height: 740, transform: `scale(${esc.toFixed(4)}) rotate(${giro}deg)`, transformOrigin: 'left top', background: 'linear-gradient(160deg, #E9DFC8, #D2C3A2)', boxShadow: '0 40px 100px rgba(0,0,0,0.75)', opacity: op }}>
      <div style={{ position: 'absolute', left: 40, top: 40, width: 920, height: 560, overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 35%, #a08a66 0%, #6d5a40 55%, #3a2e20 100%)' }}>
        <svg width={920} height={560} style={{ position: 'absolute', left: 0, top: 0 }}>
          {xs.map((fx, i) => (
            <Figura key={i} x={fx} base={575} esc={es[i]} chapeu={prog(f, chapeus + i * 4, 12)} anel={aneis && quem.indexOf(i) >= 0 ? prog(f, aneis[quem.indexOf(i)], 9) : 0} tracejado={i === 2} />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(20,12,4,0.6) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 630, width: 1000, textAlign: 'center', ...M(30, TINTA, { fontWeight: 500, letterSpacing: '0.16em' }) }}>{legenda}</div>
    </div>
  );
};

/** Circular pequena: folha com cinco retratos. */
const Folhinha: React.FC<{ x: number; y: number; t: number; giro?: number; tam?: number }> = ({ x, y, t, giro = 0, tam = 1 }) => {
  if (t <= 0) return null;
  const e = saiExpo(c01(t));
  return (
    <div style={{ position: 'absolute', left: x - 23 * tam, top: y - 30 * tam, width: 46 * tam, height: 60 * tam, background: '#E8DFCB', boxShadow: '0 6px 16px rgba(0,0,0,0.6)', transform: `rotate(${giro}deg) scale(${mix(2.2, 1, e).toFixed(3)})`, opacity: c01(t * 3) }}>
      <div style={{ position: 'absolute', left: 5 * tam, top: 6 * tam, width: 36 * tam, height: 4 * tam, background: TINTA }} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: (4 + i * 8) * tam, top: 16 * tam, width: 6 * tam, height: 9 * tam, background: TINTA }} />
      ))}
      {[0, 1, 2].map((i) => (
        <div key={`l${i}`} style={{ position: 'absolute', left: 5 * tam, top: (32 + i * 7) * tam, width: (36 - i * 6) * tam, height: 2.5 * tam, background: 'rgba(29,23,18,0.6)' }} />
      ))}
    </div>
  );
};

const FW = CIDADE.fort_worth;
const DEN = CIDADE.denver;
const CAM_W: Cam = { cx: 1150, cy: 700, zoom: 0.82 };
const CAM_T: Cam = { cx: 1000, cy: 880, zoom: 2.1 };
const CAM_D: Cam = { cx: 1050, cy: 780, zoom: 1.5 };
const CAM_N: Cam = { cx: 780, cy: 620, zoom: 1.0 };

/** 376-388,9 · cinco bandidos entram numa loja em Fort Worth */
const Chegada: React.FC<{ f: number }> = ({ f }) => {
  const cam = camMix(CAM_W, CAM_T, entraSai(prog(f, s(376.3), 100)));
  const [px, py] = proj(cam, FW[0], FW[1]);
  const placa = saiExpo(prog(f, s(384.7), 12));
  const tb = f - s(384.7);
  const balanca = tb > 0 ? 7 * Math.exp(-tb / 22) * Math.cos(tb / 5) : 0;
  return (
    <AbsoluteFill>
      <Fundo f={f} tom="quente" semente={41} />
      <MapaEUA cam={cam}>
        {[0, 1, 2, 3, 4].map((i) => {
          const t = saiCubica(prog(f, s(377.46) + i * 3, 50));
          if (t <= 0) return null;
          const de: [number, number] = [FW[0] - 250 - i * 34, FW[1] - 190 + i * 52];
          return <circle key={i} cx={mix(de[0], FW[0] + (i - 2) * 5, t)} cy={mix(de[1], FW[1] + (i % 2) * 5, t)} r={6 / cam.zoom} fill={COR.creme} opacity={c01(t * 6) * (1 - prog(f, s(380.6), 10))} />;
        })}
        <Ponto em={FW} t={prog(f, s(379.3), 8)} cam={cam} f={f} />
      </MapaEUA>
      <Rotulo em={FW} cam={cam} t={prog(f, s(379.32), 8)} texto="FORT WORTH" sub="TEXAS" lado="baixo" tam={54} />
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 62%)' }} />
      <Cinetico texto="1900" f={f} ini={s(376.6)} por="letra" passo={1.5} dur={7} estilo="mascara" fim={s(388.7)} saida="sobe" style={em(128, 130, A(250))} />
      <Tarja f={f} ini={s(377.4)} fim={s(381.5)} texto="CINCO BANDIDOS ENTRAM NUMA LOJA" y={420} tempos={P(377.46, 377.64, 378.12, 378.64, 378.8)} />
      <Impacto f={f} ini={s(381.7)} fim={s(383.9)} texto="NÃO PRA ROUBAR." y={500} tam={136} tempos={P(381.72, 381.96, 382.12)} por="palavra" />
      <Tarja f={f} ini={s(382.4)} fim={s(385.9)} texto="ERA O ESTÚDIO DO FOTÓGRAFO" y={700} tempos={P(382.4, 383.36, 383.5, 383.96, 384.16)} />
      {placa > 0 && (
        <div style={{ ...em(px - 330, 150), width: 660, transformOrigin: '50% -120px', transform: `rotate(${balanca.toFixed(3)}deg) translateY(${((1 - placa) * -500).toFixed(1)}px)`, opacity: 1 - prog(f, s(388.7), 6) }}>
          <div style={{ position: 'absolute', left: 60, top: -160, width: 5, height: 160, background: '#3a2a1a' }} />
          <div style={{ position: 'absolute', right: 60, top: -160, width: 5, height: 160, background: '#3a2a1a' }} />
          <div style={{ background: 'linear-gradient(170deg, #E9DFC8, #D2C3A2)', border: `9px solid ${TINTA}`, padding: '14px 0 16px', textAlign: 'center', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
            <div style={A(104, TINTA)}>JOHN SWARTZ</div>
            <div style={M(27, TINTA, { fontWeight: 500, letterSpacing: '0.34em' })}>FOTÓGRAFO</div>
          </div>
        </div>
      )}
      <Impacto f={f} ini={s(386.2)} fim={s(388.7)} texto={'ENTRARAM PRA\nTIRAR UM RETRATO.'} y={470} tam={112} tempos={P(386.6, 387.36, 387.56, 387.88, 388.32)} por="palavra" />
    </AbsoluteFill>
  );
};

/** 388,9-418,5 · o retrato, o recibo, a vitrine e o detetive */
const Retrato: React.FC<{ f: number }> = ({ f }) => {
  const vai = saiCubica(prog(f, s(408.5), 32));
  const fx = mix(800, 1134, vai);
  const fy = mix(150, 372, vai);
  const fe = mix(1, 0.52, vai);
  const vitrine = saiCubica(prog(f, s(408.3), 20));
  const zoom = 1 + 0.03 * prog(f, s(388.9), 400);
  const det = saiCubica(prog(f, s(411.7), s(415.4) - s(411.7)));
  const dx = mix(-420, 720, det);
  const passo = Math.sin(f * 0.5) * 6 * (det < 1 ? 1 : 0);
  const foco = Math.min(saiExpo(prog(f, s(395.6), 10)), 1 - prog(f, s(397.5), 8));
  return (
    <AbsoluteFill>
      <Fundo f={f} tom="quente" semente={44} />
      <Poeira f={f} n={30} />
      {/* a vitrine do estúdio */}
      {vitrine > 0 && (
        <div style={{ opacity: vitrine }}>
          <div style={{ ...em(1040, 190), width: 700, height: 96, background: 'linear-gradient(170deg, #E9DFC8, #D2C3A2)', border: `7px solid ${TINTA}`, boxSizing: 'border-box', textAlign: 'center', ...A(58, TINTA), lineHeight: '80px' }}>JOHN SWARTZ · FOTÓGRAFO</div>
          <div style={{ ...em(1040, 306), width: 700, height: 520, border: '26px solid #2b1d12', boxSizing: 'border-box', background: 'linear-gradient(180deg, #131a20, #0a0d10)', boxShadow: '0 40px 90px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.8)' }} />
        </div>
      )}
      <div style={{ transform: `scale(${(vai > 0 ? 1 : zoom).toFixed(4)})`, transformOrigin: '70% 50%' }}>
        <Foto f={f} x={fx} y={fy} esc={fe} giro={mix(-1.5, 0, vai)} chapeus={s(394.72)} aneis={P(416.78, 417.1, 417.32)} legenda={f >= s(398.8) && f < s(402.0) ? 'DIRETORIA · RELATÓRIO ANUAL' : 'FORT WORTH, TEXAS · 1900'} />
      </div>
      {/* o vidro por cima da foto */}
      {vitrine > 0 && <div style={{ ...em(1066, 332), width: 648, height: 468, background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.09) 38%, rgba(255,255,255,0) 46%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.06) 66%, rgba(255,255,255,0) 72%)', opacity: vitrine }} />}
      {/* cantos de enquadramento: a pose */}
      {foco > 0 &&
        [0, 1, 2, 3].map((i) => {
          const esq = i % 2 === 0;
          const cima = i < 2;
          const m = 40 * (1 - foco);
          return <div key={i} style={{ position: 'absolute', left: esq ? 850 - m : 1690 + m, top: cima ? 200 - m : 690 + m, width: 60, height: 60, borderLeft: esq ? `6px solid ${COR.vermelho}` : undefined, borderRight: esq ? undefined : `6px solid ${COR.vermelho}`, borderTop: cima ? `6px solid ${COR.vermelho}` : undefined, borderBottom: cima ? undefined : `6px solid ${COR.vermelho}`, opacity: foco }} />;
        })}
      {/* o detetive passa na frente */}
      {det > 0 && f < s(418.6) && (
        <svg width={520} height={900} viewBox="0 0 520 900" style={{ position: 'absolute', left: dx, top: 200 + passo, opacity: 0.97 }}>
          <ellipse cx={260} cy={150} rx={150} ry={22} fill="#040302" />
          <path d="M165,150 Q160,40 260,40 Q360,40 355,150 Z" fill="#040302" />
          <ellipse cx={260} cy={200} rx={72} ry={84} fill="#040302" />
          <path d="M40,900 L60,420 Q70,300 190,270 L330,270 Q450,300 460,420 L480,900 Z" fill="#040302" />
        </svg>
      )}
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 36%, rgba(0,0,0,0) 50%)' }} />
      {/* nomes */}
      <Impacto f={f} ini={s(389.38)} fim={s(393.0)} texto={'BUTCH\nCASSIDY'} y={230} tam={116} tempos={P(389.42, 389.8)} por="palavra" />
      <Impacto f={f} ini={s(391.42)} fim={s(393.0)} texto={'SUNDANCE\nKID'} y={520} tam={116} tempos={P(391.46, 391.92)} por="palavra" />
      <Legenda f={f} ini={s(390.28)} fim={s(393.0)} x={140} y={474} texto="ESTAVA LÁ." tam={30} cor={COR.vermelho} />
      <Legenda f={f} ini={s(392.2)} fim={s(393.0)} x={140} y={764} texto="ESTAVA LÁ." tam={30} cor={COR.vermelho} />
      {/* cinco homens de terno, chapéu-coco */}
      <Impacto f={f} ini={s(393.2)} fim={s(397.4)} texto={'CINCO HOMENS\nDE TERNO.'} y={250} tam={104} tempos={P(393.22, 393.66, 393.94, 394.12)} por="palavra" />
      <Impacto f={f} ini={s(394.7)} fim={s(397.4)} texto="CHAPÉU-COCO." y={520} tam={104} cor={COR.vermelho} tempos={P(394.72)} por="palavra" />
      <Impacto f={f} ini={s(397.6)} fim={s(401.9)} texto={'COMO UMA\nDIRETORIA\nDE BANCO'} y={230} tam={112} tempos={P(398.2, 398.52, 398.86, 399.56, 399.72)} por="palavra" />
      <Tarja f={f} ini={s(400.2)} fim={s(401.9)} texto="POSANDO PRO RELATÓRIO ANUAL" y={640} tam={33} tempos={P(400.26, 400.7, 400.92, 401.34)} />
      <Tarja f={f} ini={s(402.0)} fim={s(403.9)} texto="ELES ACHARAM A PIADA BOA." y={640} cor={COR.creme} tempos={P(402.02, 402.58, 402.94, 403.06, 403.26)} />
      {/* pagaram pela foto */}
      <Impacto f={f} ini={s(404.0)} fim={s(408.3)} texto={'PAGARAM\nPELA FOTO.'} y={230} tam={128} tempos={P(404.08, 404.56, 404.78)} por="palavra" />
      <Papel f={f} ini={s(404.5)} fim={s(408.2)} x={170} y={560} w={430} h={280} giro={-4} de="esq">
        <div style={em(30, 20, A(52, TINTA))}>RECIBO</div>
        <div style={{ ...em(30, 88), width: 370, height: 3, background: TINTA }} />
        <div style={em(30, 108, M(25, TINTA, { fontWeight: 500 }))}>1 RETRATO DE GRUPO</div>
        <div style={em(30, 148, M(25, TINTA, { fontWeight: 500 }))}>CINCO CAVALHEIROS</div>
        {f >= s(404.9) && (
          <div style={{ ...em(210, 176), ...A(58, COR.vermelho), border: `6px solid ${COR.vermelho}`, padding: '0 16px', transform: `rotate(-8deg) scale(${mix(2.4, 1, saiExpo(prog(f, s(404.9), 6))).toFixed(3)})`, opacity: 0.9 }}>PAGO</div>
        )}
      </Papel>
      <Tarja f={f} ini={s(405.6)} fim={s(408.3)} texto="SWARTZ TAMBÉM ACHOU QUE TINHA FICADO BOA." y={900} tam={36} tempos={P(405.68, 406.34, 407.0, 407.34, 407.48, 407.64, 407.98)} />
      {/* a vitrine e o detetive */}
      <Tarja f={f} ini={s(408.5)} fim={s(410.55)} texto="BOTOU UMA CÓPIA" y={200} tempos={P(408.5, 408.94, 409.06)} />
      <Impacto f={f} ini={s(409.4)} fim={s(410.55)} texto={'NA VITRINE\nDO ESTÚDIO.'} y={290} tam={120} tempos={P(409.44, 409.58, 410.06, 410.26)} por="palavra" />
      <Tarja f={f} ini={s(410.68)} fim={s(418.4)} texto="UM DETETIVE DE FORT WORTH" y={200} tempos={P(410.68, 411.7, 412.18, 412.38, 412.7)} />
      <Tarja f={f} ini={s(413.1)} fim={s(418.4)} texto="PASSOU NA FRENTE DAQUELA VITRINE" y={272} cor={COR.creme} tempos={P(413.18, 414.64, 414.86, 415.26, 415.68)} />
      <Impacto f={f} ini={s(416.2)} fim={s(418.4)} texto={'RECONHECEU\n2 OU 3 ROSTOS.'} y={400} tam={112} tempos={P(416.26, 416.78, 417.1, 417.32, 417.48)} por="palavra" destaque={{ 1: COR.vermelho, 2: COR.vermelho, 3: COR.vermelho }} />
      <Legenda f={f} ini={s(389.6)} x={1785} y={1010} alinhar="dir" texto="ILUSTRAÇÃO · O RETRATO ORIGINAL É DE JOHN SWARTZ, 1900" tam={19} />
      <Clarao f={f} ini={s(388.9)} dur={9} forca={0.95} />
    </AbsoluteFill>
  );
};

const DESTINOS = ['winnemucca', 'reno', 'salt_lake', 'boise', 'helena', 'cheyenne', 'santa_fe', 'el_paso', 'omaha', 'kansas_city', 'sioux_falls', 'bismarck', 'des_moines', 'minneapolis'];

/** 418,5-436 · Denver, a Pinkerton imprime, e a circular corre de Nevada a Minnesota */
const Pinkerton: React.FC<{ f: number }> = ({ f }) => {
  const cam = camMix(CAM_D, CAM_N, entraSai(prog(f, s(428.9), 44)));
  const rota = saiCubica(prog(f, s(419.4), s(421.5) - s(419.4)));
  const pt = curva(FW, DEN, 0.16).em(rota);
  const [cx, cy] = proj(cam, pt[0], pt[1]);
  const [dxs, dys] = proj(cam, DEN[0], DEN[1]);
  return (
    <AbsoluteFill>
      <Fundo f={f} tom="frio" semente={47} />
      <MapaEUA cam={cam}>
        <Rota de={FW} para={DEN} t={rota} cam={cam} arco={0.16} larg={6} ponta={false} />
        {DESTINOS.map((d, i) => (
          <Rota key={d} de={DEN} para={CIDADE[d]} t={saiCubica(prog(f, s(429.9) + i * 3, 16))} cam={cam} arco={0.1 * (i % 2 ? 1 : -1)} larg={3.5} />
        ))}
        <Ponto em={FW} t={1} cam={cam} f={f} cor={COR.creme} raio={7} />
        <Ponto em={DEN} t={prog(f, s(421.4), 8)} cam={cam} f={f} />
      </MapaEUA>
      {/* a foto viaja até Denver */}
      {rota > 0 && rota < 1 && <div style={{ ...em(cx - 34, cy - 26), width: 68, height: 52, background: '#D8CBA9', border: '5px solid #E9DFC8', boxShadow: '0 8px 22px rgba(0,0,0,0.7)', transform: `rotate(${(-8 + 12 * rota).toFixed(2)}deg)` }} />}
      <Rotulo em={FW} cam={cam} t={1 - prog(f, s(429.0), 10)} texto="FORT WORTH" lado="dir" tam={30} />
      <Rotulo em={DEN} cam={cam} t={prog(f, s(421.5), 8)} texto="DENVER" sub="ESCRITÓRIO DA PINKERTON" lado="esq" tam={46} />
      {/* a Pinkerton imprime: as folhas saem em leque */}
      {f < s(429.3) &&
        [0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Folhinha key={i} x={dxs + 60 + i * 44} y={dys - 96 - Math.abs(i - 3) * -9} t={prog(f, s(422.9) + i * 3, 8) * (1 - prog(f, s(429.0), 8))} giro={(i - 3) * 9} tam={1.5} />
        ))}
      {DESTINOS.map((d, i) => {
        const [x, y] = proj(cam, CIDADE[d][0], CIDADE[d][1]);
        return <Folhinha key={d} x={x} y={y} t={prog(f, s(429.9) + i * 3 + 14, 8)} giro={(rnd(i, 9) - 0.5) * 24} tam={0.9} />;
      })}
      <Rotulo em={CIDADE.winnemucca} cam={cam} t={prog(f, s(430.0), 8)} texto="NEVADA" lado="cima" tam={34} cor={COR.creme} />
      <Rotulo em={CIDADE.minneapolis} cam={cam} t={prog(f, s(430.62), 8)} texto="MINNESOTA" lado="cima" tam={34} cor={COR.creme} />
      <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)' }} />
      <Tarja f={f} ini={s(418.7)} fim={s(422.2)} texto="A FOTO FOI PRO ESCRITÓRIO DA PINKERTON, EM DENVER" y={910} tam={38} tempos={P(418.74, 419.38, 419.64, 419.8, 420.04, 420.56, 420.78, 421.52, 421.58)} />
      <Impacto f={f} ini={s(422.3)} fim={s(424.3)} texto={'A PINKERTON\nIMPRIMIU.'} y={520} tam={128} tempos={P(422.34, 422.84, 423.46)} por="palavra" destaque={{ 2: COR.vermelho }} />
      <Impacto f={f} ini={s(424.4)} fim={s(429.1)} texto={'15 DE MAIO\nDE 1901'} y={500} tam={150} tempos={P(424.84, 425.16, 425.36, 425.6, 425.74)} por="palavra" />
      <Tarja f={f} ini={s(426.8)} fim={s(429.1)} texto="MENOS DE UM ANO DEPOIS" y={104} tempos={P(426.84, 427.14, 427.32, 427.38, 427.5)} />
      <Tarja f={f} ini={s(427.7)} fim={s(429.1)} texto="DAQUELA TARDE NO ESTÚDIO" y={174} cor={COR.creme} tempos={P(427.8, 428.16, 428.46, 428.62)} />
      <Tarja f={f} ini={s(429.3)} fim={s(436.0)} texto="POLICIAIS DE NEVADA ATÉ MINNESOTA" y={850} tempos={P(429.38, 429.92, 430.0, 430.4, 430.62)} />
      <Tarja f={f} ini={s(431.0)} fim={s(436.0)} texto="TINHAM AQUELES CINCO ROSTOS NA MÃO" y={922} cor={COR.creme} tempos={P(431.06, 431.72, 432.06, 432.36, 433.5, 433.72)} />
      {/* a circular impressa */}
      <Papel f={f} ini={s(433.9)} x={1250} y={110} w={540} h={700} giro={3} de="dir">
        <div style={{ ...em(0, 26, A(36, TINTA)), width: 540, textAlign: 'center', lineHeight: 1.1 }}>
          PINKERTON&apos;S NATIONAL
          <br />
          DETECTIVE AGENCY
        </div>
        <div style={{ ...em(40, 122), width: 460, height: 3, background: TINTA }} />
        <div style={{ ...em(0, 136, M(20, TINTA, { fontWeight: 500 })), width: 540, textAlign: 'center' }}>CIRCULAR · 15 DE MAIO DE 1901</div>
        <svg width={540} height={170} style={{ position: 'absolute', left: 0, top: 182 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={32 + i * 98} y={4} width={84} height={150} fill="#b9a67f" stroke={TINTA} strokeWidth={3} />
              <Figura x={74 + i * 98} base={154} esc={0.3} chapeu={1} />
            </g>
          ))}
        </svg>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} style={{ ...em(40, 378 + i * 34), width: i === 7 ? 260 : 460, height: 9, background: 'rgba(29,23,18,0.55)' }} />
        ))}
      </Papel>
      <Impacto f={f} ini={s(434.0)} fim={s(436.0)} texto={'EM CIRCULAR\nIMPRESSA.'} y={130} tam={128} tempos={P(434.06, 434.44, 435.08)} por="palavra" />
    </AbsoluteFill>
  );
};

/** 436-442,5 · ninguém atirou neles */
const Quatro: React.FC<{ f: number }> = ({ f }) => {
  const fim = s(442.4);
  const linha = (texto: string, y: number, tempos: number[], cor: string = COR.creme) => (
    <Cinetico texto={texto} f={f} ini={0} fim={fim} saida="sobe" tempos={tempos} por="palavra" dur={7} estilo="mascara" style={{ ...em(135, y), ...A(100, cor) }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      <Fundo f={f} tom="neutro" semente={50} />
      <Foto f={f} x={1230} y={270} esc={0.6} giro={3} op={0.85 * (1 - prog(f, fim, 8))} />
      {linha('NINGUÉM ATIROU NELES.', 170, P(436.46, 437.1, 437.48))}
      {linha('ALGUÉM OS FOTOGRAFOU.', 320, P(438.24, 438.66, 438.82))}
      {linha('ELES POSARAM.', 470, P(439.46, 439.68))}
      {linha('E PAGARAM PELO RETRATO.', 620, P(440.32, 440.84, 441.46, 441.7), COR.vermelho)}
      <Clarao f={f} ini={s(438.82)} dur={8} forca={0.9} />
    </AbsoluteFill>
  );
};

/** 442,5-457 · é o registro: telégrafo, ferrovia, papel, arquivo */
const Registro: React.FC<{ f: number }> = ({ f }) => {
  const tr = tremor(f, s(445.64), 16, 10);
  const pulsos = [447.2, 447.62, 448.04];
  const cavalo = prog(f, s(446.9), 66);
  const trilho = saiCubica(prog(f, s(449.3), 24));
  const trem = saiCubica(prog(f, s(449.5), 38));
  const voce = prog(f, s(453.8), 44);
  const gavetas: React.ReactNode[] = [];
  if (f >= s(455.1)) {
    for (let lin = 0; lin < 5; lin++) {
      for (let col = 0; col < 8; col++) {
        const dist = Math.hypot(col - 3.5, (lin - 2) * 1.4);
        const t = saiExpo(prog(f, s(455.2) + (4.6 - dist) * 5.5, 9));
        if (t <= 0) continue;
        gavetas.push(
          <div key={`${lin}-${col}`} style={{ position: 'absolute', left: col * 240, top: lin * 216, width: 240, height: 216, boxSizing: 'border-box', border: '3px solid rgba(233,198,147,0.5)', background: '#0b0a09', opacity: t, transform: `scale(${mix(1.25, 1, t).toFixed(3)})` }}>
            <div style={{ position: 'absolute', left: 70, top: 54, width: 100, height: 40, border: '2px solid rgba(233,198,147,0.5)', boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: 96, top: 136, width: 48, height: 12, background: 'rgba(233,198,147,0.55)' }} />
          </div>,
        );
      }
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      <Fundo f={f} tom="neutro" semente={53} />
      <Poeira f={f} n={24} />
      {/* é o registro */}
      {f < s(446.6) && (
        <div style={{ opacity: 1 - prog(f, s(446.35), 6), transform: `translate(${tr.x.toFixed(2)}px, ${tr.y.toFixed(2)}px)` }}>
          <Cinetico texto="É ISSO QUE MATA O FAROESTE." f={f} ini={0} tempos={P(442.76, 442.96, 443.14, 443.28, 443.52, 443.68)} por="palavra" dur={6} estilo="mascara" style={{ ...em(0, 140), width: W, textAlign: 'center', ...A(124) }} />
          <div style={{ ...em(0, 316), width: W, display: 'flex', justifyContent: 'center' }}>
            <Risco f={f} ini={s(445.3)} dur={8} alt={8}>
              <Cinetico texto="NÃO É O XERIFE MAIS RÁPIDO." f={f} ini={0} tempos={P(444.26, 444.34, 444.42, 444.5, 444.8, 445.08)} por="palavra" dur={6} estilo="sobe" style={O(52, COR.papel, 0.26)} />
            </Risco>
          </div>
          <Cinetico texto="É O REGISTRO." f={f} ini={0} tempos={P(445.64, 445.82, 445.88)} por="palavra" dur={6} estilo="bate" style={{ ...em(0, 440), width: W, textAlign: 'center', ...A(290, COR.vermelho) }} />
        </div>
      )}
      {/* o telégrafo corre mais que o cavalo */}
      {f >= s(446.5) && f < s(449.0) && (
        <div style={{ opacity: Math.min(saiExpo(prog(f, s(446.5), 6)), 1 - prog(f, s(448.85), 5)) }}>
          <Cinetico texto="O TELÉGRAFO" f={f} ini={s(446.56)} por="palavra" passo={3} dur={6} estilo="mascara" style={em(135, 110, A(150))} />
          <Cinetico texto="CORRE MAIS QUE O CAVALO." f={f} ini={0} tempos={P(447.76, 448.0, 448.2, 448.34, 448.44)} por="palavra" dur={6} estilo="sobe" style={em(140, 290, O(52, COR.papel, 0.26))} />
          <div style={{ ...em(200, 556), width: 1520, height: 8, background: COR.creme }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ ...em(200 + i * 190 - 5, 500), width: 10, height: 170, background: COR.creme, opacity: 0.85 }} />
          ))}
          {pulsos.map((t0, i) => {
            const t = prog(f, s(t0), 9);
            if (t <= 0 || t >= 1) return null;
            return <div key={i} style={{ ...em(200 + 1520 * t - 90, 548), width: 110, height: 24, borderRadius: 12, background: `linear-gradient(to right, rgba(205,18,15,0), ${COR.vermelho})`, boxShadow: `0 0 30px ${COR.vermelho}` }} />;
          })}
          <div style={{ ...em(200, 822), width: 1520, height: 3, background: 'rgba(233,198,147,0.3)' }} />
          <div style={{ ...em(200 + 150 * cavalo - 24, 782), width: 48, height: 48, borderRadius: 24, background: COR.creme }} />
          <div style={em(200, 440, O(34, COR.vermelho, 0.3))}>TELÉGRAFO</div>
          <div style={em(200, 852, O(34, COR.cinza, 0.3))}>CAVALO</div>
        </div>
      )}
      {/* a ferrovia chega antes de você */}
      {f >= s(448.95) && f < s(451.15) && (
        <div style={{ opacity: Math.min(saiExpo(prog(f, s(448.95), 6)), 1 - prog(f, s(451.0), 5)) }}>
          <Cinetico texto="A FERROVIA" f={f} ini={s(449.06)} por="palavra" passo={3} dur={6} estilo="mascara" style={em(135, 110, A(150))} />
          <Cinetico texto="CHEGA ANTES DE VOCÊ." f={f} ini={0} tempos={P(450.1, 450.3, 450.48, 450.64)} por="palavra" dur={6} estilo="sobe" style={em(140, 290, O(52, COR.papel, 0.26))} />
          {Array.from({ length: 39 }).map((_, i) => (i / 39 <= trilho ? <div key={i} style={{ ...em(200 + i * 39, 636), width: 12, height: 56, background: 'rgba(233,198,147,0.45)' }} /> : null))}
          <div style={{ ...em(200, 646), width: 1520 * trilho, height: 6, background: COR.creme }} />
          <div style={{ ...em(200, 676), width: 1520 * trilho, height: 6, background: COR.creme }} />
          <div style={{ ...em(200 + 1240 * trem, 548), width: 270, height: 92 }}>
            <div style={{ position: 'absolute', left: 0, top: 22, width: 270, height: 70, background: COR.vermelho }} />
            <div style={{ position: 'absolute', left: 196, top: 0, width: 30, height: 30, background: COR.vermelho }} />
            <div style={{ position: 'absolute', left: 30, top: 34, width: 60, height: 30, background: '#0b0a09' }} />
          </div>
          <div style={{ ...em(512, 772), width: 48, height: 48, borderRadius: 24, background: COR.creme }} />
          <div style={em(486, 836, O(34, COR.cinza, 0.3))}>VOCÊ</div>
        </div>
      )}
      {/* o papel não cansa e não esquece */}
      {f >= s(451.1) && f < s(453.7) && (
        <div style={{ opacity: Math.min(saiExpo(prog(f, s(451.1), 6)), 1 - prog(f, s(453.55), 5)) }}>
          <Cinetico texto="O PAPEL" f={f} ini={s(451.18)} por="palavra" passo={3} dur={6} estilo="mascara" style={em(135, 110, A(150))} />
          <Cinetico texto="NÃO CANSA E NÃO ESQUECE." f={f} ini={0} tempos={P(452.04, 452.16, 452.58, 452.64, 452.76)} por="palavra" dur={6} estilo="sobe" style={em(140, 290, O(52, COR.papel, 0.26))} />
          {Array.from({ length: 22 }).map((_, i) => {
            const t = saiExpo(prog(f, s(451.3) + i * 2.6, 8));
            if (t <= 0) return null;
            return <div key={i} style={{ ...em(960 + (rnd(i, 3) - 0.5) * 46, 930 - i * 24 - (1 - t) * 300), width: 560, height: 20, background: i % 5 === 4 ? '#cdbf9f' : '#E8DFCB', boxShadow: '0 4px 10px rgba(0,0,0,0.6)', opacity: c01(t * 3), transform: `rotate(${((rnd(i, 4) - 0.5) * 3).toFixed(2)}deg)` }} />;
          })}
        </div>
      )}
      {/* dá pra fugir de um homem; de um arquivo, não */}
      {f >= s(453.6) && (
        <>
          {gavetas}
          {f < s(455.2) && (
            <>
              <Cinetico texto="DÁ PRA FUGIR DE UM HOMEM." f={f} ini={0} tempos={P(453.74, 453.86, 454.14, 454.44, 454.56, 454.66)} por="palavra" dur={6} estilo="mascara" style={{ ...em(0, 190), width: W, textAlign: 'center', ...A(130) }} />
              <div style={{ ...em(360, 640), width: 1200, height: 3, background: 'rgba(233,198,147,0.25)' }} />
              <div style={{ ...em(520 + 240 * voce - 26, 592), width: 52, height: 52, borderRadius: 26, background: COR.vermelho }} />
              <div style={em(520 + 240 * voce - 80, 672, { ...O(30, COR.vermelho, 0.3), width: 160, textAlign: 'center' })}>HOMEM</div>
            </>
          )}
          <div style={{ ...em(820 + 600 * Math.min(voce, 1) - 26, 592), width: 52, height: 52, borderRadius: 26, background: COR.creme, boxShadow: '0 0 0 6px #0b0a09', opacity: f >= s(455.9) ? 0 : 1 }} />
          {f >= s(455.15) && (
            <div style={{ ...em(0, 380), width: W, textAlign: 'center' }}>
              <span style={{ display: 'inline-block', background: '#000', padding: '18px 44px 8px', boxShadow: '0 0 80px 40px rgba(0,0,0,0.9)' }}>
                <Cinetico texto={'NÃO DÁ PRA FUGIR\nDE UM ARQUIVO.'} f={f} ini={0} tempos={P(455.22, 455.34, 455.48, 455.62, 455.92, 456.02, 456.1)} por="palavra" dur={6} estilo="mascara" style={A(150, COR.vermelho)} />
              </span>
            </div>
          )}
        </>
      )}
      <Clarao f={f} ini={s(445.64)} dur={5} forca={0.5} />
    </AbsoluteFill>
  );
};

export const FortWorth: React.FC<Cena> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {f < s(388.9) && <Chegada f={f} />}
    {f >= s(388.9) && f < s(418.5) && <Retrato f={f} />}
    {f >= s(418.5) && f < s(436.0) && <Pinkerton f={f} />}
    {f >= s(436.0) && f < s(442.5) && <Quatro f={f} />}
    {f >= s(442.5) && <Registro f={f} />}
    <Vinheta forca={0.42} />
    <Grao f={f} forca={0.13} />
    <Clarao f={f} ini={11280} dur={7} forca={0.5} />
  </AbsoluteFill>
);

export { H };
