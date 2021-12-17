import { Category } from '../store.types';

export type VynotekaApiCategory = {
  name: string;
  query: string;
  category: Category;
};

export type VynotekaApiResponse = {
  list: VynotekaApiResponseProduct[];
};

export type Attr = {
  [key: string]: {
    [key: string]: string;
  };
};
export type VynotekaApiResponseProduct = {
  id: number;
  product_type: string;
  label: string;
  alcohol: string;
  energy_drink: null;
  df: string;
  slug: string;
  sold_online: null;
  gourmet: null;
  ps: any[];
  md: string;
  p: {
    pr: string;
    cur: string;
  };
  cor: any;
  c: any;
  attr?: Attr;
};

// {
//   id: '2276',
//   product_type: 'productbeverage',
//   label: 'Loic Raison Degustation 0,75 l',
//   sku: '03V8092598',
//   bar: '3256550081922',
//   wine_award: null,
//   alcohol: '1',
//   energy_drink: null,
//   country_of_origin_id: '55',
//   rdp: null, //   rdqty: null,
//   rdsku: null,
//   rdbar: null,
//   rdl: null,
//   df: '0.10',
//   slug: '/loic-raison-degustation-075-l',
//   sold_online: null,
//   gourmet: null,
//   award: null,
//   ps: [],
//   p: { pr: '4.99', prp: null, dpc: null, da: null, cur: 'EUR' },
//   cor: { id: '55', t: 'TYPE_COUNTRY', l: 'Prancūzija', pr: null },
//   md: 'e7d0147f4779ad34f369e006b6b013efcc8d66b9.jpeg',
//   c: { '24': { l: 'Obuolių sidras', pr: [Object] } },
//   is_favourite: false,
//   attr: {
//     '1': { _6: [Object] },
//     '3': { '2': [Object] },
//     '5': { '_1 x 0.75 L': [Object] },
//     '26': { '347': [Object] }
//   },
//   store_qty: { '2': 1, '33': 3, '54': 3, '89': 8, '124': 5 }
// }
