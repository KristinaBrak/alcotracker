import { fetchBarboraProducts } from './barbora/barbora.service';
import { fetchBottleryProducts } from './bottlery/bottlery.service';
import { fetchIkiProducts } from './iki/iki.service';
import { fetchLidlProducts } from './lidl/lidl.service';
import { fetchRimiProducts } from './rimi/rimi.service';
import { ApiProduct } from './store.types';
import { fetchVynotekaProducts } from './vynoteka/vynoteka.service';

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
