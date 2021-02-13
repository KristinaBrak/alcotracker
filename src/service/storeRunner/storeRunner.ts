import { getConnection } from 'typeorm';
import { dbName } from '../../consts';
import { Category } from '../../entity/Category';
import { Price } from '../../entity/Price';
import { Product } from '../../entity/Product';
import { Store } from '../../entity/Store';
import { logger } from '../../logger';
import { ApiProduct } from '../stores/store.types';
import { ApiStore, stores } from '../stores/storeService';

const updateStores = async () => {
  const dbStores = await Store.find();
  for (const { name: storeName, link } of stores) {
    const storeExist = dbStores.some(({ name }) => storeName === name);
    if (!storeExist) {
      const store = new Store();
      store.name = storeName;
      store.link = link;
      logger.info(`creating store ${storeName}`);
      await Store.save(store);
    }
  }
};

const updateStoreProducts = async (store: Store, products: ApiProduct[]) => {
  const CategoryRepository = getConnection().getRepository(Category);
  const dbCategories = await CategoryRepository.find();
  for (const { category, image, link, name, price, alcVolume, volume } of products) {
    await getConnection().transaction(async em => {
      const ProductRepository = em.getRepository(Product);
      const PriceRepository = em.getRepository(Price);

      let dbProduct = await ProductRepository.findOne({ link });
      if (!dbProduct) {
        dbProduct = new Product();
        dbProduct.name = name;
        dbProduct.link = link;
        dbProduct.store = store;
        // dbProduct.alcVolume = alcVolume;
        // dbProduct.volume = volume;
        dbProduct.image = image;
        dbProduct.category =
          dbCategories.find(c => c.name.toLowerCase() === category.toLowerCase()) ??
          dbCategories.find(c => c.name.toLowerCase() === 'other')!;
        logger.debug(`inserting dbProduct ${name}`);
      }
      if (dbProduct.alcVolume !== alcVolume) {
        dbProduct.alcVolume = alcVolume;
      }
      if (dbProduct.volume !== volume) {
        dbProduct.volume = volume;
      }
      await ProductRepository.save(dbProduct);

      const dbPrice = new Price();
      dbPrice.value = price;
      dbPrice.product = dbProduct;
      await PriceRepository.save(dbPrice);
    });
  }
};

const fetchAndUpdateStoreProducts = async ({ name, fn }: ApiStore) => {
  const store = (await Store.findOne({ name }))!;
  logger.info(`fetching data from store: ${store.name}`);
  const products = await fn();
  logger.info(`updating db of ${store.name}`);
  await updateStoreProducts(store, products);
};

export const executeStoreRunner = async () => {
  logger.info('executing store runner');
  await updateStores();
  await Promise.all(stores.map(fetchAndUpdateStoreProducts));
};
