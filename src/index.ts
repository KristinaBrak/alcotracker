import * as dotenv from 'dotenv';
dotenv.config();
import { exit } from 'process';
import {
  fetchRimiCategoryProducts,
  fetchRimiProducts,
} from './stores/rimi/rimiService';
import { logger } from './logger';
import { fetchBarboraProducts } from './stores/barbora/barboraService';

(async () => {
  // const result = await fetchBottleryProducts();
  // console.log(result[0]);
  // const rimiProducts = await fetchRimiProducts();
  // console.log(rimiProducts.length);

  const barboraProducts = await fetchBarboraProducts();
  console.log(barboraProducts.filter(p => p.alcVolume).length);
})()
  .catch(error => {
    console.error('[ERROR]', error);
    exit(1);
  })
  .finally(() => exit(0));
