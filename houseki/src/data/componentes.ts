/**
 * Os planos de timeline.ts que não são uma peça de assets.ts e sim um componente.
 * Os frames vêm das notas de timeline.ts, sem mudança.
 */

// plano 3120–3900: "A REGUA DE MOHS. Componente, nao imagem. Entra em 3120. O 10 do diamante
// conta em 3330; o 3,5 da fosfofilita conta em 3540."
export const regua = {de: 3120, conta: {10: 3330, 3.5: 3540} as Record<number, number>, duracaoConta: 20};

// plano 11214–11754: "Os tres entram um por vez: admirabilis em 11214, elenco em 11280, descida
// em 11340. Rotulos CARNE / OSSO / ALMA. Em 11394 os rotulos trocam…"
export const tres = {de: 11214, pecas: ['admirabilis', 'elenco', 'descida'], entradas: [11214, 11280, 11340], trocaRotulos: 11394};

// plano 7410–7780: "O principe e o sapateiro. Citacao em texto, sem imagem."
export const citacao = {de: 7410};

// plano 2060–2595: "Escala de 70% a 150% ao longo de 2060->2480, enquadramento descendo para o
// torso do gigante… De 2480 a 2595 fica parado no detalhe."
// README (correção): no fim "a gravura sangrando para fora da tela nos quatro lados… o torso do
// gigante um pouco acima do centro… reduza o alvo… em vez de abrir mão do sangramento".
// A 150% da altura a gravura (retrato, 0,63) só tem 1016 px de largura: sobra papel dos lados.
// Então o fim é o maior entre 150% e a menor altura em que ela sangra dos lados com 3% de folga
// (`sangria`), que dá 292%. O torso (as pessoas da armadura), medido na gravura em (0,50; 0,215),
// termina a 42% da altura da tela.
export const leviata = {
  de: 2060,
  ate: 2480,
  alturaInicial: 0.7,
  alturaFinal: 1.5,
  sangria: 1.03,
  torso: {x: 0.5, y: 0.215},
  torsoNaTela: 0.42,
};

// o terceiro preto (timeline.ts, pretos[2]): "O papel vai para preto puro em 20 frames enquanto o
// quadro `minuscula` fica em cena… papel e imagem viram a mesma coisa". O preto do quadro não é
// zero: o céu medido no arquivo fica entre 30 e 38 (p10–p90). Nos mesmos 20 frames do papel, o
// ponto preto do quadro desce de 0 até 38: o céu vai a zero, o branco continua em 255.
export const fim = {pretoDoQuadro: 38};
