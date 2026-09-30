import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {curvas, fontes, tempo} from '../theme';
import type {Forma} from './formas';
import {Objeto} from './Objeto';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Posicao = {f: number; x: number; y: number; escala: number; opacidade: number};

// A LISTA: objetos empilhados, cada um com o seu número, e um contador no alto.
// A lista inteira se move por quadros-chave (sem mola, na curva do corpo).
// `remover`: um item se destaca, flutua até um destino e cresce; a partir de `ate` quem
// cuida dele é outra peça (a morfose). `vazio`: quando a lista volta, o lugar do item
// removido aparece só em contorno pontilhado por alguns frames, e some.
export const Lista: React.FC<{
  itens: readonly {forma: Forma; rotulo: string; desenha: number}[];
  lado: number;
  intervalo: number;
  posicoes: readonly Posicao[];
  cor: string;
  contador: readonly {de: number; texto: string}[];
  remover?: {indice: number; de: number; ate: number; destino: {x: number; y: number; lado: number}};
  vazio?: {de: number};
}> = ({itens, lado, intervalo, posicoes, cor, contador, remover, vazio}) => {
  const frame = useCurrentFrame();
  const campo = (c: keyof Omit<Posicao, 'f'>, f: number) =>
    posicoes.length === 1
      ? posicoes[0][c]
      : interpolate(f, posicoes.map((p) => p.f), posicoes.map((p) => p[c]), {...clamp, easing: curvas.corpo});
  const g = (f: number) => ({x: campo('x', f), y: campo('y', f), escala: campo('escala', f), opacidade: campo('opacidade', f)});
  const agora = g(frame);
  const passo = (lado + intervalo) * agora.escala;
  const l = lado * agora.escala;
  const rotulo = (texto: string, y: number) => (
    <div
      style={{
        position: 'absolute',
        left: agora.x + l + 28 * agora.escala,
        top: y + l / 2,
        transform: 'translateY(-50%)',
        fontFamily: fontes.hero,
        fontSize: lado * 0.3 * agora.escala,
        lineHeight: 1,
        color: cor,
        opacity: agora.opacidade,
      }}
    >
      {texto}
    </div>
  );
  const cont = [...contador].reverse().find((c) => frame >= c.de);
  return (
    <>
      {cont ? (
        <div
          style={{
            position: 'absolute',
            left: agora.x,
            top: agora.y - lado * 0.42 * agora.escala,
            fontFamily: fontes.hero,
            fontSize: lado * 0.22 * agora.escala,
            lineHeight: 1,
            letterSpacing: '0.08em',
            color: cor,
            opacity: agora.opacidade,
          }}
        >
          {cont.texto}
        </div>
      ) : null}
      {itens.map((it, i) => {
        if (frame < it.desenha) return null;
        const y = agora.y + i * passo;
        if (remover && remover.indice === i && frame >= remover.de) {
          // o item removido: sai do seu lugar e flutua até o destino, crescendo
          if (frame >= remover.ate) {
            if (vazio && frame >= vazio.de && frame < vazio.de + tempo.lista.pontilhado) {
              return <Objeto key={i} forma={it.forma} x={agora.x} y={y} lado={l} cor={cor} inicio={vazio.de} opacidade={agora.opacidade} pontilhado />;
            }
            return null;
          }
          const saida = g(remover.de);
          const t = interpolate(frame, [remover.de, remover.de + tempo.lista.flutua], [0, 1], {...clamp, easing: curvas.corpo});
          const de = {x: saida.x, y: saida.y + i * (lado + intervalo) * saida.escala, lado: lado * saida.escala};
          const d = remover.destino;
          return (
            <Objeto
              key={i}
              forma={it.forma}
              x={de.x + (d.x - de.x) * t}
              y={de.y + (d.y - de.y) * t}
              lado={de.lado + (d.lado - de.lado) * t}
              cor={cor}
              inicio={it.desenha}
              opacidade={saida.opacidade + (1 - saida.opacidade) * t}
            />
          );
        }
        return (
          <React.Fragment key={i}>
            <Objeto forma={it.forma} x={agora.x} y={y} lado={l} cor={cor} inicio={it.desenha} opacidade={agora.opacidade} espessura={tempo.objeto.traco * Math.max(0.5, agora.escala)} />
            {rotulo(it.rotulo, y)}
          </React.Fragment>
        );
      })}
    </>
  );
};
