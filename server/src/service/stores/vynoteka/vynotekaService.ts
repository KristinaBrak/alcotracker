import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Url } from '../../../types';
import { ApiProduct } from '../store.types';

interface VynotekaCategory {
  name: string;
  link: Url;
}

const vynotekaURL: Url = 'https://www.vynoteka.lt/vynas';

const fetchVynotekaProductCategories = async (
  data: string,
): Promise<VynotekaCategory[]> => {
  const categories: VynotekaCategory[] = [];
  const dom = new JSDOM(data);

  return categories;
};

export const fetchVynotekaProducts = async () => {
  const { data } = await axios.get(vynotekaURL);

  const barboraCategories: VynotekaCategory[] = await fetchVynotekaProductCategories(
    data,
  );

  //   const products = (
  //     await Promise.all(
  //       barboraCategories.map(category => fetchBarboraCategoryProducts(category)),
  //     )
  //   ).flat();
  const products: ApiProduct[] = [];
  return products;
};
