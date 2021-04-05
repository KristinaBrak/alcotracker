import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Url } from '../../../types';
import { Category, ApiProduct } from '../store.types';
import querystring from 'query-string';
import { logger } from '../../../logger';

interface BarboraCategory {
  name: string;
  link: Url;
}

const MIN_PAGING_ELEMENTS = 3;

const barboraURL = 'https://barbora.lt';

// TODO clear uneeded header
const config = {
  headers: {
    Connection: 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Accept-Language': 'en-US,en;q=0.9',
    Cookie:
      'f5avraaaaaaaaaaaaaaaa_session_=IAGNLHJNLEEOFFIBOOFJOBKBNCLMCNIOOAOEFDMGEJMDHNJLFHEHOBFALGGFCDFHAMIDKCMFCMJLMCBDFBKAMNPKPCGHONOIMKICOEICNEGEBPFCGEFFFLFBBMGEALJC; region=barbora.lt; _fbp=fb.1.1612524867873.567810989; f5avraaaaaaaaaaaaaaaa_session_=JGONBLKHDOKGHPCOABKIIOKCANBOHJKCIIHLHDGINOPIOEDKGEGMELDAAFNNIFCHEJCDKHFNFMOMCIGHFMBABMJBJCBHEIFNOCCFGINDGMLEAOFEOLIDGLDHBBEKHGNN',
  },
};

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
    ['alus ir sidras']: Category.LIGHT,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

const isAlcoholCategory = (categoryName: string) => {
  const category = convertToCategory(categoryName.toLowerCase());
  return category !== Category.OTHER;
};

const fetchBarboraProductCategories = async (data: string): Promise<BarboraCategory[]> => {
  const dom = new JSDOM(data);
  const categoryElements = Array.from(dom.window.document.querySelectorAll("div.b-single-category--box h3 a"));
  return categoryElements.reduce<BarboraCategory[]>((acc, el) => {
    const name = el.textContent?.trim();
    if (name && isAlcoholCategory(name)) {
      const link: Url = barboraURL + el.getAttribute('href')?.trim();
      return [...acc, { name, link }];
    }
    return acc;
  }, []);
};

// TODO extract pagination out of this function
const fetchBarboraCategoryProducts = async ({
  name,
  link,
}: BarboraCategory): Promise<ApiProduct[]> => {

  const {
    query: { page },
  } = querystring.parseUrl(link);

  const { data } = await axios.get(link, config);
  const dom = new JSDOM(data);

  const pageList = dom.window.document.querySelector('ul.pagination');
  const pageListLength = pageList?.children.length ?? MIN_PAGING_ELEMENTS;
  const nextPageLinkElement = pageList?.children[pageListLength - 1].querySelector('a');
  const nextPageUrl = barboraURL + nextPageLinkElement?.getAttribute('href') ?? undefined;
  const {
    query: { page: nextPage },
  } = querystring.parseUrl(nextPageUrl);

  const productElements = Array.from(dom.window.document.querySelectorAll('div.b-product--wrap'));

  const products = productElements.map<ApiProduct>(el => {
    const linkElement = el.querySelector(
      "div.b-product-wrap-img a.b-product--imagelink.b-link--product-info",
    );

    const link = barboraURL + linkElement?.getAttribute('href');

    const productName = el.querySelector("span[itemprop='name']")?.textContent ?? "";
    const priceLabel = el.querySelector("span[itemprop='price']")?.getAttribute('content') ?? "";
    const price = Number(priceLabel);
    const image = el.querySelector("img[itemprop='image']")?.getAttribute('src') ?? "";

    const product: ApiProduct = {
      name: productName,
      category: convertToCategory(name),
      price,
      alcVolume: extractAlcVolume(productName),
      volume: extractVolume(productName),
      link,
      image: barboraURL + image,
    };
    return product;
  });

  if (page === nextPage) {
    return products;
  }

  return products.concat(await fetchBarboraCategoryProducts({ name, link: nextPageUrl }));
};

export const fetchBarboraProducts = async () => {
  const { data } = await axios.get(barboraURL + '/gerimai', config);

  const barboraCategories = await fetchBarboraProductCategories(data);

  const products = (
    await Promise.all(barboraCategories.map(category => fetchBarboraCategoryProducts(category)))
  ).flat();
  console.log(products);
  return products;
};
