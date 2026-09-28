import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {tempo} from '../theme';
import {HeroManuscrito} from '../components/Hero';

// AS DUAS PILHAS. Uma divisória vertical cresce de cima para baixo e separa a tela ao meio.
// Cada lado tem um título e linhas manuscritas. Com `transbordar`, o lado direito recebe uma
// linha nova a cada `intervalo` frames: a nova entra no alto da pilha e empurra as outras
// uma linha para baixo (por corte), até as de baixo saírem pela borda inferior.
// O lado esquerdo fica com poucas linhas, limpo. `soEsquerda` apaga divisória e lado direito.

type Linha = {texto: string; de: number};

export const Pilhas: React.FC<{
  de: number; // a divisória começa a crescer
  x: number; // posição da divisória
  cor: string;
  espessura?: number;
  margem: number; // começo do texto do lado esquerdo
  afastamento: number; // distância do texto do lado direito até a divisória
  tamanho: number;
  passo: number; // distância entre as linhas de uma pilha
  baseTitulo: number;
  baseLinhas: number;
  esquerda: {titulo: Linha; linhas: readonly Linha[]};
  direita?: {titulo: Linha; linhas: readonly string[]; transbordar?: {de: number; intervalo?: number}};
  soEsquerda?: boolean;
  semente: string;
}> = ({de, x, cor, espessura = 3, margem, afastamento, tamanho, passo, baseTitulo, baseLinhas, esquerda, direita, soEsquerda, semente}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const cresce = interpolate(frame, [de, de + tempo.pilhas.divisor], [0, height], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const xDireita = x + afastamento;

  // lado direito: quantas linhas já entraram, a mais nova no alto
  let direitas: {texto: string; de: number; base: number}[] = [];
  if (direita?.transbordar && !soEsquerda) {
    const t = direita.transbordar;
    const intervalo = t.intervalo ?? tempo.pilhas.intervalo;
    const entraram = frame < t.de ? 0 : Math.min(direita.linhas.length, Math.floor((frame - t.de) / intervalo) + 1);
    direitas = direita.linhas.slice(0, entraram).map((texto, i) => ({
      texto,
      de: t.de + i * intervalo,
      base: baseLinhas + (entraram - 1 - i) * passo,
    }));
  }

  return (
    <>
      {!soEsquerda && frame >= de ? (
        <div style={{position: 'absolute', left: x - espessura / 2, top: 0, width: espessura, height: cresce, backgroundColor: cor}} />
      ) : null}
      <HeroManuscrito texto={esquerda.titulo.texto} inicio={esquerda.titulo.de} tamanho={tamanho} cor={cor} esquerda={margem} base={baseTitulo} semente={`${semente}-e`} />
      {esquerda.linhas.map((l, i) => (
        <HeroManuscrito key={l.texto} texto={l.texto} inicio={l.de} tamanho={tamanho} cor={cor} esquerda={margem} base={baseLinhas + i * passo} semente={`${semente}-e${i}`} />
      ))}
      {direita && !soEsquerda ? (
        <>
          <HeroManuscrito texto={direita.titulo.texto} inicio={direita.titulo.de} tamanho={tamanho} cor={cor} esquerda={xDireita} base={baseTitulo} semente={`${semente}-d`} />
          {direitas
            .filter((l) => l.base - tamanho < height)
            .map((l) => (
              <HeroManuscrito key={l.texto} texto={l.texto} inicio={l.de} tamanho={tamanho} cor={cor} esquerda={xDireita} base={l.base} semente={`${semente}-${l.texto}`} />
            ))}
        </>
      ) : null}
    </>
  );
};
