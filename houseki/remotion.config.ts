import {Config} from '@remotion/cli/config';

/**
 * O grão (desvio local 7, README <Papel>) é ruído por pixel: o H.264 normal joga ele fora.
 * Medido: com -tune grain a ~45 Mbps o desvio no vídeo fica entre 6 e 7; sem isso, a 10 Mbps,
 * cai para 1–3. E os frames vão em PNG: o JPEG padrão do Remotion já alisa o grão antes.
 */
Config.setVideoImageFormat('png');
Config.overrideFfmpegCommand(({args}) => {
  const i = args.indexOf('libx264');
  return i < 0 ? args : [...args.slice(0, i + 1), '-tune', 'grain', ...args.slice(i + 1)];
});
