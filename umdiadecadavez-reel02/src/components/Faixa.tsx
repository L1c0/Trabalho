import React from 'react';
import {cores, fontes, grid, tempo} from '../theme';
import {Escrita} from '../motion/Escrita';

// Faixa escura com a assinatura da página.
// A faixa vai do topo até o pé da tela; o texto fica centrado nos primeiros `altura` px
// (na capa, isso o mantém dentro da margem que o grid corta).
export const Faixa: React.FC<{texto: string; inicio: number; topo: number; altura: number; tamanho: number; esquerda?: number}> = ({
  texto,
  inicio,
  topo,
  altura,
  tamanho,
  esquerda = grid.margem,
}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: topo, bottom: 0}}>
    <Escrita inicio={inicio} duracao={tempo.faixa} estilo={{display: 'block', width: '100%', height: '100%', backgroundColor: cores.breu}}>
      <div
        style={{
          position: 'absolute',
          left: esquerda,
          top: altura / 2,
          transform: 'translateY(-50%)',
          fontFamily: fontes.legenda,
          fontWeight: fontes.peso.legendaForte,
          fontSize: tamanho,
          letterSpacing: '0.06em',
          color: cores.papel,
        }}
      >
        {texto}
      </div>
    </Escrita>
  </div>
);
