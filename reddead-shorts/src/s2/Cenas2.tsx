import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraSai, H, mix, prog, rnd, saiCubica, saiExpo, saiVolta, tremores, W } from '../kit/base';
import { Camera, Clarao, Papel, Poeira, Raios, Sol } from '../kit/Cena';
import { Etiqueta, Traco } from '../kit/Pecas';
import { A, Cinetico, Cz, Hodometro, Mq, O } from '../kit/Texto';
import { DentroDaTinta, Sangra, Tinta } from '../kit/Tinta';
import { C, q, qp } from './tempo';

const bate = (f: number, t0: number, forca = 0.9, dur = 5) => 1 + forca * Math.pow(1 - prog(f, t0, dur), 3);

/** O frasco do remédio, em tinta. `nivel` enche o frasco de 0 a 1. */
export const Frasco: React.FC<{ x: number; y: number; alt: number; desenho?: number; nivel?: number; cor?: string; vidro?: string; rotulo?: boolean }> = ({ x, y, alt, desenho = 1, nivel = 1, cor = COR.tinta, vidro = COR.osso, rotulo = true }) => {
  const d = c01(desenho);
  return (
    <svg width={alt * 0.44} height={alt} viewBox="0 0 200 460" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      <path d="M72,70 L72,112 C72,138 40,142 40,176 L40,420 Q40,444 64,444 L136,444 Q160,444 160,420 L160,176 C160,142 128,138 128,112 L128,70 Z" fill={vidro} opacity={c01(d * 3 - 1.4)} />
      <clipPath id="dentro-do-frasco">
        <path d="M72,70 L72,112 C72,138 40,142 40,176 L40,420 Q40,444 64,444 L136,444 Q160,444 160,420 L160,176 C160,142 128,138 128,112 L128,70 Z" />
      </clipPath>
      <rect x={30} y={444 - 300 * c01(nivel)} width={140} height={320} fill={COR.vermelho} clipPath="url(#dentro-do-frasco)" opacity={c01(d * 3 - 2)} />
      <path d="M72,70 L72,112 C72,138 40,142 40,176 L40,420 Q40,444 64,444 L136,444 Q160,444 160,420 L160,176 C160,142 128,138 128,112 L128,70 Z" fill="none" stroke={cor} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
      <rect x={58} y={8} width={84} height={50} rx={8} fill={cor} opacity={c01(d * 3 - 1.6)} />
      <rect x={64} y={56} width={72} height={18} fill={cor} opacity={c01(d * 3 - 1.6)} />
      {rotulo && (
        <g opacity={c01(d * 3 - 2)}>
          <rect x={40} y={236} width={120} height={108} fill={COR.papel} stroke={cor} strokeWidth={7} />
          <rect x={56} y={262} width={88} height={9} fill={cor} />
          <rect x={56} y={286} width={66} height={7} fill={cor} opacity={0.6} />
          <rect x={56} y={306} width={78} height={7} fill={cor} opacity={0.6} />
        </g>
      )}
      <rect x={54} y={184} width={11} height={200} rx={5} fill="#fff" opacity={0.5 * c01(d * 3 - 2)} />
    </svg>
  );
};

/**
 * 28,2-40,3 · "O primeiro remédio que de fato funciona contra a tuberculose é
 * a estreptomicina, isolada em 1943, 44 anos depois, testada em pacientes no
 * ano seguinte."
 * O frasco se desenha, o nome bate por cima, o ano corre de 1899 até 1943.
 */
