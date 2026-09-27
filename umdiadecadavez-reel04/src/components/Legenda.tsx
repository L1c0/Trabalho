import React from 'react';
import {fontes, grid} from '../theme';
import {Escrita, duracaoEscrita} from '../motion/Escrita';

// Texto de apoio em Montserrat. Sem coreografia: a tinta só pega o papel.
export const Legenda: React.FC<{
  linhas: readonly string[];
  inicio: number;
  tamanho: number;
  cor: string;
  esquerda: number;
  topo: number;
  peso?: number;
  caixaAlta?: boolean;
  noFluxo?: boolean; // dentro de outro layout, em vez de posicionada na tela
  centro?: boolean; // centrada na largura da tela
}> = ({linhas, inicio, tamanho, cor, esquerda, topo, peso = fontes.peso.legenda, caixaAlta, noFluxo, centro}) => {
  let t = inicio;
  return (
    <div
      style={{
        ...(noFluxo ? {} : {position: 'absolute' as const, top: topo, ...(centro ? {left: 0, right: 0, textAlign: 'center' as const} : {left: esquerda})}),
        fontFamily: fontes.legenda,
        fontWeight: peso,
        fontSize: tamanho,
        lineHeight: grid.entrelinhaLegenda,
        color: cor,
        whiteSpace: 'nowrap',
        textTransform: caixaAlta ? 'uppercase' : undefined,
        letterSpacing: caixaAlta ? '0.04em' : undefined,
      }}
    >
      {linhas.map((linha, i) => {
        const de = t;
        const dur = duracaoEscrita(linha);
        t += dur;
        return (
          <div key={i}>
            <Escrita inicio={de} duracao={dur}>
              {linha}
            </Escrita>
          </div>
        );
      })}
    </div>
  );
};
