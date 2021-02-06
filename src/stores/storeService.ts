import { fetchBarboraProducts } from './barbora/barboraService';
import { fetchBottleryProducts } from './bottlery/bottleryService';
import { fetchRimiProducts } from './rimi/rimiService';
import { Product } from './store.types';

export const stores: {
  name: string;
  link: string;
  fn: () => Promise<Product[]>;
}[] = [
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
