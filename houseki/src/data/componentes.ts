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
// O torso (onde estão as pessoas da armadura) foi medido na gravura: centro em (0,50; 0,215).
export const leviata = {de: 2060, ate: 2480, alturaInicial: 0.7, alturaFinal: 1.5, torso: {x: 0.5, y: 0.215}};
