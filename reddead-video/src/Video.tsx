import React from 'react';
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { DESLOCA, IDENTIDADE, INICIO_CLIPE, REMENDO, SAI } from './ajustes';
import { c01, entrada, FiltroCor, ENTRADA } from './comum';
import { corEm } from './cor';
import { Letreiros, preparaLetreiros } from './Letreiros';
import { MapaEsquema, MapaImagem } from './Mapa';
import pacote from './data/pacote.json';
import quadrosDosClipes from './data/clipes.json';

/**
 * ANTES DA LENDA · Red Dead Redemption 2 — o vídeo longo, pelo pacote v3
 * (PACOTE.json, coreografia, partitura de cor e mapa) e a trilha v2.
 * 1920x1080, 30 fps, 22470 quadros (12:29).
 *
 * Regras do pacote:
 * - nada de rotateX/rotateY/perspective/translateZ/paralaxe/preserve-3d;
 * - corte seco entre cenas, com 4 quadros de opacidade;
 * - chapa: fundo + peças. Empurrão de escala de 1,00 a 1,05 ao longo da
 *   cena, velocidade constante, sem easing. As peças entram nos quadros da
 *   coreografia;
 * - clipe: nenhum movimento extra. Contraste 1,07, sombra quente, vinheta e
 *   grão 5, feitos aqui sobre o vídeo original;
 * - partitura de cor (src/cor.ts): vale para a imagem, ou seja, o jogo e o
 *   fundo das chapas com as fotos. A tipografia, os gráficos e as três
 *   chapas de identidade (a faixa vermelha) ficam fora, na cor original.
 *
 * `clipes: false` desenha um cartão no lugar de cada clipe, para conferir o
 * resto sem os vídeos.
 */

const W = 1920;
const H = 1080;
const GANHO = 4;
const GRAO = 0.147; // o ladrilho tem desvio 34: 0,147 dá desvio 5 em cinza médio, com overlay

type Peca = { id: string; arq: string; x: number; y: number; w: number; h: number; classe: string };
type Cena = {
  i: number;
  entra_f: number;
  sai_f: number;
  dur_f: number;
  tipo: 'chapa' | 'clipe';
  clipe?: string;
  arquivo_origem?: string;
  origem_entra_s?: number;
  origem_sai_s?: number;
  movimento?: { tipo: string; de?: number; para?: number };
  fundo?: string;
  pecas?: Peca[];
  entra_f_por_peca?: Record<string, number>;
};
const CENAS = (pacote as unknown as { cenas: Cena[] }).cenas;
export const DURACAO = (pacote as unknown as { formato: { dur_f: number } }).formato.dur_f;

const LETREIROS = preparaLetreiros((i) => CENAS.find((c) => c.i === i)!.sai_f);

/** A cor de uma cena no quadro f: a cena que sai segura a cor do último quadro dela. */
const corDaCena = (c: Cena, f: number) => corEm(Math.max(c.entra_f, Math.min(f, c.sai_f - 1)));

// ---------------------------------------------------------------- chapas

/** Camadas de imagem a mais (passam pela partitura junto com o fundo). */
const ImagemExtra: React.FC<{ nome: string; f: number }> = ({ nome, f }) => {
  if (nome === 'p06-boletim') {
    // o atlas, menor e à direita da citação (antes passava por baixo dela)
    return (
      <Img
        src={staticFile('pecas/p06-boletim/atlas.jpg')}
        style={{ position: 'absolute', left: 1215, top: 354, width: 842, height: 644, boxShadow: '0 -16px 46px -8px rgba(150,165,185,0.14)' }}
      />
    );
  }
  if (nome === 'p06b-mapa') return <MapaImagem f={f} />;
  return null;
};

/** Revela uma imagem da esquerda para a direita. */
const Revela: React.FC<{ src: string; x: number; y: number; w: number; h: number; p: number }> = ({ src, x, y, w, h, p }) =>
  p <= 0 ? null : (
    <Img
      src={staticFile(src)}
      style={{ position: 'absolute', left: x, top: y, width: w, height: h, clipPath: `inset(0 ${(w * (1 - p)).toFixed(2)}px 0 0)` }}
    />
  );

/** Gráficos a mais (ficam fora da partitura). */
const GraficoExtra: React.FC<{ nome: string; f: number }> = ({ nome, f }) => {
  if (nome === 'p05-44anos') {
    // a barra vai de 1899 a 1943 enquanto os dois anos entram (5674-5790)
    return <Revela src="pecas/p05-44anos/barra.png" x={378} y={870} w={1608} h={24} p={c01((f - 5674) / 116)} />;
  }
  if (nome === 'p06-boletim') {
    // os sublinhados se desenham logo depois da linha deles, em velocidade constante
    return (
      <>
        <Revela src="pecas/p06-boletim/sublinhado-1.png" x={338} y={406} w={741} h={11} p={c01((f - 8498) / 17)} />
        <Revela src="pecas/p06-boletim/sublinhado-2.png" x={338} y={468} w={336} h={11} p={c01((f - 8558) / 8)} />
      </>
    );
  }
  if (nome === 'p06b-mapa') return <MapaEsquema f={f} />;
  if (nome === 'p13-cartela') {
    // o tracinho de "INSCREVA-SE", centrado na linha e entrando com ela
    const e = entrada(f, 22230);
    return e.op > 0 ? (
      <div style={{ position: 'absolute', left: 306, top: 961 + e.dy, width: 40, height: 4, opacity: e.op, backgroundColor: 'rgb(192,166,130)' }} />
    ) : null;
  }
  return null;
};

