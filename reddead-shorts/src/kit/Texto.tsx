import React from 'react';
import { c01, COR, FONTE, mix, mola, prog, rnd, saiCubica, saiExpo, saiVolta } from './base';

/** Estilos de letra prontos. */
export const A = (tam: number, cor: string = COR.tinta, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.anton,
  fontSize: tam,
  color: cor,
  lineHeight: 1.02,
  letterSpacing: '0.012em',
  textTransform: 'uppercase',
  ...extra,
});
/** Oswald em caixa alta espaçada: rótulos. */
export const O = (tam: number, cor: string = COR.tinta, esp = 0.16, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.oswald,
  fontWeight: 700,
  fontSize: tam,
  color: cor,
  letterSpacing: `${esp}em`,
  lineHeight: 1.15,
  textTransform: 'uppercase',
  ...extra,
});
/** Cinzel fina e bem espaçada: os títulos de abertura. */
export const Cz = (tam: number, cor: string = COR.tinta, esp = 0.3, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.cinzel,
  fontWeight: 400,
  fontSize: tam,
  color: cor,
  letterSpacing: `${esp}em`,
  lineHeight: 1.2,
  textTransform: 'uppercase',
  ...extra,
});
/** A letra do documento de 1891. */
export const D = (tam: number, cor: string = COR.tinta, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.doc,
  fontSize: tam,
  color: cor,
  lineHeight: 1.25,
  ...extra,
});
/** Máquina de escrever. */
export const Mq = (tam: number, cor: string = COR.tinta, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.maquina,
  fontSize: tam,
  color: cor,
  lineHeight: 1.35,
  ...extra,
});
/** Serifa grossa, de carimbo e cartaz. */
export const Sl = (tam: number, cor: string = COR.tinta, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FONTE.slab,
  fontSize: tam,
  color: cor,
  lineHeight: 1.05,
  textTransform: 'uppercase',
  ...extra,
});

/** Caixa posicionada na tela. */
export const em = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', left: x, top: y, ...extra });

/**
 * Texto cinético. O texto é partido em letras, palavras ou linhas, e cada
 * pedaço entra com atraso em relação ao anterior. Tudo é função do quadro.
 *
 * estilos:
 * - sobe        sobe 0,6 em e ganha opacidade
 * - mascara     sobe por trás de uma máscara reta (a linha "nasce" do chão)
 * - bate        vem grande e desfocado e bate no lugar
 * - cai         cai girando e assenta com mola
 * - foco        entra do desfoque
 * - datilografa aparece seco, como máquina de escrever
 * - embaralha   letras trocam ao acaso até acertar
 * - pisca       acende falhando, como lâmpada
 */
export type Estilo = 'sobe' | 'mascara' | 'bate' | 'cai' | 'foco' | 'datilografa' | 'embaralha' | 'pisca';

type Props = {
  texto: string;
  f: number;
  ini: number;
  /** quadro em que começa a sair (opcional) */
  fim?: number;
  por?: 'letra' | 'palavra' | 'linha';
  /** quadros entre um pedaço e o seguinte */
  passo?: number;
  /** quadros que cada pedaço leva para entrar */
  dur?: number;
  estilo?: Estilo;
  style?: React.CSSProperties;
  /** cor por palavra: índice da palavra -> cor */
  destaque?: Record<number, string>;
  semente?: number;
  /** quadro de entrada de cada pedaço (no lugar de ini + k * passo): a sincronia com a fala */
  tempos?: number[];
  /** como sai: some por opacidade (padrão) ou sobe por trás da máscara */
  saida?: 'some' | 'sobe';
};

const GLIFOS = 'ABCDEFGHJKLMNOPQRSTUVXZ0123456789#%&';

