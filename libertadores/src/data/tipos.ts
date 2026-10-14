// O formato de uma cena. Todos os frames são absolutos (do vídeo), medidos na narração.
import type {Pt, Recorte} from '../lib/formato';
import type {TimeId} from '../theme';

// Jogador: 't9' = time principal da cena, nº 9; 'a4' = adversário, nº 4.
export type Id = `t${number}` | `a${number}`;

export type SetaD = {
  de: Id; // toda seta nasce num jogador
  para: Pt | Id;
  frame: number;
  tipo: 'passe' | 'movimento'; // cheia = passe ou condução; tracejada = movimento sem a bola
  curva?: number; // sinal e intensidade da curvatura (padrão 1)
  cor?: 'time' | 'taca';
  ate?: number; // some (corte) neste frame
};
export type ZonaD = {pontos: Pt[]; frame: number; cor?: 'time' | 'perigo' | 'adversario'; ate?: number};
export type MovD = {quem: Id; para: Pt; frame: number};
export type OpacD = {quem: Id[] | 'todos'; exceto?: Id[]; valor: number; frame: number};
export type DestaqueD = {quem: Id; frame: number; ate?: number};
export type PressaoD = {alvo: Id; quem: Id[]; frame: number};
export type LinhasD = {
  x: [number, number, number]; // defesa, meio, ataque (fração do comprimento)
  aparecem: [number, number, number]; // frame em que cada uma é desenhada
  mover?: {x: [number, number, number]; frame: number};
  pisca?: number; // frame em que a faixa do meio pisca uma vez
};
export type TextoD = {linhas: string[]; frame: number; quadros?: number[]}; // `quadros`: frame de cada linha

type Base = {frame: number};

export type CenaCampo = Base & {
  tipo: 'campo';
  time: TimeId;
  confronto?: string;
  formacao?: string;
  mostrar?: number[]; // do time principal; vazio = campo limpo
  pos?: Partial<Record<number, Pt>>; // posição própria (substitui a da formação)
  adversario?: {time: TimeId; jogadores: Partial<Record<number, Pt>>};
  transformacoes?: {para: string; frame: number}[];
  movimentos?: MovD[];
  setas?: SetaD[];
  zonas?: ZonaD[];
  linhas?: LinhasD;
  destaques?: DestaqueD[];
  opacidades?: OpacD[];
  pressoes?: PressaoD[];
  texto?: TextoD;
  recorte?: Recorte; // área ampliada
  entradas?: {quem: Id; frame: number}[];
  saidas?: {quem: Id; frame: number}[];
  marcas?: {quem: Id; texto: string}[]; // rótulo pequeno ao lado do jogador (times diferentes no mesmo quadro)
  legenda?: {texto: string; frame: number}[]; // nome do esquema embaixo do campo, em dourado
};

export type CenaDuelo = Omit<CenaCampo, 'tipo'> & {tipo: 'duelo'; pares: [Id, Id][]; rotulo: string; contexto: Id[]; ligarEm?: number; semAneis?: boolean};
export type CenaCartela = Base & {tipo: 'cartela'; titulo: string; sub?: string};
export type CenaBroll = Base & {tipo: 'broll'; arquivo: string; taxa?: number; faltando?: string};
export type CenaConfronto = Base & {tipo: 'confronto'; casa: TimeId; fora: TimeId; rotulo: string};
export type CenaFicha = Base & {tipo: 'ficha'; time: TimeId; atributos: {texto: string; frame: number}[]};
export type CenaCartoes = Base & {tipo: 'cartoes'; itens: {texto: string; frame: number}[]; intervalo: number};
export type CenaRotulos = Base & {tipo: 'rotulos'; itens: {texto: string; frame: number; onde: Pt}[]};
export type CenaFecho = Base & {tipo: 'fecho'};

export type Cena = CenaCampo | CenaDuelo | CenaCartela | CenaBroll | CenaConfronto | CenaFicha | CenaCartoes | CenaRotulos | CenaFecho;

export type DadosVideo = {
  id: string;
  titulo: string;
  duracao: number;
  narracao: string;
  trilha: {arquivo: string; db: number; duckingDb: number; release: number} | null;
  fala: [number, number][]; // trechos com voz (guiam o ducking)
  cenas: Cena[];
};
