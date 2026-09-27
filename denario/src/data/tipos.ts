// Vocabulário de todo vídeo do canal. Um vídeo novo é só um arquivo em src/data/ com estes tipos.

export type Imagem = {src: string; w: number; h: number; credito?: string};

type Base = {
  entra?: number; // frame de entrada, relativo ao início da composição (corte seco)
  sai?: number; // frame de saída, relativo; ausente = fica até o fim da composição
};

type Peca = Base & {
  img: string; // chave em `imagens`
  x: number;
  y: number;
  largura: number;
  rotacao: number; // graus. Nunca 0: papel colado nunca fica reto.
  zoom?: boolean; // o elemento principal: 100% → 104% em 6 s
  origemZoom?: string; // transform-origin do zoom
};

export type Elemento =
  | (Peca & {tipo: 'recorte'}) // PNG com alfa
  | (Peca & {tipo: 'cena' | 'documento'; quadro?: {x: number; y: number; w: number; h: number}; forma?: 'retangulo' | 'circulo'})
  | (Base & {tipo: 'titulo'; texto: string; x: number; y: number; tamanho?: number; rotacao?: number})
  | (Base & {tipo: 'numero'; texto: string; x: number; y: number; tamanho?: number; rotacao?: number})
  | (Base & {tipo: 'citacao'; linhas: readonly string[]; x: number; y: number; largura: number; rotacao: number})
  | (Base & {tipo: 'credito'; texto: string});

export type Composicao = {id: string; nome: string; de: number; ate: number; elementos: readonly Elemento[]};

export type Video = {
  codigo: string;
  titulo: string;
  fps: number;
  largura: number;
  altura: number;
  duracao: number;
  imagens: Record<string, Imagem>;
  composicoes: readonly Composicao[];
  audio: {
    narracao: string;
    trilha: {arquivo: string; de: number; ate: number; db: number; picoDoArquivo: number; duckingDb: number; ataque: number; release: number};
    fala: readonly (readonly [number, number])[];
  };
  thumb: {elementos: readonly Elemento[]};
};
