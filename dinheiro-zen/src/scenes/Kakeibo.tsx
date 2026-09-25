import React from 'react';
import {AbsoluteFill} from 'remotion';
import {textos} from '../data/textos';
import {cores, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Contador} from '../motion/Contador';
import {Kakijun, duracaoKakijun} from '../motion/Kakijun';
import {Risco} from '../motion/Risco';
import {Absorcao} from '../components/Absorcao';
import {Escrita} from '../components/Escrita';
import {Ruby} from '../components/Ruby';
import {TateColumn} from '../components/TateColumn';

// 0800–1000 · KAKEIBO
export const Kakeibo: React.FC = () => {
  const L = useLayout();
  const c = L.kakeibo;
  const q = (f: number) => local('kakeibo', f);
  const T = tempo.kakeibo;
  const t = textos.kakeibo;
  const ritmo = motion.kakijun.kakeibo;

  let inicio = q(T.kakijun);
  const celulas = t.kanji.map((k, i) => {
    const celula = {...k, ...c.kanji[i], inicio};
    inicio += duracaoKakijun(k.kanji, ritmo);
    return {...celula, fim: inicio};
  });

  return (
    <AbsoluteFill>
      <Absorcao inicio={q(T.absorcao)}>
        {celulas.map((k) => (
          <React.Fragment key={k.kanji}>
            <TateColumn cx={k.cx} topo={k.topo} tamanho={k.tamanho}>
              <Kakijun kanji={k.kanji} tamanho={k.tamanho} inicio={k.inicio} ritmo={ritmo} cor={cores.sumi} />
            </TateColumn>
            <Ruby texto={k.ruby} x={c.rubyX} topo={k.topo} inicio={k.fim} tamanho={L.tipo.ruby} />
          </React.Fragment>
        ))}
        <Risco
          antes={t.risco.antes}
          riscada={t.risco.riscada}
          nova={t.risco.nova}
          inicioTexto={q(T.riscoTexto)}
          inicio={q(T.risco)}
          tamanho={L.tipo.risco}
          corTexto={cores.sumi}
          corRisco={cores.shu}
          direita={c.risco.direita}
          topo={c.risco.topo}
          estilo={{fontFamily: fontes.display, fontWeight: fontes.peso.corpo, fontSize: L.tipo.risco, lineHeight: proporcoes.entrelinha}}
        />
        <Contador
          valores={t.ano}
          inicio={q(T.ano)}
          passo={motion.contador.passoAno}
          estilo={{
            position: 'absolute',
            left: 0,
            width: c.ano.direita,
            top: c.ano.topo,
            textAlign: 'right',
            fontFamily: fontes.display,
            fontWeight: fontes.peso.corpo,
            fontSize: L.tipo.ano,
            lineHeight: 1,
            color: cores.sumi,
          }}
        />
        <Escrita
          linhas={[t.autora]}
          inicio={q(T.autora)}
          direita={c.autora.direita}
          topo={c.autora.topo}
          estilo={{
            fontFamily: fontes.apoio,
            fontWeight: fontes.peso.apoioForte,
            fontSize: L.tipo.autora,
            letterSpacing: proporcoes.espacoAutora,
            lineHeight: proporcoes.entrelinha,
            color: cores.ai,
          }}
        />
      </Absorcao>
    </AbsoluteFill>
  );
};
