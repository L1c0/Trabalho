import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, FONTE, H, mix, prog, rnd, saiCubica, saiExpo, W } from './base';
import { Cinetico, Estilo } from './Texto';
import { A, M, O } from './tipos';

/**
 * Letterings sobre o jogo. A área de imagem fica entre as barras de cinema
 * (y de 138 a 942), e a margem esquerda é 135.
 */

/** Escurece um canto da imagem para o texto ler bem. */
export const Sombra: React.FC<{ f: number; ini: number; fim: number; lado?: 'esq' | 'centro' | 'dir' | 'tudo'; forca?: number }> = ({ f, ini, fim, lado = 'esq', forca = 0.78 }) => {
  const op = Math.min(saiCubica(prog(f, ini - 4, 12)), 1 - prog(f, fim, 12));
  if (op <= 0) return null;
  const fundo =
    lado === 'tudo'
      ? `rgba(0,0,0,${forca})`
      : lado === 'centro'
        ? `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,0,0,${forca}) 0%, rgba(0,0,0,0) 100%)`
        : lado === 'dir'
          ? `radial-gradient(ellipse 75% 80% at 100% 85%, rgba(0,0,0,${forca}) 0%, rgba(0,0,0,0) 100%)`
          : `radial-gradient(ellipse 75% 80% at 0% 85%, rgba(0,0,0,${forca}) 0%, rgba(0,0,0,0) 100%)`;
  return <AbsoluteFill style={{ background: fundo, opacity: op, pointerEvents: 'none' }} />;
};

type Base = { f: number; ini: number; fim?: number; texto: string; x?: number; y?: number; tam?: number; cor?: string; tempos?: number[] };

/** Linha de impacto: Anton grande, com a barra vermelha que nasce antes dela. */
export const Impacto: React.FC<Base & { estilo?: Estilo; por?: 'letra' | 'palavra'; passo?: number; barra?: boolean; alinhar?: 'esq' | 'centro'; destaque?: Record<number, string> }> = ({
  f,
  ini,
  fim = 1e9,
  texto,
  x = 135,
  y = 660,
  tam = 136,
  cor = COR.creme,
  estilo = 'mascara',
  por = 'letra',
  passo = 1.2,
  barra = true,
  alinhar = 'esq',
  tempos,
  destaque,
}) => {
  if (f < ini - 6 || f > fim + 10) return null;
  const linhas = texto.split('\n').length;
  const b = saiExpo(prog(f, ini - 5, 9)) * (1 - prog(f, fim, 8));
  const centro = alinhar === 'centro';
  return (
    <>
      {barra && !centro && b > 0 && (
        <div style={{ position: 'absolute', left: x - 30, top: y + tam * 0.1, width: 10, height: tam * 1.04 * linhas - tam * 0.12, background: COR.vermelho, transform: `scaleY(${b.toFixed(4)})`, transformOrigin: 'top' }} />
      )}
      <Cinetico
        texto={texto}
        f={f}
        ini={ini}
        fim={fim}
        tempos={tempos}
        por={por}
        passo={passo}
        dur={8}
        estilo={estilo}
        saida={estilo === 'mascara' ? 'sobe' : 'some'}
        destaque={destaque}
        style={{
          position: 'absolute',
          left: centro ? 0 : x,
          top: y,
          width: centro ? W : undefined,
          textAlign: centro ? 'center' : 'left',
          ...A(tam, cor),
          textShadow: '0 6px 30px rgba(0,0,0,0.55)',
        }}
      />
    </>
  );
};

/** Tarja: faixa preta que corre da esquerda e traz o texto dentro. */
export const Tarja: React.FC<Base & { por?: 'letra' | 'palavra'; passo?: number; corFundo?: string }> = ({
  f,
  ini,
  fim = 1e9,
  texto,
  x = 135,
  y = 820,
  tam = 42,
  cor = COR.papel,
  por = 'palavra',
  passo = 3,
  tempos,
  corFundo = 'rgba(0,0,0,0.86)',
}) => {
  if (f < ini - 4 || f > fim + 12) return null;
  const abre = saiExpo(prog(f, ini - 3, 10));
  const fecha = prog(f, fim, 9);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 30,
        top: y,
        clipPath: `inset(0 ${((1 - abre) * 100).toFixed(2)}% 0 ${(fecha * fecha * 100).toFixed(2)}%)`,
      }}
    >
      <div style={{ background: corFundo, padding: `${tam * 0.3}px ${tam * 0.75}px ${tam * 0.26}px 30px`, display: 'flex', alignItems: 'center', gap: tam * 0.45 }}>
        <div style={{ width: tam * 0.3, height: tam * 0.3, background: COR.vermelho, flexShrink: 0 }} />
        <Cinetico texto={texto} f={f} ini={ini + 3} tempos={tempos} por={por} passo={passo} dur={7} estilo="sobe" style={{ ...O(tam, cor, 0.2), lineHeight: 1.1 }} />
      </div>
    </div>
  );
};

