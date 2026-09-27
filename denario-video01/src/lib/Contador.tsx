import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fontes, tempo} from '../theme';
import {Digitos} from '../lettering/Digitos';

// Número contando em dígito tabular (nada desliza). Prefixo, sufixo e casas decimais configuráveis.
export const formatar = (v: number, casas: number) => v.toFixed(casas).replace('.', ',');

export const Contador: React.FC<{
  de: number;
  valor: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  duracao?: number;
  tamanho: number;
  cor: string;
}> = ({de, valor, casas = 0, prefixo = '', sufixo = '', duracao = tempo.contador, tamanho, cor}) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  const passo = 10 ** -casas;
  const v = interpolate(frame, [de, de + Math.max(tempo.minimo, duracao)], [0, valor], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const atual = Math.round(v / passo) * passo;
  return (
    <div style={{fontFamily: fontes.lettering, fontSize: tamanho, lineHeight: 1, color: cor, whiteSpace: 'nowrap'}}>
      {prefixo ? <span style={{fontSize: '0.42em', marginRight: '0.15em'}}>{prefixo.trim()}</span> : null}
      <Digitos texto={formatar(atual, casas)} />
      {sufixo ? <span style={{fontSize: '0.42em', marginLeft: '0.15em'}}>{sufixo}</span> : null}
    </div>
  );
};
