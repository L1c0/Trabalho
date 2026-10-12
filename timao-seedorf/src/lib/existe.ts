import {getStaticFiles} from 'remotion';

const avisados = new Set<string>();
// Arquivo ausente em public/: não desenha nada no lugar e avisa uma vez no console.
export const existe = (arquivo: string) => {
  const ok = getStaticFiles().some((f) => f.name === arquivo);
  if (!ok && !avisados.has(arquivo)) {
    avisados.add(arquivo);
    console.warn(`[edit] arquivo ausente em public/: ${arquivo}`);
  }
  return ok;
};