/** Frase no centro da tela, com a imagem escurecida por trás. */
export const Centro: React.FC<{
  f: number;
  ini: number;
  fim: number;
  linhas: { texto: string; tam?: number; cor?: string; estilo?: Estilo; t?: number; tempos?: number[]; por?: 'letra' | 'palavra'; passo?: number; fonte?: 'anton' | 'oswald' }[];
  y?: number;
  escurece?: number;
  vao?: number;
}> = ({ f, ini, fim, linhas, y = 300, escurece = 0.62, vao = 10 }) => {
  if (f < ini - 6 || f > fim + 12) return null;
  return (
    <>
      <Sombra f={f} ini={ini} fim={fim} lado="tudo" forca={escurece} />
      <div style={{ position: 'absolute', left: 0, top: y, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: vao }}>
        {linhas.map((l, i) => (
          <Cinetico
            key={i}
            texto={l.texto}
            f={f}
            ini={l.t ?? ini}
            fim={fim}
            tempos={l.tempos}
            por={l.por ?? 'palavra'}
            passo={l.passo ?? 3}
            dur={7}
            estilo={l.estilo ?? 'mascara'}
            saida={(l.estilo ?? 'mascara') === 'mascara' ? 'sobe' : 'some'}
            style={{ ...(l.fonte === 'oswald' ? O(l.tam ?? 54, l.cor ?? COR.papel, 0.3) : A(l.tam ?? 170, l.cor ?? COR.creme)), textAlign: 'center', textShadow: '0 6px 30px rgba(0,0,0,0.5)' }}
          />
        ))}
      </div>
    </>
  );
};

/** Máquina de escrever: texto mono que aparece letra a letra, com cursor. */
export const Maquina: React.FC<Base & { cps?: number; fundo?: boolean; larg?: number }> = ({ f, ini, fim = 1e9, texto, x = 135, y = 800, tam = 40, cor = COR.papel, cps = 22, fundo = true, larg }) => {
  if (f < ini || f > fim + 10) return null;
  const n = Math.floor(((f - ini) / 30) * cps);
  const some = 1 - prog(f, fim, 8);
  const cursor = Math.floor(f / 7) % 2 === 0 || n < texto.length;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - (fundo ? 26 : 0),
        top: y,
        opacity: some,
        background: fundo ? 'rgba(0,0,0,0.82)' : undefined,
        padding: fundo ? `${tam * 0.4}px ${tam * 0.7}px ${tam * 0.34}px 26px` : 0,
        borderLeft: fundo ? `8px solid ${COR.vermelho}` : undefined,
        width: larg,
        ...M(tam, cor),
        whiteSpace: 'pre-wrap',
      }}
    >
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0, color: COR.vermelho }}>▌</span>
    </div>
  );
};

/** Etiqueta pequena que estala na tela. */
export const Etiqueta: React.FC<Base & { giro?: number; fundo?: string }> = ({ f, ini, fim = 1e9, texto, x = 135, y = 500, tam = 34, cor = COR.preto, giro = 0, fundo = COR.creme }) => {
  if (f < ini || f > fim + 8) return null;
  const e = saiExpo(prog(f, ini, 7));
  const some = 1 - prog(f, fim, 6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        ...O(tam, cor, 0.16),
        background: fundo,
        padding: `${tam * 0.22}px ${tam * 0.5}px ${tam * 0.16}px`,
        transform: `rotate(${giro}deg) scale(${mix(1.5, 1, e).toFixed(3)})`,
        transformOrigin: 'left center',
        opacity: c01(e * 3) * some,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </div>
  );
};

/** Carimbo: entra grande, bate e fica torto, com tinta falhada. */
export const Carimbo: React.FC<Base & { giro?: number }> = ({ f, ini, fim = 1e9, texto, x = 1100, y = 500, tam = 110, cor = COR.vermelho, giro = -9 }) => {
  if (f < ini || f > fim + 8) return null;
  const e = saiExpo(prog(f, ini, 6));
  const some = 1 - prog(f, fim, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        ...A(tam, cor),
        border: `${Math.max(5, tam * 0.07)}px solid ${cor}`,
        padding: `${tam * 0.08}px ${tam * 0.32}px 0`,
        transform: `rotate(${giro}deg) scale(${mix(2.6, 1, e).toFixed(3)})`,
        opacity: 0.92 * c01(e * 3) * some,
        whiteSpace: 'nowrap',
        // tinta falhada: máscara de riscos finos
        WebkitMaskImage: 'repeating-linear-gradient(115deg, #000 0 9px, rgba(0,0,0,0.72) 9px 11px)',
        maskImage: 'repeating-linear-gradient(115deg, #000 0 9px, rgba(0,0,0,0.72) 9px 11px)',
      }}
    >
      {texto}
    </div>
  );
};

/** Texto que acende falhando, com brilho: luz elétrica. */
export const Eletrico: React.FC<Base & { alinhar?: 'esq' | 'centro'; brilho?: string }> = ({ f, ini, fim = 1e9, texto, x = 135, y = 640, tam = 140, cor = '#F4F1E6', alinhar = 'esq', brilho = '#9fd4ff' }) => {
  if (f < ini || f > fim + 10) return null;
  const t = prog(f, ini, 16);
  const falha = t < 1 ? (rnd(Math.floor(f / 1), ini) > 0.42 ? 1 : 0.15) : 0.9 + 0.1 * Math.sin(f * 1.7) * (rnd(Math.floor(f / 3), 5) > 0.85 ? 3 : 0.3);
  const some = 1 - prog(f, fim, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: alinhar === 'centro' ? 0 : x,
        width: alinhar === 'centro' ? W : undefined,
        textAlign: alinhar === 'centro' ? 'center' : 'left',
        top: y,
        ...A(tam, cor),
        whiteSpace: 'pre',
        opacity: c01(falha) * some,
        textShadow: `0 0 18px ${brilho}, 0 0 60px ${brilho}aa, 0 0 120px ${brilho}66`,
      }}
    >
      {texto}
    </div>
  );
};

export { H, FONTE };
