import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {altura, cor, font, grade, largura, tipo} from '../theme';

/**
 * TÍTULO DE BLOCO, CITAÇÃO e as frases dos pretos. Cormorant, alinhado à esquerda na
 * espinha (240). Nada é centralizado.
 */
const TOPO = altura * 0.4;

export const TituloBloco: React.FC<{texto: string}> = ({texto}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: grade.esq, top: TOPO, fontFamily: font, fontSize: tipo.tituloBloco, letterSpacing: '0.08em', color: cor.tinta}}>{texto}</div>
  </AbsoluteFill>
);

export const Citacao: React.FC<{linhas: string[]; cor?: string}> = ({linhas, cor: c = cor.tinta}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: grade.esq, top: TOPO, width: largura - grade.esq - grade.dir, fontFamily: font, fontSize: tipo.citacao, lineHeight: 1.3, color: c}}>
      {linhas.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  </AbsoluteFill>
);

// o segundo preto: "O preto entra no texto ao longo de 30 frames" (de tinta a preto puro)
export const TextoEscurecendo: React.FC<{linhas: string[]; quadros: number}> = ({linhas, quadros}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / quadros);
  const [a, b] = [cor.tinta, cor.preto].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const c = '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  return <Citacao linhas={linhas} cor={c} />;
};
