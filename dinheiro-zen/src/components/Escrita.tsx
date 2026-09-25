import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Palavra} from '../data/roteiro';
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

export const useEscrita = (inicio: number, duracao: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [inicio, inicio + Math.max(duracao, motion.escrita.minimo)], [0, 1], {
    ...clamp,
    easing: curvas.linear,
  });
};

// Uma palavra falada escrevendo enquanto é dita (de → ate), direita → esquerda.
const PalavraEscrita: React.FC<{palavra: Palavra; local: (f: number) => number}> = ({palavra, local}) => {
  const frame = useCurrentFrame();
  const de = local(palavra.de);
  const p = useEscrita(de, palavra.ate - palavra.de);
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        visibility: frame >= de ? 'visible' : 'hidden',
        ...mascaraDeEscrita('rtl', p),
      }}
    >
      {palavra.texto}
    </span>
  );
};

// Hero: linhas de palavras faladas, penduradas no eixo à direita.
export const EscritaFalada: React.FC<{
  linhas: readonly (readonly Palavra[])[];
  local: (f: number) => number;
  direita: number;
  topo: number;
  estilo: React.CSSProperties;
}> = ({linhas, local, direita, topo, estilo}) => (
  <div style={{position: 'absolute', left: 0, width: direita, top: topo, textAlign: 'right', ...estilo}}>
    {linhas.map((linha, i) => (
      <div key={i}>
        {linha.map((palavra, j) => (
          <React.Fragment key={j}>
            {j > 0 ? ' ' : null}
            <PalavraEscrita palavra={palavra} local={local} />
          </React.Fragment>
        ))}
      </div>
    ))}
  </div>
);

// Texto fixo (não falado): linha a linha, duração proporcional ao número de letras.
export const Escrita: React.FC<{
  linhas: readonly string[];
  inicio: number;
  direita: number;
  topo: number;
  estilo: React.CSSProperties;
}> = ({linhas, inicio, direita, topo, estilo}) => {
  const frame = useCurrentFrame();
  if (frame < inicio) return null;
  let t = inicio;
  const tempos = linhas.map((l) => {
    const dur = Math.max(motion.escrita.minimo, Math.round([...l].length * motion.escrita.quadrosPorLetra));
    const ini = t;
    t += dur;
    return {ini, dur};
  });
  return (
    <div style={{position: 'absolute', left: 0, width: direita, top: topo, textAlign: 'right', ...estilo}}>
      {linhas.map((linha, i) => (
        <LinhaFixa key={i} texto={linha} inicio={tempos[i].ini} duracao={tempos[i].dur} />
      ))}
    </div>
  );
};

const LinhaFixa: React.FC<{texto: string; inicio: number; duracao: number}> = ({texto, inicio, duracao}) => {
  const frame = useCurrentFrame();
  const p = useEscrita(inicio, duracao);
  return (
    <div>
      <span
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          visibility: frame >= inicio ? 'visible' : 'hidden',
          ...mascaraDeEscrita('rtl', p),
        }}
      >
        {texto}
      </span>
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
