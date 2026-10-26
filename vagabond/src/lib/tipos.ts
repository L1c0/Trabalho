/** O que a prensa... não: o que o pincel (ferramentas/montagem.py) deixou pronto. */

/** [escala, x, y]: o ponto (x, y) da folha, em px de quadro, fica no centro da tela. */
export type Pose = [number, number, number];

export type Camada = {
  id: string;
  /** transmitância (1 = papel limpo); numa peça colorida, a versão em sumi */
  src: string;
  /** a versão colorida, quando a peça tem cor: a partitura mistura as duas */
  cor?: string;
  /** retângulo na folha, em px de quadro */
  x: number;
  y: number;
  w: number;
  h: number;
  /** tamanho do material em px (1440p) */
  iw: number;
  ih: number;
  /** [frame absoluto em que a tinta encosta, duração em frames]; sem isso, já está na folha */
  chega?: [number, number];
  /** campo de chegada reduzido (16 bits em vermelho/verde) */
  campo?: string;
  /** quanto a frente escurece (0,18 a 0,26) */
  borda?: number;
  /** em que plano de profundidade a camada mora (só nos três momentos) */
  plano?: string;
};

export type Folha = {
  /** fator do tom do papel sobre o washi limpo (multiplicação); null = limpo */
  tom: [number, number, number] | null;
  /** deslocamento do washi periódico, em px de quadro */
  ox: number;
  oy: number;
  /** extensão do papel na folha, em px de quadro */
  caixa: [number, number, number, number];
  camadas: Camada[];
};

/** [ganho de escala, deriva horizontal em fração da largura] ao longo do plano */
export type Profundidade = Record<string, [number, number]>;

export type Plano = {
  de: number;
  ate: number;
  folha: string;
  cam: [Pose, Pose];
  /** só nos três momentos de profundidade: o movimento extra de cada plano */
  px?: Profundidade;
  nota?: string;
};

export type Montagem = {
  fps: number;
  frames: number;
  K: number;
  papel: { src: string; w: number; h: number };
  fibra: { src: string; lado: number };
  partitura: [number, number, number][];
  folhas: Record<string, Folha>;
  planos: Plano[];
};
