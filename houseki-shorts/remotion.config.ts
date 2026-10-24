import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
// grão e traço fino: compressão baixa, senão o ruído vira bloco
Config.setCrf(16);
// o arame é WebGL
Config.setChromiumOpenGlRenderer('angle');
