import { cancelRender, continueRender, delayRender } from 'remotion';
import { FONTES_DADOS } from './fontes-dados';

/**
 * As fontes vêm embutidas em base64 (ferramentas/fontes.py) e entram no
 * navegador direto da memória, sem pedido de rede. Assim o render não fica
 * esperando arquivo de fonte.
 */
const buffer = (b64: string) => {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8.buffer;
};

let pronto: Promise<unknown> | null = null;

export const carregaFontes = () => {
  if (pronto) return pronto;
  const espera = delayRender('fontes embutidas');
  pronto = Promise.all(
    FONTES_DADOS.map((d) => {
      const ff = new FontFace(d.familia, buffer(d.b64), { weight: String(d.peso), style: d.estilo });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(ff);
      return ff.load();
    }),
  )
    .then(() => continueRender(espera))
    .catch((e) => cancelRender(e));
  return pronto;
};

carregaFontes();
