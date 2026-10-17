import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {regua as tempos} from '../data/componentes';
import {regua as textos} from '../data/textos';
import {cor, font, tipo} from '../theme';

/**
 * RÉGUA — a escala de Mohs. Componente, não imagem (layout do mockup-mohs.png).
 * Régua de 1 a 10, da espinha (240) até 1680, linha de base em y=640. Fosfofilita e diamante
 * em tinta, haste alta, rótulo em caixa; os outros em cor fraca, haste baixa, caixa baixa.
 * Os números 3,5 e 10 entram em corpo 72 acima dos marcadores, contando de 0 até o valor em
 * 20 frames, em algarismos de linha como no mockup. Rodapé em cor fraca, corpo 26, na margem esquerda.
 */
const X0 = 240;
const X1 = 1680;
const BASE = 640;
const x = (v: number) => X0 + ((v - 1) / 9) * (X1 - X0);
const texto = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', fontFamily: font, whiteSpace: 'nowrap', ...s});

export const Regua: React.FC<{inicio: number}> = ({inicio}) => {
  const f = useCurrentFrame() + inicio;
  const numero = (v: number) => {
    const de = tempos.conta[v];
    if (de === undefined || f < de) return null;
    const t = Math.min(1, (f - de) / tempos.duracaoConta);
    const atual = v * t;
    return Number.isInteger(v) ? String(Math.round(atual)) : atual.toFixed(1).replace('.', ',');
  };
  return (
    <AbsoluteFill>
      <div style={texto({left: X0, top: 212, fontSize: tipo.rotulo, letterSpacing: '0.22em', color: cor.fraco})}>{textos.cabecalho}</div>
      <div style={{position: 'absolute', left: X0, top: 261, width: 353, height: 1, backgroundColor: cor.fraco}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke={cor.tinta} strokeWidth={2} />
        {Array.from({length: 10}, (_, i) => i + 1).map((v) => (
          <line key={v} x1={x(v)} y1={BASE} x2={x(v)} y2={BASE + (v === 1 || v === 5 || v === 10 ? 20 : 12)} stroke={cor.tinta} strokeWidth={2} />
        ))}
        {textos.marcadores.map((m) => {
          const topo = m.forte ? 490 : 555;
          return (
            <g key={m.nome}>
              <line x1={x(m.valor)} y1={BASE - 6} x2={x(m.valor)} y2={topo} stroke={m.forte ? cor.tinta : cor.fraco} strokeWidth={m.forte ? 3 : 1} />
              {m.forte ? <circle cx={x(m.valor)} cy={topo} r={7} fill={cor.tinta} /> : <circle cx={x(m.valor)} cy={topo} r={3.5} fill="none" stroke={cor.fraco} strokeWidth={1.2} />}
            </g>
          );
        })}
      </svg>
      {Array.from({length: 10}, (_, i) => i + 1).map((v) => (
        <div key={v} style={texto({left: x(v) - 40, width: 80, textAlign: 'center', top: v === 1 || v === 5 || v === 10 ? 674 : 664, fontSize: tipo.rotulo, color: cor.fraco, fontVariantNumeric: 'lining-nums tabular-nums'})}>
          {v}
        </div>
      ))}
      {textos.marcadores.map((m) => (
        <React.Fragment key={m.nome}>
          <div
            style={texto({
              left: x(m.valor) - 200,
              width: 400,
              textAlign: 'center',
              top: m.forte ? 432 : 496,
              fontSize: m.forte ? 40 : tipo.rotulo,
              color: m.forte ? cor.tinta : cor.fraco,
            })}
          >
            {m.nome}
          </div>
          {m.forte && numero(m.valor) !== null && (
            <div style={texto({left: x(m.valor) - 200, width: 400, textAlign: 'center', top: 340, fontSize: 72, color: cor.tinta, fontVariantNumeric: 'lining-nums tabular-nums'})}>
              {numero(m.valor)}
            </div>
          )}
        </React.Fragment>
      ))}
      <div style={texto({left: X0, top: 878, fontSize: tipo.nota, lineHeight: 1.45, color: cor.fraco, whiteSpace: 'normal'})}>
        {textos.rodape.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
