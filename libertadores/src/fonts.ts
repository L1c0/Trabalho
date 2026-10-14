import {loadFont as anton} from '@remotion/google-fonts/Anton';
import {loadFont as inter} from '@remotion/google-fonts/Inter';

export const carregarFontes = () => {
  anton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
  inter('normal', {weights: ['400', '600', '700'], subsets: ['latin', 'latin-ext']});
};
