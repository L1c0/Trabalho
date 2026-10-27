// Quadros soltos para conferência, sem renderizar o vídeo:
//   node ferramentas/quadros.mjs 0 249 880 ...   ->  out/quadros/q<frame>.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const saida = path.join(raiz, 'out/quadros');
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public') });
const composition = await selectComposition({ serveUrl, id: 'Oficina', inputProps: {} });
for (const f of process.argv.slice(2).map(Number)) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: path.join(saida, `q${f}.png`), inputProps: {}, timeoutInMilliseconds: 120000 });
  console.log(`q${f}.png  ${Date.now() - t0} ms`);
}
