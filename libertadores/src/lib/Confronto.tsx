import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import type {TimeId} from '../theme';
import {curvas, fontes, medidas, paleta, times} from '../theme';
import {projetor, ProjetorProvider, useFormato} from './formato';
import {Gramado} from './Gramado';

// ABERTURA DE CONFRONTO. Dois escudos de 160 px entram pelas laterais opostas em 20 quadros
// e param a 8 px do "x" central. Embaixo, o rótulo do confronto. Fundo: o campo desfocado
// 12 px a 30%.
export const Confronto: React.FC<{casa: TimeId; fora: TimeId; rotulo: string}> = ({casa, fora, rotulo}) => {
  const f = useCurrentFrame();
  const fm = useFormato();
  const m = medidas.confronto;
  const t = curvas.saida(Math.min(1, f / m.entrada));
  const cx = fm.largura / 2;
  const cy = fm.altura * (fm.vertical ? 0.44 : 0.46);
  const meioX = (m.x * fm.k) / 2 + 6; // metade da largura do "x"
  const alvoEsq = cx - meioX - m.folga - m.escudo;
  const alvoDir = cx + meioX + m.folga;
  const esq = -m.escudo + (alvoEsq + m.escudo) * t;
  const dir = fm.largura + (alvoDir - fm.largura) * t;
  const rot = Math.min(1, Math.max(0, (f - m.entrada) / 12));
  const escudo = (time: TimeId, x: number) => (
    <Img src={staticFile(times[time].escudo!)} style={{position: 'absolute', left: x, top: cy - m.escudo / 2, width: m.escudo, height: m.escudo, objectFit: 'contain'}} />
  );
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <svg width={fm.largura} height={fm.altura} style={{position: 'absolute', inset: 0, filter: `blur(${m.desfoque}px)`, opacity: m.fundo}}>
        <ProjetorProvider valor={projetor(fm)}>
          <Gramado />
        </ProjetorProvider>
      </svg>
      {escudo(casa, esq)}
      {escudo(fora, dir)}
      <div style={{position: 'absolute', left: cx - 60, width: 120, top: cy - m.x * fm.k * 0.62, textAlign: 'center', fontFamily: fontes.display, fontSize: m.x * fm.k, color: paleta.secundario, opacity: t}}>x</div>
      <div
        style={{
          position: 'absolute',
          left: fm.margem,
          right: fm.margem,
          top: cy + m.escudo / 2 + 44,
          textAlign: 'center',
          fontFamily: fontes.display,
          fontSize: m.rotulo * fm.k,
          letterSpacing: '0.06em',
          color: paleta.texto,
          clipPath: `inset(-10% ${(1 - curvas.saida(rot)) * 100}% -10% 0)`,
        }}
      >
        {rotulo}
      </div>
    </AbsoluteFill>
  );
};
