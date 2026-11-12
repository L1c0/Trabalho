import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { COR } from '../kit/base';
import { Acabamento, Pincelada, tPincel } from '../kit/Cena';
import { Fecho } from '../kit/Fecho';
import { Legenda } from '../kit/Legenda';
import { Filtros } from '../kit/Pecas';
import { Cavalo, Mortes, Receita, Tosse, Tratamento } from './Cenas1';
import { Buraco, Nada, Remedio } from './Cenas2';
import { BLOCOS, C, DUR, q, qp } from './tempo';

export const DUR_S2 = DUR;

/** Short 2 · "44 anos de nada". */
export const Short2: React.FC<{ som?: boolean }> = ({ som = true }) => {
  const f = useCurrentFrame();
  let cena: React.ReactNode;
  if (f < q(C.tratamento)) cena = <Tosse f={f} />;
  else if (f < q(C.receita)) cena = <Tratamento f={f} />;
  else if (f < q(C.cavalo)) cena = <Receita f={f} />;
  else if (f < q(C.mortes)) cena = <Cavalo f={f} />;
  else if (f < q(C.remedio)) cena = <Mortes f={f} />;
  else if (f < q(C.nada)) cena = <Remedio f={f} />;
  else if (f < q(C.buraco)) cena = <Nada f={f} />;
  else if (f < q(C.fim)) cena = <Buraco f={f} />;
  else cena = <Fecho f={f} f0={q(C.fim)} tempos={[qp('mais'), qp('um', 2), qp('amanhã')]} />;
  const preto = f >= q(C.preto) && f < q(C.buraco);
  return (
    <AbsoluteFill style={{ backgroundColor: COR.tinta }}>
      <Filtros />
      {cena}
      {/* pinceladas de corte */}
      <Pincelada t={tPincel(f, q(C.tratamento), 4, 6)} cor={COR.tinta} semente={3} lado="esq" />
      <Pincelada t={tPincel(f, q(C.receita))} cor={COR.tinta} semente={6} lado="baixo" />
      <Pincelada t={tPincel(f, q(C.cavalo), 4, 5)} cor={COR.tinta} semente={8} lado="dir" />
      <Pincelada t={tPincel(f, q(C.mortes))} cor={COR.tinta} semente={10} lado="cima" />
      <Pincelada t={tPincel(f, q(C.remedio))} cor={COR.vermelho} semente={12} lado="baixo" />
      <Pincelada t={tPincel(f, q(C.nada), 4, 6)} cor={COR.tinta} semente={14} lado="esq" />
      <Pincelada t={tPincel(f, q(C.buraco), 1, 9)} cor={COR.tinta} semente={16} lado="cima" />
      <Legenda blocos={BLOCOS} f={f} q={q} />
      <Acabamento f={f} papel={preto ? 0.25 : 1} vinheta={preto ? 0.5 : 0.28} />
      {som ? <Audio src={staticFile('audio/short2.wav')} /> : null}
    </AbsoluteFill>
  );
};