const partes = (texto: string, por: Props['por']) => {
  if (por === 'linha') return texto.split('\n').map((t) => ({ t, quebra: true }));
  const out: { t: string; quebra: boolean; palavra: number }[] = [];
  let palavra = 0;
  texto.split('\n').forEach((linha, li, linhas) => {
    const ps = linha.split(' ');
    ps.forEach((p, pi) => {
      if (por === 'palavra') {
        out.push({ t: p + (pi < ps.length - 1 ? ' ' : ''), quebra: false, palavra });
      } else {
        for (const ch of p) out.push({ t: ch, quebra: false, palavra });
        if (pi < ps.length - 1) out.push({ t: ' ', quebra: false, palavra });
      }
      palavra++;
    });
    if (li < linhas.length - 1) out.push({ t: '', quebra: true, palavra });
  });
  return out;
};

export const Cinetico: React.FC<Props> = ({
  texto,
  f,
  ini,
  fim,
  por = 'letra',
  passo = 2,
  dur = 10,
  estilo = 'sobe',
  style,
  destaque,
  semente = 1,
  tempos,
  saida = 'some',
}) => {
  if (f < Math.min(ini, tempos?.[0] ?? ini)) return null;
  const sai = fim === undefined ? 0 : prog(f, fim, saida === 'sobe' ? 9 : 8);
  if (sai >= 1) return null;
  const some = saida === 'some' ? 1 - sai : 1;
  const ps = partes(texto, por);
  let k = -1;
  return (
    <div style={{ whiteSpace: 'pre', lineHeight: 1.05, ...style, opacity: (Number(style?.opacity ?? 1)) * some }}>
      {ps.map((p, i) => {
        if (por !== 'linha' && p.quebra) return <br key={i} />;
        if (p.t.trim() === '' && por !== 'linha') return <span key={i}>{p.t}</span>;
        k++;
        const t = prog(f, tempos ? tempos[Math.min(k, tempos.length - 1)] : ini + k * passo, dur);
        const cor = destaque && 'palavra' in p ? destaque[(p as { palavra: number }).palavra] : undefined;
        let est: React.CSSProperties = {};
        let conteudo = p.t;
        const envolve = estilo === 'mascara' || saida === 'sobe';
        if (estilo === 'sobe') {
          const e = saiCubica(t);
          est = { transform: `translateY(${(0.6 * (1 - e)).toFixed(3)}em)`, opacity: e };
        } else if (estilo === 'mascara') {
          const e = saiExpo(t);
          // escondido até a hora: os acentos passam da caixa da linha e apareciam por baixo da máscara
          est = { transform: `translateY(${(125 * (1 - e)).toFixed(2)}%)`, visibility: t > 0 ? 'visible' : 'hidden' };
        } else if (estilo === 'bate') {
          const e = saiExpo(t);
          est = {
            transform: `scale(${(1 + 1.4 * (1 - e)).toFixed(3)})`,
            opacity: c01(t * 4),
            filter: e < 0.98 ? `blur(${(10 * (1 - e)).toFixed(1)}px)` : undefined,
          };
        } else if (estilo === 'cai') {
          const e = mola(t, 1.6, 5);
          const giro = (rnd(k, semente) - 0.5) * 30;
          est = { transform: `translateY(${(-0.9 * (1 - e)).toFixed(3)}em) rotate(${(giro * (1 - e)).toFixed(2)}deg)`, opacity: c01(t * 5) };
        } else if (estilo === 'foco') {
          const e = saiCubica(t);
          est = { opacity: e, filter: e < 0.98 ? `blur(${(14 * (1 - e)).toFixed(1)}px)` : undefined };
        } else if (estilo === 'datilografa') {
          est = { opacity: t > 0 ? 1 : 0 };
        } else if (estilo === 'embaralha') {
          est = { opacity: t > 0 ? 1 : 0 };
          if (t > 0 && t < 1 && p.t.length === 1) {
            conteudo = GLIFOS[Math.floor(rnd(k, Math.floor(f / 2), semente) * GLIFOS.length)];
          }
        } else if (estilo === 'pisca') {
          const aceso = t >= 1 ? 1 : t <= 0 ? 0 : rnd(k, Math.floor(f), semente) > 0.45 ? 1 : 0.12;
          est = { opacity: aceso };
        }
        const subindo = saida === 'sobe' && sai > 0;
        if (subindo) est = { ...est, transform: `translateY(${(-110 * sai * sai).toFixed(2)}%)` };
        const span = (
          <span key={i} style={{ display: 'inline-block', color: cor, willChange: 'transform', ...est }}>
            {conteudo}
          </span>
        );
        if (por === 'linha') {
          return (
            <div key={i} style={{ overflow: envolve ? 'hidden' : 'visible' }}>
              {span}
            </div>
          );
        }
        return envolve ? (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingTop: '0.12em' }}>
            {span}
          </span>
        ) : (
          span
        );
      })}
    </div>
  );
};

