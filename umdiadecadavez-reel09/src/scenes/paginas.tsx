// Peças do Reel. A página (camada de baixo) vem em blocos; a barra é uma camada contínua
// por cima, do desenho até o canto. Tudo vem de data/.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {R} from '../data';
import {usePlataforma, useTopoDaLegenda} from '../plataforma';
import {cores, curvas, fontes, grid} from '../theme';
import {Papel} from '../texture/Papel';
import {Sangramento} from '../texture/Sangramento';
import {Apagar} from '../motion/Apagar';
import {Barra} from '../motion/Barra';
import {Carimbo} from '../motion/Carimbo';
import {Escrita, duracaoEscrita} from '../motion/Escrita';
import {Risco} from '../motion/Risco';
import {Faixa} from '../components/Faixa';
import {HeroEscrito, HeroManuscrito} from '../components/Hero';
import {Legenda} from '../components/Legenda';
import {PalavraGigante} from '../components/PalavraGigante';

export type Local = {local: (f: number) => number};
const M = grid.margem;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const anton = (tamanho: number, cor: string): React.CSSProperties => ({
  fontFamily: fontes.hero,
  fontWeight: fontes.peso.hero,
  fontSize: tamanho,
  lineHeight: grid.entrelinhaHero,
  textTransform: 'uppercase',
  color: cor,
  whiteSpace: 'nowrap',
});

// "A VIDA" / "NÃO É CURTA", com o risco atravessando só "NÃO É"
const HeroVidaCurta: React.FC<{inicio: number; tamanho: number; topo: number; risco: number}> = ({inicio, tamanho, topo, risco}) => {
  const [a, b, c] = ['A VIDA', 'NÃO É', 'CURTA'];
  const tb = inicio + duracaoEscrita(a);
  const tc = tb + duracaoEscrita(b);
  return (
    <div style={{position: 'absolute', left: M, top: topo}}>
      <Sangramento estilo={anton(tamanho, cores.papel)}>
        <div>
          <Escrita inicio={inicio} duracao={duracaoEscrita(a)}>
            {a}
          </Escrita>
        </div>
        <div style={{display: 'flex', gap: tamanho * 0.22}}>
          <div style={{position: 'relative'}}>
            <Escrita inicio={tb} duracao={duracaoEscrita(b)}>
              {b}
            </Escrita>
            <Risco inicio={risco} tamanho={tamanho} larguraEstimada={tamanho * 2.4} cor={cores.destaque} semente="nao-e" />
          </div>
          <Escrita inicio={tc} duracao={duracaoEscrita(c)}>
            {c}
          </Escrita>
        </div>
      </Sangramento>
    </div>
  );
};

// ─── 0 · no breu ───
export const Breu: React.FC<Local> = ({local}) => {
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
      <HeroVidaCurta inicio={local(b.hero2.de)} tamanho={b.hero2.tamanho} topo={b.hero2.topo} risco={local(b.hero2.risco)} />
      <HeroEscrito linhas={b.hero3.linhas} inicio={local(b.hero3.de)} tamanho={b.hero3.tamanho} cor={cores.destaque} esquerda={M} topo={b.hero3.topo} />
    </>
  );
};

// ─── 1 · a página ───
export const Pagina: React.FC<Local> = ({local}) => {
  const topo = useTopoDaLegenda();
  const p = R.pagina;
  const c = p.carimbo;
  return (
    <Papel>
      <Apagar inicio={local(p.apagar)}>
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
        {p.linhas.map((l, i) => (
          <HeroManuscrito key={l.texto} texto={l.texto} inicio={local(l.de)} tamanho={p.tamanhoLinha} cor={cores.esfero} esquerda={M} base={l.base} semente={`linha${i}`} />
        ))}
        <Carimbo texto={c.texto} x={c.x} y={c.y} raio={c.raio} tamanho={c.tamanho} cor={cores.esfero} inicio={local(c.de)} pulsa={local(c.pulsa)} />
        <Legenda linhas={[p.legenda1.texto]} inicio={local(p.legenda1.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(p.legenda1.topo)} />
      </Apagar>
      <Apagar inicio={local(p.legenda2.apaga)}>
        <Legenda linhas={[p.legenda2.texto]} inicio={local(p.legenda2.de)} tamanho={40} cor={cores.esfero} esquerda={M} topo={topo(p.legenda2.topo)} />
      </Apagar>
      <Apagar inicio={local(p.apagarHerois)}>
        <HeroEscrito linhas={p.hero4.linhas} inicio={local(p.hero4.de)} tamanho={p.hero4.tamanho} cor={cores.esfero} esquerda={M} topo={p.hero4.topo} />
        <HeroEscrito linhas={p.hero5.linhas} inicio={local(p.hero5.de)} tamanho={p.hero5.tamanho} cor={cores.destaque} esquerda={M} topo={p.hero5.topo} />
      </Apagar>
      <HeroEscrito linhas={p.hero6.linhas} inicio={local(p.hero6.de)} tamanho={p.hero6.tamanho} cor={cores.esfero} esquerda={0} topo={p.hero6.topo} centro />
    </Papel>
  );
};

// ─── A barra: uma camada contínua sobre a página ───
export const CamadaDaBarra: React.FC = () => {
  const frame = useCurrentFrame();
  const b = R.barra;
  const ps = b.posicoes;
  const campo = (c: 'x' | 'y' | 'escala' | 'opacidade') => interpolate(frame, ps.map((p) => p.f), ps.map((p) => p[c]), {...clamp, easing: curvas.corpo});
  const [x, y, s] = [campo('x'), campo('y'), campo('escala')];
  // a barra é desenhada no lugar dela e levada inteira (com a hachura) para o canto
  const origem = ps[0];
  return (
    <AbsoluteFill
      style={{
        opacity: campo('opacidade'),
        transformOrigin: `${origem.x}px ${origem.y}px`,
        transform: `translate(${x - origem.x}px, ${y - origem.y}px) scale(${s})`,
      }}
    >
      <Barra x={origem.x} y={origem.y} desenha={b.desenha} rotulo={b.rotulo} marcar={b.marcar} hachura={b.hachura} />
    </AbsoluteFill>
  );
};

// ─── Na frente: a faixa, só no Instagram ───
export const Frente: React.FC = () => {
  const {height} = useVideoConfig();
  const {faixa} = usePlataforma();
  return faixa ? <Faixa texto={R.handle} inicio={R.pagina.faixa} topo={height - R.faixa.altura} altura={R.faixa.altura} tamanho={R.faixa.tamanho} /> : null;
};
