import type React from 'react';
import type {BlocoId} from '../data';
import {Breu} from './Breu';
import {Caderno} from './Caderno';
import {Riscos} from './Riscos';
import {Levanta} from './Levanta';
import {IgualVoce} from './IgualVoce';

export const cenas: Record<BlocoId, React.FC> = {
  breu: Breu,
  caderno: Caderno,
  riscos: Riscos,
  levanta: Levanta,
  igualVoce: IgualVoce,
};
