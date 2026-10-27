import React from 'react';
import { useCurrentFrame } from 'remotion';
import chapas from '../data/chapas.json';
import legendas from '../data/legendas.json';
import { FAMILIA } from './fonte';

type Cue = { de: number; ate: number; linhas: string[] };
const LEG = legendas as unknown as Record<string, Cue[]>;
const TOM = chapas.legenda as Record<string, string>;

/**
 * A legenda queimada: EB Garamond 500, corpo 40, #2A2622 a 80%, centrada na
 * faixa y=1330..1430. O texto é o das .srt entregues, no tempo da fala
 * medida (ferramentas/legendas.py). Não treme com a batida: é faixa de
 * serviço, fora da câmera.
 *
 * Por trás de cada letra vai um halo do tom do próprio papel: as camadas
 * do JSON passam pela faixa (as faixas pretas do anel, a última linha do
 * arquivo da contagem, a divisória das sagas) e, sem ele, a tinta escura
 * apagava a legenda. Em cima do papel o halo some.
 */
export const Legenda: React.FC<{ short: string }> = ({ short }) => {
  const f = useCurrentFrame();
  const c = LEG[short].find((x) => f >= x.de && f < x.ate);
  if (!c) return null;
  const texto = c.linhas.join('\n');
  const tipo: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1080,
    textAlign: 'center',
    fontFamily: `"${FAMILIA}"`,
    fontWeight: 500,
    fontSize: 40,
    lineHeight: '48px',
    whiteSpace: 'pre',
  };
  return (
    <div style={{ position: 'absolute', left: 0, width: 1080, top: 1380 - c.linhas.length * 24 }}>
      <div style={{ ...tipo, color: TOM[short], WebkitTextStroke: `10px ${TOM[short]}`, filter: 'blur(2px)' }}>{texto}</div>
      <div style={{ ...tipo, color: '#2A2622', opacity: 0.8 }}>{texto}</div>
    </div>
  );
};
