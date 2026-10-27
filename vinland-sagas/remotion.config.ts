import { Config } from '@remotion/cli/config';

// Render do LEIA-PRIMEIRO: 1080x1920, 30 fps, h264, CRF 18, yuv420p, faststart.
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
