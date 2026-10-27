import React from 'react';
import { useCurrentFrame } from 'remotion';
import legendas from '../data/legendas.json';
import { FAMILIA } from './fonte';

type Cue = { de: number; ate: number; linhas: string[] };
const LEG = legendas as unknown as Record<string, Cue[]>;

/**
 * A legenda queimada: EB Garamond 500, corpo 40, #2A2622 a 80%, centrada na
 * faixa y=1330..1430. O texto é o das .srt entregues, no tempo da fala
 * medida (ferramentas/legendas.py). Não treme com a batida: é faixa de
 * serviço, fora da câmera.
 */
export const Legenda: React.FC<{ short: string }> = ({ short }) => {
  const f = useCurrentFrame();
  const c = LEG[short].find((x) => f >= x.de && f < x.ate);
  if (!c) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: 1080,
        top: 1380 - c.linhas.length * 24,
        textAlign: 'center',
        fontFamily: `"${FAMILIA}"`,
        fontWeight: 500,
        fontSize: 40,
        lineHeight: '48px',
        color: '#2A2622',
        opacity: 0.8,
        whiteSpace: 'pre',
      }}
    >
      {c.linhas.join('\n')}
    </div>
  );
};
