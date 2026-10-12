import {interpolate} from 'remotion';
import {edit} from '../data/edit';
import {blocos, transicaoGloria, type BlocoId} from '../theme';

// A intensidade de cada efeito num frame. A troca de bloco acontece no corte; só a
// entrada da glória é gradual, ao longo de `transicaoGloria` frames.

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

export const blocoNo = (frame: number): BlocoId => {
  let id: BlocoId = edit.blocos[0].id;
  for (const b of edit.blocos) if (frame >= b.de) id = b.id;
  return id;
};

export type Parametros = {
  bloco: BlocoId;
  saturacao: number;
  alto: number[]; // rgb
  grao: number;
  vinheta: number;
  halo: number; // 0–1
  vazamento: number; // 0–1 (multiplica a oscilação)
};

export const parametrosNo = (frame: number): Parametros => {
  const id = blocoNo(frame);
  const b = blocos[id];
  if (id !== 'gloria') {
    return {bloco: id, saturacao: b.saturacao, alto: hex(b.alto), grao: b.grao, vinheta: b.vinheta, halo: b.halo ? 1 : 0, vazamento: 0};
  }
  const de = edit.blocos.find((x) => x.id === 'gloria')!.de;
  const t = interpolate(frame, [de, de + transicaoGloria], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const v = blocos.virada;
  const mix = (a: number, c: number) => a + (c - a) * t;
  const [a0, a1] = [hex(v.alto), hex(b.alto)];
  return {
    bloco: id,
    saturacao: mix(v.saturacao, b.saturacao),
    alto: a0.map((x, i) => mix(x, a1[i])),
    grao: mix(v.grao, b.grao),
    vinheta: mix(v.vinheta, b.vinheta),
    halo: 1,
    vazamento: t,
  };
};
