// O único ponto que sabe qual vídeo está montado.
import {corDoBloco} from '../theme';
import {video01 as V} from './video01';

export {V};
export type {Bloco, Efeito, Estado, Segmento} from './video01';

export type BlocoId = (typeof V.blocos)[number]['id'];

export const blocoNoFrame = (frame: number) => V.blocos.find((b) => frame >= b.de && frame < b.ate) ?? V.blocos[V.blocos.length - 1];
export const corNoFrame = (frame: number) => corDoBloco[blocoNoFrame(frame).cor];
export const inicioDoBloco = (id: BlocoId) => V.blocos.find((b) => b.id === id)?.de ?? 0;
