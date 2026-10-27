import chapas from '../data/chapas.json';

/**
 * Os timeline.json do pacote (src/data/timeline/) são a fonte da verdade de
 * cada Short: cada camada, a posição, o frame em que entra, o frame em que
 * sai e o efeito. Aqui só se lê e se interpola; nenhuma marca de frame é
 * decidida no código.
 */
export type Camada = {
  arquivo: string;
  ancora: 'quadro' | 'centro';
  x?: number;
  y?: number;
  entra: number;
  sai: number;
  tinta?: number;
  papel?: string;
  efeito?: 'batida' | 'assentar' | 'corte' | 'desregistro' | 'descolar';
  batida_frames?: number;
  tremida_px?: number;
  escala_de?: number;
  de_x?: number;
  de_y?: number;
  assentar_frames?: number;
  solavanco_px?: number;
  dx?: number;
  dy?: number;
  frames?: number;
  mascara?: string;
  descolar_de?: number;
  descolar_frames?: number;
  sobe_px?: number;
};

export type Ponto = { frame: number } & Record<string, number>;

/** a camada está no quadro de `entra` até o frame antes de `sai` */
export const ativa = (c: Camada, f: number) => f >= c.entra && f < c.sai;

/** uma curva de pontos {frame, chave} no frame f: linear entre os pontos, parada fora deles */
export const curva = (pts: Ponto[], chave: string, f: number) => {
  if (f <= pts[0].frame) return pts[0][chave];
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1];
    const b = pts[k];
    if (f <= b.frame) {
      return b.frame === a.frame ? b[chave] : a[chave] + ((b[chave] - a[chave]) * (f - a.frame)) / (b.frame - a.frame);
    }
  }
  return pts[pts.length - 1][chave];
};

/** o centro da tinta de uma camada de quadro inteiro (preparar.py): a origem da escala do efeito */
export const centroTinta = (arquivo: string) => {
  const [x, y] = (chapas.tinta as Record<string, number[]>)[arquivo];
  return `${x}px ${y}px`;
};
