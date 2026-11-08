// Render do master em qualquer sistema (Windows, macOS, Linux):
//   node ferramentas/render.mjs [--frames=3180-3479] [--gl=angle]
// 1. Remotion: 1920x1080, x264 CRF 16 preset slow, yuv420p, matriz bt709
//    -> out/reddead-render.mp4
// 2. O ffmpeg que vem com o Remotion copia vídeo e áudio sem recodificar.
//    Ele adianta o áudio nas 2048 amostras de priming do AAC, que o Remotion
//    não desconta (sem isso, a trilha toca 42,7 ms atrasada), e etiqueta a
//    cor como bt709 -> out/reddead-master.mp4
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const gl = (args.find((a) => a.startsWith('--gl=')) ?? '').slice(5) || undefined;
const trecho = args.find((a) => a.startsWith('--frames='));
const frameRange = trecho ? trecho.slice(9).split('-').map(Number) : null;
const suf = frameRange ? `-${frameRange[0]}-${frameRange[1]}` : '';
const out = path.join(raiz, 'out');
fs.mkdirSync(out, { recursive: true });
const bruto = path.join(out, `reddead-render${suf}.mp4`);
const master = path.join(out, `reddead-master${suf}.mp4`);
const chromiumOptions = gl ? { gl } : {};
const inputProps = { clipes: true };

console.log('montando o projeto...');
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public') });
const composition = await selectComposition({ serveUrl, id: 'RedDead', inputProps, chromiumOptions });
const t0 = Date.now();
let ult = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: bruto,
  inputProps,
  crf: 16,
  pixelFormat: 'yuv420p',
  x264Preset: 'slow',
  colorSpace: 'bt709',
  chromiumOptions,
  timeoutInMilliseconds: 120000,
  frameRange,
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 100);
    if (p !== ult) {
      ult = p;
      const min = ((Date.now() - t0) / 60000).toFixed(1);
      process.stdout.write(`\r${p}%  (${min} min)`);
    }
  },
});
console.log('\nvídeo pronto; acertando o áudio...');
const r = spawnSync(
  'npx',
  ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', bruto, '-itsoffset', '-0.042666667', '-i', bruto,
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
    '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1',
    '-c:a', 'copy', '-movflags', '+faststart', master],
  { stdio: 'inherit', shell: process.platform === 'win32', cwd: raiz },
);
if (r.status !== 0) {
  console.error('o ffmpeg falhou');
  process.exit(1);
}
console.log(`pronto: ${path.relative(raiz, master)}`);
