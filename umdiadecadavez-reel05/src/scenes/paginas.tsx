// Peças de página de cada bloco.
// Tudo vem de data/; frames absolutos são convertidos para o frame local do bloco.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, grid} from '../theme';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Osso} from '../motion/Osso';
import {Pilhas} from '../motion/Pilhas';
import {Faixa} from '../components/Faixa';
import {HeroEscrito, HeroManuscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── 0 · no breu: a linha que quebra ───
export const Breu: React.FC<Local> = ({local}) => {
  const b = R.breu;
  const topo = useTopoDaLegenda();
  const {breuNaAbertura} = usePlataforma();
  const o = b.osso;
  return (
    <>
      <Apagar inicio={local(b.apagar1)}>
        <HeroEscrito
          linhas={b.hero1.linhas}
          inicio={local(breuNaAbertura ? b.hero1.de : b.hero1.deSemBreu)}
          tamanho={b.hero1.tamanho}
          cor={cores.papel}
          esquerda={M}
          topo={b.hero1.topo}
        />
      </Apagar>
      {/* no breu a linha é da cor do papel: em esfero ela sumiria no escuro */}
      <Osso x={o.x} y={o.y} altura={o.altura} espessura={o.espessura} cor={cores.papel} escreve={local(o.escreve)} entorta={local(o.entorta)} quebra={local(o.quebra)} />
      <Apagar inicio={local(b.apagarLegendas)}>
        {b.legendas.map((l) => (
          <Legenda key={l.texto} linhas={[l.texto]} inicio={local(l.de)} tamanho={40} cor={cores.papel} esquerda={M} topo={topo(l.topo)} />
        ))}
      </Apagar>
      <HeroEscrito linhas={b.hero2.linhas} inicio={local(b.hero2.de)} tamanho={b.hero2.tamanho} cor={cores.destaque} esquerda={0} topo={b.hero2.topo} centro />
    </>
  );
};

// ─── 1 · o papel entra: lenda ───
export const Lenda: React.FC<Local> = ({local}) => {
  const topo = useTopoDaLegenda();
  const l = R.lenda;
  return (
    <Papel>
      <Apagar inicio={local(l.esvazia)}>
        <PalavraGigante
          texto={l.gigante.texto}
          inicio={local(l.gigante.de)}
          ate={local(l.esvazia)}
          tamanho={l.gigante.tamanho}
          cor={cores.esfero}
          opacidade={l.gigante.opacidade}
          esquerda={l.gigante.esquerda}
          topo={l.gigante.topo}
        />
        <Legenda linhas={[l.legenda.texto]} inicio={local(l.legenda.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(l.legenda.topo)} />
      </Apagar>
    </Papel>
  );
};

// ─── 2 · as duas pilhas, e os três riscos ───
const localizar = (local: (f: number) => number, l: {texto: string; de: number}) => ({texto: l.texto, de: local(l.de)});

export const PaginaPilhas: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const p = R.pilhas;
  const recuo = interpolate(frame, [local(p.recuo.de), local(p.recuo.de) + p.recuo.duracao], [1, p.recuo.opacidade], clamp);
  return (
    <Papel>
      <Apagar inicio={local(p.apagar)}>
        <AbsoluteFill style={{opacity: recuo}}>
          <Pilhas
            de={local(p.de)}
            x={p.x}
            cor={cores.esfero}
            margem={M}
            afastamento={p.afastamento}
            tamanho={p.tamanho}
            passo={p.passo}
            baseTitulo={p.baseTitulo}
            baseLinhas={p.baseLinhas}
            esquerda={{titulo: localizar(local, p.esquerda.titulo), linhas: p.esquerda.linhas.map((l) => localizar(local, l))}}
            direita={{titulo: localizar(local, p.direita.titulo), linhas: p.direita.linhas, transbordar: {de: local(p.direita.transbordar.de)}}}
            semente="pilhas"
          />
        </AbsoluteFill>
        {p.frases.map((f, i) => {
          const proxima = p.frases[i + 1];
          return (
            <Apagar key={f.texto} inicio={proxima ? local(proxima.de) - 8 : local(p.apagar)}>
              <HeroEscrito
                linhas={[f.texto]}
                inicio={local(f.de)}
                tamanho={p.tamanhoFrase}
                cor={cores.esfero}
                esquerda={M}
                topo={p.topoFrase}
                risco={local(f.risco)}
                corRisco={cores.destaque}
              />
            </Apagar>
          );
        })}
      </Apagar>
    </Papel>
  );
};

// ─── 3 · escolheu não implorar ───
export const PaginaImplorar: React.FC<Local> = ({local}) => {
  const im = R.implorar;
  return (
    <Papel>
      <Apagar inicio={local(im.apagar)}>
        <HeroEscrito linhas={im.hero.linhas} inicio={local(im.hero.de)} tamanho={im.hero.tamanho} cor={cores.esfero} esquerda={M} topo={im.hero.topo} />
        {im.linhas.map((l, i) => (
          <HeroManuscrito key={l.texto} texto={l.texto} inicio={local(l.de)} tamanho={im.tamanhoLinha} cor={cores.esfero} esquerda={M} base={l.base} semente={`implorar${i}`} />
        ))}
      </Apagar>
    </Papel>
  );
};

// ─── 4 · fecho: sobra só a pilha limpa ───
export const PaginaFecho: React.FC<Local> = ({local}) => {
  const {height} = useVideoConfig();
  const topo = useTopoDaLegenda();
  const {faixa} = usePlataforma();
  const f = R.fecho;
  const p = R.pilhas;
  return (
    <>
      <Papel>
        <Pilhas
          de={local(f.pilha.titulo.de)}
          x={p.x}
          cor={cores.esfero}
          margem={M}
          afastamento={p.afastamento}
          tamanho={p.tamanho}
          passo={p.passo}
          baseTitulo={p.baseTitulo}
          baseLinhas={p.baseLinhas}
          esquerda={{titulo: localizar(local, f.pilha.titulo), linhas: f.pilha.linhas.map((l) => localizar(local, l))}}
          soEsquerda
          semente="fecho"
        />
        <Legenda linhas={[f.legenda.texto]} inicio={local(f.legenda.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(f.legenda.topo)} />
        <HeroEscrito linhas={f.hero.linhas} inicio={local(f.hero.de)} tamanho={f.hero.tamanho} cor={cores.esfero} esquerda={M} topo={f.hero.topo} />
      </Papel>
      {/* só no Instagram; a faixa fica acima da vinheta: é faixa, não papel */}
      {faixa ? <Faixa texto={R.handle} inicio={local(f.faixa)} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null}
    </>
  );
};
