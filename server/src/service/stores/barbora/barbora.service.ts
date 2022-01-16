import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Url } from '../../../types';
import { Category, ApiProduct } from '../store.types';
import querystring from 'query-string';
import { logger } from '../../../logger';
import { barboraConfig } from './barbora.config';
import { fetchData } from '../../../utils/api.utils';

interface BarboraCategory {
  name: string;
  link: Url;
}

const barboraURL = 'https://barbora.lt';

const extractAlcVolume = (productName: string): ApiProduct['alcVolume'] => {
  const alcVolumeText = productName.match(/\d?\d?\,?\d\s?%/);
  if (alcVolumeText && alcVolumeText.length) {
    const alcVolumeList = alcVolumeText[0].split('%');
    const alcVolume = Number(alcVolumeList[0].replace(',', '.').trim());
    return alcVolume;
  }
  return;
};

const extractVolume = (volumeText: string): ApiProduct['volume'] => {
  const units = [
    { type: 'l', precision: 1 },
    { type: 'ml', precision: 1000 },
  ];

  for (const { type, precision } of units) {
    const volumeMatch = volumeText.match(new RegExp(`\\d*\\,?\\d+\\s?${type}`));
    if (volumeMatch) {
      const numericVolume = Number(volumeMatch[0].replace(type, '').replace(',', '.').trim());
      if (isNaN(numericVolume)) {
        logger.error(`failed to parse volume for ${volumeText}`);
      }
      return numericVolume / precision;
    }
  }
  return;
};

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['nealkoholiniai gėrimai']: Category.FREE,
    ['stiprieji alkoholiniai gėrimai']: Category.STRONG,
    ['vynas']: Category.WINE,
    ['alus']: Category.LIGHT,
    ['sidras ir kokteiliai']: Category.LIGHT,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const isAlcoholCategory = (categoryName: string) => {
  const category = convertToCategory(categoryName.toLowerCase());
  return category !== Category.OTHER;
};

const fetchBarboraProductCategories = async (data: string): Promise<BarboraCategory[]> => {
  const dom = new JSDOM(data);
  const categoryElements = Array.from(
    dom.window.document.querySelectorAll('div.b-single-category--box h3 a'),
  );
  return categoryElements.reduce<BarboraCategory[]>((acc, el) => {
    const name = el.textContent?.trim();
    if (name && isAlcoholCategory(name)) {
      const link: Url = barboraURL + el.getAttribute('href')?.trim();
      return [...acc, { name, link }];
    }
    return acc;
  }, []);
};

const parseProducts =
  (data: string) =>
  (category: Category): ApiProduct[] => {
    const dom = new JSDOM(data);

    const productElements = Array.from(dom.window.document.querySelectorAll('div.b-product--wrap'));

    const products = productElements.reduce<ApiProduct[]>((acc, el) => {
      const linkElement = el.querySelector(
        'div.b-product-wrap-img a.b-product--imagelink.b-link--product-info',
      );

      const link = barboraURL + linkElement?.getAttribute('href');

      const productName = el.querySelector("span[itemprop='name']")?.textContent ?? '';
      const priceLabel = el.querySelector("span[itemprop='price']")?.getAttribute('content') ?? '';
      const price = Number(priceLabel);
      const image = el.querySelector("img[itemprop='image']")?.getAttribute('src') ?? '';

      const product: ApiProduct = {
        name: productName,
        category: category,
        price,
        alcVolume: extractAlcVolume(productName),
        volume: extractVolume(productName),
        link,
        image: image,
      };

      return price ? [...acc, product] : acc;
    }, []);

    return products;
  };

async function* fetchNextPage(url: string): any {
  const {
    query: { page },
  } = querystring.parseUrl(url);
  const data = await fetchData(url);
  const dom = new JSDOM(data);
  const pageList = dom.window.document.querySelector('ul.pagination');
  const pageListLength = pageList?.children.length ?? 1;
  const nextPageLinkElement = pageList?.children[pageListLength - 1].querySelector('a');
  const nextPageLink = barboraURL + nextPageLinkElement?.getAttribute('href') ?? undefined;
  const {
    query: { page: nextPage },
  } = querystring.parseUrl(nextPageLink);
  if (page !== nextPage) {
    yield data;
    yield* fetchNextPage(nextPageLink);
  }
}

const fetchBarboraCategoryProducts = async (
  apiCategory: BarboraCategory,
): Promise<ApiProduct[]> => {
  const category = convertToCategory(apiCategory.name);

  const results: ApiProduct[][] = [];
  for await (const data of fetchNextPage(apiCategory.link)) {
    const products = parseProducts(data)(category);
    results.push(products);
  }
  return results.flat();
};

export const fetchBarboraProducts = async () => {
  const { data } = await axios.get(barboraURL + '/gerimai', barboraConfig);

  const barboraCategories = await fetchBarboraProductCategories(data);

  const products = (await Promise.all(barboraCategories.map(fetchBarboraCategoryProducts))).flat();

  if (!products.length) {
    logger.error('failed to get barbora items!');
  }

  return products;
};
