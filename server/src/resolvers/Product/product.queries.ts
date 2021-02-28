export const columnNameDictionary: { [column: string]: string } = {
  ['name']: 'product."name"',
  ['store']: 's."name"',
  ['category']: 'c."name"',
  ['discount']: 'stats."discount"',
};

export const PRODUCT_SELECT = `
          product.id,
          product.name,
          product."volume",
          product."alcVolume",
          product."link",
          product."image",
          s.name as "store",
          c.name as "category",
          stats."priceCurrent" as "priceCurrent",
          stats."priceMean" as "priceMean",
          stats."priceMode" as "priceMode",
          stats."discount" as "discount"
        `;
