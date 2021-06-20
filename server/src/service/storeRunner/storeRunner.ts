import { getConnection, QueryRunner } from 'typeorm';
import { Category } from '../../entity/Category';
import { Price } from '../../entity/Price';
import { Product } from '../../entity/Product';
import { Store } from '../../entity/Store';
import { logger } from '../../logger';
import { ApiProduct } from '../stores/store.types';
import { ApiStore, stores } from '../stores/storeService';

const updateStoreCreator =
  (dbStores: Store[]) =>
  async ({ name: storeName, link }: ApiStore) => {
    const storeExist = dbStores.some(({ name }) => storeName === name);
    if (!storeExist) {
      const store = new Store();
      store.name = storeName;
      store.link = link;
      logger.info(`creating store ${storeName}`);
      await Store.save(store);
    }
  };

const updateStores = async () => {
  const dbStores = await Store.find();
  const updateStore = updateStoreCreator(dbStores);
  for (const store of stores) {
    await updateStore(store);
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
        dbProduct.alcVolume = alcVolume ?? null;
        dbProduct.volume = volume ?? null;
        dbProduct.image = image;
        dbProduct.category =
          dbCategories.find(c => c.name.toLowerCase() === category.toLowerCase()) ??
          dbCategories.find(c => c.name.toLowerCase() === 'other')!;
        logger.debug(`inserting dbProduct ${name}`);
        await ProductRepository.save(dbProduct);
      } else {
        let changed = false;
        if (dbProduct.image !== image) {
          dbProduct.image = image;
          changed = true;
        }
        if (dbProduct.alcVolume != alcVolume) {
          dbProduct.alcVolume = alcVolume ?? null;
          changed = true;
        }
        if (dbProduct.volume != volume) {
          dbProduct.volume = volume ?? null;
          changed = true;
        }
        if (changed) {
          logger.warn(`updating existing product! ${dbProduct.id} ${name}`);
          await ProductRepository.save(dbProduct);
        }
      }

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

const refreshMaterializedView = async (materializedView: string) => {
  const connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`REFRESH MATERIALIZED VIEW ${materializedView}`);
  await queryRunner.release();
  logger.info(`materialized view ${materializedView} refreshed`);
};

export const executeStoreRunner = async () => {
  logger.info('executing store runner');
  await updateStores();
  await Promise.all(stores.map(fetchAndUpdateStoreProducts));
  await refreshMaterializedView('product_statistic');
};
