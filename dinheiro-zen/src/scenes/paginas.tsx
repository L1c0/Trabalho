// Peças de página compartilhadas entre blocos consecutivos.
// Tudo usa frames absolutos do roteiro convertidos para o frame local do bloco.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {cues, heros, letras, textosFixos} from '../data/roteiro';
import {cores, corpoFixo, curvas, escala, fontes, motion, proporcoes, useLayout} from '../theme';
import {Contador} from '../motion/Contador';
import {Enso} from '../motion/Enso';
import {Hanko, Losango} from '../motion/Hanko';
import {Kakijun, duracaoKakijun} from '../motion/Kakijun';
import {TracoDePincel} from '../motion/Pincel';
import {Risco} from '../motion/Risco';
import {Absorcao} from '../components/Absorcao';
import {Escrita, EscritaFalada, EscritaVertical, mascaraDeEscrita, useEscrita} from '../components/Escrita';
import {Pauta, type Linha} from '../components/Pauta';
import {Ruby} from '../components/Ruby';
import {TateColumn} from '../components/TateColumn';

type Local = {local: (f: number) => number};

const estiloHero = (tamanho: number): React.CSSProperties => ({
  fontFamily: fontes.display,
  fontWeight: fontes.peso.hero,
  fontSize: tamanho,
  lineHeight: proporcoes.entrelinhaHero,
  letterSpacing: proporcoes.espacoCaixaAlta,
  textTransform: 'uppercase',
  color: cores.sumi,
});

// ─── Página do MA ───
export const Trelica: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const {verticais, topo, base, esq, dir} = L.trelica;
  const linhas: Linha[] = [
    {x1: dir, y1: topo, x2: esq, y2: topo},
    ...verticais.map((x) => ({x1: x, y1: topo, x2: x, y2: base})),
    {x1: dir, y1: base, x2: esq, y2: base},
  ];
  return <Pauta linhas={linhas} inicio={local(cues.trelica)} espessura={L.px(motion.pauta.espessura)} />;
};

export const HeroUmaPalavraJaponesa: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const h = heros.umaPalavraJaponesa;
  return (
    <Absorcao inicio={local(h.absorve)}>
      <EscritaFalada linhas={h.linhas} local={local} direita={L.hero1.direita} topo={L.hero1.topo} estilo={estiloHero(L.tipo.hero)} />
    </Absorcao>
  );
};

export const KanjiMa: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const c = L.ma;
  return (
    <>
      <TateColumn cx={c.kanji.cx} topo={c.kanji.topo} tamanho={c.kanji.tamanho}>
        <Kakijun kanji={heros.ma.kanji} tamanho={c.kanji.tamanho} inicio={local(heros.ma.kakijun)} ritmo={motion.kakijun.ma} cor={cores.sumi} />
      </TateColumn>
      <Ruby texto={heros.ma.ruby.texto} x={c.ruby.x} topo={c.ruby.topo} inicio={local(heros.ma.ruby.de)} tamanho={corpoFixo.ruby} />
    </>
  );
};

export const HeroAPausa: React.FC<Local> = ({local}) => {
  const L = useLayout();
  return (
    <EscritaFalada
      linhas={heros.aPausa.linhas}
      local={local}
      direita={L.ma.aPausa.direita}
      topo={L.ma.aPausa.topo}
      estilo={estiloHero(L.tipo.heroPausa)}
    />
  );
};

// ─── Página do intervalo: 欲 | 3·2·1 | 買 ───
const LinhaIntervalo: React.FC<{inicio: number}> = ({inicio}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const c = L.intervalo.linha;
  const perfil = {
    ...motion.pincel,
    inicio: L.px(motion.intervalo.inicio),
    fim: L.px(motion.intervalo.fim),
    amostra: L.px(motion.pincel.amostra * 4),
  };
  const d = motion.intervalo.duracao;
  const trecho = (t0: number) =>
    interpolate(frame, [t0, t0 + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: curvas.pincel});
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      <TracoDePincel d={`M${c.x},${c.cima[0]} L${c.x},${c.cima[1]}`} progresso={trecho(inicio)} perfil={perfil} cor={cores.ai} />
      <TracoDePincel d={`M${c.x},${c.baixo[0]} L${c.x},${c.baixo[1]}`} progresso={trecho(inicio + d)} perfil={perfil} cor={cores.ai} />
    </svg>
  );
};

