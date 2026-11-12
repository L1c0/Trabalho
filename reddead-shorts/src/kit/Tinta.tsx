import React from 'react';
import { Freeze, Img, OffthreadVideo, staticFile } from 'remotion';
import medidas from '../data/takes.json';
import { COR } from './base';

const MEDIDA = medidas as Record<string, { w: number; h: number; n: number }>;
export const quadrosDe = (take: string) => MEDIDA[take].n;

/** O quadro `k` de um vídeo de tinta (take ou mancha), como imagem parada. */
export const QuadroDe: React.FC<{ arq: string; k: number; style?: React.CSSProperties }> = ({ arq, k, style }) => {
  const nome = arq.split('/').pop()!.replace('.mp4', '');
  const q = Math.max(0, Math.min(Math.round(k), MEDIDA[nome].n - 1));
  return (
    <Freeze frame={q}>
      <OffthreadVideo src={staticFile(arq)} muted style={{ display: 'block', ...style }} />
    </Freeze>
  );
};

type Mistura = 'multiplica' | 'clareia';
/**
 * Toda peça de tinta é aparada 2 px por dentro. Na borda da caixa as camadas
 * cobrem só parte do pixel, e ali a camada de cor aparecia sem misturar: uma
 * linha fina e clara em volta do take.
 */
const APARA = 'inset(2px)';

/**
 * Um take em tinta. O arquivo é um vídeo em tons de cinza (fundo branco,
 * tinta preta) feito por ferramentas/tinta.py. Ele entra por modo de mistura:
 *
 * - `multiplica`: a tinta escurece o que está por baixo (tinta sobre papel);
 * - `clareia`: o negativo, tinta clara sobre fundo escuro.
 *
 * Com `cor`, a tinta ganha essa cor em vez de preto (ou de branco).
 * `k` é o quadro do take a mostrar (os takes têm 30 fps).
 */
export const Tinta: React.FC<{
  take: string;
  k: number;
  x?: number;
  y?: number;
  /** largura na tela; a altura acompanha a proporção do take */
  w?: number;
  cor?: string;
  modo?: Mistura;
  espelho?: boolean;
  style?: React.CSSProperties;
  pasta?: string;
}> = ({ take, k, x = 0, y = 0, w, cor, modo = 'multiplica', espelho, style, pasta = 'takes' }) => {
  const m = MEDIDA[take];
  const larg = w ?? m.w;
  const alt = (larg * m.h) / m.w;
  const negativo = modo === 'clareia';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: larg,
        height: alt,
        mixBlendMode: negativo ? 'screen' : 'multiply',
        transform: espelho ? 'scaleX(-1)' : undefined,
        clipPath: APARA,
        ...style,
      }}
    >
      <QuadroDe arq={`${pasta}/${take}.mp4`} k={k} style={{ width: '100%', height: '100%', filter: negativo ? 'invert(1) contrast(1.3)' : 'contrast(1.3)' }} />
      {cor ? <div style={{ position: 'absolute', inset: 0, background: cor, mixBlendMode: negativo ? 'multiply' : 'screen' }} /> : null}
    </div>
  );
};

/**
 * Dupla exposição: o que está dentro (`children`) só aparece dentro da tinta
 * do take. Fora dela fica o papel. A peça inteira multiplica sobre o fundo.
 */
export const DentroDaTinta: React.FC<{ take: string; k: number; x?: number; y?: number; w?: number; children: React.ReactNode; fundo?: string; style?: React.CSSProperties }> = ({
  take,
  k,
  x = 0,
  y = 0,
  w,
  children,
  fundo = COR.tinta,
  style,
}) => {
  const m = MEDIDA[take];
  const larg = w ?? m.w;
  const alt = (larg * m.h) / m.w;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: larg, height: alt, mixBlendMode: 'multiply', overflow: 'hidden', clipPath: APARA, ...style }}>
      <div style={{ position: 'absolute', inset: 0, background: fundo }} />
      {children}
      <QuadroDe arq={`takes/${take}.mp4`} k={k} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', mixBlendMode: 'screen', filter: 'contrast(1.3)' }} />
    </div>
  );
};

/** Mancha de tinta parada (public/tinta/*.png), com cor. Entra crescendo num estalo. */
export const Mancha: React.FC<{
  arq: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  cor?: string;
  modo?: Mistura | 'chapado';
  giro?: number;
  escala?: number;
  op?: number;
}> = ({ arq, x, y, w, h, cor = COR.sangue, modo = 'multiplica', giro = 0, escala = 1, op = 1 }) => {
  if (escala <= 0 || op <= 0) return null;
  if (modo === 'chapado') {
    // tinta opaca de qualquer cor: o desenho entra como máscara (a versão -a.png tem transparência)
    const url = staticFile(`tinta/${arq.replace('.png', '-a.png')}`);
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h ?? w, transform: `rotate(${giro}deg) scale(${escala.toFixed(4)})`, opacity: op }}>
        <div style={{ position: 'absolute', inset: 0, background: cor, WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }} />
        {/* cópia invisível: faz o render esperar o arquivo da máscara */}
        <Img src={url} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
      </div>
    );
  }
  const negativo = modo === 'clareia';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h ?? w,
        mixBlendMode: negativo ? 'screen' : 'multiply',
        transform: `rotate(${giro}deg) scale(${escala.toFixed(4)})`,
        clipPath: APARA,
        opacity: op,
      }}
    >
      <Img src={staticFile(`tinta/${arq}`)} style={{ width: '100%', height: '100%', display: 'block', filter: negativo ? 'invert(1)' : undefined }} />
      <div style={{ position: 'absolute', inset: 0, background: cor, mixBlendMode: negativo ? 'multiply' : 'screen' }} />
    </div>
  );
};

/** Mancha que cresce (public/tinta/sangra-N.mp4): `k` é o quadro da mancha, de 0 até ela fechar. */
export const Sangra: React.FC<{ n?: 1 | 2 | 3; k: number; x: number; y: number; w: number; cor?: string; modo?: Mistura; giro?: number }> = ({
  n = 1,
  k,
  x,
  y,
  w,
  cor = COR.sangue,
  modo = 'multiplica',
  giro = 0,
}) => {
  if (k < 0) return null;
  const negativo = modo === 'clareia';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: w, mixBlendMode: negativo ? 'screen' : 'multiply', transform: `rotate(${giro}deg)`, clipPath: APARA }}>
      <QuadroDe arq={`tinta/sangra-${n}.mp4`} k={k} style={{ width: '100%', height: '100%', filter: negativo ? 'invert(1) contrast(1.3)' : 'contrast(1.3)' }} />
      <div style={{ position: 'absolute', inset: 0, background: cor, mixBlendMode: negativo ? 'multiply' : 'screen' }} />
    </div>
  );
};
