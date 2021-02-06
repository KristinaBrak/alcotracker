import * as dotenv from 'dotenv';
dotenv.config();
import { exit } from 'process';
import {
  fetchRimiCategoryProducts,
  fetchRimiProducts,
} from './stores/rimi/rimiService';
import { fetchBarboraProducts } from './stores/barbora/barboraService';
import { logger } from './logger';

(async () => {
  // const result = await fetchBottleryProducts();
  // console.log(result[0]);
  // const rimiProducts = await fetchRimiProducts();
  const barboraProducts = await fetchBarboraProducts();
  console.log(barboraProducts.length);
  // console.log(barboraProducts.filter(p => p.alcVolume).length);
})()
  .catch(error => {
    logger.error(error);
    exit(1);
  })
  .finally(() => exit(0));
