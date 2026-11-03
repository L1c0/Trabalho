// Quadros soltos para conferência, sem renderizar o vídeo (em 1x, como no
// render final):  node ferramentas/quadros.mjs --comp=S1 [--gl=angle] 0 60 518 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const gl = (args.find((a) => a.startsWith('--gl=')) ?? '--gl=angle').slice(5);
const comp = (args.find((a) => a.startsWith('--comp=')) ?? '--comp=S1').slice(7);
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const saida = path.join(raiz, 'out/quadros');
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public') });
const composition = await selectComposition({ serveUrl, id: comp, inputProps: {}, chromiumOptions: { gl } });
for (const f of args.filter((a) => !a.startsWith('--')).map(Number)) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: path.join(saida, `${comp}-q${f}.png`), inputProps: {}, scale: 1,
    chromiumOptions: { gl }, timeoutInMilliseconds: 120000 });
  console.log(`q${f}.png  ${Date.now() - t0} ms`);
}
