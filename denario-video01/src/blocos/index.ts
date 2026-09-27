import type React from 'react';
import type {BlocoId} from '../data';
import type {Local} from './comum';
import {Abertura} from './Abertura';
import {Seneca} from './Seneca';
import {Ansiedade} from './Ansiedade';
import {Conta} from './Conta';
import {Valeu} from './Valeu';
import {Pratica} from './Pratica';
import {Denario} from './Denario';
import {Fim} from './Fim';

export const blocos: Record<BlocoId, React.FC<{q: Local}>> = {
  abertura: Abertura,
  seneca: Seneca,
  ansiedade: Ansiedade,
  conta: Conta,
  valeu: Valeu,
  pratica: Pratica,
  denario: Denario,
  fim: Fim,
};
