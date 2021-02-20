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
  const category = convertToCategory(categoryName);
  return category !== Category.OTHER;
};

const fetchBarboraProductCategories = async (data: string) => {
  const categories: BarboraCategory[] = [];
  const dom = new JSDOM(data);
  dom.window.document
    .querySelectorAll("div[class='b-single-category--box'] > h3 > a")
    ?.forEach(el => {
      const name = el.textContent?.trim();
      if (name && isAlcoholCategory(name.toLowerCase())) {
        const link: Url = barboraURL + el.getAttribute('href')?.trim();
        categories.push({ name, link });
      }
    });
  return categories;
};

const fetchBarboraCategoryProducts = async ({
  name,
  link,
}: BarboraCategory): Promise<ApiProduct[]> => {
  const products: ApiProduct[] = [];

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

  dom.window.document.querySelectorAll('div.b-product--wrap')?.forEach((el, _, __) => {
    const details = el.getAttribute('data-b-for-cart');
    // Attribute 'data-b-for-cart' structure with examples
    //   {"id":"00000000000BR05951",
    //   "product_position_in_list":0,
    //   "title":"Spiritinis gėrimas CAPTAIN MORGAN ORIGINAL SPICED GOLD (35%), 1000 ml",
    //   "category_id":"9efa3bf4-5d31-4031-9636-f20a1e7b1e5b",
    //   "category_name_full_path":"Gėrimai/Stiprieji alkoholiniai gėrimai/Romas",
    //   "root_category_id":"3e2e66e1-88c3-48df-b8c2-f444618991e4",
    //   "brand_name":"Captain Morgan",
    //   "price":21.9900,
    //   "image":"/api/images/GetInventoryImage?id=ec47b192-c0f3-4230-a41d-6e85ea7ba9d4",
    //   "comparative_unit":"l",
    //   "comparative_unit_price":21.99,
    //   "status":"active",
    //   "popUpText":null,
    //   "age_limitation":20,
    //   "picking_actions":[],
    //   "list":"Prekės pagal kategoriją",
    //   "quantity":1.0}

    if (details) {
      const element = JSON.parse(details);
      const linkElement = el.querySelector(
        "div[class='b-product-wrap-img'] > a[class='b-product--imagelink b-link--product-info']",
      );
      const link = barboraURL + linkElement?.getAttribute('href');

      const product: ApiProduct = {
        name: element.title,
        category: convertToCategory(name),
        price: element.price,
        alcVolume: extractAlcVolume(element.title),
        volume: extractVolume(element.title),
        link,
        image: barboraURL + element.image,
      };

      products.push(product);
    }
  });

  if (page === nextPage) {
    return products;
  }

  return products.concat(await fetchBarboraCategoryProducts({ name, link: nextPageUrl }));
};

export const fetchBarboraProducts = async () => {
  const { data } = await axios.get(barboraURL + '/gerimai', config);

  const barboraCategories: BarboraCategory[] = await fetchBarboraProductCategories(data);

  const products = (
    await Promise.all(barboraCategories.map(category => fetchBarboraCategoryProducts(category)))
  ).flat();
  return products;
};
