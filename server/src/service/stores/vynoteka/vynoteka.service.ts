import axios from 'axios';
import { withCache } from '../../../cache';
import { logger } from '../../../logger';
import { FetchData } from '../../../types';
import { ApiProduct, Category } from '../store.types';
import {
  VynotekaApiCategory,
  VynotekaApiResponse,
  VynotekaApiResponseProduct,
} from './vynoteka.types';
import { parseAlcVolume, parseNumeric, parsePrice, parseVolume } from './vynoteka.utils';
import * as A from 'fp-ts/Array';
import * as ROA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { prop, trace } from '../../../utils/functions';

const fetchData: FetchData<VynotekaApiResponse> = async (url: string) => {
  const { data } = await axios.get<VynotekaApiResponse>(url);
  return data;
};

const fetchio = (url: string) =>
  pipe(
    TE.tryCatch(
      () => axios.get<VynotekaApiResponse>(url),
      reason => new Error(`${reason}`),
    ),
    TE.map(prop('data')),
  );

const vynotekaURL = 'https://www.vynoteka.lt';
const vynotekaBaseApiUrl = 'https://vynoteka.lt/api/product/list?categories';

const apiCategories: VynotekaApiCategory[] = [
  { name: 'vynas', query: '%5B1%5D=102', category: Category.WINE },
  { name: 'alkoholiniai-gerimai', query: '%5B0%5D=112', category: Category.STRONG },
  { name: 'alus', query: '%5B0%5D=1', category: Category.LIGHT },
  { name: 'sidras', query: '%5B0%5D=113', category: Category.LIGHT },
];

const mapApiResponseItemToApiItem =
  (category: Category) =>
  ({ label, slug, md, p, attr }: VynotekaApiResponseProduct): ApiProduct => {
    return {
      name: label,
      link: vynotekaURL + slug,
      image: vynotekaURL + md,
      price: parsePrice(p.pr), // not worth getting the product if didn't manage to get price
      category,
      volume: attr ? parseVolume(attr)(['qty', 'vol'])(5) : undefined,
      alcVolume: attr ? parseAlcVolume(attr)('lf')(1) : undefined,
    };
  };

const fetchVynotekaApiCategoryProducts = ({ query, category }: VynotekaApiCategory) =>
  flow(
    fetchio,
    TE.map(prop('list')),
    TE.map(A.map(mapApiResponseItemToApiItem(category))),
  )(vynotekaBaseApiUrl + query);

export const fetchVynotekaProducts = async (): Promise<readonly ApiProduct[]> => {
  const items = await flow(
    A.map(fetchVynotekaApiCategoryProducts),
    TE.sequenceArray,
    TE.map(ROA.flatten),
    TE.map(trace('items')),
  )(apiCategories)();

  return E.fold<Error, readonly ApiProduct[], readonly ApiProduct[]>(
    () => [],
    x => x,
  )(items);
};
