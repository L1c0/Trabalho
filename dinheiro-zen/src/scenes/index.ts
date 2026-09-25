import type React from 'react';
import type {BlocoId} from '../data/roteiro';
import {Gancho} from './Gancho';
import {Ma} from './Ma';
import {Pausa} from './Pausa';
import {TresSegundos} from './TresSegundos';
import {Controle} from './Controle';
import {Ano} from './Ano';
import {Caderno} from './Caderno';
import {Kakeibo} from './Kakeibo';
import {Zen} from './Zen';
import {Cta} from './Cta';

export const cenas: Record<BlocoId, React.FC> = {
  gancho: Gancho,
  ma: Ma,
  pausa: Pausa,
  tresSegundos: TresSegundos,
  controle: Controle,
  ano: Ano,
  caderno: Caderno,
  kakeibo: Kakeibo,
  zen: Zen,
  cta: Cta,
};
