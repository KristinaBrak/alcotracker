import axios from 'axios';
import { JSDOM } from 'jsdom';
import { withCache } from '../../../cache';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';

const ikiUrl = 'https://iki.lt';

const alcRoute = '/alkoholiniai-gerimai/';
const alcUrl = ikiUrl + alcRoute;

const convertToCategory = (category: string): Category => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['stiprieji gėrimai']: Category.STRONG,
    ['alus']: Category.LIGHT,
    ['vynas']: Category.WINE,
    ['sidras, kokteiliai']: Category.LIGHT,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const fetchHtml: FetchData<string> = async (url: string) => {
  const { data } = await axios.get(url).catch(() => {
    throw new Error('Lidl API error');
  });

  return data;
};

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

const parseVolume = (volumeText: string): ApiProduct['volume'] => {
  if (!volumeText) {
    return;
  }
  const [volumeValueText] = volumeText.split(' ');
  return Number(volumeValueText.replace(',', '.'));
};

const parseAlcVolume = (alcVolumeText: string): ApiProduct['alcVolume'] => {
  if (!alcVolumeText) {
    return;
  }
  return Number(alcVolumeText.replace('%', '').replace('|', '').trim().replace(',', '.'));
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

export const fetchIkiProducts = async () => {
  const alcCategoriesHtml = await withCache(fetchHtml)(alcUrl);

  const categories = parseCategories(alcCategoriesHtml);
  const products = (
    await Promise.all(
      categories.map(async ({ category, route }) => {
        const html = await withCache(fetchHtml)(alcUrl + route);
        const pageCount = getPageCount(html);
        const pageNumbers = Array.from(Array(pageCount + 1).keys()).filter(num => num > 1);
        const pagedUrls = pageNumbers.map(page => `${alcUrl}page/${page}${route}`);
        const allProducts = (
          await Promise.all(
            [alcUrl + route, ...pagedUrls].map(async url => {
              const htmlPage = await withCache(fetchHtml)(url);
              return parseIkiCategoryProducts(htmlPage, category, route);
            }),
          )
        ).flat();
        return allProducts;
      }),
    )
  ).flat();

  return products;
};