export const PaginaIntervalo: React.FC<Local & {linhaAte?: number}> = ({local, linhaAte}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const c = L.intervalo;
  const h = heros.tresDoisUm;
  const kanji: React.CSSProperties = {
    fontFamily: fontes.display,
    fontWeight: fontes.peso.hero,
    fontSize: c.tamanho,
    lineHeight: 1,
    color: cores.sumi,
  };
  const largura = motion.contador.larguraDigito * c.digito.tamanho;
  const linhaOpacidade =
    linhaAte === undefined
      ? 1
      : interpolate(frame, [local(cues.nijimi), linhaAte], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: linhaOpacidade}}>
        <LinhaIntervalo inicio={local(cues.intervalo)} />
      </AbsoluteFill>
      <Absorcao inicio={local(cues.intervaloAbsorve)}>
        <TateColumn cx={c.querer.cx} topo={c.topo} tamanho={c.tamanho}>
          <EscritaVertical inicio={local(cues.formas)} estilo={kanji}>
            {textosFixos.formas.querer}
          </EscritaVertical>
        </TateColumn>
        <TateColumn cx={c.comprar.cx} topo={c.topo} tamanho={c.tamanho}>
          <EscritaVertical inicio={local(cues.formas)} estilo={kanji}>
            {textosFixos.formas.comprar}
          </EscritaVertical>
        </TateColumn>
        <Contador
          valores={h.valores}
          inicio={local(h.falado.de)}
          passo={h.passo}
          estilo={{
            position: 'absolute',
            left: c.digito.cx - largura / 2,
            width: largura,
            top: c.digito.meio - c.digito.tamanho / 2,
            textAlign: 'center',
            fontFamily: fontes.display,
            fontWeight: fontes.peso.corpo,
            fontSize: c.digito.tamanho,
            lineHeight: 1,
            color: cores.ai,
          }}
        />
      </Absorcao>
    </AbsoluteFill>
  );
};

// ─── Página do 1904 ───
export const PaginaAno: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const c = L.ano;
  const h = heros.ano;
  return (
    <Absorcao inicio={local(cues.anoAbsorve)}>
      <Contador
        valores={h.valores}
        inicio={local(h.falado.de)}
        passo={h.passo}
        estilo={{
          position: 'absolute',
          left: 0,
          width: c.direita,
          top: c.topo,
          textAlign: 'right',
          fontFamily: fontes.display,
          fontWeight: fontes.peso.corpo,
          fontSize: c.tamanho,
          lineHeight: 1,
          color: cores.sumi,
        }}
      />
      <Enso cx={c.enso.cx} cy={c.enso.cy} raio={c.enso.raio} inicio={local(cues.enso)} cor={cores.sumi} escala={L.k} />
    </Absorcao>
  );
};

// ─── Página do caderno ───
const Pergunta: React.FC<{texto: string; inicio: number; direita: number; topo: number}> = ({texto, inicio, direita, topo}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const p = useEscrita(inicio, [...texto].length * motion.escrita.quadrosPorLetra);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: direita,
        top: topo,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: L.px(motion.losango.afastamento),
        fontFamily: fontes.display,
        fontWeight: fontes.peso.corpo,
        fontSize: L.tipo.pergunta,
        lineHeight: proporcoes.entrelinha,
        color: cores.sumi,
      }}
    >
      <Losango lado={L.px(escala.losango)} inicio={inicio - motion.losango.antecedencia} />
      <span style={{whiteSpace: 'nowrap', visibility: frame >= inicio ? 'visible' : 'hidden', ...mascaraDeEscrita('rtl', p)}}>
        {texto}
      </span>
    </div>
  );
};

