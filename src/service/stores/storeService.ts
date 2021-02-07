import { fetchBarboraProducts } from './barbora/barboraService';
import { fetchBottleryProducts } from './bottlery/bottleryService';
import { fetchRimiProducts } from './rimi/rimiService';
import { ApiProduct } from './store.types';

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
];
