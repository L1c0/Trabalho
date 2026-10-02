// Peças do Reel. A página (camada de baixo) vem em blocos; a balança é uma camada contínua
// por cima, que atravessa a página do desenho até o reequilíbrio. Tudo vem de data/.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, curvas, grid} from '../theme';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Balanca} from '../motion/Balanca';
import {inclinacaoNo} from '../motion/oscilacao';
import {Faixa} from '../components/Faixa';
import {HeroEscrito, HeroManuscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';
import {duracaoEscrita} from '../motion/Escrita';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── 0 · no breu ───
export const Breu: React.FC<Local> = ({local}) => {
  const b = R.breu;
  const topo = useTopoDaLegenda();
  const {breuNaAbertura} = usePlataforma();
  const [l1, l2] = b.hero2.linhas;
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
      <Apagar inicio={local(b.apagarLegendas)}>
        {b.legendas.map((l) => (
          <Legenda key={l.texto} linhas={[l.texto]} inicio={local(l.de)} tamanho={40} cor={cores.papel} esquerda={M} topo={topo(l.topo)} />
        ))}
      </Apagar>
      <HeroEscrito linhas={[l1]} inicio={local(b.hero2.de)} tamanho={b.hero2.tamanho} cor={cores.papel} esquerda={M} topo={b.hero2.topo} />
      <HeroEscrito
        linhas={[l2]}
        inicio={local(b.hero2.de + duracaoEscrita(l1))}
        tamanho={b.hero2.tamanho}
        cor={cores.papel}
        esquerda={M}
        topo={b.hero2.topo + b.hero2.tamanho * grid.entrelinhaHero}
        risco={local(b.hero2.risco)}
        corRisco={cores.destaque}
      />
      <HeroEscrito linhas={b.hero3.linhas} inicio={local(b.hero3.de)} tamanho={b.hero3.tamanho} cor={cores.destaque} esquerda={M} topo={b.hero3.topo} />
    </>
  );
};

// ─── 1 · a página ───
export const Pagina: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const topo = useTopoDaLegenda();
  const p = R.pagina;
  const recuo = interpolate(frame, [local(p.recuo.de), local(p.recuo.de) + p.recuo.duracao], [1, p.recuo.opacidade], clamp);
  return (
    <Papel>
      <Apagar inicio={local(p.gigante.ate)}>
        <PalavraGigante
          texto={p.gigante.texto}
          inicio={local(p.gigante.de)}
          ate={local(p.gigante.ate)}
          tamanho={p.gigante.tamanho}
          cor={cores.esfero}
          opacidade={p.gigante.opacidade}
          esquerda={p.gigante.esquerda}
          topo={p.gigante.topo}
        />
      </Apagar>
      <Apagar inicio={local(p.linhas[0].de)}>
        <Legenda linhas={[p.legenda.texto]} inicio={local(p.legenda.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(p.legenda.topo)} />
      </Apagar>
      <Apagar inicio={local(p.apagar)}>
        <AbsoluteFill style={{opacity: recuo}}>
          {p.linhas.map((l, i) => (
            <HeroManuscrito key={l.texto} texto={l.texto} inicio={local(l.de)} tamanho={p.tamanhoLinha} cor={cores.esfero} esquerda={M} base={l.base} semente={`linha${i}`} />
          ))}
        </AbsoluteFill>
        <HeroEscrito linhas={p.hero4.linhas} inicio={local(p.hero4.de)} duracao={p.hero4.duracao} tamanho={p.hero4.tamanho} cor={cores.esfero} esquerda={0} topo={p.hero4.topo} centro />
      </Apagar>
      <HeroEscrito linhas={p.hero5.linhas} inicio={local(p.hero5.de)} tamanho={p.hero5.tamanho} cor={cores.esfero} esquerda={0} topo={p.hero5.topo} centro />
    </Papel>
  );
};

// ─── A balança: uma camada contínua sobre a página ───
export const CamadaDaBalanca: React.FC = () => {
  const frame = useCurrentFrame();
  const b = R.balanca;
  const ps = b.posicoes;
  const campo = (c: 'x' | 'y' | 'escala' | 'opacidade') =>
    interpolate(
      frame,
      ps.map((p) => p.f),
      ps.map((p) => p[c]),
      {...clamp, easing: curvas.corpo},
    );
  return (
    <AbsoluteFill style={{opacity: campo('opacidade')}}>
      <Balanca
        x={campo('x')}
        y={campo('y')}
        escala={campo('escala')}
        inclinacao={inclinacaoNo(b.inclinacao, frame)}
        desenha={b.desenha}
        cor={cores.esfero}
        esquerda={b.esquerda}
        direita={b.direita}
      />
    </AbsoluteFill>
  );
};

// ─── Na frente: a faixa, só no Instagram ───
export const Frente: React.FC = () => {
  const {height} = useVideoConfig();
  const {faixa} = usePlataforma();
  return faixa ? <Faixa texto={R.handle} inicio={R.pagina.faixa} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null;
};
