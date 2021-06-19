import { fetchBarboraProducts } from './barbora/barboraService';
import { fetchBottleryProducts } from './bottlery/bottleryService';
import { fetchIkiProducts } from './iki/ikiService';
import { fetchLidlProducts } from './lidl/lidlService';
import { fetchRimiProducts } from './rimi/rimiService';
import { ApiProduct } from './store.types';
import { fetchVynotekaProducts } from './vynoteka/vynotekaService';

export interface ApiStore {
  name: string;
  link: string;
  fn: () => Promise<ApiProduct[]>;
}

export const stores: ApiStore[] = [
  {
    name: 'bottlery',
    link: 'https://www.bottlery.eu/',
    fn: fetchBottleryProducts,
  },
  {
    name: 'rimi',
    link: 'https://www.rimi.lt/e-parduotuve',
    fn: fetchRimiProducts,
  },
  { name: 'barbora', link: 'https://barbora.lt/', fn: fetchBarboraProducts },
  { name: 'lidl', link: 'https://www.lidl.lt/lt', fn: fetchLidlProducts },
  { name: 'iki', link: 'https://iki.lt/', fn: fetchIkiProducts },
  { name: 'vynoteka', link: 'https://www.vynoteka.lt/', fn: fetchVynotekaProducts },
];
