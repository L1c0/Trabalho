import React from 'react';
import {AbsoluteFill} from 'remotion';
import {V} from '../data';
import {cores, corDoBloco, escala, fontes, tempo} from '../theme';
import {Corte} from '../lettering/Corte';
import {Empilhar} from '../lettering/Empilhar';
import {TrocaDeUnidade} from '../lettering/TrocaDeUnidade';
import {Contador} from '../lib/Contador';
import {Centro, type Local} from './comum';

// 3 · A conta. Passo a passo empilhando, o contador, e a troca de unidade.
export const Conta: React.FC<{q: Local}> = ({q}) => {
  const c = V.conta;
  const cor = corDoBloco.magenta;
  return (
    <AbsoluteFill>
      <Corte de={q(c.passos.de)} ate={q(c.passos.ate)}>
        <div style={{position: 'absolute', left: escala.margem, top: 220, height: 580, width: 1600}}>
          <Empilhar
            de={q(c.passos.de)}
            linhas={c.passos.linhas}
            intervalo={tempo.empilharConta}
            estilo={{fontFamily: fontes.texto, fontWeight: fontes.peso.forte, fontSize: escala.empilhar, lineHeight: escala.entrelinhaTexto, color: cores.branco}}
            marcador={(i) => <span style={{color: cor, marginRight: 28}}>{String(i + 1).padStart(2, '0')}</span>}
          />
        </div>
      </Corte>
      <Corte de={q(c.contador.de)} ate={q(c.contador.ate)}>
        <Centro>
          <Contador de={q(c.contador.de)} valor={c.contador.valor} casas={c.contador.casas} prefixo={c.contador.prefixo} tamanho={escala.contador} cor={cores.branco} />
        </Centro>
      </Corte>
      <Corte de={q(c.troca.de)} ate={q(c.troca.ate)}>
        <Centro>
          <TrocaDeUnidade de={q(c.troca.de)} estados={c.troca.estados} tamanho={escala.contador} cor={cores.branco} corUnidade={cor} />
        </Centro>
      </Corte>
    </AbsoluteFill>
  );
};
