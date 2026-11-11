import React from 'react';
import { AbsoluteFill } from 'remotion';
import { c01, COR, entraCubica, FONTE, H, mix, prog, rnd, saiCubica, saiExpo, W } from '../kit/base';

/**
 * A vinheta de abertura, no espírito das de streaming: a marca aparece numa
 * batida, a câmera mergulha nela e a tela vira faixas de luz que passam e
 * somem no preto. É uma peça original da marca "Antes da Lenda": a linha
 * vermelha é a linha de fronteira do vídeo, e as faixas têm as cores da
 * série (vermelho, âmbar e creme).
 *
 * Tempos, em quadros (30 fps):
 *   8  primeira batida: a linha vermelha acende no meio da tela
 *   8-26  a linha se abre em duas e revela a marca
 *   26  segunda batida: a marca assenta
 *   54-100  a câmera mergulha na letra N e a marca vira faixas de luz
 *   100-128  as faixas passam e a tela fica preta
 */
export const VINHETA_DUR = 132;
const BATIDA1 = 8;
const BATIDA2 = 26;
const MERGULHO = 54;

const PALETA = ['#CD120F', '#E21A12', '#D98A2B', '#8A0B09', '#F2DDB8', '#B00F0C', '#F26B2A', '#E9C693', '#CD120F', '#FF3B1F'];
const N_FAIXAS = 110;

/**
 * As faixas de luz. Cada uma tem uma posição de -1 a 1 e uma "profundidade":
 * quanto mais a câmera entra (z), mais elas se afastam do centro e engrossam,
 * e as mais próximas correm mais. Uma em cada sete é preta, para abrir
 * frestas entre as cores.
 */
const Faixas: React.FC<{ f: number }> = ({ f }) => {
  const t = prog(f, MERGULHO + 2, 72);
  if (t <= 0) return null;
  const z = Math.pow(t, 2.4) * 11;
  const entra = c01((f - MERGULHO - 2) / 10);
  const barras = [];
  for (let i = 0; i < N_FAIXAS; i++) {
    const u = (rnd(i, 11) - 0.5) * 2;
    const prof = 0.2 + rnd(i, 12) * 1.9;
    const x = W / 2 + u * (W * 0.05) * (1 + z * prof);
    const larg = (1.5 + rnd(i, 13) * 9) * (1 + z * prof * 0.42);
    if (x + larg < -60 || x - larg > W + 60) continue;
    const preta = i % 7 === 3;
    const cor = preta ? '#000000' : PALETA[Math.floor(rnd(i, 14) * PALETA.length)];
    const pisca = 0.8 + 0.2 * Math.sin(f * (0.6 + rnd(i, 15)) + i * 2.1);
    const nasce = c01((t - rnd(i, 16) * 0.22) * 7);
    const op = entra * nasce * (preta ? 0.92 : pisca * (0.55 + 0.45 * rnd(i, 17)));
    // o brilho de cada faixa varia de cima a baixo
    const topo = (10 + rnd(i, 18) * 30).toFixed(0);
    const base = (60 + rnd(i, 19) * 30).toFixed(0);
    barras.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - larg / 2,
          top: 0,
          width: larg,
          height: H,
          background: preta ? '#000' : `linear-gradient(to bottom, ${cor}55 0%, ${cor} ${topo}%, ${cor} ${base}%, ${cor}66 100%)`,
          opacity: op,
          boxShadow: preta ? undefined : `0 0 ${(6 + larg * 0.25).toFixed(0)}px 0px ${cor}aa`,
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ overflow: 'hidden' }}>{barras}</AbsoluteFill>;
};

export const Vinheta: React.FC<{ f: number }> = ({ f }) => {
  if (f >= VINHETA_DUR) return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  // a marca
  const abre = saiExpo(prog(f, BATIDA1, 18)); // a fenda que revela a marca
  const meia = 560; // meia largura da marca
  const assenta = 1 + 0.05 * (1 - saiCubica(prog(f, BATIDA2, 10)));
  const deriva = 1 + 0.04 * prog(f, BATIDA2, MERGULHO - BATIDA2);
  const mergulho = entraCubica(prog(f, MERGULHO, 36));
  const escala = (f < BATIDA2 ? 1.05 : assenta * deriva) * (1 + mergulho * 46);
  const opMarca = 1 - prog(f, MERGULHO + 8, 12);
  // a linha: nasce no meio, vira duas e some
  const altLinha = saiExpo(prog(f, BATIDA1, 5));
  const opLinha = 1 - prog(f, BATIDA2 + 2, 10);
  const xLinha = abre * (meia + 60);
  const clarao1 = f >= BATIDA1 && f < BATIDA1 + 8 ? Math.pow(1 - (f - BATIDA1) / 8, 2) : 0;
  const clarao2 = f >= BATIDA2 && f < BATIDA2 + 10 ? Math.pow(1 - (f - BATIDA2) / 10, 2) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* brilho atrás da marca na segunda batida */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 46% 40% at 50% 50%, rgba(205,18,15,${(0.5 * clarao2 + 0.1 * (f > BATIDA2 ? opMarca : 0)).toFixed(3)}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {opMarca > 0 && f >= BATIDA1 && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: opMarca,
            // a fenda abre do meio para os lados
            clipPath: `inset(0 ${(W / 2 - xLinha).toFixed(1)}px 0 ${(W / 2 - xLinha).toFixed(1)}px)`,
          }}
        >
          <div style={{ transform: `scale(${escala.toFixed(4)})`, transformOrigin: '50.6% 62%', textAlign: 'center' }}>
            <div
              style={{
                fontFamily: FONTE.oswald,
                fontWeight: 600,
                fontSize: 50,
                letterSpacing: '0.62em',
                marginRight: '-0.62em',
                color: COR.creme,
                lineHeight: 1,
              }}
            >
              ANTES DA
            </div>
            <div style={{ fontFamily: FONTE.anton, fontSize: 300, letterSpacing: '0.02em', color: COR.creme, lineHeight: 1.02, marginTop: 14 }}>LENDA</div>
          </div>
        </AbsoluteFill>
      )}
      {/* as duas linhas vermelhas que abrem a fenda */}
      {opLinha > 0 && altLinha > 0 && (
        <>
          {[-1, 1].map((lado) => (
            <div
              key={lado}
              style={{
                position: 'absolute',
                left: W / 2 + lado * xLinha - 3,
                top: (H * (1 - altLinha)) / 2,
                width: 6,
                height: H * altLinha,
                background: COR.vermelho,
                opacity: opLinha,
                boxShadow: `0 0 ${mix(60, 24, abre).toFixed(0)}px ${mix(14, 4, abre).toFixed(0)}px ${COR.vermelho}`,
              }}
            />
          ))}
        </>
      )}
      <Faixas f={f} />
      {clarao1 > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 30% 80% at 50% 50%, rgba(205,18,15,${(0.55 * clarao1).toFixed(3)}) 0%, rgba(0,0,0,0) 75%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}
      {/* o fim: tudo apaga no preto */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: prog(f, VINHETA_DUR - 16, 14) }} />
    </AbsoluteFill>
  );
};
