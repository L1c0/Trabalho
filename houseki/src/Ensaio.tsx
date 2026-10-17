import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {pega} from './data/assets';
import {citacao, regua, tres} from './data/componentes';
import {citacaoPrincipe, pergunta, rendicao, titulos} from './data/textos';
import type {Plano as TPlano} from './data/timeline';
import {blocos, papelNosTitulos, planos, pretos, silencios, som, TOTAL} from './data/timeline';
import {cor} from './theme';
import {Grao} from './lib/Grao';
import {Painel} from './lib/Painel';
import {Papel} from './lib/Papel';
import {Regua} from './lib/Regua';
import {Citacao, TextoEscurecendo, TituloBloco} from './lib/Texto';
import {Tingido} from './lib/Tingido';
import {Tres} from './lib/Tres';

/**
 * O ENSAIO — encadeia timeline.ts. Corte seco entre tudo: cada plano é uma Sequence que
 * entra e sai no frame marcado, sem transição. O que não está em `planos` é papel vazio.
 */
const CARTELA = 110; // "A cartela de bloco entra nos primeiros 110 frames do bloco"
const PAPEL_SOM = 34; // "O som de papel, nas sete entradas de cartela de bloco. 34 frames cada."
const TRANSICAO_PRETO_2 = 30; // "O preto entra no texto ao longo de 30 frames"

const Plano: React.FC<{p: TPlano}> = ({p}) => {
  if (p.peca) {
    const peca = pega(p.peca);
    return peca.tipo === 'quadro' ? <Painel peca={peca} ancora={p.ancora} /> : <Tingido peca={peca} ancora={p.ancora} inicio={p.de} />;
  }
  if (p.de === pretos[0].de) return <Citacao linhas={[pergunta]} cor={cor.preto} />;
  if (p.de === pretos[1].de) return <TextoEscurecendo linhas={[rendicao]} quadros={TRANSICAO_PRETO_2} />;
  if (p.de === regua.de) return <Regua inicio={p.de} />;
  if (p.de === tres.de) return <Tres inicio={p.de} />;
  if (p.de === citacao.de && citacaoPrincipe) return <Citacao linhas={citacaoPrincipe} />;
  return null; // papel vazio
};

// o leito roda o filme inteiro menos nos dois silêncios absolutos
const trechosDoLeito = (() => {
  const t: {de: number; ate: number}[] = [];
  let de = 0;
  for (const s of silencios) {
    t.push({de, ate: s.de});
    de = s.ate;
  }
  t.push({de, ate: TOTAL});
  return t;
})();

export const Ensaio: React.FC = () => {
  const [narracao, leito, ...trilhas] = som;
  return (
    <AbsoluteFill>
      <Papel />
      {planos.map((p) => (
        <Sequence key={p.de} from={p.de} durationInFrames={p.ate - p.de} name={p.peca ?? 'papel'}>
          <Plano p={p} />
        </Sequence>
      ))}
      {blocos
        .filter((b) => b.titulo)
        .map((b) => (
          <Sequence key={b.id} from={b.de} durationInFrames={CARTELA} name={`cartela ${b.id}`}>
            <TituloBloco texto={titulos[b.id]} />
          </Sequence>
        ))}
      <Grao />

      {/* SOM — tudo em volume 1.0, sem ganho nenhum: a mixagem já está feita */}
      <Sequence from={narracao.de} durationInFrames={narracao.frames} name="narração" layout="none">
        <Html5Audio src={staticFile(narracao.arq)} />
      </Sequence>
      {trechosDoLeito.map((t) => (
        <Sequence key={t.de} from={t.de} durationInFrames={t.ate - t.de} name="leito" layout="none">
          <Html5Audio src={staticFile(leito.arq)} trimBefore={t.de} />
        </Sequence>
      ))}
      {trilhas.map((s) => (
        <Sequence key={s.arq} from={s.de} durationInFrames={s.frames} name={s.arq} layout="none">
          <Html5Audio src={staticFile(s.arq)} />
        </Sequence>
      ))}
      {papelNosTitulos.map((f) => (
        <Sequence key={f} from={f} durationInFrames={PAPEL_SOM} name="papel" layout="none">
          <Html5Audio src={staticFile('audio/papel.mp3')} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