/** Barra de marca-texto que cresce por trás de um trecho. */
export const Marca: React.FC<{ f: number; ini: number; dur?: number; cor?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  f,
  ini,
  dur = 10,
  cor = COR.sangue,
  style,
  children,
}) => {
  const e = saiExpo(prog(f, ini, dur));
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span
        style={{
          position: 'absolute',
          left: '-0.12em',
          right: '-0.12em',
          top: '0.08em',
          bottom: '0.02em',
          background: cor,
          transform: `scaleX(${e.toFixed(4)})`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

/** Risca o que estiver dentro: um traço cruza o texto da esquerda para a direita. */
export const Risco: React.FC<{ f: number; ini: number; dur?: number; cor?: string; alt?: number; pos?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  f,
  ini,
  dur = 9,
  cor = COR.sangue,
  alt = 14,
  pos = 0.52,
  children,
  style,
}) => {
  const e = saiExpo(prog(f, ini, dur));
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      {children}
      <span
        style={{
          position: 'absolute',
          left: '-0.08em',
          right: '-0.08em',
          top: `${(pos * 100).toFixed(1)}%`,
          height: alt,
          marginTop: -alt / 2,
          background: cor,
          transform: `scaleX(${e.toFixed(4)})`,
          transformOrigin: 'left center',
        }}
      />
    </span>
  );
};

/** Traço que se desenha (sublinhado, risco, régua). */
export const Traco: React.FC<{ f: number; ini: number; dur?: number; x: number; y: number; w: number; h?: number; cor?: string; origem?: 'left' | 'right' | 'center' }> = ({
  f,
  ini,
  dur = 12,
  x,
  y,
  w,
  h = 5,
  cor = COR.sangue,
  origem = 'left',
}) => {
  const e = saiExpo(prog(f, ini, dur));
  if (e <= 0) return null;
  return (
    <div
      style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: cor, transform: `scaleX(${e.toFixed(4)})`, transformOrigin: `${origem} center` }}
    />
  );
};

/**
 * Hodômetro: cada casa é uma tira de algarismos que rola. As casas de cima
 * só rolam quando a de baixo vira de 9 para 0, como num contador mecânico.
 */
export const Hodometro: React.FC<{ valor: number; casas: number; style?: React.CSSProperties; milhar?: boolean }> = ({ valor, casas, style, milhar: comPonto }) => {
  const cols: React.ReactNode[] = [];
  for (let i = casas - 1; i >= 0; i--) {
    const p = Math.pow(10, i);
    const x = valor / p;
    const inteiro = Math.floor(x);
    const resto = x - inteiro;
    const rola = i === 0 ? resto : c01((resto * p - (p - 1)) / 1);
    const pos = (inteiro % 10) + rola;
    cols.push(
      <span key={i} style={{ display: 'inline-block', height: '1em', overflow: 'hidden', verticalAlign: 'top' }}>
        <span style={{ display: 'block', transform: `translateY(${(-pos * 1).toFixed(4)}em)`, lineHeight: 1 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => (
            <span key={j} style={{ display: 'block', height: '1em' }}>
              {d}
            </span>
          ))}
        </span>
      </span>,
    );
    if (comPonto && i > 0 && i % 3 === 0) cols.push(<span key={`p${i}`}>.</span>);
  }
  return <span style={{ display: 'inline-block', lineHeight: 1, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', ...style }}>{cols}</span>;
};

/** Valor que cresce com freada no fim. */
export const conta = (f: number, ini: number, dur: number, de: number, para: number, curva = saiQuintaLocal) => mix(de, para, curva(prog(f, ini, dur)));
function saiQuintaLocal(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

export { saiVolta };
