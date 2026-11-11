/**
 * A linha do tempo. O vídeo abre com a vinheta, depois tela preta em
 * silêncio, e a trilha (a narração mixada) entra em B0. Dentro da trilha a
 * voz só começa em 1,0 s, então a voz chega no quadro VOZ.
 *
 * Do corpo em diante tudo é escrito no tempo da trilha: `s(12.5)` é o quadro
 * em que a trilha está em 12,5 s. Os tempos vêm da transcrição
 * (docs/narracao.txt).
 */
export const FPS = 30;
export const VINHETA = 132; // 4,4 s
export const VOZ = 174; // 1,4 s de preto e silêncio depois da vinheta
export const B0 = VOZ - 30; // a trilha começa aqui
export const CORPO = 22470; // quadros da trilha (749 s)
export const DURACAO = B0 + CORPO;

/** segundos da trilha -> quadro da trilha */
export const s = (seg: number) => Math.round(seg * FPS);
