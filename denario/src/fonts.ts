import {loadFont as carregarInter} from '@remotion/google-fonts/Inter';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {fontes} from './theme';

// Português cabe em latin; latin-ext cobre o resto (ç, ã, õ, ê).
const subsets = ['latin', 'latin-ext'] as const;

export const carregarFontes = () => {
  carregarPlayfair('normal', {weights: [...fontes.pesos.playfair], subsets: [...subsets]});
  carregarInter('normal', {weights: [...fontes.pesos.inter], subsets: [...subsets]});
};
