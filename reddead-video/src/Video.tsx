import React from 'react';
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import pacote from './data/pacote.json';
import quadrosDosClipes from './data/clipes.json';

/**
 * ANTES DA LENDA · Red Dead Redemption 2 — o vídeo longo (docs/PACOTE.json)
 * 1920x1080, 30 fps, 22470 quadros (12:29).
 *
 * Regras do pacote:
 * - nada de rotateX/rotateY/perspective/translateZ/paralaxe/preserve-3d;
 * - corte seco entre cenas, com 4 quadros de opacidade;
 * - chapa: só a janela de 1920x1080 desliza, de x=140 a x=340, no centro
 *   da altura. A chapa tem 2400x1350, então nunca amplia;
 * - clipe: nenhum movimento extra. A cor é saturação 0,72, contraste 1,07,
 *   sombra quente, vinheta e grão 5. Tudo é feito aqui, sobre o vídeo
 *   original, para o pacote de render só precisar dos trechos do jogo.
 *
 * `clipes: false` desenha um cartão no lugar de cada clipe (o arquivo e o
 * trecho), para conferir chapas, cortes e trilha sem os vídeos.
 */

const W = 1920;
const H = 1080;
const GANHO = 4;
const GRAO = 0.147; // o ladrilho tem desvio 34: 0,147 dá desvio 5 em cinza médio, com overlay

type Movimento = { tipo: string; de_x?: number; para_x?: number };
type Cena = {
  i: number;
  entra_f: number;
  sai_f: number;
  dur_f: number;
  tipo: 'chapa' | 'clipe';
  arquivo?: string;
  clipe?: string;
  arquivo_origem?: string;
  origem_entra_s?: number;
  origem_sai_s?: number;
  movimento?: Movimento;
};
const CENAS = (pacote as unknown as { cenas: Cena[] }).cenas;
export const DURACAO = (pacote as unknown as { formato: { dur_f: number } }).formato.dur_f;

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/** Tamanho real de cada chapa (a p12-fecho veio em 1920x1080 e não desliza). */
const TAMANHO: Record<string, [number, number]> = { 'chapas/p12-fecho.jpg': [1920, 1080] };

const Chapa: React.FC<{ c: Cena; f: number }> = ({ c, f }) => {
  const arq = c.arquivo!;
  const [lw, lh] = TAMANHO[arq] ?? [2400, 1350];
  const m = c.movimento ?? { tipo: 'nenhum' };
  let x = 0;
  if (m.tipo === 'crop_desliza' && lw > W) {
    const de = m.de_x ?? 0;
    const para = m.para_x ?? de;
    x = de + (para - de) * ((f - c.entra_f) / c.dur_f);
  }
  const y = (lh - H) / 2;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img src={staticFile(arq)} style={{ position: 'absolute', left: 0, top: 0, width: lw, height: lh, transform: `translate(${-x}px, ${-y}px)` }} />
    </AbsoluteFill>
  );
};

const Cor: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* sombra quente: o preto sobe para um marrom escuro; luz e meio-tom ficam */}
    <AbsoluteFill style={{ backgroundColor: 'rgb(24,16,10)', mixBlendMode: 'lighten' }} />
    {/* vinheta */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 100%)' }} />
    {/* grão 5: o ladrilho anda a cada quadro, como na abertura */}
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('grao.png')})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${(f * 97) % 512}px ${(f * 53) % 512}px`,
        mixBlendMode: 'overlay',
        opacity: GRAO,
      }}
    />
  </>
);

const Clipe: React.FC<{ c: Cena; f: number; clipes: boolean }> = ({ c, f, clipes }) => {
  if (!clipes) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#1b1714', color: '#d8cbb8', fontFamily: 'monospace', fontSize: 42, padding: 120, justifyContent: 'center' }}>
        <div>CLIPE {c.clipe}</div>
        <div style={{ fontSize: 56, marginTop: 24 }}>{c.arquivo_origem}</div>
        <div style={{ marginTop: 24 }}>
          {c.origem_entra_s} – {c.origem_sai_s} s
        </div>
      </AbsoluteFill>
    );
  }
  // cada clipe veio já cortado no trecho da cena: public/clipes/cNN-X.mp4
  // (NN = a cena, X = o clipe). Nos 3 quadros em que ele fica por baixo da
  // cena seguinte, segura o último quadro do arquivo.
  const arq = `c${String(c.i).padStart(2, '0')}-${c.clipe}.mp4`;
  const total = (quadrosDosClipes as Record<string, number>)[arq];
  const k = Math.min(f - c.entra_f, total - 1);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Freeze frame={k}>
        <OffthreadVideo
          src={staticFile(`clipes/${arq}`)}
          muted
          style={{ width: W, height: H, filter: 'saturate(0.72) contrast(1.07)' }}
        />
      </Freeze>
      <Cor f={f} />
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ clipes: boolean }> = ({ clipes }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {CENAS.map((c, k) => {
        // a cena segue por baixo da seguinte enquanto ela ganha opacidade
        const ate = k < CENAS.length - 1 ? c.sai_f + GANHO - 1 : c.sai_f;
        if (f < c.entra_f || f >= ate) return null;
        const op = c.entra_f > 0 ? c01((f - c.entra_f + 1) / GANHO) : 1;
        return (
          <AbsoluteFill key={c.i} style={{ opacity: op }}>
            {c.tipo === 'chapa' ? <Chapa c={c} f={f} /> : <Clipe c={c} f={f} clipes={clipes} />}
          </AbsoluteFill>
        );
      })}
      <Audio src={staticFile('trilha.mp3')} />
    </AbsoluteFill>
  );
};
