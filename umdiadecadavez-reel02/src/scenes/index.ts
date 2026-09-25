import type React from 'react';
import type {BlocoId} from '../data/reel02';
import {NoBreu} from './NoBreu';
import {AntesDe} from './AntesDe';
import {Celular} from './Celular';
import {Seneca} from './Seneca';
import {Medo} from './Medo';
import {SemNome} from './SemNome';
import {Escreve} from './Escreve';
import {Tamanho} from './Tamanho';

export const cenas: Record<BlocoId, React.FC> = {
  noBreu: NoBreu,
  antesDe: AntesDe,
  celular: Celular,
  seneca: Seneca,
  medo: Medo,
  semNome: SemNome,
  escreve: Escreve,
  tamanho: Tamanho,
};
