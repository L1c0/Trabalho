import {tempo} from '../theme';

// A inclinação da balança ao longo do tempo, a partir de uma lista de eventos:
//   {f, alvo, duracao}   vai até o alvo e, ao chegar, passa dele e volta (seno amortecido)
//   {f, balanco}         oscila de leve em torno do valor atual, sem assentar
// Escrita à mão, sem spring: o travessão acelera como peso caindo (ease-in) e chega com
// velocidade; a oscilação começa com essa mesma velocidade, então não há quina no gráfico.
export type EventoDeInclinacao =
  | {f: number; alvo: number; duracao: number}
  | {f: number; balanco: {amplitude: number; periodo: number}};

const {periodo, passagens} = tempo.oscilacao;

const trecho = (e: EventoDeInclinacao, de: number, t: number) => {
  if ('balanco' in e) return de + e.balanco.amplitude * Math.sin((2 * Math.PI * t) / e.balanco.periodo);
  const delta = e.alvo - de;
  if (e.duracao > 0 && t < e.duracao) {
    const u = t / e.duracao;
    return de + delta * u * u;
  }
  const u = t - e.duracao;
  if (e.duracao === 0 || u >= passagens * periodo) return e.alvo;
  // velocidade de chegada do ease-in = 2Δ/D; a do seno no início = A·ω → A = Δ·P/(π·D)
  const amplitude = (delta * periodo) / (Math.PI * e.duracao);
  const cai = 0.5 ** (u / (periodo / 2)); // metade a cada passagem pelo alvo
  return e.alvo + amplitude * cai * Math.sin((2 * Math.PI * u) / periodo);
};

export const inclinacaoNo = (eventos: readonly EventoDeInclinacao[], frame: number) => {
  let valor = 0;
  for (let i = 0; i < eventos.length; i++) {
    const e = eventos[i];
    if (frame < e.f) break;
    const proximo = eventos[i + 1];
    const de = valor;
    // o valor no início do próximo trecho é o deste trecho naquele frame
    const fim = proximo && frame >= proximo.f ? proximo.f : frame;
    valor = trecho(e, de, fim - e.f);
  }
  return valor;
};