export const Remedio: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.remedio);
  const tNome = qp('estreptomicina');
  const tIso = qp('isolada');
  const tAno = qp('1943');
  const tPara = q(36.22);
  const t44 = qp('44');
  const tTest = qp('testada');
  const ano = 1899 + 44 * (1 - Math.pow(1 - prog(f, tAno, tPara - tAno), 2.2));
  const tr = tremores(f, [
    [tNome, 22, 11],
    [tPara, 24, 11],
    [t44, 26, 12],
  ]);
  return (
    <Papel cor={COR.papel}>
      <Camera fundo={COR.papel} x={tr.x} y={tr.y} rot={tr.rot} escala={1.0 + 0.05 * prog(f, f0, 360)} origem="50% 50%">
        <Sol x={540} y={860} r={380} cor={COR.ouro} escala={saiVolta(prog(f, f0 + 4, 16), 1.2)} op={0.95} />
        <Frasco x={390} y={520} alt={680} desenho={prog(f, f0 + 2, 40)} nivel={saiExpo(prog(f, f0 + 30, 30))} />
        {/* o nome */}
        {f >= tNome && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 760, transform: 'rotate(-5deg)' }}>
            <Cinetico texto="ESTREPTOMICINA" f={f} ini={tNome} por="letra" passo={2.2} dur={5} estilo="bate" style={{ textAlign: 'center', ...A(158, COR.osso, { letterSpacing: '0.005em', background: COR.vermelho, display: 'inline-block', padding: '8px 26px 0', marginLeft: 20, boxShadow: `10px 12px 0 ${COR.tinta}` }) }} />
          </div>
        )}
        {/* o ano */}
        {f >= tIso - 2 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 150, textAlign: 'center', ...O(46, COR.tinta, 0.4, { paddingLeft: '0.4em' }), opacity: prog(f, tIso - 2, 5) }}>isolada em</div>
        )}
        {f >= tIso - 2 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 214, textAlign: 'center', transform: `scale(${(f >= tPara ? bate(f, tPara, 0.3, 6) : 1).toFixed(4)})` }}>
            <Hodometro valor={f < tAno ? 1899 : ano} casas={4} style={{ ...A(300, f >= tPara ? COR.vermelho : COR.tinta) }} />
          </div>
        )}
        {/* 44 anos depois */}
        {f >= t44 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 1220, textAlign: 'center', transform: `scale(${bate(f, t44, 0.8).toFixed(4)}) rotate(-3deg)` }}>
            <span style={{ display: 'inline-block', background: COR.tinta, padding: '6px 34px 0', ...A(128, COR.osso) }}>44 ANOS DEPOIS</span>
          </div>
        )}
        <Etiqueta f={f} t0={tTest + 4} x={540} y={1068} texto="1944 · em pacientes" tam={46} centro giro={2} fundo={COR.vermelho} />
      </Camera>
      <Clarao f={f} ini={tNome} dur={5} forca={0.5} />
      <Clarao f={f} ini={tPara} dur={5} forca={0.4} />
    </Papel>
  );
};

/**
 * 40,3-47,3 · "Entre a tosse do Arthur e a primeira dose de uma coisa que
 * funciona, tem 44 anos de absolutamente nada."
 * A linha do tempo, de pé. A câmera desce por 44 anos vazios; depois a linha
 * inteira cabe na tela; no "nada" tudo apaga.
 */
