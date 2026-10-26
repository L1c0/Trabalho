import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Chegada } from './Chegada';
import type { Camada, Montagem, Plano } from './tipos';

/**
 * Uma folha de washi debaixo da câmera. O papel é o washi periódico
 * ladrilhado; a tinta de cada camada é transmitância multiplicada sobre ele.
 * Papel e tinta andam juntos debaixo da câmera: o grão é da folha, nunca
 * filtro de tela.
 *
 * Câmera paciente: escala e ponto olhado vão em linha reta do começo ao fim
 * do plano, velocidade constante, sem easing. Corte de escala é outro plano
 * sobre a mesma folha.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CamadaParada: React.FC<{ c: Camada; sat: number }> = ({ c, sat }) => {
  const caixa: React.CSSProperties = { position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h };
  if (!c.cor) {
    return <Img src={staticFile(c.src)} style={{ ...caixa, mixBlendMode: 'multiply' }} />;
  }
  // a peça colorida: sumi por baixo, cor por cima na proporção da partitura
  return (
    <div style={{ ...caixa, mixBlendMode: 'multiply' }}>
      <Img src={staticFile(c.src)} style={{ position: 'absolute', inset: 0, width: c.w, height: c.h }} />
      <Img
        src={staticFile(c.cor)}
        style={{ position: 'absolute', inset: 0, width: c.w, height: c.h, opacity: sat }}
      />
    </div>
  );
};

const CamadaNoQuadro: React.FC<{ m: Montagem; c: Camada; f: number; sat: number }> = ({ m, c, f, sat }) => {
  if (c.chega) {
    const [ini, dur] = c.chega;
    if (f < ini) return null;
    if (f < ini + dur && dur > 0) return <Chegada c={c} f={f} sat={sat} fibra={m.fibra} />;
  }
  return <CamadaParada c={c} sat={sat} />;
};

export const FolhaNoPlano: React.FC<{ m: Montagem; pl: Plano; f: number; sat: number }> = ({ m, pl, f, sat }) => {
  const folha = m.folhas[pl.folha];
  if (!folha) throw new Error(`folha ${pl.folha} não existe na montagem`);
  const e = Math.min(1, Math.max(0, (f - pl.de) / Math.max(1, pl.ate - pl.de - 1)));
  const [a, b] = pl.cam;
  const s = lerp(a[0], b[0], e);
  const cx = lerp(a[1], b[1], e);
  const cy = lerp(a[2], b[2], e);
  const [x0, y0, x1, y1] = folha.caixa;

  // planos de profundidade: o fundo leva o papel; os da frente multiplicam
  // sobre ele (base branca, porque transformação isola a mistura)
  const nomes = pl.px ? Object.keys(pl.px) : ['fundo'];
  const fundo = nomes[0];
  return (
    <AbsoluteFill style={{ backgroundColor: '#E8E4DA', overflow: 'hidden' }}>
      {nomes.map((nome) => {
        const [ganho, deriva] = pl.px?.[nome] ?? [0, 0];
        const ps = s * (1 + ganho * e);
        const dx = deriva * 1920 * e;
        const camadas = folha.camadas.filter((c) => (c.plano ?? fundo) === nome);
        const eFundo = nome === fundo;
        return (
          <div
            key={nome}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              transformOrigin: '0 0',
              transform: `translate(${960 - cx * ps + dx}px, ${540 - cy * ps}px) scale(${ps})`,
              mixBlendMode: eFundo ? 'normal' : 'multiply',
            }}
          >
            {eFundo ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: x0,
                    top: y0,
                    width: x1 - x0,
                    height: y1 - y0,
                    backgroundImage: `url(${staticFile(m.papel.src)})`,
                    backgroundSize: `${m.papel.w}px ${m.papel.h}px`,
                    backgroundPosition: `${-folha.ox}px ${-folha.oy}px`,
                    backgroundRepeat: 'repeat',
                  }}
                />
                {folha.tom && (
                  <div
                    style={{
                      position: 'absolute',
                      left: x0,
                      top: y0,
                      width: x1 - x0,
                      height: y1 - y0,
                      backgroundColor: `rgb(${folha.tom.map((v) => Math.round(v * 255)).join(',')})`,
                      mixBlendMode: 'multiply',
                    }}
                  />
                )}
              </>
            ) : (
              <div style={{ position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0, backgroundColor: '#fff' }} />
            )}
            {camadas.map((c) => (
              <CamadaNoQuadro key={c.id} m={m} c={c} f={f} sat={sat} />
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
