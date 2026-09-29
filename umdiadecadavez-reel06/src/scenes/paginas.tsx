// Peças do Reel. A página (camada A) vem em blocos; o anel, o vão e o que fica na frente
// do anel são camadas contínuas, por cima dos blocos. Tudo vem de data/.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, grid, tempo} from '../theme';
import {Papel} from '../texture/Papel';
import {Apagar} from '../motion/Apagar';
import {Anel} from '../motion/Anel';
import {Manuscrito} from '../motion/Manuscrito';
import {Multiplicar} from '../motion/Multiplicar';
import {Risco} from '../motion/Risco';
import {estadoNo} from '../motion/trajeto';
import {Vao} from '../motion/Vao';
import {Faixa} from '../components/Faixa';
import {HeroEscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── 0 · no breu ───
export const Breu: React.FC<Local> = ({local}) => {
  const b = R.breu;
  const topo = useTopoDaLegenda();
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
      {b.legendas.map((l) => (
        <Apagar key={l.texto} inicio={local(l.apaga)}>
          <Legenda linhas={[l.texto]} inicio={local(l.de)} tamanho={l.tamanho} cor={cores.papel} esquerda={0} topo={topo(l.topo)} centro />
        </Apagar>
      ))}
    </>
  );
};

// ─── 1 · a página (camada A), com a paralaxe dos três vãos ───
export const Pagina: React.FC<Local> = ({local}) => {
  const frame = useCurrentFrame();
  const topo = useTopoDaLegenda();
  const p = R.pagina;
  const desloca = interpolate(frame, [local(p.paralaxe.de), local(p.paralaxe.ate)], [0, tempo.vao.paralaxePagina], clamp);
  return (
    // a folha é maior que o quadro: ao deslizar 6 px, a borda não aparece
    <AbsoluteFill style={{left: -24, right: -24, transform: `translateX(${desloca}px)`}}>
      <Papel>
        <AbsoluteFill style={{left: 24, right: 24}}>
          <Apagar inicio={local(p.esvazia)}>
            <PalavraGigante
              texto={p.gigante.texto}
              inicio={local(p.gigante.de)}
              ate={local(p.parada.de)} // a deriva termina quando tudo para
              tamanho={p.gigante.tamanho}
              cor={cores.esfero}
              opacidade={p.gigante.opacidade}
              esquerda={p.gigante.esquerda}
              topo={p.gigante.topo}
            />
            <HeroEscrito linhas={p.hero2.linhas} inicio={local(p.hero2.de)} tamanho={p.hero2.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero2.topo} />
            <HeroEscrito linhas={p.hero3.linhas} inicio={local(p.hero3.de)} tamanho={p.hero3.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero3.topo} />
            <Legenda linhas={[p.legenda.texto]} inicio={local(p.legenda.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(p.legenda.topo)} />
          </Apagar>
        </AbsoluteFill>
      </Papel>
    </AbsoluteFill>
  );
};

// Texto manuscrito centrado num ponto, opcionalmente riscado. Vive dentro de um vão.
const TextoNoVao: React.FC<{linhas: readonly string[]; x: number; y: number; de: number; tamanho: number; risco?: number; semente: string}> = ({
  linhas,
  x,
  y,
  de,
  tamanho,
  risco,
  semente,
}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
    {linhas.map((l, i) => (
      <div key={l} style={{position: 'relative', display: 'block', width: 'max-content', margin: '0 auto'}}>
        <Manuscrito texto={l} inicio={de + i * 14} tamanho={tamanho} cor={cores.papel} semente={`${semente}-${i}`} falha />
        {risco === undefined ? null : (
          <Risco inicio={risco} tamanho={tamanho} larguraEstimada={[...l].length * tamanho * 0.42} cor={cores.destaque} semente={`${semente}-risco`} />
        )}
      </div>
    ))}
  </div>
);

// ─── O ANEL, o vão principal e a multiplicação: uma camada contínua sobre a página ───
export const CamadaDoAnel: React.FC = () => {
  const frame = useCurrentFrame();
  const a = R.anel;
  const v = R.vao;
  const m = R.multiplicar;
  // no breu o anel tem a cor do papel: em esfero ele sumiria no escuro
  const cor = frame < R.pagina.virada ? cores.papel : cores.esfero;
  const e = estadoNo(a.trajeto, frame);
  const deslocaVao = (de: number, ate: number) => interpolate(frame, [de, ate], [0, tempo.vao.paralaxeVao], clamp);
  return (
    <AbsoluteFill>
      {frame < a.some ? (
        <Vao e={e} abre={v.abre} fecha={v.fecha} deslocamento={deslocaVao(v.paralaxe.de, v.paralaxe.ate)}>
          {v.linhas.map((l, i) => (
            <TextoNoVao key={l.texto} linhas={[l.texto]} x={e.x} y={e.y + l.dy} de={l.de} tamanho={v.tamanho} risco={l.risco} semente={`vao${i}`} />
          ))}
        </Vao>
      ) : null}
      <Anel trajeto={a.trajeto} cor={cor} desenha={a.desenha} ate={a.some} />
      <Anel trajeto={a.trajeto} cor={cor} de={a.volta} />
      <Multiplicar
        origem={{x: 540, y: 900, raio: 300, traco: 1}}
        destinos={m.destinos}
        raio={m.raio}
        traco={m.traco}
        divide={m.divide}
        espalha={m.espalha}
        volta={m.volta}
        converge={m.converge}
        giro={m.giro}
        cor={cores.esfero}
        deslocamentoVao={deslocaVao(m.paralaxe.de, m.paralaxe.ate)}
        vaos={m.vaos.map((vv, i) => ({
          abre: vv.abre,
          fecha: m.fecham,
          conteudo: (c) => <TextoNoVao linhas={vv.linhas} x={c.x} y={c.y} de={vv.abre + 4} tamanho={m.tamanho} semente={`multi${i}`} />,
        }))}
      />
    </AbsoluteFill>
  );
};

// ─── Na frente do anel: os heros que ficam sobre ele e a faixa ───
export const Frente: React.FC = () => {
  const {height} = useVideoConfig();
  const {faixa} = usePlataforma();
  const f = R.frente;
  return (
    <>
      <Apagar inicio={f.hero4.apaga}>
        <HeroEscrito linhas={f.hero4.linhas} inicio={f.hero4.de} tamanho={f.hero4.tamanho} cor={cores.destaque} esquerda={0} topo={f.hero4.topo} centro />
      </Apagar>
      <HeroEscrito linhas={f.hero5.linhas} inicio={f.hero5.de} tamanho={f.hero5.tamanho} cor={cores.esfero} esquerda={0} topo={f.hero5.topo} centro />
      {/* só no Instagram; a faixa fica acima da vinheta: é faixa, não papel */}
      {faixa ? <Faixa texto={R.handle} inicio={f.faixa} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null}
    </>
  );
};
