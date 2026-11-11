// Render de conferência em partes (só vídeo), que retoma de onde parou:
//   node ferramentas/render-partes.mjs [--tam=1500] [--crf=20] [--so=3,7]
// Cada parte vai para out/partes/pNN.mp4. Uma parte que já existe é pulada;
// --so= refaz só as partes pedidas. Depois, ferramentas/junta.sh emenda as
// partes e põe o áudio. O master de verdade sai do render.mjs, inteiro e em PNG.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const num = (nome, padrao) => Number((args.find((a) => a.startsWith(`--${nome}=`)) ?? `--${nome}=${padrao}`).split('=')[1]);
const tam = num('tam', 1500);
const crf = num('crf', 20);
const so = (args.find((a) => a.startsWith('--so=')) ?? '--so=').slice(5).split(',').filter(Boolean).map(Number);
const dir = path.join(raiz, 'out/partes');
fs.mkdirSync(dir, { recursive: true });
const inputProps = { clipes: true };
const chromiumOptions = { gl: 'angle' };

console.log('montando o projeto...');
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public') });
const composition = await selectComposition({ serveUrl, id: 'RedDead', inputProps, chromiumOptions });
const total = composition.durationInFrames;
const n = Math.ceil(total / tam);
console.log(`${total} quadros em ${n} partes de ${tam}`);
for (let k = 0; k < n; k++) {
  if (so.length && !so.includes(k)) continue;
  const a = k * tam;
  const b = Math.min(total, a + tam) - 1;
  const fim = path.join(dir, `p${String(k).padStart(2, '0')}.mp4`);
  if (fs.existsSync(fim) && !so.length) {
    console.log(`parte ${k}: já existe`);
    continue;
  }
  const tmp = path.join(dir, `tmp-p${String(k).padStart(2, '0')}.mp4`);
  const t0 = Date.now();
  let ult = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: tmp,
    inputProps,
    crf,
    pixelFormat: 'yuv420p',
    x264Preset: 'veryfast',
    colorSpace: 'bt709',
    imageFormat: 'jpeg',
    jpegQuality: 95,
    muted: true,
    concurrency: 4,
    chromiumOptions,
    timeoutInMilliseconds: 120000,
    frameRange: [a, b],
    onBrowserLog: (l) => {
      if (l.text.includes('[fontes]') || l.type === 'error') console.log(`  [aba] ${l.text.slice(0, 200)}`);
    },
    onProgress: ({ renderedFrames }) => {
      if (renderedFrames % 300 === 0 && renderedFrames !== ult) {
        ult = renderedFrames;
        console.log(`  parte ${k}: ${renderedFrames} quadros em ${((Date.now() - t0) / 60000).toFixed(1)} min`);
      }
    },
  });
  fs.renameSync(tmp, fim);
  console.log(`parte ${k} (${a}-${b}): pronta em ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}
console.log('FIM');
