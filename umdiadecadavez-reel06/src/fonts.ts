import {loadFont as carregarAnton} from '@remotion/google-fonts/Anton';
import {loadFont as carregarCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as carregarMontserrat} from '@remotion/google-fonts/Montserrat';
import {fontes} from './theme';

// Português cabe em latin; latin-ext cobre o resto (ç, ã, õ, ê, ·).
const subsets = ['latin', 'latin-ext'] as const;

export const carregarFontes = () => {
  carregarAnton('normal', {weights: [...fontes.pesos.anton], subsets: [...subsets]});
  carregarMontserrat('normal', {weights: [...fontes.pesos.montserrat], subsets: [...subsets]});
  carregarCaveat('normal', {weights: [...fontes.pesos.caveat], subsets: [...subsets]});
};
