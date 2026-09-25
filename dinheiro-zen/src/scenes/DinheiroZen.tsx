import React from 'react';
import {AbsoluteFill} from 'remotion';
import {textos} from '../data/textos';
import {cores, fontes, local, motion, proporcoes, tempo, useLayout} from '../theme';
import {Hanko} from '../motion/Hanko';
import {Escrita} from '../components/Escrita';

// 1000–1200 · DINHEIRO ZEN
export const DinheiroZen: React.FC = () => {
  const L = useLayout();
  const c = L.dinheiroZen;
  const q = (f: number) => local('dinheiroZen', f);
  const T = tempo.dinheiroZen;
  const t = textos.dinheiroZen;
  return (
    <AbsoluteFill>
      <Hanko kanji={t.hanko} tamanho={c.hanko.tamanho} inicio={q(T.hanko)} direita={c.hanko.direita} topo={c.hanko.topo} />
      <Escrita
        linhas={t.titulo}
        inicio={q(T.titulo)}
        direita={c.titulo.direita}
        topo={c.titulo.topo}
        estilo={{
          fontFamily: fontes.display,
          fontWeight: fontes.peso.titulo,
          fontSize: L.tipo.titulo,
          lineHeight: proporcoes.entrelinhaTitulo,
          color: cores.sumi,
        }}
      />
      {t.subtitulo && t.subtitulo.length > 0 ? (
        <Escrita
          linhas={t.subtitulo}
          inicio={q(T.subtitulo)}
          direita={c.subtitulo.direita}
          topo={c.subtitulo.topo}
          estilo={{
            fontFamily: fontes.display,
            fontWeight: fontes.peso.corpo,
            fontSize: L.tipo.subtitulo,
            lineHeight: proporcoes.entrelinha,
            color: cores.ai,
          }}
        />
      ) : null}
      {t.aviso && t.aviso.length > 0 ? (
        <Escrita
          linhas={t.aviso}
          inicio={q(T.aviso)}
          direita={c.aviso.direita}
          topo={c.aviso.topo}
          quadrosPorLetra={motion.escrita.quadrosPorLetraAviso}
          estilo={{
            fontFamily: fontes.apoio,
            fontWeight: fontes.peso.apoio,
            fontSize: L.tipo.aviso,
            lineHeight: proporcoes.entrelinha,
            color: cores.rikyu,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
