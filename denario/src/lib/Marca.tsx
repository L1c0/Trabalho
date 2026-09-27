import React from 'react';
import {cores, escala, fontes} from '../theme';

// Marca · "DENÁRIO" pequeno, canto inferior direito, discreto.
export const Marca: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: escala.margemCanto,
      bottom: escala.margemCanto,
      fontFamily: fontes.titulo,
      fontSize: escala.marca,
      letterSpacing: '0.28em',
      color: cores.osso,
      opacity: 0.6,
    }}
  >
    DENÁRIO
  </div>
);
