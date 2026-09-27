import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Segmento} from '../data';
import {cores, escala, fontes, tempo} from '../theme';
import {mascaraEscrita} from '../lettering/Escrita';

// A IMAGEM-CHAVE. Barra de 24 h em segmentos; só o destaque na cor do bloco, o resto em #333.
// Segmentos entram da esquerda, um a cada 10 frames. Quando o destaque termina de entrar,
// tudo para por 24 frames; depois os que faltam continuam.
export const agendaDaBarra = (de: number, segmentos: readonly Segmento[]) => {
  const b = tempo.barra;
  const k = segmentos.findIndex((s) => s.destaque);
  const pausaDe = de + k * b.intervalo + tempo.minimo;
  const pausa = [pausaDe, pausaDe + b.pausa] as const;
  const inicios = segmentos.map((_, i) => (i <= k ? de + i * b.intervalo : pausa[1] + (i - k - 1) * b.intervalo));
  return {inicios, pausa};
};

export const BarraDoDia: React.FC<{
  de: number;
  segmentos: readonly Segmento[];
  cor: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
}> = ({de, segmentos, cor, x, y, largura, altura}) => {
  const frame = useCurrentFrame();
  const {inicios} = agendaDaBarra(de, segmentos);
  const total = segmentos.reduce((a, s) => a + s.horas, 0);
  let acumulado = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: largura}}>
      {segmentos.map((s, i) => {
        const esq = (acumulado / total) * largura;
        const w = (s.horas / total) * largura;
        acumulado += s.horas;
        if (frame < inicios[i]) return null;
        const p = interpolate(frame, [inicios[i], inicios[i] + tempo.minimo], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        // rótulos alternam em duas linhas para os segmentos curtos não se atropelarem
        const linha = i % 2;
        const centro = Math.max(esq + w / 2, 0);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: esq,
                top: 0,
                width: Math.max(1, w - 3),
                height: altura,
                backgroundColor: s.destaque ? cor : cores.apagado,
                ...mascaraEscrita(p),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: centro,
                top: altura + 18 + linha * 34,
                transform: esq + w / 2 < 90 ? 'translateX(-10%)' : 'translateX(-50%)',
                fontFamily: fontes.texto,
                fontWeight: fontes.peso.texto,
                fontSize: escala.rotulo,
                color: s.destaque ? cor : cores.marca,
                whiteSpace: 'nowrap',
              }}
            >
              {s.rotulo}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
