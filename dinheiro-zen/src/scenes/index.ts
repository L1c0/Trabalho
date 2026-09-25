import type React from 'react';
import type {CenaId} from '../data/cenas';
import {DinheiroSome} from './DinheiroSome';
import {DinheiroZen} from './DinheiroZen';
import {Kakeibo} from './Kakeibo';
import {Ma} from './Ma';
import {QuatroPerguntas} from './QuatroPerguntas';
import {TresSegundos} from './TresSegundos';

export const cenas: Record<CenaId, React.FC> = {
  ma: Ma,
  tresSegundos: TresSegundos,
  dinheiroSome: DinheiroSome,
  quatroPerguntas: QuatroPerguntas,
  kakeibo: Kakeibo,
  dinheiroZen: DinheiroZen,
};
