import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import { withCache } from '../../../cache';
import { FetchData, Url } from '../../../types';
import { Category, ApiProduct } from '../store.types';
import { extractAlcVolume, extractVolume } from './rimi.utils';
import { JSDOM } from 'jsdom';

interface RimiCategory {
  name: string;
  link: Url;
}

const rimiURL = 'https://www.rimi.lt';

const PRODUCTS_PER_PAGE = 80;

const rimiAlcoholURL = 'https://www.rimi.lt/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1';

const requestOptions: AxiosRequestConfig = {
  headers: {
    Cookie:
      'rimi_storefront_session=eyJpdiI6IkQ4MGtHampuXC9sWG5IMUxyd1pBQ0RnPT0iLCJ2YWx1ZSI6IkxtenlQazE1ZUFhbWdRMGhVeWd2Z0V6OHo3bVZJOVRHdVlBUnRMK2lDd1R5Q291VFlYWWVEUzhOWFNRbmx3OUE2b08rZXQ3OHczR1JmSmJSdE5LTlNQWFBGa09JS3VhQXBRUVZyUXVqdnpcL0NUelRrcXFHcDFuRHVhaWpKTG41RiIsIm1hYyI6IjRiYmVjZTA0MzViNjg2MDU0YTg0ZmE2NjkwOGFmN2NlYjc1NWJjYzRiYWMxMzllZDM2MTNkYTk1ZmM0YmJiZDYifQ%3D%3D; ',
  },
};

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['vynas']: Category.WINE,
    ['degtinė']: Category.STRONG,
    ['viskis']: Category.STRONG,
    ['brendis']: Category.STRONG,
    ['trauktinė ir likeris']: Category.STRONG,
    ['tekila']: Category.STRONG,
    ['romas']: Category.STRONG,
    ['konjakas']: Category.STRONG,
    ['džinas']: Category.STRONG,
    ['alus']: Category.LIGHT,
    ['sidras']: Category.LIGHT,
    ['kokteiliai']: Category.LIGHT,
    ['nealkoholiniai gėrimai']: Category.FREE,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const fetchData: FetchData<string> = async (url: string) => {
  const { data } = await axios.get<string>(url, requestOptions);
  return data;
};

const parseProducts = (data: string, categoryName: string): ApiProduct[] => {
  const products: ApiProduct[] = [];
  const $ = cheerio.load(data);
  $.html();
  $('li.product-grid__item > div.js-product-container').each((_, el) => {
    const details = $(el).attr('data-gtm-eec-product') ?? '';

    //Attribute (data-gtm-eec-product) structure with examples:
    // {"id":"1363162",
    // "name":"Alus \u0160VYTURYS EKSTRA, 5,2 %, 6 X 0,5 l sk.",
    // "category":"SH-1-1-2",
    // "brand":null,
    // "price":5.89,
    // "currency":"EUR"}

    const product = JSON.parse(details);
    const productCategory = convertToCategory(categoryName);
    const productPrice = product.price;

    const alcVolume = extractAlcVolume(product.name);
    const volume = extractVolume(product.name);
    const image = $(el).find('div.card__image-wrapper > div > img').attr('src') ?? '#';
    const productLink = rimiURL + $(el).children('a').attr('href') ?? '/';

    products.push({
      name: product.name,
      category: productCategory,
      price: productPrice,
      volume,
      alcVolume,
      link: productLink,
      image,
    });
  });
  return products;
};

const parseNextPageUrl = (data: string): Url | undefined => {
  let nextPage: Url | undefined = undefined;
  const $ = cheerio.load(data);
  $.html();
  $('div.pagination > ul > li.pagination__item > a').each((_, el) => {
    if ($(el).attr('rel') === 'next') {
      nextPage = rimiURL + $(el).attr('href');
    }
  });
  return nextPage;
};
export const fetchRimiCategoryProducts = async ({ name, link }: RimiCategory) => {
  try {
    const products: ApiProduct[] = [];
    let nextPage: Url | undefined = link;

    while (nextPage) {
      const data = await withCache(fetchData)(nextPage);
      products.push(...parseProducts(data, name));
      nextPage = parseNextPageUrl(data);
    }
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const formatUrl = (link: string) => {
  const itemUrl = rimiURL + link + `?pageSize=${PRODUCTS_PER_PAGE}`;
  return itemUrl;
};

const listItemToCategory = (acc: RimiCategory[], item: HTMLLIElement) => {
  const anchor = item.querySelector('.-no-child a');
  const link = anchor?.getAttribute('href');
  if (link) {
    const name = anchor?.innerHTML?.trim() ?? '';
    return [...acc, { name, link: formatUrl(link) }];
  }
  const nestedLink = item
    .querySelector('ul li a.category-menu__category-link')
    ?.getAttribute('href');
  if (nestedLink) {
    const name = item.firstChild?.textContent?.trim() ?? '';
    return [...acc, { name, link: formatUrl(nestedLink) }];
  }
  return acc;
};

const fetchRimiCategories = (data: string) => {
  const dom = new JSDOM(data);
  const menu = dom.window.document.querySelector(
    "#main nav .category-menu__wrapper a[href='/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1']",
  )?.nextElementSibling;
  const itemList = menu?.querySelectorAll('li');
  const items = Array.from(itemList ?? []);
  const results = items.reduce<RimiCategory[]>(listItemToCategory, []);
  return results;
};

export const fetchRimiProducts = async () => {
  const data = await withCache(fetchData)(rimiAlcoholURL, requestOptions);
  const rimiCategories = fetchRimiCategories(data);
  const items = (
    await Promise.all(rimiCategories.map(rimiCategory => fetchRimiCategoryProducts(rimiCategory)))
  ).flat();
  return items;
};
