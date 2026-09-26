// Peças de página de cada bloco.
// Tudo vem de data/; frames absolutos são convertidos para o frame local do bloco.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {cores, fontes, grid, tempo, textura} from '../theme';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Manuscrito} from '../motion/Manuscrito';
import {Faixa} from '../components/Faixa';
import {HeroEscrito, HeroManuscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── 0 · no breu ───
export const BreuTexto: React.FC<Local> = ({local}) => {
  const b = R.breu;
  return (
    <>
      <Apagar inicio={local(b.apagar1)}>
        <HeroEscrito linhas={b.hero1.linhas} inicio={local(b.hero1.de)} duracao={b.hero1.duracao} tamanho={b.hero1.tamanho} cor={cores.papel} esquerda={M} topo={b.hero1.topo} />
      </Apagar>
      <Apagar inicio={local(b.apagar2)}>
        <HeroEscrito linhas={b.hero2.linhas} inicio={local(b.hero2.de)} duracao={b.hero2.duracao} tamanho={b.hero2.tamanho} cor={cores.destaque} esquerda={M} topo={b.hero2.topo} />
      </Apagar>
    </>
  );
};

// ─── 1 · o caderno ───
export const PaginaCaderno: React.FC<Local> = ({local}) => {
  const c = R.caderno;
  return (
    <Papel>
      <Apagar inicio={local(c.esvazia)}>
        <PalavraGigante
          texto={c.gigante.texto}
          inicio={local(c.gigante.de)}
          ate={local(c.esvazia)}
          tamanho={c.gigante.tamanho}
          cor={cores.esfero}
          opacidade={c.gigante.opacidade}
          esquerda={c.gigante.esquerda}
          topo={c.gigante.topo}
        />
        {c.legendas.map((l) => (
          <Legenda key={l.texto} linhas={[l.texto]} inicio={local(l.de)} tamanho={c.tamanho} cor={cores.esfero} esquerda={M} topo={l.topo} />
        ))}
      </Apagar>
    </Papel>
  );
};

// ─── 2 · as duas frases riscadas ───
export const PaginaRiscos: React.FC<Local> = ({local}) => {
  const r = R.riscos;
  const ultima = r.frases[r.frases.length - 1];
  return (
    <Papel>
      <Apagar inicio={local(ultima.apagar)}>
        <Legenda linhas={[r.pergunta.texto]} inicio={local(r.pergunta.de)} tamanho={r.pergunta.tamanho} cor={cores.esfero} esquerda={M} topo={r.pergunta.topo} centro />
      </Apagar>
      {r.frases.map((f) => (
        <Apagar key={f.texto} inicio={local(f.apagar)}>
          <HeroEscrito
            linhas={[f.texto]}
            inicio={local(f.de)}
            duracao={f.duracao}
            tamanho={r.tamanho}
            cor={cores.esferoFraca}
            esquerda={M}
            topo={r.topo}
            risco={local(f.risco)}
          />
        </Apagar>
      ))}
    </Papel>
  );
};

// ─── 3 · levanta ───
export const PaginaLevanta: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const l = R.levanta;
  const recuo = interpolate(frame, [local(l.recuo.de), local(l.recuo.de) + l.recuo.duracao], [1, l.recuo.opacidade], clamp);
  return (
    <Papel>
      <Apagar inicio={local(l.apagar)}>
        <AbsoluteFill style={{opacity: recuo}}>
          {l.linhas.map((linha, i) => (
            <HeroManuscrito
              key={linha.texto}
              texto={linha.texto}
              inicio={local(linha.de)}
              tamanho={linha.tamanho}
              cor={cores.esfero}
              esquerda={M}
              base={linha.base}
              semente={`levanta${i}`}
            />
          ))}
        </AbsoluteFill>
        <HeroEscrito linhas={[l.hero.texto]} inicio={local(l.hero.de)} duracao={l.hero.duracao} tamanho={l.hero.tamanho} cor={cores.esfero} esquerda={M} topo={l.hero.topo} />
        <Legenda linhas={[l.todoDia.texto]} inicio={local(l.todoDia.de)} tamanho={l.todoDia.tamanho} cor={cores.esfero} esquerda={M} topo={l.todoDia.topo} peso={fontes.peso.legendaForte} />
      </Apagar>
    </Papel>
  );
};

// ─── 4 · igual você ───
export const PaginaIgualVoce: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const g = R.igualVoce;
  const t = local(g.pautaFoco);
  const pauta = interpolate(frame, [t, t + tempo.pautaFoco], [textura.pauta.opacidade, textura.pauta.foco], clamp);
  return (
    <>
      <Papel pauta={pauta}>
        <HeroEscrito linhas={[g.hero.texto]} inicio={local(g.hero.de)} tamanho={g.hero.tamanho} cor={cores.esfero} esquerda={M} topo={g.hero.topo} centro />
        {g.linhas.map((linha, i) => (
          <div key={linha.texto} style={{position: 'absolute', left: M, top: linha.base - g.tamanho}}>
            <Manuscrito texto={linha.texto} inicio={local(linha.de)} tamanho={g.tamanho} cor={cores.esfero} semente={`final${i}`} falha />
          </div>
        ))}
      </Papel>
      {/* a faixa fica acima da vinheta: é faixa, não papel */}
      <Faixa texto={R.handle} inicio={local(g.faixa)} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} />
    </>
  );
};