const ANO_PX = 300; // altura de um ano na linha do tempo
export const Nada: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.nada);
  const fV = q(C.visao);
  const fP = q(C.preto);
  if (f >= fP) {
    // "nada."
    const t0 = qp('nada', 2);
    return (
      <AbsoluteFill style={{ backgroundColor: '#050302' }}>
        {f >= t0 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 730, textAlign: 'center', ...A(400, COR.osso), transform: `scale(${(1 + 0.05 * prog(f, t0, 40)).toFixed(4)})`, opacity: c01((f - t0 + 1) / 2) }}>NADA.</div>
        )}
      </AbsoluteFill>
    );
  }
  if (f < fV) {
    // a viagem: do nó de 1899 ao nó de 1943
    const tDose = qp('primeira');
    const desce = entraSai(prog(f, tDose - 6, 26));
    const camY = desce * 44 * ANO_PX;
    const borrao = desce > 0.03 && desce < 0.97 ? 14 : 0;
    const anos = [];
    for (let i = 1; i < 44; i++) {
      const y = 700 + i * ANO_PX - camY;
      if (y < -200 || y > H + 200) continue;
      anos.push(
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: 500, top: y - 3, width: 80, height: 6, background: COR.osso, opacity: 0.55 }} />
          <div style={{ position: 'absolute', left: 620, top: y - 34, ...A(64, COR.osso), opacity: 0.4 }}>{1899 + i}</div>
        </React.Fragment>,
      );
    }
    const yA = 700 - camY;
    const yB = 700 + 44 * ANO_PX - camY;
    return (
      <Papel cor={COR.noite}>
        <Camera fundo={COR.noite} escala={1.0 + 0.03 * prog(f, f0, 110)} origem="50% 40%">
          <div style={{ position: 'absolute', left: 537, top: Math.max(-50, yA), width: 6, height: Math.min(H + 100, yB) - Math.max(-50, yA), background: COR.osso }} />
          <div style={{ filter: borrao ? `blur(${borrao}px)` : undefined }}>{anos}</div>
          {/* 1899: a tosse */}
          {yA > -900 && (
            <>
              <DentroDaTinta take="busto" k={120} x={60} y={yA - 430} w={420} fundo={COR.osso} modo="clareia" style={{ WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, #000 72%, rgba(0,0,0,0) 100%)' }}>
                <Sangra n={1} k={44} x={70} y={250} w={280} cor={COR.vermelho} modo="multiplica" />
              </DentroDaTinta>
              <div style={{ position: 'absolute', left: 540 - 22, top: yA - 22, width: 44, height: 44, borderRadius: '50%', background: COR.vermelho }} />
              <div style={{ position: 'absolute', left: 610, top: yA - 100, ...A(170, COR.osso) }}>1899</div>
              <div style={{ position: 'absolute', left: 616, top: yA + 80, ...O(48, COR.vermelho, 0.26) }}>a tosse</div>
            </>
          )}
          {/* 1943: a primeira dose */}
          {yB < H + 700 && (
            <>
              <div style={{ position: 'absolute', left: 540 - 22, top: yB - 22, width: 44, height: 44, borderRadius: '50%', background: COR.osso }} />
              <div style={{ position: 'absolute', left: 610, top: yB - 100, ...A(170, COR.osso) }}>1943</div>
              <div style={{ position: 'absolute', left: 616, top: yB + 80, ...O(48, COR.sol, 0.2, { lineHeight: 1.2 }) }}>
                a primeira
                <br />
                dose
              </div>
              <Frasco x={180} y={yB - 250} alt={420} cor={COR.osso} vidro="rgba(244,236,216,0.14)" rotulo={false} />
            </>
          )}
        </Camera>
        <Poeira f={f} cor={COR.osso} forca={0.4} n={24} />
      </Papel>
    );
  }
  // a linha inteira na tela: de 1899 a 1943, e nada no meio
  const t44 = qp('44', 2);
  const tDe = q(45.16) - 1;
  const abre = saiExpo(prog(f, fV, 12));
  const tr = tremores(f, [[t44, 26, 12]]);
  const yA = 330;
  const yB = 1500;
  return (
    <Papel cor={COR.noite}>
      <Camera fundo={COR.noite} x={tr.x} y={tr.y} rot={tr.rot}>
        <div style={{ position: 'absolute', left: 537, top: yA, width: 6, height: (yB - yA) * abre, background: COR.osso }} />
        {Array.from({ length: 43 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 520, top: yA + ((i + 1) / 44) * (yB - yA) - 2, width: 40, height: 4, background: COR.osso, opacity: 0.5 * c01(abre * 44 - i) }} />
        ))}
        <div style={{ position: 'absolute', left: 540 - 20, top: yA - 20, width: 40, height: 40, borderRadius: '50%', background: COR.vermelho }} />
        <div style={{ position: 'absolute', left: 0, width: W, top: yA - 150, textAlign: 'center', ...A(110, COR.osso) }}>1899</div>
        <div style={{ position: 'absolute', left: 540 - 20, top: yB - 20, width: 40, height: 40, borderRadius: '50%', background: COR.osso, opacity: c01(abre * 3 - 2) }} />
        <div style={{ position: 'absolute', left: 0, width: W, top: yB + 34, textAlign: 'center', ...A(110, COR.osso), opacity: c01(abre * 3 - 2) }}>1943</div>
        {f >= t44 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 610, textAlign: 'center', transform: `scale(${bate(f, t44, 0.9, 6).toFixed(4)})` }}>
            <span style={{ display: 'inline-block', background: COR.noite, padding: '0 30px', ...A(300, COR.vermelho, { lineHeight: 1.0 }) }}>44 ANOS</span>
          </div>
        )}
        {f >= tDe && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 930, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: COR.noite, padding: '6px 28px', ...Cz(62, COR.osso, 0.2, { fontWeight: 700, paddingLeft: '0.2em' }), opacity: prog(f, tDe, 5) }}>
              <span>de </span>
              <span style={{ opacity: f >= qp('absolutamente') ? 1 : 0.25 }}>absolutamente</span>
            </span>
          </div>
        )}
      </Camera>
      <Clarao f={f} ini={t44} dur={5} forca={0.4} cor={COR.vermelho} />
    </Papel>
  );
};

