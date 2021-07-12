import axios from 'axios';
import { JSDOM } from 'jsdom';
import { withCache } from '../../../cache';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';

const lidlUrl = 'https://www.lidl.lt';

const convertToCategory = (category: string): Category => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['baltasis-vynas']: Category.WINE,
    ['raudonasis-vynas']: Category.WINE,
    ['rozinis-vynas']: Category.WINE,
    ['putojantis-vynas']: Category.WINE,
    ['alkoholinis-alus']: Category.LIGHT,
    ['nealkoholinis-alus']: Category.FREE,
    ['degtine']: Category.STRONG,
    ['brendis-ir-viskis']: Category.STRONG,
    ['likeris']: Category.STRONG,
    ['kiti-gerimai']: Category.STRONG,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const fetchHtml: FetchData<string> = async (url: string) => {
  const { data } = await axios.get(url).catch(() => {
    throw new Error('Lidl API error');
  });

  return data;
};

const parseCategoryUrls = (categoriesHtml: string): string[] => {
  const excludeKeywords = ['leidinys', 'nauji-atradimai'];
  const dom = new JSDOM(categoriesHtml);

  const categoriesSelection = dom.window.document.querySelectorAll(
    'ul.list li.list__item a.pagenavigation__item--final',
  );

  const urls: string[] = [];

  categoriesSelection.forEach(element => {
    const url = element.getAttribute('href');
    if (url && !excludeKeywords.some(keyword => url.includes(keyword))) {
      urls.push(url);
    }
  });
  return urls;
};

const parseVolume = (basicQuantity: string): ApiProduct['volume'] => {
  const volumeMatch = basicQuantity.match(new RegExp(`(?<volume>\\d*\\,?\\d+)\\s?l`));

  const volume = volumeMatch?.groups?.volume;
  if (volume) {
    return Number(volume.replace(',', '.'));
  }
  return;
};

const parseAlcVolume = (basicQuantity: string): ApiProduct['alcVolume'] => {
  const alcVolumeMatch = basicQuantity.match(
    new RegExp(`[,|]\\s*(?<alcVolume>\\d+(\\,\\d+)?)\\s*%.*alk`),
  );

  const alcVolume = alcVolumeMatch?.groups?.alcVolume;
  if (alcVolume) {
    return Number(alcVolume.replace(',', '.'));
  }
  return;
};

const parseLidlCategoryProducts = (alcPageHtml: string, category: Category): ApiProduct[] => {
  const dom = new JSDOM(alcPageHtml);
  const articles = dom.window.document.querySelectorAll('article.product');
  const products: ApiProduct[] = [];
  articles.forEach(article => {
    const pathToProduct = article.querySelector('a.product__body')?.getAttribute('href') ?? '';
    const link = lidlUrl + pathToProduct;
    const image =
      article.querySelector('div.product__image picture.picture img')?.getAttribute('src') ?? '';

    const productTextElement = article.querySelector('div.product__text');
    const productTitle = productTextElement?.querySelector('.product__title')?.textContent?.trim();
    const productDescription = productTextElement
      ?.querySelector('.product__desc')
      ?.textContent?.trim();
    const name = `${productTitle} ${productDescription}`;
    const pricebox = article.querySelector('.product__price div.pricebox');
    const price = Number(
      pricebox?.querySelector('.pricebox__price')?.textContent?.trim().replace(',', '.'),
    );
    const basicQuantity = pricebox
      ?.querySelector('div.pricebox__basic-quantity')
      ?.textContent?.trim()!;

    const volume = parseVolume(basicQuantity);
    const alcVolume = parseAlcVolume(basicQuantity);
    const product = {
      name,
      image,
      link,
      price,
      category,
      volume,
      alcVolume,
    };
    products.push(product);
  });

  return products;
};

export const fetchLidlProducts = async (): Promise<ApiProduct[]> => {
  const alcUrlRoute = '/alkoholiniai-gerimai';
  const alcUrl = lidlUrl + alcUrlRoute;
  const categoriesHtml = await withCache(fetchHtml)(alcUrl);
  const categoryUrls = parseCategoryUrls(categoriesHtml);

  const results = categoryUrls.map(async route => {
    const alcPageHtml = await withCache(fetchHtml)(lidlUrl + route);
    const categoryName = route.split('/').pop() || '';
    const category = convertToCategory(categoryName);

    return parseLidlCategoryProducts(alcPageHtml, category);
  });

  const products = (await Promise.all(results)).flat();
  return products;
};
