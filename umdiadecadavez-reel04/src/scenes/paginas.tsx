// Peças de página de cada bloco.
// Tudo vem de data/; frames absolutos são convertidos para o frame local do bloco.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, grid, tempo} from '../theme';
import {rgba} from '../texture/Dobra';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
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
  const {breuNaAbertura} = usePlataforma();
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
      <Apagar inicio={local(b.apagar2)}>
        <HeroEscrito linhas={b.hero2.linhas} inicio={local(b.hero2.de)} tamanho={b.hero2.tamanho} cor={cores.destaque} esquerda={M} topo={b.hero2.topo} />
      </Apagar>
      <HeroEscrito
        linhas={[b.preguicoso.texto]}
        inicio={local(b.preguicoso.de)}
        tamanho={b.preguicoso.tamanho}
        cor={cores.esferoFraca}
        esquerda={M}
        topo={b.preguicoso.topo}
        risco={local(b.preguicoso.risco)}
        corRisco={cores.destaque}
      />
    </>
  );
};

// ─── 1 · o caderno ───
export const PaginaCaderno: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const topo = useTopoDaLegenda();
  const c = R.caderno;
  const recuo = interpolate(frame, [local(c.recuo.de), local(c.recuo.de) + c.recuo.duracao], [1, c.recuo.opacidade], clamp);
  return (
    <Papel>
      <Apagar inicio={local(c.esvaziaAntesDoSoco)}>
        <AbsoluteFill style={{opacity: recuo}}>
          {c.linhas.map((l, i) => (
            <HeroManuscrito key={l.texto} texto={l.texto} inicio={local(l.de)} tamanho={c.tamanhoLinha} cor={cores.esfero} esquerda={M} base={l.base} semente={`linha${i}`} />
          ))}
        </AbsoluteFill>
        <Legenda linhas={[c.culpa.texto]} inicio={local(c.culpa.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(c.culpa.topo)} />
      </Apagar>
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
        <HeroEscrito linhas={c.soco.linhas} inicio={local(c.soco.de)} duracao={c.soco.duracao} tamanho={c.soco.tamanho} cor={cores.esfero} esquerda={M} topo={c.soco.topo} />
        {c.legendas.map((l) => (
          <Legenda key={l.texto} linhas={[l.texto]} inicio={local(l.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(l.topo)} />
        ))}
      </Apagar>
    </Papel>
  );
};

// ─── 2 · o celular: a luz fria da tela, só gradiente ───
const LuzDaTela: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const l = R.celular.luz;
  if (frame < local(l.de) || frame >= local(l.apaga)) return null;
  const liga = interpolate(frame, [local(l.de), local(l.de) + tempo.luz.entrada], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: l.x,
        top: l.y,
        width: l.largura,
        height: l.altura,
        opacity: liga,
        background: `radial-gradient(closest-side at 50% 45%, ${rgba(cores.luzFria, 0.5)} 0%, ${rgba(cores.luzFria, 0.28)} 55%, ${rgba(cores.luzFria, 0)} 100%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export const PaginaCelular: React.FC<Local> = ({local}) => {
  const topo = useTopoDaLegenda();
  const c = R.celular;
  return (
    <Papel>
      <Apagar inicio={local(c.apagar)}>
        <LuzDaTela local={local} />
        <HeroEscrito linhas={c.hero.linhas} inicio={local(c.hero.de)} tamanho={c.hero.tamanho} cor={cores.destaque} esquerda={M} topo={c.hero.topo} />
        <Legenda linhas={[c.legenda.texto]} inicio={local(c.legenda.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(c.legenda.topo)} />
      </Apagar>
    </Papel>
  );
};

// ─── 3 · fecho ───
export const PaginaFecho: React.FC<Local> = ({local}) => {
  const {height} = useVideoConfig();
  const {faixa} = usePlataforma();
  const f = R.fecho;
  return (
    <>
      <Papel>
        {f.linhas.map((l, i) => (
          <HeroManuscrito key={l.texto} texto={l.texto} inicio={local(l.de)} tamanho={f.tamanhoLinha} cor={cores.esfero} esquerda={M} base={l.base} semente={`fecho${i}`} />
        ))}
        <HeroEscrito linhas={f.hero.linhas} inicio={local(f.hero.de)} tamanho={f.hero.tamanho} cor={cores.esfero} esquerda={M} topo={f.hero.topo} />
      </Papel>
      {/* só no Instagram; a faixa fica acima da vinheta: é faixa, não papel */}
      {faixa ? <Faixa texto={R.handle} inicio={local(f.faixa)} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null}
    </>
  );
};
