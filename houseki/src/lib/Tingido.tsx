import React, {useLayoutEffect, useRef, useState} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {leviata} from '../data/componentes';
import type {Peca} from '../data/assets';
import {altura, cor, largura} from '../theme';
import {useDeriva} from './deriva';
import type {Ancora} from './layout';
import {ALTURA_GRAVURA, ALTURA_PRANCHA, dimensao, posicionar} from './layout';

/**
 * TINGIDO — gravuras e pranchas de public/classico/ (cinza + alfa, SEM COR).
 *
 * O cinza é mapeado no gradiente cor.tinta → papel atual. Como o papel é exatamente o
 * fundo atrás da peça, isso é o mesmo que pousar TINTA com opacidade alfa × (1 − cinza)
 * sobre ele: onde o cinza é preto sai tinta, onde é branco sai o próprio papel, e no meio
 * a mistura. Por isso a prancha acompanha a cor do papel ao longo do filme sem recalcular
 * nada: a camada de tinta é feita uma vez por peça, e o papel por baixo muda sozinho.
 * Sem moldura nenhuma: gravura pousa direto no papel; prancha flutua com a borda esfumada.
 */
const tintaRGB = [1, 3, 5].map((i) => parseInt(cor.tinta.slice(i, i + 2), 16));
const cache = new Map<string, Promise<HTMLCanvasElement>>();

const camadaDeTinta = (arq: string) => {
  const pronto = cache.get(arq);
  if (pronto) return pronto;
  const p = new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d', {willReadFrequently: true})!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        const cinza = px[i];
        const alfa = px[i + 3];
        px[i] = tintaRGB[0];
        px[i + 1] = tintaRGB[1];
        px[i + 2] = tintaRGB[2];
        px[i + 3] = (alfa * (255 - cinza)) / 255;
      }
      ctx.putImageData(d, 0, 0);
      resolve(c);
    };
    img.onerror = () => reject(new Error(`não carregou ${arq}`));
    img.src = staticFile(arq);
  });
  cache.set(arq, p);
  return p;
};

export const Tingido: React.FC<{peca: Peca; ancora: Ancora; inicio: number}> = ({peca, ancora, inicio}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender(`tingido ${peca.id}`));
  const deriva = useDeriva();
  const f = useCurrentFrame() + inicio;
  const {w, h} = dimensao(peca.arq);

  useLayoutEffect(() => {
    let vivo = true;
    camadaDeTinta(peca.arq).then((c) => {
      if (!vivo || !ref.current) return;
      const ctx = ref.current.getContext('2d')!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(c, 0, 0);
      continueRender(handle);
    });
    return () => {
      vivo = false;
    };
  }, [peca.arq, handle, w, h]);

  let caixa: {x: number; y: number; w: number; h: number};
  let escala = deriva;
  if (peca.id === 'leviata' && ancora === 'CHEIO') {
    // o único zoom longo do filme: de 70% da altura até sangrar nos quatro lados, indo para o
    // torso do gigante. A escala anda em proporção (log), então a velocidade aparente é a mesma
    // do começo ao fim; o torso sai do centro e termina um pouco acima dele.
    const t = Math.min(1, Math.max(0, (f - leviata.de) / (leviata.ate - leviata.de)));
    const e = t * t * (3 - 2 * t);
    const H0 = altura * leviata.alturaInicial;
    const H1 = Math.max(altura * leviata.alturaFinal, (largura * leviata.sangria * h) / w);
    const H = H0 * Math.pow(H1 / H0, e);
    const W = (H * w) / h;
    const fx = 0.5 + (leviata.torso.x - 0.5) * e;
    const fy = 0.5 + (leviata.torso.y - 0.5) * e;
    const ty = 0.5 + (leviata.torsoNaTela - 0.5) * e;
    caixa = {x: largura / 2 - fx * W, y: altura * ty - fy * H, w: W, h: H};
    escala = 1;
  } else if (ancora === 'CHEIO') {
    const k = Math.min(largura / w, altura / h);
    caixa = {x: (largura - w * k) / 2, y: (altura - h * k) / 2, w: w * k, h: h * k};
  } else {
    const H = altura * (peca.tipo === 'gravura' ? ALTURA_GRAVURA : ALTURA_PRANCHA);
    caixa = posicionar(ancora, (H * w) / h, H);
  }
  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      style={{position: 'absolute', left: caixa.x, top: caixa.y, width: caixa.w, height: caixa.h, transform: `scale(${escala})`, transformOrigin: 'center'}}
    />
  );
};
