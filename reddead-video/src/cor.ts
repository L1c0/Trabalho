import pacote from './data/pacote.json';

/**
 * A partitura de cor do pacote (partitura_de_cor), quadro a quadro.
 * - saturação de 0 a 100, em % do original;
 * - temperatura de -100 (frio) a +100 (quente);
 * - entre duas viradas, interpola em linha reta;
 * - uma virada "seca" segura a cor anterior até o quadro dela e troca num
 *   quadro só, no corte.
 *
 * Única mudança: a virada seca de 15553 ("a frase que eu não usei") vai para
 * 15566, o corte da cena 21. Em 15553 ela trocaria a cor da chapa p11 parada,
 * 13 quadros antes do corte.
 */
type Virada = { frame: number; saturacao: number; temperatura: number; seca: boolean };
const VIRADAS: Virada[] = (pacote as unknown as { partitura_de_cor: { viradas: Virada[] } }).partitura_de_cor.viradas.map(
  (v) => (v.frame === 15553 ? { ...v, frame: 15566 } : v),
);

export type Cor = { sat: number; temp: number };

export const corEm = (f: number): Cor => {
  let k = 0;
  while (k + 1 < VIRADAS.length && VIRADAS[k + 1].frame <= f) k++;
  const a = VIRADAS[k];
  const b = VIRADAS[k + 1];
  if (!b || b.seca || f <= a.frame) return { sat: a.saturacao, temp: a.temperatura };
  const t = (f - a.frame) / (b.frame - a.frame);
  return {
    sat: a.saturacao + (b.saturacao - a.saturacao) * t,
    temp: a.temperatura + (b.temperatura - a.temperatura) * t,
  };
};

/**
 * Matriz 4x5 do feColorMatrix (em sRGB).
 * 1. Saturação, com a luma Rec. 709, como o saturate() do CSS.
 * 2. Temperatura, como um balanço de branco. O quente sobe o vermelho e
 *    baixa o azul, com ganho e um pouco de deslocamento para chegar às
 *    sombras. O frio faz o contrário.
 * Com saturação 0 e temperatura -30, por exemplo, sai um cinza levemente frio.
 */
const QUENTE = { r: 0.08, g: 0.015, b: 0.1, desloc: 0.01 };

export const matriz = ({ sat, temp }: Cor): string => {
  const s = sat / 100;
  const t = temp / 100;
  const L = [0.2126, 0.7152, 0.0722];
  const ganho = [1 + QUENTE.r * t, 1 + QUENTE.g * t, 1 - QUENTE.b * t];
  const desloc = [QUENTE.desloc * t, 0, -QUENTE.desloc * t];
  const linhas = [0, 1, 2].map((i) => [
    ...[0, 1, 2].map((j) => (L[j] * (1 - s) + (i === j ? s : 0)) * ganho[i]),
    0,
    desloc[i],
  ]);
  return [...linhas, [0, 0, 0, 1, 0]].map((l) => l.map((v) => v.toFixed(5)).join(' ')).join(' ');
};
