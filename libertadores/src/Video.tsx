import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Cena, DadosVideo} from './data/tipos';
import {Broll} from './lib/Broll';
import {Campo} from './lib/Campo';
import {Cartela} from './lib/Cartela';
import {Cartoes, Rotulos} from './lib/Avisos';
import {Confronto} from './lib/Confronto';
import {Fecho} from './lib/Fecho';
import {Ficha} from './lib/Ficha';
import {FormatoProvider} from './lib/formato';
import {Grao} from './lib/Grao';
import {Trilha} from './lib/Trilha';
import {formatos, paleta} from './theme';

// O VÍDEO: recebe o data e encadeia as cenas em corte seco. Trocar de vídeo = trocar o data.
const cena = (c: Cena) => {
  switch (c.tipo) {
    case 'campo':
    case 'duelo':
      return <Campo cena={c} />;
    case 'cartela':
      return <Cartela titulo={c.titulo} sub={c.sub} />;
    case 'broll':
      return <Broll arquivo={c.arquivo} taxa={c.taxa} faltando={c.faltando} />;
    case 'confronto':
      return <Confronto casa={c.casa} fora={c.fora} rotulo={c.rotulo} />;
    case 'ficha':
      return <Ficha time={c.time} atributos={c.atributos} inicio={c.frame} />;
    case 'cartoes':
      return <Cartoes itens={c.itens} intervalo={c.intervalo} inicio={c.frame} />;
    case 'rotulos':
      return <Rotulos itens={c.itens} inicio={c.frame} />;
    case 'fecho':
      return <Fecho />;
  }
};

export const Video: React.FC<{dados: DadosVideo; vertical: boolean}> = ({dados, vertical}) => (
  <FormatoProvider formato={vertical ? formatos.vertical : formatos.horizontal}>
    <AbsoluteFill style={{backgroundColor: paleta.fundo}}>
      {dados.cenas.map((c, i) => {
        const fim = dados.cenas[i + 1]?.frame ?? dados.duracao;
        return (
          <Sequence key={`${c.tipo}-${c.frame}`} from={c.frame} durationInFrames={fim - c.frame} name={`${c.frame} ${c.tipo}`}>
            {cena(c)}
          </Sequence>
        );
      })}
      <Grao />
      <Trilha dados={dados} />
    </AbsoluteFill>
  </FormatoProvider>
);
