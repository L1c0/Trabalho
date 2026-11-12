import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { COR } from '../kit/base';
import { Acabamento, Pincelada, tPincel } from '../kit/Cena';
import { Legenda } from '../kit/Legenda';
import { Filtros } from '../kit/Pecas';
import { Abertura, Boletim, Data, Escritorio, Linha, Tabela } from './Cenas1';
import { Atestado, CensuraCena, Citacao, Fechada, Fecho, Mapa, Montanha } from './Cenas2';
import { BLOCOS, C, DUR, q, qp } from './tempo';

export const DUR_S1 = DUR;

/** Short 1 · "Acabou numa tabela". */
export const Short1: React.FC<{ som?: boolean }> = ({ som = true }) => {
  const f = useCurrentFrame();
  const corte = (c: number) => q(c);
  let cena: React.ReactNode;
  if (f < corte(C.tabela)) cena = <Abertura f={f} />;
  else if (f < corte(C.data)) cena = <Tabela f={f} />;
  else if (f < corte(C.boletim)) cena = <Data f={f} />;
  else if (f < corte(C.escritorio)) cena = <Boletim f={f} />;
  else if (f < corte(C.linha)) cena = <Escritorio f={f} />;
  else if (f < corte(C.mapa)) cena = <Linha f={f} />;
  else if (f < corte(C.fechada)) cena = <Mapa f={f} />;
  else if (f < corte(C.censura)) cena = <Fechada f={f} />;
  else if (f < corte(C.citacao)) cena = <CensuraCena f={f} />;
  else if (f < corte(C.montanha)) cena = <Citacao f={f} />;
  else if (f < corte(C.atestado)) cena = <Montanha f={f} />;
  else if (f < corte(C.fim)) cena = <Atestado f={f} />;
  else cena = <Fecho f={f} f0={corte(C.fim)} tempos={[qp('mais', 2), qp('um', 4), qp('amanhã')]} />;
  return (
    <AbsoluteFill style={{ backgroundColor: COR.tinta }}>
      <Filtros />
      {cena}
      {/* pinceladas de corte */}
      <Pincelada t={tPincel(f, corte(C.data))} cor={COR.tinta} semente={2} lado="baixo" />
      <Pincelada t={tPincel(f, corte(C.linha), 4, 6)} cor={COR.sangue} semente={5} lado="esq" />
      <Pincelada t={tPincel(f, corte(C.mapa))} cor={COR.tinta} semente={7} lado="cima" />
      <Pincelada t={tPincel(f, corte(C.fechada), 4, 6)} cor={COR.tinta} semente={9} lado="dir" />
      <Pincelada t={tPincel(f, corte(C.citacao))} cor={COR.sangue} semente={11} lado="baixo" />
      <Pincelada t={tPincel(f, corte(C.montanha), 4, 6)} cor={COR.tinta} semente={13} lado="esq" />
      <Pincelada t={tPincel(f, corte(C.atestado))} cor={COR.tinta} semente={15} lado="cima" />
      <Legenda blocos={BLOCOS} f={f} q={q} />
      <Acabamento f={f} />
      {som ? <Audio src={staticFile('audio/short1.wav')} /> : null}
    </AbsoluteFill>
  );
};
