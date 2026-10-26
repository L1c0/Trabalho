import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Chegada } from './Chegada';
import type { Camada, Folha, Montagem, Plano } from './tipos';

/**
 * Uma folha de washi debaixo da câmera. O papel é o washi periódico
 * ladrilhado; a tinta de cada camada é transmitância multiplicada sobre ele.
 * Papel e tinta andam juntos debaixo da câmera: o grão é da folha, nunca
 * filtro de tela.
 *
 * Câmera paciente: escala e ponto olhado vão em linha reta do começo ao fim
 * do plano, velocidade constante, sem easing. Corte de escala é outro plano
 * sobre a mesma folha.
 *
 * Profundidade (só nos três momentos): os planos da frente andam um pouco
 * mais que o fundo. Recorte opaco (pinheiro sobre o mar) tem papel próprio
 * e máscara; tinta sobre papel (o picanço) só multiplica.
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

/** O papel da folha num retângulo dela. (x, y) posiciona o retângulo no
 * pai; (fx, fy) é onde a origem dele cai na folha (por padrão, x e y): o
 * ladrilho do washi fica sempre no mesmo lugar da folha, então o recorte da
 * frente começa com o mesmo papel do fundo, sem emenda. */
const Papel: React.FC<{
  m: Montagem; folha: Folha; x: number; y: number; w: number; h: number; fx?: number; fy?: number;
}> = ({ m, folha, x, y, w, h, fx = x, fy = y }) => {
  const [x0, y0] = folha.caixa;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundImage: `url(${staticFile(m.papel.src)})`,
          backgroundSize: `${m.papel.w}px ${m.papel.h}px`,
          backgroundPosition: `${x0 - folha.ox - fx}px ${y0 - folha.oy - fy}px`,
          backgroundRepeat: 'repeat',
        }}
      />
      {folha.tom && (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: w,
            height: h,
            backgroundColor: `rgb(${folha.tom.map((v) => Math.round(v * 255)).join(',')})`,
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </>
  );
};

/** Recorte opaco: papel próprio + tinta, cortado pela máscara. */
const Recorte: React.FC<{ m: Montagem; folha: Folha; c: Camada; sat: number }> = ({ m, folha, c, sat }) => {
  const mascara = `url(${staticFile(c.alfa!)})`;
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        top: c.y,
        width: c.w,
        height: c.h,
        WebkitMaskImage: mascara,
        maskImage: mascara,
        WebkitMaskSize: `${c.w}px ${c.h}px`,
        maskSize: `${c.w}px ${c.h}px`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        isolation: 'isolate',
      }}
    >
      <Papel m={m} folha={folha} x={0} y={0} w={c.w} h={c.h} fx={c.x} fy={c.y} />
      <div style={{ position: 'absolute', left: -c.x, top: -c.y, width: 1, height: 1 }}>
        <CamadaParada c={c} sat={sat} />
      </div>
    </div>
  );
};

const CamadaNoQuadro: React.FC<{ m: Montagem; c: Camada; f: number; sat: number }> = ({ m, c, f, sat }) => {
  if (c.carimbo) {
    // o carimbo desce: escala de 1,05 a 1,0 e a tinta subindo em 7 frames
    // (opacidade numa camada multiplicada = a tinta aumentando)
    const [quando, giro] = c.carimbo;
    if (f < quando) return null;
    const t = Math.min(1, (f - quando + 1) / 7);
    return (
      <Img
        src={staticFile(c.src)}
        style={{
          position: 'absolute',
          left: c.x,
          top: c.y,
          width: c.w,
          height: c.h,
          mixBlendMode: 'multiply',
          opacity: Math.min(1, t * 1.25),
          transform: `rotate(${giro}deg) scale(${1.05 - 0.05 * t})`,
          transformOrigin: 'center',
        }}
      />
    );
  }
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

  const nomes = pl.px ? Object.keys(pl.px) : ['fundo'];
  const fundo = nomes[0];
  const pose = (nome: string) => {
    const [g, d, sobe] = pl.px?.[nome] ?? [0, 0, 0];
    const ps = s * (1 + g * e);
    return { ps, tx: 960 - cx * ps + d * 1920 * e, ty: 540 - cy * ps - (sobe ?? 0) * e };
  };
  // o recorte dos planos da frente, na tela, pela pose do fundo
  const pf = pose(fundo);
  const clip = pl.clip
    ? `inset(${pf.ty + pl.clip[1] * pf.ps}px ${1920 - (pf.tx + pl.clip[2] * pf.ps)}px ${
        1080 - (pf.ty + pl.clip[3] * pf.ps)
      }px ${pf.tx + pl.clip[0] * pf.ps}px)`
    : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: '#E8E4DA', overflow: 'hidden' }}>
      {nomes.map((nome) => {
        const { ps, tx, ty } = pose(nome);
        // camada sem plano (ou de um plano que este quadro não separa) mora no fundo
        const camadas = folha.camadas.filter((c) => (c.plano && nomes.includes(c.plano) ? c.plano : fundo) === nome);
        const eFundo = nome === fundo;
        const opaco = !eFundo && camadas.some((c) => c.alfa);
        const conteudo = (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              transformOrigin: '0 0',
              transform: `translate(${tx}px, ${ty}px) scale(${ps})`,
            }}
          >
            {eFundo ? (
              <Papel m={m} folha={folha} x={x0} y={y0} w={x1 - x0} h={y1 - y0} />
            ) : (
              !opaco && (
                <div style={{ position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0, backgroundColor: '#fff' }} />
              )
            )}
            {camadas.map((c) =>
              c.alfa ? (
                <Recorte key={c.id} m={m} folha={folha} c={c} sat={sat} />
              ) : (
                <CamadaNoQuadro key={c.id} m={m} c={c} f={f} sat={sat} />
              ),
            )}
          </div>
        );
        if (eFundo) return <React.Fragment key={nome}>{conteudo}</React.Fragment>;
        return (
          <div
            key={nome}
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: clip,
              mixBlendMode: opaco ? 'normal' : 'multiply',
            }}
          >
            {conteudo}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
