import axios from 'axios';
import cheerio from 'cheerio';
import { withCache } from '../../../cache';
import { FetchData, Url } from '../../../types';
import { Category, ApiProduct } from '../store.types';

interface RimiCategory {
  name: string;
  link: Url;
}

const rimiURL = 'https://www.rimi.lt';

const PRODUCTS_PER_PAGE = 20;

const rimiAlcoholURL =
  'https://www.rimi.lt/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1';

const fetchVolume = async (url: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Cookie:
          'rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ',
      },
    });

    const $ = cheerio.load(data);
    $.html();
    const volume: string[] = [];
    $('div.product__list-wrapper> ul.list > li > span').each((_, el) => {
      if ($(el).text() === 'Kiekis') {
        const volumeText = $(el).siblings().text();
        volume.push(volumeText.split('l')[0].trim());
      }
    });
    return volume[0];
  } catch (error) {
    return '??';
  }
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

const extractAlcVolume = (productName: string): ApiProduct['alcVolume'] => {
  const alcVolumeText: string[] | undefined =
    productName.match(/\d?\,?\d\s?%/) ?? undefined;
  if (alcVolumeText) {
    const alcVolumeList: string[] = alcVolumeText[0].split('%');
    const alcVolume = Number(alcVolumeList[0].replace(',', '.').trim());
    return alcVolume;
  }
  return undefined;
};

const fetchData: FetchData<string> = async (url: string) => {
  const { data } = await axios.get<string>(url, {
    headers: {
      Cookie:
        'rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ',
    },
  });
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

    const image =
      $(el).find('div.card__image-wrapper > div > img').attr('src') ?? '#';
    const productLink = rimiURL + $(el).children('a').attr('href') ?? '/';

    products.push({
      name: product.name,
      category: productCategory,
      price: productPrice,
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
export const fetchRimiCategoryProducts = async ({
  name,
  link,
}: RimiCategory) => {
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

const fetchRimiCategories = async () => {
  try {
    const { data } = await axios.get(rimiAlcoholURL, {
      headers: {
        Cookie:
          'rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ',
      },
    });

    const $ = cheerio.load(data);
    $.html();
    const urlList: RimiCategory[] = [];

    $(
      "#main > nav > div.category-menu__wrapper.-child.js-child-categories > a[href='/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1']",
    )
      .siblings()
      .find('li > a')
      .each((_, el) => {
        const alcoURL =
          rimiURL +
            $(el).attr('href') +
            `?pageSize=${PRODUCTS_PER_PAGE}&query=` ?? '';
        const alcoName = $(el).text().trim() ?? '';
        urlList.push({ name: alcoName, link: alcoURL });
      });
    return urlList;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchRimiProducts = async () => {
  const rimiCategories = await fetchRimiCategories();

  return (
    await Promise.all(
      rimiCategories.map(rimiCategory =>
        fetchRimiCategoryProducts(rimiCategory),
      ),
    )
  ).flat();
};
