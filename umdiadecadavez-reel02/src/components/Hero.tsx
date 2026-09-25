import React from 'react';
import {cores, fontes, grid} from '../theme';
import {Escrita, duracaoEscrita} from '../motion/Escrita';
import {Manuscrito} from '../motion/Manuscrito';
import {Risco} from '../motion/Risco';
import {Sangramento} from '../texture/Sangramento';

type Base = {
  inicio: number;
  tamanho: number;
  cor: string;
  esquerda: number;
  topo: number;
};

const estiloAnton = (tamanho: number, cor: string): React.CSSProperties => ({
  fontFamily: fontes.hero,
  fontWeight: fontes.peso.hero,
  fontSize: tamanho,
  lineHeight: grid.entrelinhaHero,
  textTransform: 'uppercase',
  color: cor,
  whiteSpace: 'nowrap',
});

// Linhas escritas uma depois da outra, dividindo a duração pelo número de letras.
const LinhasEscritas: React.FC<{linhas: readonly string[]; inicio: number; duracao?: number}> = ({linhas, inicio, duracao}) => {
  const letras = linhas.map((l) => [...l].length);
  const total = letras.reduce((a, b) => a + b, 0);
  let t = inicio;
  return (
    <>
      {linhas.map((linha, i) => {
        const dur = duracao === undefined ? duracaoEscrita(linha) : (duracao * letras[i]) / total;
        const de = t;
        t += dur;
        return (
          <div key={i}>
            <Escrita inicio={de} duracao={dur}>
              {linha}
            </Escrita>
          </div>
        );
      })}
    </>
  );
};

// HERO · escrita (Anton), sempre com sangramento.
export const HeroEscrito: React.FC<Base & {linhas: readonly string[]; duracao?: number}> = ({linhas, inicio, duracao, tamanho, cor, esquerda, topo}) => (
  <div style={{position: 'absolute', left: esquerda, top: topo}}>
    <Sangramento estilo={estiloAnton(tamanho, cor)}>
      <LinhasEscritas linhas={linhas} inicio={inicio} duracao={duracao} />
    </Sangramento>
  </div>
);

// HERO · escrita dupla: caneta fraca, depois a caneta cheia passando por cima para marcar.
export const HeroDuplo: React.FC<Omit<Base, 'inicio' | 'cor'> & {linhas: readonly string[]; fraca: number; cheia: number; duracao: number}> = ({
  linhas,
  fraca,
  cheia,
  duracao,
  tamanho,
  esquerda,
  topo,
}) => (
  <div style={{position: 'absolute', left: esquerda, top: topo}}>
    <Sangramento estilo={estiloAnton(tamanho, cores.esferoFraca)}>
      <LinhasEscritas linhas={linhas} inicio={fraca} duracao={duracao} />
    </Sangramento>
    <div style={{position: 'absolute', inset: 0}}>
      <Sangramento estilo={estiloAnton(tamanho, cores.esfero)}>
        <LinhasEscritas linhas={linhas} inicio={cheia} duracao={duracao} />
      </Sangramento>
    </div>
  </div>
);

// HERO · manuscrito (Caveat) com falha de caneta; opcionalmente riscado.
export const HeroManuscrito: React.FC<Omit<Base, 'topo'> & {texto: string; base: number; risco?: number; semente: string}> = ({
  texto,
  inicio,
  tamanho,
  cor,
  esquerda,
  base,
  risco,
  semente,
}) => (
  <div style={{position: 'absolute', left: esquerda, top: base - tamanho}}>
    <Sangramento estilo={{display: 'inline-block'}}>
      <Manuscrito texto={texto} inicio={inicio} tamanho={tamanho} cor={cor} semente={semente} falha />
    </Sangramento>
    {risco === undefined ? null : (
      <Risco inicio={risco} tamanho={tamanho} larguraEstimada={[...texto].length * tamanho * 0.42} cor={cor} semente={`${semente}-risco`} />
    )}
  </div>
);