/**
 * 47,3-51,3 · "Ele não está sendo maltratado. Ele está na frente de um buraco."
 * Ele a cavalo no alto do morro. A câmera desce, e o morro é a borda de um
 * buraco sem fundo.
 */
export const Buraco: React.FC<{ f: number }> = ({ f }) => {
  const f0 = q(C.buraco);
  const tEle = qp('Ele', 3);
  const tBur = qp('buraco');
  const desce = entraSai(prog(f, tEle - 4, 34));
  const tr = tremores(f, [[tBur, 30, 14]]);
  const entra = saiExpo(prog(f, f0, 16));
  return (
    <Papel cor={COR.ouro}>
      <Camera fundo={COR.ouro} x={tr.x} y={tr.y - desce * 760} rot={tr.rot} escala={1.0} origem="50% 50%">
        <Raios f={f} x={560} y={900} op={0.1} />
        <Sol x={560} y={900} r={320} cor={COR.sangue} escala={0.6 + 0.4 * entra} />
        <Tinta take="morro" k={40 + (f - f0) * 1.3} y={270} />
        <div style={{ position: 'absolute', left: -300, top: 1700, width: W + 600, height: 2400, background: COR.tinta }} />
        {/* os anéis do buraco, descendo */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const fase = ((f * 0.012 + i / 7) % 1 + 1) % 1;
          const rx = 520 * (1 - fase * 0.82);
          return <div key={i} style={{ position: 'absolute', left: 540 - rx, top: 1830 + fase * 900 - rx * 0.24, width: rx * 2, height: rx * 0.48, borderRadius: '50%', border: `5px solid ${COR.osso}`, boxSizing: 'border-box', opacity: 0.3 * Math.sin(Math.PI * fase) * desce }} />;
        })}
        {f >= qp('frente') - 3 && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 1960, textAlign: 'center', ...Cz(60, COR.osso, 0.22, { fontWeight: 700, paddingLeft: '0.22em' }), opacity: prog(f, qp('frente') - 3, 6) }}>na frente de um</div>
        )}
        {f >= tBur && (
          <div style={{ position: 'absolute', left: 0, width: W, top: 2050, textAlign: 'center', ...A(300, COR.osso), transform: `scale(${bate(f, tBur, 0.9, 6).toFixed(4)})` }}>BURACO</div>
        )}
      </Camera>
      <Clarao f={f} ini={tBur} dur={5} forca={0.35} />
    </Papel>
  );
};
