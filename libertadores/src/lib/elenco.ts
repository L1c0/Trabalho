// O elenco de uma cena: quem aparece, onde começa, e cada deslocamento no tempo.
// Um jogador sem deslocamento fica parado. É isso que faz a transformação de formação se ler.
import type {CenaCampo, CenaDuelo, Id} from '../data/tipos';
import {formacoes} from '../formacoes';
import type {TimeId} from '../theme';
import {corDoTime, curvas, medidas} from '../theme';
import type {Pt} from './formato';

export type Deslocamento = {para: Pt; frame: number; dur: number};
export type Atleta = {
  id: Id;
  n: number;
  time: TimeId;
  cor: string;
  base: Pt;
  principal: boolean;
  movs: Deslocamento[];
  entraEm: number;
  saiEm?: number;
};

const EPS = 0.004;
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

export const montarElenco = (c: CenaCampo | CenaDuelo): Atleta[] => {
  const esquema = c.formacao ? formacoes[c.formacao] : {};
  const lista: Atleta[] = [];
  for (const n of c.mostrar ?? []) {
    const base = c.pos?.[n] ?? esquema[n];
    if (!base) throw new Error(`cena ${c.frame}: jogador ${n} sem posição`);
    lista.push({id: `t${n}`, n, time: c.time, cor: corDoTime(c.time, c.confronto), base, principal: true, movs: [], entraEm: 0});
  }
  for (const [k, base] of Object.entries(c.adversario?.jogadores ?? {})) {
    if (!base || !c.adversario) continue;
    const n = Number(k);
    lista.push({id: `a${n}`, n, time: c.adversario.time, cor: corDoTime(c.adversario.time, c.confronto), base, principal: false, movs: [], entraEm: 0});
  }
  const achar = (id: Id) => {
    const a = lista.find((j) => j.id === id);
    if (!a) throw new Error(`cena ${c.frame}: ${id} não está em campo`);
    return a;
  };
  const ultima = (a: Atleta) => (a.movs.length ? a.movs[a.movs.length - 1].para : a.base);

  // transformação de formação: só se move quem muda de posição
  for (const t of [...(c.transformacoes ?? [])].sort((x, y) => x.frame - y.frame)) {
    const alvo = formacoes[t.para];
    for (const a of lista.filter((j) => j.principal)) {
      const p = alvo[a.n];
      if (p && dist(p, ultima(a)) > EPS) a.movs.push({para: p, frame: t.frame, dur: medidas.formacao.duracao});
    }
  }
  for (const m of c.movimentos ?? []) achar(m.quem).movs.push({para: m.para, frame: m.frame, dur: medidas.formacao.duracao});
  // pressão: cada um corre até perto do alvo, em 35 quadros
  for (const pr of c.pressoes ?? []) {
    const alvo = posNo(achar(pr.alvo), pr.frame);
    for (const q of pr.quem) {
      const a = achar(q);
      const de = posNo(a, pr.frame);
      // em metros: o campo não é quadrado em fração
      const [dx, dy] = [(de.x - alvo.x) * 105, (de.y - alvo.y) * 68];
      const d = Math.hypot(dx, dy) || 1;
      const parada = medidas.pressao.parada * 105;
      a.movs.push({para: {x: alvo.x + (dx / d) * (parada / 105), y: alvo.y + (dy / d) * (parada / 68)}, frame: pr.frame, dur: medidas.pressao.duracao});
    }
  }
  for (const a of lista) a.movs.sort((x, y) => x.frame - y.frame);

  // entrada: do goleiro para o ataque, 3 quadros entre cada um
  const ordem = [...lista].sort((a, b) => (a.principal === b.principal ? (a.principal ? a.base.x - b.base.x : b.base.x - a.base.x) : a.principal ? -1 : 1));
  ordem.forEach((a, i) => (a.entraEm = c.frame + i * medidas.entrada.intervalo));
  for (const e of c.entradas ?? []) achar(e.quem).entraEm = e.frame;
  for (const s of c.saidas ?? []) achar(s.quem).saiEm = s.frame;
  return lista;
};

export const posNo = (a: Atleta, f: number): Pt => {
  let p = a.base;
  for (const m of a.movs) {
    if (f <= m.frame) break;
    const e = curvas.suave(Math.min(1, (f - m.frame) / m.dur));
    p = {x: p.x + (m.para.x - p.x) * e, y: p.y + (m.para.y - p.y) * e};
  }
  return p;
};

export const emMovimento = (a: Atleta, f: number) => a.movs.some((m) => f > m.frame && f < m.frame + m.dur + 16);

export const opacidadeNo = (c: CenaCampo | CenaDuelo, id: Id, f: number) => {
  let v = 1;
  for (const o of [...(c.opacidades ?? [])].sort((x, y) => x.frame - y.frame)) {
    if (f < o.frame) break;
    const vale = o.quem === 'todos' ? !(o.exceto ?? []).includes(id) : o.quem.includes(id);
    if (vale) v += (o.valor - v) * curvas.suave(Math.min(1, (f - o.frame) / 10));
  }
  return v;
};

// 0 → 1,08 no quadro 6 → 1 no quadro 8. Sem mola.
export const escalaEntrada = (q: number) => {
  const e = medidas.entrada;
  if (q <= 0) return 0;
  if (q < e.quadroPico) return e.pico * curvas.saida(q / e.quadroPico);
  if (q < e.duracao) return e.pico + (1 - e.pico) * ((q - e.quadroPico) / (e.duracao - e.quadroPico));
  return 1;
};
