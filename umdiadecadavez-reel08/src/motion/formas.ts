// Ferramentas para desenhar objetos à mão: cada forma é uma lista de traços, cada traço
// uma lista de pontos numa caixa 0–1 × 0–1 (y para baixo). O desenho em si (quais objetos,
// com que traços) mora no data/ do Reel.

export type Ponto = readonly [number, number];
export type Traco = readonly Ponto[];
export type Forma = readonly Traco[];

// Curva de Bézier quadrática (p0 → p1, com controle c)
export const curva = (p0: Ponto, c: Ponto, p1: Ponto, n = 24): Ponto[] =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    return [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1]] as const;
  });

// Arco de elipse, de a0 a a1 (radianos)
export const arco = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 32): Ponto[] =>
  Array.from({length: n + 1}, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
  });

// Emenda trechos num traço só, sem repetir o ponto de junção
export const emenda = (...trechos: Ponto[][]): Ponto[] => trechos.flatMap((t, i) => (i === 0 ? t : t.slice(1)));

// Mão humana: um tremor pequeno e determinístico ao longo do traço
export const tremor = (t: readonly Ponto[], amplitude = 0.006, semente = 1): Ponto[] =>
  t.map(([x, y], i) => [x + amplitude * Math.sin(i * 0.9 + semente), y + amplitude * Math.cos(i * 1.3 + semente * 2)] as const);

// Reamostra um traço em n pontos igualmente espaçados (para a morfose)
export const reamostra = (t: readonly Ponto[], n: number): Ponto[] => {
  const acum = [0];
  for (let i = 1; i < t.length; i++) acum.push(acum[i - 1] + Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]));
  const total = acum[acum.length - 1];
  const out: Ponto[] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const alvo = (total * k) / (n - 1);
    while (j < t.length - 2 && acum[j + 1] < alvo) j++;
    const seg = acum[j + 1] - acum[j] || 1;
    const u = (alvo - acum[j]) / seg;
    out.push([t[j][0] + (t[j + 1][0] - t[j][0]) * u, t[j][1] + (t[j + 1][1] - t[j][1]) * u]);
  }
  return out;
};

export const comprimento = (t: readonly Ponto[]) => t.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p[0] - t[i - 1][0], p[1] - t[i - 1][1])), 0);

// Pontos na caixa (x, y, lado) em pixels, como atributo `d` de um path
export const caminho = (t: readonly Ponto[], x: number, y: number, lado: number) =>
  `M${t.map(([a, b]) => `${(x + a * lado).toFixed(1)},${(y + b * lado).toFixed(1)}`).join(' L')}`;
