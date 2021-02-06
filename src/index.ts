import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { exit } from 'process';
import {
  fetchRimiCategoryProducts,
  fetchRimiProducts,
} from './stores/rimi/rimiService';
import { fetchBarboraProducts } from './stores/barbora/barboraService';
import { logger } from './logger';
import { createConnection } from 'typeorm';
import { fetchBottleryProducts } from './stores/bottlery/bottleryService';
import { Product } from './entity/Product';
import { Price } from './entity/Price';
import { Category } from './entity/Category';

createConnection()
  .then(async connection => {
    await connection.runMigrations();
    const bottleyProducts = await fetchBottleryProducts();
    logger.info(`fetched bottlery products, total: ${bottleyProducts.length}`);
    const CategoryRepository = connection.getRepository(Category);
    const dbCategories = await CategoryRepository.find();
    for (const {
      category,
      image,
      link,
      name,
      price,
      alcVolume,
      volume,
    } of bottleyProducts) {
      await connection.transaction(async em => {
        const ProductRepository = em.getRepository(Product);
        const PriceRepository = em.getRepository(Price);

        let dbProduct = await ProductRepository.findOne({ link });
        if (!dbProduct) {
          dbProduct = new Product();
          dbProduct.name = name;
          dbProduct.link = link;
          dbProduct.alcVolume = alcVolume;
          dbProduct.volume = volume;
          dbProduct.image = image;
          dbProduct.category =
            dbCategories.find(
              c => c.name.toLowerCase() === category.toLowerCase(),
            ) ?? dbCategories.find(c => c.name.toLowerCase() === 'other')!;
          logger.debug(`inserting dbProduct ${name}`);
          await ProductRepository.save(dbProduct);
        }
        const dbPrice = new Price();
        dbPrice.price = price;
        dbPrice.product = dbProduct;
        await PriceRepository.save(dbPrice);
      });
    }
    // bottleyProducts.forEach();
    // const rimiProducts = await fetchRimiProducts();
    // const barboraProducts = await fetchBarboraProducts();
    // console.log(barboraProducts.filter(p => p.alcVolume).length);
  })
  .catch(error => {
    logger.error(error);
    exit(1);
  })
  .finally(() => exit(0));