const PecaNaChapa: React.FC<{ q: Peca; f: number; entra: number; dx: number; dy: number; sai?: number }> = ({ q, f, entra, dx, dy, sai }) => {
  if (f < entra) return null;
  const e = entrada(f, entra);
  const some = sai === undefined ? 1 : c01((sai - f) / ENTRADA);
  if (some <= 0) return null;
  return (
    <Img
      src={staticFile(q.arq)}
      style={{ position: 'absolute', left: q.x + dx, top: q.y + dy + e.dy, width: q.w, height: q.h, opacity: e.op * some }}
    />
  );
};

const Chapa: React.FC<{ c: Cena; f: number }> = ({ c, f }) => {
  const nome = c.fundo!.split('/')[1];
  const de = c.movimento?.de ?? 1;
  const para = c.movimento?.para ?? 1;
  const s = de + (para - de) * ((f - c.entra_f) / c.dur_f);
  const graduada = !IDENTIDADE.has(nome);
  const id = `cor-${c.i}`;
  const desl = DESLOCA[nome] ?? {};
  const sai = SAI[nome] ?? {};
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      {graduada && <FiltroCor id={id} cor={corDaCena(c, f)} />}
      <div
        style={{
          position: 'absolute',
          left: -240,
          top: -135,
          width: 2400,
          height: 1350,
          transform: `scale(${s})`,
          transformOrigin: '1200px 675px',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: 2400, height: 1350, filter: graduada ? `url(#${id})` : undefined }}>
          <Img src={staticFile(c.fundo!)} style={{ position: 'absolute', left: 0, top: 0, width: 2400, height: 1350 }} />
          <ImagemExtra nome={nome} f={f} />
        </div>
        <GraficoExtra nome={nome} f={f} />
        {c.pecas!.map((q) => (
          <PecaNaChapa
            key={q.id}
            q={q}
            f={f}
            entra={c.entra_f_por_peca![q.id]}
            dx={desl[q.id]?.dx ?? 0}
            dy={desl[q.id]?.dy ?? 0}
            sai={sai[q.id]}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- clipes

const Acabamento: React.FC<{ f: number }> = ({ f }) => (
  <>
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

const Remendo: React.FC<{ arq: string; k: number; x: number; y: number; w: number; h: number; de_dy: number }> = ({ arq, k, x, y, w, h, de_dy }) => {
  const borda = 'linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%)';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', WebkitMaskImage: borda, maskImage: borda }}>
      <Freeze frame={k}>
        <OffthreadVideo
          src={staticFile(`clipes/${arq}`)}
          muted
          style={{ position: 'absolute', left: -x, top: -y - de_dy, width: W, height: H, filter: 'contrast(1.07)' }}
        />
      </Freeze>
    </div>
  );
};

const Clipe: React.FC<{ c: Cena; f: number; clipes: boolean }> = ({ c, f, clipes }) => {
  const id = `cor-${c.i}`;
  const letreiros = LETREIROS.filter((g) => g.cena === c.i);
  // cada clipe veio já cortado no trecho da cena: public/clipes/cNN-X.mp4
  // (NN = a cena, X = o clipe). Nos 3 quadros em que ele fica por baixo da
  // cena seguinte, segura o último quadro do arquivo.
  const arq = `c${String(c.i).padStart(2, '0')}-${c.clipe}.mp4`;
  const total = (quadrosDosClipes as Record<string, number>)[arq];
  const k = Math.max(Math.min(f - c.entra_f, total - 1), INICIO_CLIPE[arq] ?? 0);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <FiltroCor id={id} cor={corDaCena(c, f)} />
      {clipes ? (
        <AbsoluteFill style={{ filter: `url(#${id})` }}>
          <Freeze frame={k}>
            <OffthreadVideo src={staticFile(`clipes/${arq}`)} muted style={{ width: W, height: H, filter: 'contrast(1.07)' }} />
          </Freeze>
          {REMENDO[arq] && <Remendo arq={arq} k={k} {...REMENDO[arq]} />}
          {/* sombra quente: o preto sobe para um marrom escuro; luz e meio-tom ficam */}
          <AbsoluteFill style={{ backgroundColor: 'rgb(24,16,10)', mixBlendMode: 'lighten' }} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ backgroundColor: '#3a332c', color: '#d8cbb8', fontFamily: 'monospace', fontSize: 42, padding: 120 }}>
          <div>
            CLIPE {c.clipe} · {arq} · quadro {k}
          </div>
          <div style={{ fontSize: 30, marginTop: 16 }}>
            {c.arquivo_origem} {c.origem_entra_s}–{c.origem_sai_s} s
          </div>
        </AbsoluteFill>
      )}
      <Acabamento f={f} />
      <Letreiros itens={letreiros} f={f} fim={c.sai_f} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- vídeo

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
