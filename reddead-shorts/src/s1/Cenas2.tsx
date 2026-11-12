import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraSai, H, mix, prog, rnd, saiCubica, saiExpo, saiVolta, tremores, W } from '../kit/base';
import { Brasas, Camera, Clarao, Papel, Poeira, Raios, Sol } from '../kit/Cena';
import { CIDADE, camMix, Cam, curva, MAPA, MapaEUA, proj } from '../kit/Mapa';
import { Assinatura, Carimbo, Etiqueta, Maquina, Traco } from '../kit/Pecas';
import { A, Cinetico, Cz, D, Hodometro, Mq, O, Sl } from '../kit/Texto';
import { QuadroDe, Sangra, Tinta } from '../kit/Tinta';
import { ALVO, Pagina, VistaDaPagina } from './Pagina';
import { C, q, qp } from './tempo';

/**
 * 28,6-34,7 · "Não que ela recuou. Que ela deixou de ser uma linha. Dois anos
 * depois, um historiador de Chicago lê esse boletim"
 * O mapa: a linha de 1880 não anda para o oeste, ela se quebra em cacos, e o
 * povoamento aparece espalhado. Depois a câmera vai até Chicago.
 */
const CAM_OESTE: Cam = { cx: 760, cy: 690, zoom: 1.0 };
const CAM_LESTE: Cam = { cx: 1590, cy: 590, zoom: 1.5 };
export const Mapa: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.mapa);
  const tRecuou = qp('recuou');
  const tDeixou = qp('deixou');
  const tDois = qp('Dois');
  const tHist = qp('historiador');
  const tLe = qp('lê');
  const vai = entraSai(prog(f, tHist - 6, 24));
  const cam = camMix({ ...CAM_OESTE, zoom: 1.0 + 0.05 * prog(f, f0, 100) }, CAM_LESTE, vai);
  const X = MAPA.linha_1880[0];
  // "recuou": a linha ensaia um passo para o oeste e volta
  const passo = f >= tRecuou - 8 && f < tDeixou ? -70 * Math.sin(Math.PI * c01((f - (tRecuou - 8)) / 22)) : 0;
  const quebra = c01((f - tDeixou) / 22);
  const rota = curva(CIDADE.washington, CIDADE.chicago, 0.22);
  const tRota = saiCubica(prog(f, tLe - 4, 22));
  const ponta = rota.em(tRota);
  const [chx, chy] = proj(cam, ...CIDADE.chicago);
  const [wax, way] = proj(cam, ...CIDADE.washington);
  const tr = tremores(f, [[tDeixou, 12, 8]]);
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} x={tr.x} y={tr.y}>
        <MapaEUA cam={cam} desenho={saiExpo(prog(f, f0 - 2, 22))} estados={0.26}>
          {/* a linha de 1880, inteira até quebrar */}
          {quebra <= 0 ? (
            <line x1={X + passo} y1={MAPA.linha_1880[1]} x2={X + passo} y2={mix(MAPA.linha_1880[1], MAPA.linha_1880[3], saiExpo(prog(f, f0, 14)))} stroke={COR.vermelho} strokeWidth={9 / cam.zoom} />
          ) : (
            MAPA.cacos.map((c, i) => {
              const d = saiExpo(c01(quebra * 1.6 - rnd(i, 5) * 0.5));
              const dx = (rnd(i, 1) - 0.72) * 190 * d;
              const dy = (rnd(i, 2) - 0.5) * 40 * d;
              const rot = (rnd(i, 3) - 0.5) * 80 * d;
              const mx = (c[0] + c[2]) / 2;
              const my = (c[1] + c[3]) / 2;
              return (
                <line
                  key={i}
                  x1={c[0]}
                  y1={c[1]}
                  x2={c[2]}
                  y2={c[3]}
                  stroke={COR.vermelho}
                  strokeWidth={9 / cam.zoom}
                  strokeLinecap="round"
                  transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${rot.toFixed(1)} ${mx} ${my})`}
                  opacity={1 - 0.45 * d}
                />
              );
            })
          )}
          {/* os núcleos de povoamento, espalhados a oeste */}
          {MAPA.nucleos.map((n, i) => {
            const e = saiVolta(prog(f, tDeixou + 4 + i * 0.9, 8));
            return e > 0 ? <circle key={i} cx={n[0]} cy={n[1]} r={n[2] * 1.9 * e} fill={COR.tinta} /> : null;
          })}
          {/* o boletim viaja de Washington a Chicago */}
          {tRota > 0 && <path d={rota.d} fill="none" stroke={COR.vermelho} strokeWidth={5 / cam.zoom} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tRota} />}
        </MapaEUA>
        {/* a rota, desenhada por cima em coordenadas de tela */}
        {tRota > 0 && (
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
            <rect x={proj(cam, ...ponta)[0] - 22} y={proj(cam, ...ponta)[1] - 28} width={44} height={56} fill={COR.papel} stroke={COR.tinta} strokeWidth={4} transform={`rotate(${-12 + 30 * tRota} ${proj(cam, ...ponta)[0]} ${proj(cam, ...ponta)[1]})`} />
          </svg>
        )}
        {/* cidades */}
        {vai > 0.3 && (
          <>
            <div style={{ position: 'absolute', left: wax - 13, top: way - 13, width: 26, height: 26, borderRadius: '50%', background: COR.tinta, opacity: c01((vai - 0.3) * 3) }} />
            <Etiqueta f={f} t0={tHist + 4} x={wax - 40} y={way + 34} texto="Washington" tam={36} centro giro={2} />
            <div style={{ position: 'absolute', left: chx - 17, top: chy - 17, width: 34, height: 34, borderRadius: '50%', background: COR.vermelho, transform: `scale(${(saiVolta(prog(f, tHist + 14, 10)) * (1 + 0.12 * Math.sin(f / 3))).toFixed(3)})` }} />
            <Etiqueta f={f} t0={qp('Chicago') - 2} x={chx} y={chy - 118} texto="Chicago · 1893" tam={52} centro giro={-3} />
          </>
        )}
        {/* rótulo da linha */}
        <div style={{ position: 'absolute', left: proj(cam, X, 0)[0] - 330, top: 208, width: 300, textAlign: 'right', ...O(34, COR.vermelho, 0.16, { lineHeight: 1.2 }), opacity: c01(prog(f, f0 + 8, 8)) * (1 - prog(f, tDois - 4, 5)) }}>
          a linha
          <br />
          de 1880
        </div>
        {/* dois anos depois */}
        {f >= tDois && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 150, textAlign: 'center', opacity: 1 - prog(f, qp('Chicago') - 4, 6) }}>
            <div style={{ display: 'inline-block', background: COR.tinta, padding: '4px 36px 0', transform: `scale(${(1 + 0.4 * Math.pow(1 - prog(f, tDois, 5), 3)).toFixed(4)}) rotate(-2deg)` }}>
              <Hodometro valor={1891 + 2 * saiExpo(prog(f, tDois + 2, 16))} casas={4} style={{ ...A(200, COR.osso) }} />
            </div>
          </div>
        )}
      </Camera>
    </Papel>
  );
};

/**
 * 34,7-37,3 · "e anuncia que a fronteira americana está fechada."
 * Vermelho. Ele sai da névoa a cavalo, e o carimbo bate.
 */
export const Fechada: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.fechada);
  const tFront = qp('fronteira', 2);
  const tFech = qp('fechada');
  const tr = tremores(f, [[tFech, 36, 16]]);
  return (
    <Papel cor={COR.sangue}>
      <Camera fundo={COR.sangue} x={tr.x} y={tr.y} rot={tr.rot} escala={1.04 + 0.05 * prog(f, f0, 80)} origem="50% 45%">
        <Sol x={600} y={760} r={520} cor="#d2301c" halo="rgba(255,150,60,0.28)" />
        <Tinta
          take="revolver"
          k={6 + (f - f0) * 1.5}
          x={-110}
          y={200}
          w={1300}
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 20%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 20%)' }}
        />
        <div style={{ position: 'absolute', left: -200, top: 1900, width: W + 400, height: 600, background: COR.tinta }} />
        <Brasas f={f} n={44} />
        <Cinetico texto="A FRONTEIRA" f={f} ini={tFront - 3} por="letra" passo={0.8} dur={8} estilo="foco" style={{ position: 'absolute', left: 0, width: W, top: 236, textAlign: 'center', ...Cz(86, COR.osso, 0.22, { fontWeight: 700, paddingLeft: '0.22em', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }) }} />
        <Cinetico texto="AMERICANA" f={f} ini={qp('americana')} por="letra" passo={0.8} dur={8} estilo="foco" style={{ position: 'absolute', left: 0, width: W, top: 348, textAlign: 'center', ...Cz(86, COR.osso, 0.22, { fontWeight: 700, paddingLeft: '0.22em', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }) }} />
        <Carimbo f={f} t0={tFech} x={540} y={1180} linhas={['FECHADA']} tam={148} cor={COR.osso} giro={-9} />
      </Camera>
      <Clarao f={f} ini={tFech} dur={7} forca={0.85} />
    </Papel>
  );
};

/**
 * 37,3-41,3 · "Não cita o número, nem a data, nem o nome do Porter."
 * A câmera salta pela página e três tarjas batem.
 */
export const CensuraCena: React.FC<{ f: number }> = ({ f }) => {
  const tN = qp('número', 3);
  const tD = qp('data');
  const tP = qp('Porter', 2);
  const v1 = entraSai(prog(f, tD - 12, 9));
  const v2 = entraSai(prog(f, tP - 16, 9));
  const px = mix(mix(ALVO.numero[0], ALVO.data[0], v1), ALVO.nome[0], v2);
  const py = mix(mix(ALVO.numero[1], ALVO.data[1], v1), ALVO.nome[1], v2);
  const s = mix(mix(1.55, 1.7, v1), 1.04, v2) + 0.05 * prog(f, q(C.censura), 120);
  const emMovimento = (v1 > 0.02 && v1 < 0.98) || (v2 > 0.02 && v2 < 0.98);
  const tr = tremores(f, [
    [tN, 20, 10],
    [tD, 20, 10],
    [tP, 26, 12],
  ]);
  return (
    <Papel cor={COR.noite}>
      <Camera fundo={COR.noite} x={tr.x} y={tr.y} rot={tr.rot}>
        <VistaDaPagina px={px} py={py} sy={820} s={s} rot={mix(mix(-2, 2, v1), -1, v2)} borrao={emMovimento ? 9 : 0}>
          <Pagina f={99999} censura={{ numero: tN, data: tD, nome: tP }} fCensura={f} />
        </VistaDaPagina>
      </Camera>
    </Papel>
  );
};

/**
 * 41,3-45,6 · "Escreve só: 'um boletim recente do superintendente do Censo'."
 * A frase do historiador, batida à máquina.
 */
const FRASE = 'In a recent bulletin\nof the Superintendent\nof the Census…';
export const Citacao: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.citacao);
  const tUm = qp('um', 3);
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} escala={1.0 + 0.05 * prog(f, f0, 130)} origem="40% 45%">
        <div style={{ position: 'absolute', left: 60, top: 290, ...D(520, COR.vermelho, { lineHeight: 0.8, fontWeight: 700 }), opacity: saiExpo(prog(f, f0, 8)), transform: `scale(${(1 + 0.3 * Math.pow(1 - prog(f, f0, 8), 3)).toFixed(4)})`, transformOrigin: '0 0' }}>“</div>
        <Maquina f={f} t0={tUm} texto={FRASE} cps={24} style={{ position: 'absolute', left: 110, top: 700, width: 900, ...Mq(74, COR.tinta, { lineHeight: 1.5 }) }} />
        <Traco f={f} t0={qp('recente') + 2} dur={12} x={236} y={806} w={700} h={10} cor={COR.vermelho} giro={-0.6} />
        <div style={{ position: 'absolute', left: 110, top: 1120, width: 900, ...D(40, COR.tinta, { fontStyle: 'italic', lineHeight: 1.35 }), opacity: saiExpo(prog(f, qp('superintendente', 2), 12)) }}>
          Frederick Jackson Turner,
          <br />
          Chicago, 12 de julho de 1893
        </div>
        <Traco f={f} t0={qp('superintendente', 2) - 4} dur={14} x={110} y={1100} w={240} h={4} cor={COR.tinta} />
      </Camera>
      <Poeira f={f} forca={0.35} />
    </Papel>
  );
};

/**
 * 45,6-49,3 · "Arthur Morgan sobe aquela montanha em 1899,"
 * A câmera sobe o morro até ele. No "1899" cai o raio e o cavalo empina.
 */
export const Montanha: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.montanha);
  const fR = q(C.raio);
  const tAno = qp('1899');
  if (f < fR) {
    const sobe = saiCubica(prog(f, f0, fR - f0 + 6));
    return (
      <Papel cor={COR.ouro}>
        <Camera fundo={COR.ouro} y={mix(-560, 60, sobe)} escala={1.18} origem="50% 40%">
          <Raios f={f} x={560} y={1010} op={0.11} />
          <Sol x={560} y={1010} r={330} cor={COR.sangue} />
          <Tinta take="morro" k={20 + (f - f0) * 1.2} y={386} />
          <div style={{ position: 'absolute', left: -100, top: 1816, width: W + 200, height: 900, background: COR.tinta }} />
        </Camera>
        <Cinetico texto="ARTHUR MORGAN" f={f} ini={qp('Arthur') - 2} por="letra" passo={0.9} dur={9} estilo="foco" style={{ position: 'absolute', left: 0, width: W, top: 250, textAlign: 'center', ...Cz(84, COR.tinta, 0.2, { fontWeight: 700, paddingLeft: '0.2em' }) }} />
      </Papel>
    );
  }
  const tr = tremores(f, [[tAno, 40, 18]]);
  const pisca = f >= tAno && f < tAno + 14 ? [1, 0.2, 0.9, 0.1, 0.6, 0, 0.35, 0, 0.2, 0, 0.1, 0, 0, 0][f - tAno] : 0;
  return (
    <Papel cor={COR.noite}>
      <Camera fundo={COR.noite} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.06 * prog(f, fR, 60)} origem="50% 55%">
        <Sangra n={2} k={(f - fR) * 1.6} x={-110} y={420} w={1300} cor={COR.sangue} modo="clareia" giro={14} />
        <Tinta take="raio" k={Math.max(0, 8 + (f - tAno) * 1.1)} y={330} modo="clareia" cor={COR.osso} />
        {/* o raio */}
        {pisca > 0 && (
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: pisca }}>
            <polyline points="770,-20 700,210 790,300 640,520 720,600 560,880" fill="none" stroke="#fff" strokeWidth={16} strokeLinejoin="bevel" style={{ filter: 'drop-shadow(0 0 26px #fff)' }} />
            <polyline points="700,210 610,330 650,380 570,470" fill="none" stroke="#fff" strokeWidth={8} />
          </svg>
        )}
        <Brasas f={f} n={30} semente={12} />
        {f >= tAno && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 1210, textAlign: 'center', ...A(400, COR.vermelho, { letterSpacing: '0.01em' }), transform: `scale(${(1 + 1.1 * Math.pow(1 - prog(f, tAno, 6), 3)).toFixed(4)})`, textShadow: '0 10px 60px rgba(0,0,0,0.6)' }}>1899</div>
        )}
      </Camera>
      <Clarao f={f} ini={tAno} dur={9} forca={0.95} />
      <Clarao f={f} ini={fR} dur={4} forca={0.6} />
    </Papel>
  );
};

/**
 * 49,3-53,9 · "oito anos depois de alguém já ter assinado o atestado de óbito
 * do ofício dele."
 * Ele de costas, o revólver na mão. Por cima: os oito anos, a assinatura e o
 * carimbo.
 */
export const Atestado: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.atestado);
  const tOito = qp('oito');
  const tAss = qp('assinado', 2);
  const tAt = qp('atestado');
  const tOb = qp('óbito');
  const tr = tremores(f, [
    [tOito, 18, 9],
    [tAt, 30, 14],
  ]);
  const regua = saiExpo(prog(f, tOito + 3, 14));
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} x={tr.x} y={tr.y} rot={tr.rot} escala={1.02 + 0.05 * prog(f, f0, 140)} origem="50% 70%">
        <Tinta
          take="coldre"
          k={24 + (f - f0) * 1.15}
          y={540}
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 22%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 22%)' }}
        />
        {/* oito anos: de 1891 a 1899 */}
        <div style={{ position: 'absolute', left: 90, top: 300, ...A(84, COR.tinta), opacity: prog(f, tOito, 5) }}>1891</div>
        <div style={{ position: 'absolute', right: 90, top: 300, ...A(84, COR.tinta), opacity: prog(f, tOito + 8, 5) }}>1899</div>
        <div style={{ position: 'absolute', left: 270, top: 344, width: 540 * regua, height: 8, background: COR.vermelho }} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 270 + i * 67.5 - 2, top: 326, width: 5, height: 44, background: COR.vermelho, opacity: regua * 8 > i ? 1 : 0 }} />
        ))}
        {f >= tOito && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 164, textAlign: 'center', ...A(112, COR.vermelho), transform: `scale(${(1 + 0.6 * Math.pow(1 - prog(f, tOito, 5), 3)).toFixed(4)})` }}>8 ANOS DEPOIS</div>
        )}
        {/* a assinatura de Porter */}
        <Assinatura f={f} t0={tAss - 10} dur={26} texto="Robert P. Porter" x={140} y={410} tam={124} larg={900} giro={-4} />
        {/* o carimbo */}
        {f >= tAt && (
          <div style={{ position: 'absolute', left: 540, top: 900, transform: `translate(-50%, -50%) rotate(-7deg) scale(${(1 + 1.3 * Math.pow(1 - prog(f, tAt, 5), 3)).toFixed(4)})`, opacity: c01((f - tAt + 1) / 2) }}>
            <div style={{ background: COR.papel, border: `10px solid ${COR.vermelho}`, outline: `4px solid ${COR.vermelho}`, outlineOffset: 10, padding: '34px 56px 22px', textAlign: 'center', whiteSpace: 'nowrap', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
              <div style={{ ...Sl(118, COR.vermelho, { letterSpacing: '0.03em' }) }}>ATESTADO</div>
              <div style={{ ...Sl(126, COR.vermelho, { letterSpacing: '0.03em' }) }}>DE ÓBITO</div>
            </div>
          </div>
        )}
      </Camera>
      <Clarao f={f} ini={tAt} dur={6} forca={0.6} />
      <AbsoluteFill style={{ background: COR.tinta, opacity: 0.0 + 0.35 * prog(f, tOb + 20, 40) }} />
    </Papel>
  );
};
