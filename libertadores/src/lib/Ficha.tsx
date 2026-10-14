import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import type {TimeId} from '../theme';
import {curvas, fontes, medidas, paleta, times} from '../theme';
import {useFormato} from './formato';

// FICHA DO TIME (fecho do vídeo 02). Escudo de 72 px, nome em display, três atributos com
// barra que preenche em 16 quadros quando a narração os cita. Sem número: a barra marca o
// atributo citado, não mede nada.
export const Ficha: React.FC<{time: TimeId; atributos: {texto: string; frame: number}[]; inicio: number}> = ({time, atributos, inicio}) => {
  const q = useCurrentFrame();
  const f = q + inicio;
  const fm = useFormato();
  const m = medidas.ficha;
  const t = times[time];
  const largura = fm.vertical ? fm.largura - 2 * fm.margem : 760;
  const x0 = (fm.largura - largura) / 2;
  const y0 = fm.altura * (fm.vertical ? 0.36 : 0.32);
  const entra = curvas.saida(Math.min(1, q / 12));
  return (
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      <div style={{position: 'absolute', left: x0, top: y0, width: largura, opacity: entra}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Img src={staticFile(t.escudo!)} style={{width: m.escudo * fm.k, height: m.escudo * fm.k, objectFit: 'contain'}} />
          <div style={{fontFamily: fontes.display, fontSize: m.nome * fm.k, color: paleta.texto, textTransform: 'uppercase', lineHeight: 1}}>{t.nome}</div>
        </div>
        <div style={{marginTop: 48 * fm.k, display: 'flex', flexDirection: 'column', gap: 30 * fm.k}}>
          {atributos.map((a) => {
            const p = curvas.saida(Math.min(1, Math.max(0, (f - a.frame) / m.barra)));
            const visivel = Math.min(1, Math.max(0, (f - a.frame + 6) / 6));
            return (
              <div key={a.texto} style={{opacity: visivel}}>
                <div style={{fontFamily: fontes.corpo, fontWeight: 600, fontSize: m.rotulo * fm.k, letterSpacing: medidas.rotulo.espacamento, color: paleta.texto, marginBottom: 10}}>
                  {a.texto.toUpperCase()}
                </div>
                <div style={{position: 'relative', height: m.barraAltura, backgroundColor: paleta.linhas}}>
                  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, backgroundColor: t.cor}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
