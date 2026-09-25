import {getInfo as infoShippori, loadFont as carregarShippori} from '@remotion/google-fonts/ShipporiMincho';
import {getInfo as infoZenKaku, loadFont as carregarZenKaku} from '@remotion/google-fonts/ZenKakuGothicNew';
import {getInfo as infoNotoSerif, loadFont as carregarNotoSerif} from '@remotion/google-fonts/NotoSerifJP';
import {textoCompleto} from './data/textos';
import {fontes} from './theme';

// Fontes CJK vêm em ~120 fatias de unicode. Carrega só as fatias que contêm
// algum caractere de data/textos.ts — trocar o texto atualiza isto sozinho.
const faixas = (unicodeRange: string) =>
  unicodeRange.split(',').map((parte) => {
    const [a, b] = parte.trim().replace(/^U\+/i, '').split('-');
    const ini = parseInt(a, 16);
    return [ini, b ? parseInt(b, 16) : ini] as const;
  });

const pontosDeCodigo = [...new Set([...textoCompleto].map((c) => c.codePointAt(0) ?? 0))];

const PREFERIDAS = ['latin', 'latin-ext'];

// Menor conjunto de fatias que cobre todos os caracteres (latin primeiro).
const fatiasNecessarias = (unicodeRanges: Record<string, string>) => {
  const entradas = Object.entries(unicodeRanges)
    .map(([fatia, faixa]) => ({fatia, fs: faixas(faixa)}))
    .sort((a, b) => Number(!PREFERIDAS.includes(a.fatia)) - Number(!PREFERIDAS.includes(b.fatia)));
  const cobre = (fs: ReturnType<typeof faixas>, cp: number) => fs.some(([a, b]) => cp >= a && cp <= b);
  const escolhidas: typeof entradas = [];
  for (const cp of pontosDeCodigo) {
    if (escolhidas.some((e) => cobre(e.fs, cp))) continue;
    const e = entradas.find((x) => cobre(x.fs, cp));
    if (e) escolhidas.push(e);
  }
  // As tipagens só listam subsets nomeados; em runtime as fatias numeradas ("[42]") também valem.
  return escolhidas.map((e) => e.fatia) as never[];
};

export const carregarFontes = () => {
  carregarShippori('normal', {
    weights: [...fontes.pesos.shippori],
    subsets: fatiasNecessarias(infoShippori().unicodeRanges),
  });
  carregarZenKaku('normal', {
    weights: [...fontes.pesos.zenKaku],
    subsets: fatiasNecessarias(infoZenKaku().unicodeRanges),
  });
  carregarNotoSerif('normal', {
    weights: [...fontes.pesos.notoSerif],
    subsets: fatiasNecessarias(infoNotoSerif().unicodeRanges),
  });
};
