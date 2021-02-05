import axios from 'axios';
import { FetchData } from 'src/types';
import { withCache } from '../../cache';
import { BOTTLERY_PRODUCT, BOTTLERY_URL } from '../../consts';
import { Category, Product } from '../store.types';

interface BottleryItem {
  Bottlery_price: string;
  Bottlery_price_action: string;
  alc_volume: string;
  item_hierarchy: string;
  item_name: string;
  price: string;
  slug: string;
  mmu_qty: string;
  picture_filepath: string;
}

const requestData =
  'action=btl_products&data%5Border%5D=price_desc&data%5Blimit%5D=';

[
  'ALCO_WINE',
  'ALCO_STRONG',
  'POS_SALES',
  //   "ADVERTISEMENT",
  //   "FOOD",
  'ALCO_LIGHT',
  //   "PERSONAL_CARE",
  //   "NO_ALCO_BEVERAGES",
  'ALCO_FREE',
  //   "HOUSEHOLD_ACCESS",
];

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['ALCO_WINE']: Category.WINE,
    ['ALCO_STRONG']: Category.STRONG,
    ['POS_SALES']: Category.OTHER,
    ['ADVERTISEMENT']: Category.OTHER,
    ['FOOD']: Category.OTHER,
    ['ALCO_LIGHT']: Category.LIGHT,
    ['PERSONAL_CARE']: Category.OTHER,
    ['NO_ALCO_BEVERAGES']: Category.OTHER,
    ['ALCO_FREE']: Category.FREE,
    ['HOUSEHOLD_ACCESS']: Category.OTHER,
  };

  return categoryDictionary[category] ?? Category.OTHER;
};

const mapProduct = ({
  alc_volume,
  item_hierarchy,
  item_name,
  price,
  slug,
  mmu_qty,
  picture_filepath,
}: BottleryItem): Product => ({
  alcVolume: Number(alc_volume),
  category: convertToCategory(item_hierarchy),
  price: Number(price),
  name: item_name,
  link: `${BOTTLERY_PRODUCT}/${slug}`,
  volume: Number(mmu_qty),
  image: picture_filepath,
});

interface BottleryResponseType {
  error: any;
  data: BottleryItem[];
}

const fetchData = async (url: string) => {
  const {
    data: { error, data },
  } = await axios.post<BottleryResponseType>(url, requestData).catch(() => {
    throw new Error('Bottlery API error');
  });
  if (error) {
    throw new Error('Bottlery response error');
  }
  return data;
};

export const fetchBottleryProducts = async (): Promise<Product[]> => {
  const data = await withCache(fetchData)(BOTTLERY_URL);

  const items: Product[] = data.map(mapProduct);
  return items;
};
