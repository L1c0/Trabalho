import type React from 'react';
import type {BlocoId} from '../data';
import {BlocoBreu} from './BlocoBreu';
import {BlocoPagina} from './BlocoPagina';

export {CamadaDosObjetos, Frente} from './paginas';

export const cenas: Record<BlocoId, React.FC> = {
  breu: BlocoBreu,
  pagina: BlocoPagina,
};