export const PaginaCaderno: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const c = L.caderno;
  const linhas: Linha[] = c.linhas.map((y) => ({x1: c.dir, y1: y, x2: c.esq, y2: y}));
  const t = (x: {de: number; ate: number}) => ({de: local(x.de), ate: local(x.ate)});
  return (
    <AbsoluteFill>
      <Pauta linhas={linhas} inicio={local(cues.pautaCaderno)} espessura={L.px(motion.pauta.espessura)} />
      <Risco
        riscada={letras.riscada.texto}
        nova={letras.nova.texto}
        entrada={t(letras.riscada)}
        risco={local(cues.risco)}
        novaTempo={t(letras.nova)}
        tamanho={c.letra.tamanho}
        corTexto={cores.sumi}
        corRisco={cores.shu}
        direita={c.letra.direita}
        topo={c.letra.topo}
        estilo={{...estiloHero(c.letra.tamanho), fontWeight: fontes.peso.corpo}}
      />
      {textosFixos.perguntas.map((texto, i) => (
        <Pergunta key={texto} texto={texto} inicio={local(cues.perguntas[i])} direita={c.direita} topo={c.perguntas[i].topo} />
      ))}
    </AbsoluteFill>
  );
};

// ─── Página do 家計簿 ───
export const KanjiKakeibo: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const c = L.kakeibo;
  const h = heros.kakeibo;
  const ritmo = motion.kakijun.kakeibo;
  let inicio = local(h.kakijun);
  const celulas = h.kanji.map((kanji, i) => {
    const celula = {kanji, ...c.kanji[i], inicio};
    inicio += duracaoKakijun(kanji, ritmo);
    return celula;
  });
  return (
    <Absorcao inicio={local(cues.kakeiboAbsorve)}>
      {celulas.map((k) => (
        <TateColumn key={k.kanji} cx={k.cx} topo={k.topo} tamanho={k.tamanho}>
          <Kakijun kanji={k.kanji} tamanho={k.tamanho} inicio={k.inicio} ritmo={ritmo} cor={cores.sumi} />
        </TateColumn>
      ))}
      <Ruby texto={h.ruby.texto} x={c.ruby.x} topo={c.ruby.topo} inicio={local(h.ruby.de)} tamanho={corpoFixo.ruby} />
    </Absorcao>
  );
};

// ─── Página final ───
export const PaginaZen: React.FC<Local> = ({local}) => {
  const L = useLayout();
  const c = L.zen;
  return (
    <AbsoluteFill>
      <Hanko kanji={textosFixos.hanko} tamanho={c.hanko.tamanho} inicio={local(cues.hanko)} direita={c.hanko.direita} topo={c.hanko.topo} />
      <Escrita
        linhas={textosFixos.titulo}
        inicio={local(cues.titulo)}
        direita={c.titulo.direita}
        topo={c.titulo.topo}
        estilo={{fontFamily: fontes.display, fontWeight: fontes.peso.hero, fontSize: L.tipo.titulo, lineHeight: proporcoes.entrelinhaHero, color: cores.sumi}}
      />
      <Escrita
        linhas={textosFixos.subtitulo}
        inicio={local(cues.subtitulo)}
        direita={c.subtitulo.direita}
        topo={c.subtitulo.topo}
        estilo={{fontFamily: fontes.display, fontWeight: fontes.peso.corpo, fontSize: L.tipo.subtitulo, lineHeight: proporcoes.entrelinha, color: cores.ai}}
      />
      <Escrita
        linhas={textosFixos.aviso}
        inicio={local(cues.aviso)}
        direita={c.aviso.direita}
        topo={c.aviso.topo}
        estilo={{fontFamily: fontes.apoio, fontWeight: fontes.peso.legenda, fontSize: corpoFixo.aviso, lineHeight: proporcoes.entrelinha, color: cores.rikyu}}
      />
    </AbsoluteFill>
  );
};
