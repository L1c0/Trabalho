// Quadros soltos para conferência, sem renderizar o filme:
//   node ferramentas/quadros.mjs --comp=Dia1-Anel 50 400 1100 ...   [--saida=out/quadros]
// Um bundle só; cada frame vira out/quadros/<comp>-q<frame>.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const opc = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const frames = args.filter((a) => !a.startsWith('--')).map(Number);
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const saida = path.resolve(raiz, opc.saida ?? 'out/quadros');
fs.mkdirSync(saida, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public') });
const inputProps = {};
const composition = await selectComposition({ serveUrl, id: opc.comp, inputProps });
for (const f of frames) {
  const t0 = Date.now();
  await renderStill({
    composition,
    serveUrl,
    frame: f,
    output: path.join(saida, `${opc.comp}-q${f}.png`),
    inputProps,
    scale: Number(opc.escala ?? 1),
    timeoutInMilliseconds: 120000,
  });
  console.log(`${opc.comp}-q${f}.png  ${Date.now() - t0} ms`);
}
