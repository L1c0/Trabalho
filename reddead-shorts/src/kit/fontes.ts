import { cancelRender, continueRender, delayRender } from 'remotion';
import { FONTES_DADOS } from './fontes-dados';

/**
 * As fontes vêm embutidas em base64 (ferramentas/fontes.py) e entram no
 * navegador direto da memória, sem pedido de rede.
 *
 * O render só é liberado quando todas estão carregadas. Em vez de esperar a
 * promessa de `load()`, o estado de cada fonte é lido em intervalos curtos:
 * num render com várias abas, a promessa de uma aba podia nunca resolver e o
 * render parava por tempo esgotado.
 */
const buffer = (b64: string) => {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8.buffer;
};

let pronto: Promise<void> | null = null;

export const carregaFontes = () => {
  if (pronto) return pronto;
  const espera = delayRender('fontes embutidas');
  const t0 = Date.now();
  const faces = FONTES_DADOS.map((d) => {
    const ff = new FontFace(d.familia, buffer(d.b64), { weight: String(d.peso), style: d.estilo });
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(ff);
    ff.load().catch(() => undefined);
    return ff;
  });
  console.log(`[fontes] criadas: ${faces.map((f) => f.status).join(',')}`);
  pronto = new Promise<void>((ok) => {
    const olha = () => {
      const erro = faces.find((f) => f.status === 'error');
      if (erro) {
        cancelRender(new Error(`a fonte ${erro.family} não carregou`));
        return;
      }
      if (faces.every((f) => f.status === 'loaded')) {
        console.log(`[fontes] prontas em ${Date.now() - t0} ms`);
        continueRender(espera);
        ok();
        return;
      }
      setTimeout(olha, 30);
    };
    olha();
  });
  return pronto;
};

carregaFontes();
