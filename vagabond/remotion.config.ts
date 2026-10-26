import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
// aguada e papel vazio: compressão baixa, senão o gradiente vira degrau
Config.setCrf(16);
