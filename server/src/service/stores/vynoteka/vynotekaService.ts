import axios from 'axios';
import { JSDOM } from 'jsdom';
import { withCache } from '../../../cache';
import { logger } from '../../../logger';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';

const drinkTypeUrls = ['vynas', 'stiprieji-alkoholiniai-gerimai', 'alus'];

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['stiprieji-alkoholiniai-gerimai']: Category.STRONG,
    ['vynas']: Category.WINE,
    ['alus']: Category.LIGHT,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const vynotekaURL = 'https://www.vynoteka.lt';

const fetchData: FetchData<string> = async (url: string) => {
  const { data } = await axios.get<string>(url);
  return data;
};

const parseVolume = (volumeRaw: string = ''): ApiProduct['volume'] => {
  const volume = volumeRaw.toLowerCase().replace(',', '.').replace('l', '').trim();
  return volume ? Number(volume) : undefined;
};

const parseAlcVolume = (alcVolumeRaw: string = ''): ApiProduct['alcVolume'] => {
  const alcVolume = alcVolumeRaw.toLowerCase().replace(',', '.').replace('%', '').trim();
  return alcVolume ? Number(alcVolume) : undefined;
};

const parseProducts = (data: string, category: Category): ApiProduct[] => {
  const dom = new JSDOM(data);
  const items = Array.from(dom.window.document.querySelectorAll(`.pr-item`));
  const results = items.map<ApiProduct>(item => {
    const linkRaw = item.querySelector('a.photo')?.getAttribute('href');
    const link = linkRaw ? `${vynotekaURL}${linkRaw}` : '';
    const image = item.querySelector('a.photo > img')?.getAttribute('data-src') ?? '';
    const name = item.querySelector('.title')?.innerHTML.trim() ?? '';
    const priceElement = item.querySelector('.price-wrap .price');
    const priceMain = priceElement?.firstChild?.textContent;
    const priceSub = priceElement?.querySelector('sup')?.textContent;
    const price = Number(`${priceMain}.${priceSub}`);
    const tipResults = Array.from(item.querySelectorAll('.tip'));
    const tips = tipResults
      .map(tipResult => ({
        title: tipResult.querySelector('strong')?.textContent?.trim() ?? '',
        value: tipResult.lastChild?.textContent?.trim(),
      }))
      .filter(({ title }) => ['stiprumas', 'tūris'].includes(title.toLowerCase()));

    const volumeRaw = tips.find(({ title }) => title === 'Tūris')?.value;
    const alcVolumeRaw = tips.find(({ title }) => title === 'Stiprumas')?.value;

    const volume = parseVolume(volumeRaw);
    const alcVolume = parseAlcVolume(alcVolumeRaw);

    return {
      name,
      link,
      image,
      price,
      alcVolume,
      volume,
      category,
    };
  });

  return results;
};

async function* fetchNextPage(url: string): any {
  const fullUrl = `${vynotekaURL}${url}`;
  const data = await withCache(fetchData)(fullUrl);
  const dom = new JSDOM(data);
  const [baseUrl] = url.split('?');
  const nextPageLink = dom.window.document
    .querySelector('.pagination .next.selectPage')
    ?.getAttribute('href');
  const nextPageQueryParam = nextPageLink?.substring(nextPageLink.indexOf('?'));
  if (nextPageQueryParam) {
    yield data;
    yield* fetchNextPage(`${baseUrl}${nextPageQueryParam}`);
  }
}

const fetchVynotekaCategoryProducts = async (urlPath: string): Promise<ApiProduct[]> => {
  const category = convertToCategory(urlPath);
  const results: ApiProduct[][] = [];
  for await (const data of fetchNextPage(`/${urlPath}`)) {
    const products = parseProducts(data, category);
    results.push(products);
  }
  return results.flat();
};

export const fetchVynotekaProducts = async () => {
  const items = (await Promise.all(drinkTypeUrls.map(fetchVynotekaCategoryProducts))).flat();
  if (!items.length) {
    logger.error('failed to get vynoteka items!');
  }
  return items;
};
