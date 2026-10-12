import {aberracao} from './Aberracao';
import {blurDirecional} from './BlurDirecional';
import {duotone} from './Duotone';
import {grao} from './Grao';
import {halo} from './Halo';
import type {Parametros} from './parametros';
import {brilho} from './Pulso';

// A pilha de efeitos de pixel, na ordem do brief:
//   duotone → (halação → desfoque de velocidade) → aberração → flicker/pulso → grão
// A vinheta, o vazamento e o letterbox vêm depois, como camadas por cima do quadro.
export type Passada = {
  frame: number;
  p: Parametros;
  borrao: number; // 0–1, já na proporção do movimento (0 se o clipe não está em câmera lenta)
  brilho: number; // flicker × pulso
};

export const aplicarPilha = (img: ImageData, s: Passada) => {
  const {data: px, width: w, height: h} = img;
  duotone(px, s.p.saturacao, s.p.alto);
  halo(px, w, h, s.p.halo);
  blurDirecional(px, w, h, s.borrao);
  aberracao(px, w, h);
  brilho(px, s.brilho);
  grao(px, s.frame, s.p.grao);
};
