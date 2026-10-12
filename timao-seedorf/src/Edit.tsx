import React from 'react';
import {AbsoluteFill, Freeze, Sequence, useCurrentFrame} from 'remotion';
import {clipesComFim, edit} from './data/edit';
import {Letterbox} from './fx/Letterbox';
import {parametrosNo} from './fx/parametros';
import {Vazamento} from './fx/Vazamento';
import {Vinheta} from './fx/Vinheta';
import {Audio} from './lib/Audio';
import {Clipe} from './lib/Clipe';
import {Fecho} from './lib/Fecho';
import {Placar} from './lib/Placar';
import {cores} from './theme';

const clipes = clipesComFim();
const ultimo = clipes[clipes.length - 1];

const faltando = clipes.filter((c) => c.faltando).map((c) => c.id);
if (faltando.length) console.warn(`[edit] clipes não recebidos (o espaço fica escuro): ${faltando.join(', ')}`);
const pendentes = edit.cards.filter((c) => c.pendente);
if (pendentes.length) console.warn(`[edit] card sem dados (não aparece): ${pendentes.map((c) => c.rotulo).join(', ')}`);

// Encadeia: os clipes (corte seco), o último quadro congelado sob o fecho, as camadas de
// luz por cima do quadro, os cards, o fecho, o letterbox e o áudio.
export const Edit: React.FC = () => {
  const frame = useCurrentFrame();
  const p = parametrosNo(frame);
  return (
    <AbsoluteFill style={{backgroundColor: cores.barra}}>
      {clipes.map((c) =>
        c.faltando ? null : (
          <Sequence key={`${c.id}-${c.de}`} name={c.id} from={c.de} durationInFrames={c.ate - c.de}>
            <Clipe c={c} />
          </Sequence>
        ),
      )}
      <Sequence name="último quadro" from={edit.fecho.de} durationInFrames={edit.duracao - edit.fecho.de}>
        <Freeze frame={ultimo.ate - ultimo.de - 1}>
          <Clipe c={ultimo} />
        </Freeze>
      </Sequence>
      <Vazamento intensidade={p.vazamento} />
      <Vinheta intensidade={p.vinheta} />
      {edit.cards
        .filter((c) => !c.pendente)
        .map((c) => (
          <Placar key={c.frame} {...c} />
        ))}
      <Sequence name="fecho" from={edit.fecho.de} durationInFrames={edit.duracao - edit.fecho.de}>
        <Fecho />
      </Sequence>
      <Letterbox />
      <Audio />
    </AbsoluteFill>
  );
};
