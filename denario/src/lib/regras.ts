import type {Composicao, Imagem, Video} from '../data/tipos';
import {regras as R} from '../theme';

// As regras de composição do canal, checadas nos dados. Só avisa (console), nunca corrige:
// quem decide a exceção é quem monta o vídeo.
const caixa = (e: Composicao['elementos'][number], imagens: Record<string, Imagem>) => {
  if (e.tipo !== 'recorte' && e.tipo !== 'cena' && e.tipo !== 'documento') return null;
  const img = imagens[e.img];
  if (!img) return null;
  const q = 'quadro' in e && e.quadro ? e.quadro : {w: img.w, h: img.h};
  return {x0: e.x, y0: e.y, x1: e.x + e.largura, y1: e.y + (e.largura * q.h) / q.w};
};

export const checarRegras = (v: Video) => {
  const avisos: string[] = [];
  let ouro = 0;
  for (const c of v.composicoes) {
    const visuais = c.elementos.filter((e) => e.tipo !== 'credito');
    ouro += c.elementos.filter((e) => e.tipo === 'numero').length;
    if (visuais.length === 0) continue; // o fim: só a marca
    const [min, max] = R.elementos;
    if (visuais.length < min || visuais.length > max) avisos.push(`${c.id}: ${visuais.length} elemento(s); o mínimo é ${min}, o máximo ${max}`);
    const dur = c.ate - c.de;
    if (dur < R.duracao[0] || dur > R.duracao[1]) avisos.push(`${c.id}: dura ${dur} frames (4–8 s = ${R.duracao.join('–')})`);
    const sangra = c.elementos.some((e) => {
      const b = caixa(e, v.imagens);
      if (b) return b.x0 < 0 || b.y0 < 0 || b.x1 > v.largura || b.y1 > v.altura;
      return e.tipo === 'numero' && (e.y < 0 || e.x < 0);
    });
    if (!sangra) avisos.push(`${c.id}: nenhum elemento sangra pela borda`);
    for (const e of c.elementos) {
      if (e.tipo !== 'recorte' && e.tipo !== 'cena' && e.tipo !== 'documento') continue;
      const lim = e.tipo === 'documento' ? R.rotacaoDocumento : R.rotacaoRecorte;
      if (e.rotacao === 0 || Math.abs(e.rotacao) > lim) avisos.push(`${c.id}/${e.img}: rotação ${e.rotacao}° (≠0, até ±${lim}°)`);
    }
  }
  if (ouro > R.usosDeOuro) avisos.push(`ouro velho usado ${ouro} vezes (máximo ${R.usosDeOuro})`);
  return avisos;
};
