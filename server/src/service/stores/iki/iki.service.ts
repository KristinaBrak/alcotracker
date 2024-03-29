import { JSDOM } from 'jsdom';
import { withCache } from '../../../cache';
import { logger } from '../../../logger';
import { fetchData } from '../../../utils/api.utils';
import { ApiProduct } from '../store.types';
import { parseVolume, parseAlcVolume, convertToCategory } from './iki.utils';

const ikiUrl = 'https://iki.lt';

const alcRoute = '/alkoholiniai-gerimai/';
const alcUrl = ikiUrl + alcRoute;

interface IkiCategoryType {
  category: string;
  subcategories: { subcategoryName: string; indexValue: string }[];
  route: string;
}

const parseCategories = (categoriesHtml: string): IkiCategoryType[] => {
  const dom = new JSDOM(categoriesHtml);

  const categoriesRow = dom.window.document.querySelector('.row.filters_row')!;
  const categoriesSelectors = categoriesRow.querySelectorAll('.filter_cat_container');
  return Array.from(categoriesSelectors)
    .filter((_, idx) => idx !== 0)
    .map(dropDownCategory => {
      const itemsList = dropDownCategory.querySelectorAll(
        '.list-overscroll li input.custom-control-input',
      );

      const [{ subcategoryName }, ...subcategories] = Array.from(itemsList).map(input => {
        return {
          subcategoryName: input.getAttribute('data-name') ?? '',
          indexValue: input.getAttribute('value') ?? '',
        };
      });
      return { category: subcategoryName, subcategories, route: getCategoryUrls(subcategories) };
    });
};

const getCategoryUrls = (subcategories: IkiCategoryType['subcategories']): string => {
  return (
    '?alc-tag=visi&' +
    subcategories
      .filter(({ subcategoryName }) => !subcategoryName.toLowerCase().includes('nealkohol'))
      .map(({ indexValue }) => `type[]=${indexValue}`)
      .join('&') +
    '&ordering=none'
  );
};

const parseIkiCategoryProducts = (html: string, category: string, route: string): ApiProduct[] => {
  const dom = new JSDOM(html);

  const items = dom.window.document.querySelectorAll('main .akcija');
  return Array.from(items).map(item => {
    const image = item.querySelector('.akcija__image picture img')?.getAttribute('src') ?? '';
    const info = item.querySelector('.akcija__infowrap');
    const priceMain = info?.querySelector('.product_price-main span')?.innerHTML.trim() ?? '';
    const priceCents = info?.querySelector('.product_price-cents span')?.innerHTML.trim() ?? '';
    const price = Number(`${priceMain}.${priceCents}`);
    const firstTitle = item.querySelector('.akcija__title span')?.innerHTML.trim() ?? '';
    const secondTitle = item.querySelector('.akcija__title')?.lastChild?.nodeValue?.trim() ?? '';
    const name = `${firstTitle} ${secondTitle}`.trim();
    const volume = parseVolume(info?.querySelector('._alc-drink-capacity')?.innerHTML.trim() ?? '');
    const alcVolume = parseAlcVolume(
      info?.querySelector('._alc-drink-volume')?.innerHTML.trim() ?? '',
    );
    const link =
      item
        .querySelector('.akcija__anchor')
        ?.getAttribute('onclick')
        ?.replace('window.location=', '')
        .replace("'", '')
        .replace("'", '')
        .trim() ?? '';

    return {
      category: convertToCategory(category),
      image,
      name,
      price,
      link,
      volume,
      alcVolume,
    };
  });
};

const getPageCount = (html: string): number => {
  const dom = new JSDOM(html);
  const pages = dom.window.document.querySelectorAll('.nav-links a.page-numbers:not(.next)');
  const lastPageNode = Array.from(pages).pop();
  return lastPageNode ? Number(lastPageNode.innerHTML) : 1;
};

export const parsePageUrls = ({ route, html }: IkiCategoryType & { html: string }) => {
  const pageCount = getPageCount(html);
  const pageNumbers = Array.from(Array(pageCount + 1).keys()).filter(num => num > 1);
  return [alcUrl + route, ...pageNumbers.map(page => `${alcUrl}page/${page}${route}`)];
};

export const mapPageToApiProducts =
  ({ category, route }: IkiCategoryType) =>
  async (url: string) => {
    const htmlPage = await fetchData(url);
    return parseIkiCategoryProducts(htmlPage, category, route);
  };

type SplitPromise<T> = {
  fulfilled: T[];
  rejected: PromiseRejectedResult['reason'][];
};
const reduceSettled = <T>(acc: SplitPromise<T>, item: PromiseSettledResult<T>) => ({
  ...acc,
  [item.status]: [...acc[item.status], item.status === 'fulfilled' ? item.value : item.reason],
});

export const mapCategoryToApiProducts = async (
  category: IkiCategoryType & { html: string },
): Promise<ApiProduct[]> => {
  const pagedUrls = parsePageUrls(category);
  const settled = await Promise.allSettled(pagedUrls.map(mapPageToApiProducts(category)));
  const { fulfilled: fullfiled, rejected } = settled.reduce<SplitPromise<ApiProduct[]>>(
    reduceSettled,
    {
      fulfilled: [],
      rejected: [],
    },
  );
  rejected.forEach(logger.error);
  return fullfiled.flat();
};

const fetchCategoryHtml = async (category: IkiCategoryType) => ({
  ...category,
  html: await fetchData(alcUrl + category.route),
});

export const fetchIkiProducts = async () => {
  const alcCategoriesHtml = await fetchData(alcUrl);
  const ikiCategories = parseCategories(alcCategoriesHtml);
  const categories = await Promise.all(ikiCategories.map(fetchCategoryHtml));
  const products = (await Promise.all(categories.map(mapCategoryToApiProducts))).flat();
  if (!products.length) {
    logger.error('Iki products failed to fetch');
  }

  return products;
};
