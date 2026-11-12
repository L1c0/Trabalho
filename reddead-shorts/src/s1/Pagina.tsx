import React from 'react';
import { c01, COR, prog, rnd, saiExpo } from '../kit/base';
import { Assinatura, Censura, Maquina, Traco } from '../kit/Pecas';
import { Cinetico, D, Mq } from '../kit/Texto';
import { Tinta } from '../kit/Tinta';
import { q, qp } from './tempo';

/**
 * A página do boletim: "Extra Census Bulletin No. 2", de 20 de abril de 1891.
 * É uma folha alta (1080 x 2300); a câmera passeia por ela. `f` comanda o que
 * já apareceu: nas cenas em que a página volta pronta, basta passar um quadro
 * bem adiante. As tarjas de censura têm os seus próprios quadros.
 */
export const PAG_H = 3000;
/** Onde ficam, na página, as três coisas que o historiador não cita. */
export const ALVO = { numero: [540, 1004], data: [792, 452], nome: [552, 1990] } as const;

const linhasDeCorpo = (y0: number, n: number, semente: number) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const fim = i === n - 1 ? 0.45 + rnd(i, semente) * 0.3 : 0.92 + rnd(i, semente) * 0.08;
    out.push(<div key={i} style={{ position: 'absolute', left: 110 + (i === 0 ? 60 : 0), top: y0 + i * 34, width: (860 - (i === 0 ? 60 : 0)) * fim, height: 9, background: COR.tinta, opacity: 0.2 }} />);
  }
  return out;
};

