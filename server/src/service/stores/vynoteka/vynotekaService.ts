import axios from 'axios';
import { withCache } from '../../../cache';
import { logger } from '../../../logger';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';
import { ApiResponseProduct } from './vynoteka.types';
import { parseAlcVolume, parseNumeric, parseVolume } from './vynotekaUtil';
import * as A from 'fp-ts/Array';

type ApiResponse = {
  list: ApiResponseProduct[];
};

const fetchData: FetchData<ApiResponse> = async (url: string) => {
  const { data } = await axios.get<ApiResponse>(url);
  return data;
};

const vynotekaURL = 'https://www.vynoteka.lt';
const vynotekaBaseApiUrl = 'https://vynoteka.lt/api/product/list?categories';
const vynotekaMedia = 'https://vynoteka.lt/upload/media/cache/248_600/';

type VynotekaApiCategory = {
  name: string;
  query: string;
  category: Category;
};

const apiCategories: VynotekaApiCategory[] = [
  { name: 'vynas', query: '%5B1%5D=102', category: Category.WINE },
  { name: 'alkoholiniai-gerimai', query: '%5B0%5D=112', category: Category.STRONG },
  { name: 'alus', query: '%5B0%5D=1', category: Category.LIGHT },
  { name: 'sidras', query: '%5B0%5D=113', category: Category.LIGHT },
];

const mapApiResponseItemToApiItem =
  (category: Category) =>
  ({ label, slug, md, p, attr }: ApiResponseProduct): ApiProduct => ({
    name: label,
    link: vynotekaURL + slug,
    image: vynotekaMedia + md,
    price: parseNumeric(p.pr),
    category,
    volume: parseVolume(attr)('qty')('vol')(5),
    alcVolume: parseAlcVolume(attr)('lf')(1),
  });

const fetchVynotekaApiCategoryProducts = async ({ query, category }: VynotekaApiCategory) => {
  const data = await withCache(fetchData)(vynotekaBaseApiUrl + query);
  return data.list.map(mapApiResponseItemToApiItem(category));
};

export const fetchVynotekaProducts = async () => {
  const items = await Promise.all(apiCategories.map(fetchVynotekaApiCategoryProducts)).then(
    A.flatten,
  );

  if (!items.length) {
    logger.error('failed to get vynoteka items!');
  }
  return items;
};
