import {loadFont} from '@remotion/google-fonts/Inter';
import {fontes} from './theme';

export const carregarFontes = () => {
  loadFont('normal', {weights: [...fontes.pesos], subsets: ['latin', 'latin-ext']});
};