export const Pagina: React.FC<{ f: number; censura?: { numero?: number; data?: number; nome?: number }; fCensura?: number }> = ({ f, censura, fCensura = 0 }) => {
  const some = (t0: number, d = 8) => saiExpo(prog(f, t0, d));
  const tWash = qp('Washington');
  const tCenso = qp('Censo');
  const tBoletim = qp('Boletim');
  const tExtra = qp('Extra');
  const tNum = qp('número');
  const tDois = qp('2');
  const tTit = [qp('“Distribuição'), qp('da', 1), qp('Segundo'), qp('Densidade”')];
  const tAss = qp('Robert');
  const tSup = qp('superintendente');
  const circ = prog(f, tDois, 12);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: PAG_H, background: COR.papel, boxShadow: '0 30px 90px rgba(0,0,0,0.55)' }}>
      {/* a vinheta do alto: o Oeste, reduzido a uma gravura de cabeçalho */}
      <div
        style={{
          position: 'absolute',
          left: 350,
          top: 96,
          width: 380,
          height: 262,
          overflow: 'hidden',
          background: COR.papel,
          opacity: some(tWash - 4, 14),
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, rgba(0,0,0,0) 100%)',
        }}
      >
        <Tinta take="morro" k={60 + f * 0.5} x={-130} y={-300} w={640} />
      </div>
      <Traco f={f} t0={tWash - 2} dur={16} x={110} y={392} w={860} h={5} cor={COR.tinta} origem="center" />
      <Traco f={f} t0={tWash} dur={16} x={110} y={402} w={860} h={2} cor={COR.tinta} origem="center" />

      {/* linha de data */}
      <Maquina f={f} t0={tWash} texto="WASHINGTON, D. C." cps={34} cursor={f < tWash + 26} style={{ position: 'absolute', left: 110, top: 428, ...Mq(40) }} />
      <div style={{ position: 'absolute', right: 110, top: 428, ...Mq(40), opacity: some(tWash + 16, 6) }}>April 20, 1891.</div>

      {/* cabeçalho */}
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 528, textAlign: 'center', ...D(34, COR.tinta, { letterSpacing: '0.22em', opacity: some(tCenso - 4, 8) }) }}>DEPARTMENT OF THE INTERIOR,</div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 578, textAlign: 'center', ...D(40, COR.tinta, { letterSpacing: '0.3em', fontWeight: 700, opacity: some(tCenso, 8) }) }}>CENSUS OFFICE.</div>
      <Cinetico texto="EXTRA" f={f} ini={tBoletim} por="letra" passo={1.2} dur={7} estilo="bate" style={{ position: 'absolute', left: 0, width: 1080, top: 648, textAlign: 'center', ...D(168, COR.tinta, { fontWeight: 700, letterSpacing: '0.1em' }) }} />
      <Cinetico texto="CENSUS BULLETIN." f={f} ini={tExtra} por="letra" passo={0.7} dur={7} estilo="bate" style={{ position: 'absolute', left: 0, width: 1080, top: 838, textAlign: 'center', ...D(94, COR.tinta, { fontWeight: 700, letterSpacing: '0.03em' }) }} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 958, textAlign: 'center', ...D(78, COR.tinta, { fontStyle: 'italic', opacity: some(tNum, 6) }) }}>No. 2.</div>
      {/* o círculo de quem leu com atenção */}
      {circ > 0 && (
        <svg width={1080} height={PAG_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <ellipse cx={540} cy={1006} rx={178} ry={66} fill="none" stroke={COR.vermelho} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - saiExpo(circ)} transform="rotate(-5 540 1006)" />
        </svg>
      )}
      <Traco f={f} t0={tNum + 10} dur={14} x={300} y={1104} w={480} h={3} cor={COR.tinta} origem="center" />
      <Traco f={f} t0={tNum + 12} dur={14} x={380} y={1114} w={320} h={2} cor={COR.tinta} origem="center" />

      {/* o título */}
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 1150, textAlign: 'center', ...D(58, COR.tinta, { fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'pre' }) }}>
        <span style={{ opacity: some(tTit[0], 5) }}>DISTRIBUTION </span>
        <span style={{ opacity: some(tTit[1], 5) }}>OF POPULATION</span>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 1228, textAlign: 'center', ...D(58, COR.tinta, { fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'pre' }) }}>
        <span style={{ opacity: some(tTit[2], 5) }}>ACCORDING TO </span>
        <span style={{ opacity: some(tTit[3], 5) }}>DENSITY: 1890.</span>
      </div>
      {/* as seis classes de densidade, do vazio ao cheio */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const e = some(tTit[3] + 6 + i * 3, 6);
        return (
          <div key={i} style={{ position: 'absolute', left: 201 + i * 116, top: 1338, width: 98, height: 98, border: `4px solid ${COR.tinta}`, opacity: c01(e * 2) }}>
            <div style={{ position: 'absolute', inset: 0, background: COR.tinta, opacity: [0, 0.14, 0.32, 0.52, 0.76, 1][i] * e }} />
          </div>
        );
      })}

      {/* o corpo do texto, só como mancha */}
      <div style={{ opacity: some(tTit[3] + 20, 20) }}>
        {linhasDeCorpo(1500, 6, 3)}
        {linhasDeCorpo(1730, 4, 9)}
      </div>

      {/* a assinatura */}
      <Assinatura f={f} t0={tAss} dur={44} texto="Robert P. Porter" x={120} y={1890} tam={134} larg={960} giro={-5} />
      <Traco f={f} t0={tAss - 6} dur={12} x={150} y={2082} w={700} h={3} cor={COR.tinta} />
      <Maquina f={f} t0={tSup} texto="Superintendent of Census." cps={30} cursor={false} style={{ position: 'absolute', left: 150, top: 2104, ...Mq(44) }} />

      {/* as tarjas: o que o historiador não cita */}
      {censura?.numero !== undefined && <Censura f={fCensura} t0={censura.numero} x={338} y={950} w={404} h={112} giro={-2} />}
      {censura?.data !== undefined && <Censura f={fCensura} t0={censura.data} x={596} y={420} w={392} h={62} giro={1.5} />}
      {censura?.nome !== undefined && <Censura f={fCensura} t0={censura.nome} x={120} y={1900} w={790} h={176} giro={-4} />}
    </div>
  );
};

/** A página vista pela câmera: o ponto (`px`, `py`) da página vai para (`sx`, `sy`) da tela, na escala `s`. */
export const VistaDaPagina: React.FC<{ px?: number; py: number; sx?: number; sy?: number; s?: number; rot?: number; borrao?: number; children: React.ReactNode }> = ({
  px = 540,
  py,
  sx = 540,
  sy = 960,
  s = 1,
  rot = 0,
  borrao = 0,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 1080,
      height: PAG_H,
      transformOrigin: `${px}px ${py}px`,
      transform: `translate(${(sx - px).toFixed(2)}px, ${(sy - py).toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(5)})`,
      filter: borrao > 0.5 ? `blur(${borrao.toFixed(1)}px)` : undefined,
    }}
  >
    {children}
  </div>
);
