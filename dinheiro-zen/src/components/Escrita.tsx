import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, motion} from '../theme';

export type Direcao = 'rtl' | 'ttb';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Máscara de gradiente: horizontal direita→esquerda (português), vertical cima→baixo (kanji).
export const mascaraDeEscrita = (direcao: Direcao, progresso: number): React.CSSProperties => {
  if (progresso >= 1) return {};
  const suave = motion.escrita.suave;
  const pos = -suave + progresso * (100 + suave);
  const sentido = direcao === 'rtl' ? 'to left' : 'to bottom';
  const img = `linear-gradient(${sentido}, #000 ${pos}%, transparent ${pos + suave}%)`;
  return {maskImage: img, WebkitMaskImage: img};
};

export const duracaoDaLinha = (texto: string, quadrosPorLetra: number = motion.escrita.quadrosPorLetra) =>
  Math.max(motion.escrita.minimo, Math.round([...texto].length * quadrosPorLetra));

export const inicioDasLinhas = (linhas: readonly string[], inicio: number, quadrosPorLetra?: number) => {
  let t = inicio;
  return linhas.map((linha) => {
    const dur = duracaoDaLinha(linha, quadrosPorLetra);
    const ini = t;
    t += dur * (1 - motion.escrita.sobreposicao);
    return {ini, dur};
  });
};

export const useEscrita = (inicio: number, duracao: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [inicio, inicio + duracao], [0, 1], {...clamp, easing: curvas.linear});
};

// Bloco de linhas pendurado num eixo à direita (a coluna). Cada linha escreve depois da anterior.
export const Escrita: React.FC<{
  linhas: readonly string[];
  inicio: number;
  direita: number;
  topo: number;
  estilo: React.CSSProperties;
  quadrosPorLetra?: number;
}> = ({linhas, inicio, direita, topo, estilo, quadrosPorLetra}) => {
  const frame = useCurrentFrame();
  if (frame < inicio) return null;
  const tempos = inicioDasLinhas(linhas, inicio, quadrosPorLetra);
  return (
    <div style={{position: 'absolute', left: 0, width: direita, top: topo, textAlign: 'right', ...estilo}}>
      {linhas.map((linha, i) => (
        <LinhaEscrita key={i} texto={linha} inicio={tempos[i].ini} duracao={tempos[i].dur} />
      ))}
    </div>
  );
};

const LinhaEscrita: React.FC<{texto: string; inicio: number; duracao: number}> = ({texto, inicio, duracao}) => {
  const p = useEscrita(inicio, duracao);
  return (
    <div>
      <span style={{display: 'inline-block', whiteSpace: 'nowrap', ...mascaraDeEscrita('rtl', p)}}>{texto}</span>
    </div>
  );
};

// Um glifo (kanji tipográfico) escrevendo de cima para baixo.
export const EscritaVertical: React.FC<{inicio: number; children: React.ReactNode; estilo?: React.CSSProperties}> = ({
  inicio,
  children,
  estilo,
}) => {
  const frame = useCurrentFrame();
  const p = useEscrita(inicio, motion.escrita.vertical);
  if (frame < inicio) return null;
  return <div style={{...estilo, ...mascaraDeEscrita('ttb', p)}}>{children}</div>;
};
