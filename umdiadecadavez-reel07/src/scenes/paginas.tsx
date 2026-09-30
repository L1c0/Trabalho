// Peças do Reel. A página (camada de baixo) vem em blocos; a lista e os objetos são uma
// camada contínua por cima, que atravessa a virada. Tudo vem de data/.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {R, objetos} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, grid} from '../theme';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Lista} from '../motion/Lista';
import {Manuscrito} from '../motion/Manuscrito';
import {Morfose, Objeto} from '../motion/Objeto';
import {Faixa} from '../components/Faixa';
import {HeroEscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;

// ─── 0 · no breu ───
export const Breu: React.FC<Local> = ({local}) => {
  const b = R.breu;
  const {breuNaAbertura} = usePlataforma();
  return (
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
  );
};

// ─── 1 · a página ───
export const Pagina: React.FC<Local> = ({local}) => {
  const topo = useTopoDaLegenda();
  const p = R.pagina;
  return (
    <Papel>
      <Apagar inicio={local(p.legenda1.apaga)}>
        <Legenda linhas={[p.legenda1.texto]} inicio={local(p.legenda1.de)} tamanho={40} cor={cores.esfero} esquerda={0} topo={topo(p.legenda1.topo)} centro />
      </Apagar>
      <Apagar inicio={local(p.esvazia)}>
        <PalavraGigante
          texto={p.gigante.texto}
          inicio={local(p.gigante.de)}
          ate={local(p.esvazia)}
          tamanho={p.gigante.tamanho}
          cor={cores.esfero}
          opacidade={p.gigante.opacidade}
          esquerda={p.gigante.esquerda}
          topo={p.gigante.topo}
        />
        <Legenda linhas={[p.legenda2.texto]} inicio={local(p.legenda2.de)} tamanho={40} cor={cores.esfero} esquerda={0} topo={topo(p.legenda2.topo)} centro />
      </Apagar>
      <Apagar inicio={local(p.apagarHerois)}>
        <HeroEscrito linhas={p.hero2.linhas} inicio={local(p.hero2.de)} tamanho={p.hero2.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero2.topo} />
        <HeroEscrito linhas={p.hero3.linhas} inicio={local(p.hero3.de)} tamanho={p.hero3.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero3.topo} />
      </Apagar>
      <Apagar inicio={local(p.apagarHero4)}>
        <HeroEscrito linhas={p.hero4.linhas} inicio={local(p.hero4.de)} tamanho={p.hero4.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero4.topo} />
      </Apagar>
    </Papel>
  );
};

// ─── A lista, as mãos e a morfose: uma camada contínua sobre a página ───
export const CamadaDosObjetos: React.FC = () => {
  const frame = useCurrentFrame();
  const l = R.lista;
  const p = R.pagina;
  // no breu a caneta é da cor do papel; quando a página termina de entrar, vira esfero
  const cor = frame < p.virada + 6 ? cores.papel : cores.esfero;
  const f = p.final;
  return (
    <AbsoluteFill>
      <Apagar inicio={l.some}>
        <Lista
          itens={l.itens.map((it) => ({forma: objetos[it.objeto], rotulo: it.rotulo, desenha: it.desenha}))}
          lado={l.lado}
          intervalo={l.intervalo}
          posicoes={l.posicoes}
          cor={cor}
          contador={l.contador}
          remover={l.remover}
          vazio={l.vazio}
        />
      </Apagar>
      <Apagar inicio={p.maos.apaga}>
        <Objeto forma={objetos.maos} x={p.maos.x} y={p.maos.y} lado={p.maos.lado} cor={cores.esfero} inicio={p.maos.de} duracao={p.maos.duracao} />
      </Apagar>
      {/* a tigela vira mãos em concha; nada mais se move */}
      {frame >= p.morfose.de ? (
        <Apagar inicio={p.morfose.apaga}>
          <Morfose de={objetos.tigelaTraco} para={objetos.maosTraco} x={p.morfose.x} y={p.morfose.y} lado={p.morfose.lado} cor={cores.esfero} inicio={p.morfose.de} />
        </Apagar>
      ) : null}
      <Objeto forma={objetos.maos} x={f.maos.x} y={f.maos.y} lado={f.maos.lado} cor={cores.esfero} inicio={f.maos.de} duracao={f.maos.duracao} />
      {frame >= f.manuscrito.de ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: f.manuscrito.base - f.manuscrito.tamanho, display: 'flex', justifyContent: 'center'}}>
          <Manuscrito texto={f.manuscrito.texto} inicio={f.manuscrito.de} tamanho={f.manuscrito.tamanho} cor={cores.esfero} semente="final" falha />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── Na frente: a faixa, só no Instagram ───
export const Frente: React.FC = () => {
  const {height} = useVideoConfig();
  const {faixa} = usePlataforma();
  return faixa ? <Faixa texto={R.handle} inicio={R.pagina.faixa} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null;
};
