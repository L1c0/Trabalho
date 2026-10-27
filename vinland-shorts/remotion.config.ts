import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
// grão do papel e traço fino: compressão baixa, senão o ruído vira bloco
Config.setCrf(17);
