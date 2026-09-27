import {loadFont as carregarArchivoBlack} from '@remotion/google-fonts/ArchivoBlack';
import {loadFont as carregarMontserrat} from '@remotion/google-fonts/Montserrat';
import {fontes} from './theme';

// Português cabe em latin; latin-ext cobre o resto (ç, ã, õ, ê, ·).
const subsets = ['latin', 'latin-ext'] as const;

export const carregarFontes = () => {
  carregarArchivoBlack('normal', {weights: ['400'], subsets: [...subsets]});
  carregarMontserrat('normal', {weights: [...fontes.pesos.montserrat], subsets: [...subsets]});
};
