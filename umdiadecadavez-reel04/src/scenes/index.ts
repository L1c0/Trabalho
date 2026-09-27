import type React from 'react';
import type {BlocoId} from '../data';
import {Breu} from './Breu';
import {Caderno} from './Caderno';
import {Celular} from './Celular';
import {Fecho} from './Fecho';

export const cenas: Record<BlocoId, React.FC> = {
  breu: Breu,
  caderno: Caderno,
  celular: Celular,
  fecho: Fecho,
};
