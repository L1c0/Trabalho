// Render dos Shorts.
//   node ferramentas/render.mjs [Short1] [Short2] [--frames=a-b] [--crf=16] [--gl=angle]
//
// 1. O Remotion renderiza a imagem (1080x1920, 30 fps, H.264, yuv420p, bt709), sem som.
// 2. O ffmpeg junta a mixagem (public/audio/shortN.wav, feita por ferramentas/mixagem.py)
//    em AAC a 320 kb/s (a 256 kb/s a compressão criava picos acima de 0 dB), sem
//    recodificar a imagem.
// Sai out/<id>-master.mp4.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (nome, padrao) => (args.find((a) => a.startsWith(`--${nome}=`)) ?? `--${nome}=${padrao}`).split('=')[1];
const ids = args.filter((a) => !a.startsWith('--'));
if (ids.length === 0) ids.push('Short1', 'Short2');
const gl = opt('gl', 'angle');
const crf = Number(opt('crf', '16'));
const frames = opt('frames', '');
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
fs.mkdirSync(path.join(raiz, 'out'), { recursive: true });
const outDir = process.env.PACOTE_REMOTION ?? path.join(os.tmpdir(), 'reddead-shorts-pacote');
const serveUrl = await bundle({ entryPoint: path.join(raiz, 'src/index.ts'), publicDir: path.join(raiz, 'public'), outDir });

for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl } });
  const faixa = frames ? frames.split('-').map(Number) : null;
  const sufixo = faixa ? `-${faixa[0]}-${faixa[1]}` : '';
  const mudo = path.join(raiz, `out/${id}${sufixo}-imagem.mp4`);
  const t0 = Date.now();
  let ultimo = 0;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: mudo,
    crf,
    pixelFormat: 'yuv420p',
    x264Preset: 'slow',
    colorSpace: 'bt709',
    imageFormat: 'png',
    muted: true,
    frameRange: faixa,
    concurrency: Number(opt('abas', '4')),
    chromiumOptions: { gl },
    timeoutInMilliseconds: 180000,
    onProgress: ({ renderedFrames, encodedFrames }) => {
      if (Date.now() - ultimo > 20000) {
        ultimo = Date.now();
        console.log(`${id}: ${renderedFrames} quadros renderizados, ${encodedFrames} codificados, ${Math.round((Date.now() - t0) / 1000)} s`);
      }
    },
  });
  const n = id.replace('Short', '');
  const som = path.join(raiz, `public/audio/short${n}.wav`);
  const saida = path.join(raiz, `out/${id}${sufixo}-master.mp4`);
  const inicio = faixa ? faixa[0] / 30 : 0;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', mudo, '-ss', String(inicio), '-i', som, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
    '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', saida]);
  fs.rmSync(mudo);
  console.log(`pronto: ${path.relative(raiz, saida)} (${Math.round((Date.now() - t0) / 1000)} s)`);
}
