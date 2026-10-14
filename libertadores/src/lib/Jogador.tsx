import React from 'react';
import {corDoNumero, fontes, medidas, paleta} from '../theme';
import {useFormato} from './formato';

// UM JOGADOR. Círculo de 26 px na cor do time, número dentro, contorno escuro para
// destacar do gramado. `anel`: dourado (destaque) ou vermelho (pressionado), pulsando.
export const Jogador: React.FC<{
  X: number;
  Y: number;
  cor: string;
  numero: number;
  escala: number;
  opacidade: number;
  anel?: {cor: string; desde: number} | null;
  quadro: number;
}> = ({X, Y, cor, numero, escala, opacidade, anel, quadro}) => {
  const {k} = useFormato();
  const m = medidas.jogador;
  const r = m.diametro / 2;
  if (escala <= 0 || opacidade <= 0) return null;
  let anelEl = null;
  if (anel) {
    const fase = (((quadro - anel.desde) % m.periodoAnel) + m.periodoAnel) % m.periodoAnel / m.periodoAnel;
    const pulso = 0.5 - 0.5 * Math.cos(2 * Math.PI * fase);
    anelEl = <circle r={r + m.contorno + 4 + 4 * pulso} fill="none" stroke={anel.cor} strokeWidth={m.anel} opacity={1 - 0.6 * pulso} />;
  }
  return (
    <g transform={`translate(${X.toFixed(1)},${Y.toFixed(1)}) scale(${escala.toFixed(3)})`} opacity={opacidade}>
      {anelEl}
      <circle r={r + m.contorno / 2} fill={cor} stroke={paleta.fundo} strokeWidth={m.contorno} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={corDoNumero(cor)}
        style={{fontFamily: fontes.corpo, fontWeight: 700, fontSize: m.numero * k, fontVariantNumeric: fontes.numeros}}
      >
        {numero}
      </text>
    </g>
  );
};

// Os fantasmas de quem está se movendo: 5, 10 e 15 quadros atrás.
export const Rastro: React.FC<{pontos: {X: number; Y: number; o: number}[]; cor: string}> = ({pontos, cor}) => (
  <g>
    {pontos.map((p, i) => (
      <circle key={i} cx={p.X} cy={p.Y} r={medidas.jogador.diametro / 2} fill={cor} opacity={p.o} />
    ))}
  </g>
);
