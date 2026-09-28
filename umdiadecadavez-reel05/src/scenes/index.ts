import type React from 'react';
import type {BlocoId} from '../data';
import {BlocoBreu} from './BlocoBreu';
import {BlocoLenda} from './BlocoLenda';
import {BlocoPilhas} from './BlocoPilhas';
import {BlocoImplorar} from './BlocoImplorar';
import {BlocoFecho} from './BlocoFecho';

export const cenas: Record<BlocoId, React.FC> = {
  breu: BlocoBreu,
  lenda: BlocoLenda,
  pilhas: BlocoPilhas,
  implorar: BlocoImplorar,
  fecho: BlocoFecho,
};
