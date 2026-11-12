// Quadros soltos para conferência, sem renderizar o vídeo:
//   node ferramentas/quadros.mjs <composição> [--gl=angle] [--escala=0.5] 0 120 300 ...
// Saem em out/quadros/<composição>-<quadro>.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--') && isNaN(Number(a)));
const gl = (args.find((a) => a.startsWith('--gl=')) ?? '--gl=angle').slice(5);
const escala = Number((args.find((a) => a.startsWith('--escala=')) ?? '--escala=1').slice(9));
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const saida = path.join(raiz, 'out/quadros');
fs.mkdirSync(saida, { recursive: true });
// o pacote do navegador vai sempre para a mesma pasta, para não acumular cópias
const outDir = process.env.PACOTE_REMOTION ?? path.join(os.tmpdir(), 'reddead-shorts-pacote');
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public'), outDir });
const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl } });
for (const f of args.filter((a) => !a.startsWith('--') && !isNaN(Number(a))).map(Number)) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: path.join(saida, `${id}-${String(f).padStart(4, '0')}.png`), scale: escala,
    chromiumOptions: { gl }, timeoutInMilliseconds: 120000 });
  console.log(`${id}-${String(f).padStart(4, '0')}.png  ${Date.now() - t0} ms`);
}
