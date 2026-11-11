import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Abertura } from './cenas/Abertura';
import { Documento, Tabela, Turner } from './cenas/Documento';
import { FortWorth } from './cenas/FortWorth';
import { Neve1899, Tuberculose } from './cenas/Grafismos1';
import { Competencia, Divida, SobreIsso } from './cenas/Jogadas1';
import { Dutch, Medico, Obsolescencia } from './cenas/Jogadas2';
import { Vinheta } from './cenas/Vinheta';
import { B0, DURACAO as D, s, VINHETA } from './tempo';

export const DURACAO = D;

type Cena = React.FC<{ f: number; clipes: boolean }>;

/**
 * O roteiro de cenas, em quadros da trilha (o quadro do vídeo menos B0).
 * Cada cena recebe o quadro da trilha e cuida das próprias entradas.
 */
export const CENAS: { de: number; C: Cena; nome: string }[] = [
  { de: 0, C: Abertura as Cena, nome: 'abertura' },
  { de: s(52.6), C: SobreIsso, nome: 'sobre-isso' },
  { de: s(62.0), C: Neve1899, nome: 'neve-1899' },
  { de: 2400, C: Competencia, nome: 'competencia' },
  { de: 3180, C: Divida, nome: 'divida' },
  { de: 4408, C: Tuberculose, nome: 'tuberculose' },
  { de: 6212, C: Medico, nome: 'medico' },
  { de: 6750, C: Dutch, nome: 'dutch' },
  { de: 8295, C: Documento, nome: 'documento' },
  { de: 9432, C: Turner, nome: 'turner' },
  { de: 10050, C: Tabela, nome: 'tabela' },
  { de: 10326, C: Obsolescencia, nome: 'obsolescencia' },
  { de: 11280, C: FortWorth, nome: 'fort-worth' },
];

export const Video: React.FC<{ clipes: boolean }> = ({ clipes }) => {
  const f = useCurrentFrame();
  const fb = f - B0;
  let k = -1;
  for (let i = 0; i < CENAS.length; i++) if (fb >= CENAS[i].de) k = i;
  const C = k >= 0 ? CENAS[k].C : null;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {f < VINHETA + 4 && <Vinheta f={f} />}
      {C && <C f={fb} clipes={clipes} />}
    </AbsoluteFill>
  );
};
