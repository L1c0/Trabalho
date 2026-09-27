import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {Estado} from '../data';
import {fontes, tempo} from '../theme';
import {Digitos} from './Digitos';

// TROCA DE UNIDADE · a animação-assinatura do canal. O mesmo valor em outra unidade:
// número em dígito tabular, unidade trocando por corte seco. O último estado fica.
export const TrocaDeUnidade: React.FC<{de: number; estados: readonly Estado[]; tamanho: number; cor: string; corUnidade: string}> = ({
  de,
  estados,
  tamanho,
  cor,
  corUnidade,
}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const i = Math.min(estados.length - 1, Math.floor((frame - de) / tempo.troca));
  const e = estados[i];
  const unidade = {fontSize: tamanho * 0.42, color: corUnidade};
  return (
    <div style={{fontFamily: fontes.lettering, fontSize: tamanho, lineHeight: 1, color: cor, whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: tamanho * 0.12}}>
      {e.prefixo ? <span style={unidade}>{e.prefixo}</span> : null}
      <span>
        <Digitos texto={e.numero} />
      </span>
      {e.sufixo ? <span style={unidade}>{e.sufixo}</span> : null}
    </div>
  );
};
