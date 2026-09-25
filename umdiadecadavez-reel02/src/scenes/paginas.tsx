// Peças de página compartilhadas entre blocos consecutivos.
// Tudo vem de data/; frames absolutos são convertidos para o frame local do bloco.
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {reel02 as R} from '../data/reel02';
import {cores, fontes, grid, tempo, textura} from '../theme';
import {rgba} from '../texture/Dobra';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Crescer} from '../motion/Crescer';
import {Manuscrito, TracoPiscando, fimManuscrito} from '../motion/Manuscrito';
import {Faixa} from '../components/Faixa';
import {HeroDuplo, HeroEscrito, HeroManuscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── no breu ───
export const NoBreuTexto: React.FC<Local> = ({local}) => {
  const c = R.noBreu;
  return (
    <>
      <Legenda linhas={[c.legenda.texto]} inicio={local(c.legenda.de)} tamanho={c.legenda.tamanho} cor={cores.papel} esquerda={M} topo={c.legenda.topo} />
      <HeroEscrito linhas={[c.hero.texto]} inicio={local(c.hero.de)} duracao={c.hero.duracao} tamanho={c.hero.tamanho} cor={cores.papel} esquerda={M} topo={c.hero.topo} />
    </>
  );
};

export const AntesDeTexto: React.FC<Local> = ({local}) => {
  const c = R.antesDe;
  return (
    <>
      <HeroEscrito linhas={[c.antes.texto]} inicio={local(c.antes.de)} tamanho={c.antes.tamanho} cor={cores.papel} esquerda={M} topo={c.antes.topo} />
      <HeroEscrito linhas={[c.hero.texto]} inicio={local(c.hero.de)} duracao={c.hero.duracao} tamanho={c.hero.tamanho} cor={cores.destaque} esquerda={M} topo={c.hero.topo} />
    </>
  );
};

// ─── o celular ───
export const LuzDoCelular: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const l = R.celular.luz;
  if (frame < local(l.de)) return null;
  const liga = interpolate(frame, [local(l.de), local(l.de) + tempo.luz.entrada], [0, 1], clamp);
  return (
    <Apagar inicio={local(l.apaga)}>
      <div
        style={{
          position: 'absolute',
          left: l.x,
          top: l.y,
          width: l.largura,
          height: l.altura,
          opacity: liga,
          background: `radial-gradient(ellipse at 50% 42%, ${rgba(cores.luzFria, 0.2)} 0%, ${rgba(cores.luzFria, 0.09)} 55%, ${rgba(cores.luzFria, 0)} 100%)`,
        }}
      />
    </Apagar>
  );
};

export const PalavrasDoCelular: React.FC<Local> = ({local}) => {
  const c = R.celular;
  return (
    <>
      {c.palavras.map((p, i) => {
        const proxima = c.palavras[i + 1];
        const some = proxima ? proxima.de - tempo.apagar.duracao : c.luz.apaga;
        return (
          <Apagar key={p.texto} inicio={local(some)}>
            <HeroEscrito linhas={[p.texto]} inicio={local(p.de)} tamanho={c.tamanho} cor={cores.papel} esquerda={c.esquerda} topo={c.topo} />
          </Apagar>
        );
      })}
    </>
  );
};

// ─── Sêneca ───
export const PaginaSeneca: React.FC<Local> = ({local}) => {
  const c = R.seneca;
  return (
    <Papel>
      <PalavraGigante
        texto={c.gigante.texto}
        inicio={local(c.gigante.de)}
        ate={local(c.gigante.ate)}
        tamanho={c.gigante.tamanho}
        cor={cores.esfero}
        opacidade={c.gigante.opacidade}
        esquerda={c.gigante.esquerda}
        topo={c.gigante.topo}
      />
      <HeroEscrito linhas={[c.hero.texto]} inicio={local(c.hero.de)} duracao={c.hero.duracao} tamanho={c.hero.tamanho} cor={cores.esfero} esquerda={M} topo={c.hero.topo} />
      <Legenda linhas={c.citacao.linhas} inicio={local(c.citacao.de)} tamanho={c.citacao.tamanho} cor={cores.esfero} esquerda={M} topo={c.citacao.topo} />
    </Papel>
  );
};

// ─── o caderno: medo, sem nome, escreve ───
const usePautaDoCaderno = (local: (f: number) => number) => {
  const frame = useCurrentFrame();
  const t = local(R.escreve.pautaFoco);
  return interpolate(frame, [t, t + tempo.pautaFoco], [textura.pauta.opacidade, textura.pauta.foco], clamp);
};

const ConteudoDoCaderno: React.FC<Local> = ({local}) => {
  const m = R.medo;
  const s = R.semNome;
  const e = R.escreve;
  return (
    <>
      <Legenda linhas={[m.frase.texto]} inicio={local(m.frase.de)} tamanho={m.frase.tamanho} cor={cores.esfero} esquerda={M} topo={m.frase.topo} peso={fontes.peso.legendaForte} />
      <HeroDuplo linhas={m.hero.linhas} fraca={local(m.hero.fraca)} cheia={local(m.hero.cheia)} duracao={m.hero.duracao} tamanho={m.hero.tamanho} esquerda={M} topo={m.hero.topo} />
      <HeroManuscrito texto={s.hero.texto} inicio={local(s.hero.de)} tamanho={s.hero.tamanho} cor={cores.esfero} esquerda={M} base={s.hero.base} risco={local(s.risco)} semente="semnome" />
      {e.linhas.map((linha, i) => {
        const base = e.primeiraBase + i * textura.pauta.passo;
        const fim = fimManuscrito(linha.texto, local(linha.de), `linha${i}`);
        return (
          <div key={i} style={{position: 'absolute', left: M, top: base - e.tamanho}}>
            <Manuscrito
              texto={linha.texto}
              inicio={local(linha.de)}
              tamanho={e.tamanho}
              cor={cores.esfero}
              semente={`linha${i}`}
              falha
              depois={'incompleta' in linha ? <TracoPiscando desde={fim} largura={e.tamanho * 2.6} cor={cores.esfero} semente={`traco${i}`} /> : null}
            />
          </div>
        );
      })}
    </>
  );
};

export const PaginaCaderno: React.FC<Local> = ({local}) => (
  <Papel pauta={usePautaDoCaderno(local)}>
    <ConteudoDoCaderno local={local} />
  </Papel>
);

// ─── tem tamanho ───
export const PaginaTamanho: React.FC<Local> = ({local}) => {
  const {height} = useVideoConfig();
  const t = R.tamanho;
  return (
    <>
      <Papel pauta={usePautaDoCaderno(local)}>
        <Apagar inicio={local(t.apagarCaderno)}>
          <ConteudoDoCaderno local={local} />
        </Apagar>
        <Crescer
          inicio={local(t.crescer.de)}
          corpoInicial={t.crescer.corpoInicial}
          corpoFinal={t.crescer.corpoFinal}
          esquerda={M}
          base={t.crescer.base}
          estilo={{fontFamily: fontes.hero, color: cores.esfero}}
          depois={
            <div style={{marginLeft: t.limite.afastamento, marginBottom: t.limite.acimaDaBase}}>
              <Legenda linhas={t.limite.linhas} inicio={local(t.limite.de)} tamanho={t.limite.tamanho} cor={cores.esfero} esquerda={0} topo={0} peso={fontes.peso.legendaForte} noFluxo />
            </div>
          }
        >
          {t.crescer.texto}
        </Crescer>
      </Papel>
      {/* a faixa fica acima da vinheta: é faixa, não papel */}
      <Faixa texto={R.handle} inicio={local(t.faixa)} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} />
    </>
  );
};
