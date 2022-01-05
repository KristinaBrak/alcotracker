import axios from 'axios';
import { JSDOM } from 'jsdom';
import { withCache } from '../../../cache';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';
import { parseAlcVolumeLidl, parseVolumeLidl } from './lidl.utils';

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
  const categoriesSelection = Array.from(
    dom.window.document.querySelectorAll('ul.list li.list__item a.pagenavigation__item--final'),
  );
  return categoriesSelection.reduce<string[]>((acc, element) => {
    const url = element.getAttribute('href');
    return url && !excludeKeywords.some(keyword => url.includes(keyword)) ? [...acc, url] : acc;
  }, []);
};

const parseLidlCategoryProducts = (alcPageHtml: string, category: Category): ApiProduct[] => {
  const dom = new JSDOM(alcPageHtml);
  const articles = Array.from(dom.window.document.querySelectorAll('article.ret-o-card'));
  return articles.map(article => {
    const pathToProduct = article.querySelector('a.ret-o-card__link')?.getAttribute('href') ?? '';
    const link = lidlUrl + pathToProduct;
    const image = (article.querySelector('picture img')?.getAttribute('src') ?? '').replace(
      'xs-lazy',
      'xs-retina',
    );

    const productTextElement = article.querySelector('div.ret-o-card__body');
    const productTitle = productTextElement
      ?.querySelector('.ret-o-card__headline')
      ?.textContent?.trim();
    const productDescription = productTextElement
      ?.querySelector('.ret-o-card__content')
      ?.textContent?.trim();
    const name = `${productTitle} ${productDescription}`;
    const price = Number(
      article.querySelector('.nuc-m-pricebox__price')?.textContent?.trim().replace(',', '.'),
    );
    const basicQuantity = article
      ?.querySelector('.nuc-m-pricebox__basic-quantity')
      ?.textContent?.trim()!;

    return {
      name,
      image,
      link,
      price,
      category,
      volume: parseVolumeLidl(basicQuantity),
      alcVolume: parseAlcVolumeLidl(basicQuantity),
    };
  });
};

const getCategoryProducts = async (route: string) => {
  const alcPageHtml = await withCache(fetchHtml)(lidlUrl + route);
  const categoryName = route.split('/').pop() || '';
  const category = convertToCategory(categoryName);
  return parseLidlCategoryProducts(alcPageHtml, category);
};

export const fetchLidlProducts = async (): Promise<ApiProduct[]> => {
  const alcUrlRoute = '/alkoholiniai-gerimai';
  const alcUrl = lidlUrl + alcUrlRoute;
  const categoriesHtml = await withCache(fetchHtml)(alcUrl);
  const categoryUrls = parseCategoryUrls(categoriesHtml);
  const results = await Promise.all(categoryUrls.map(getCategoryProducts));
  return results.flat();
};
