import axios, { AxiosRequestConfig } from "axios";
import { BOTTLERY_PRODUCT, BOTTLERY_URL } from "../../consts";
import { Category, Product } from "../store.types";

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
  "action=btl_products&data%5Border%5D=price_desc&data%5Blimit%5D=";

const config: AxiosRequestConfig = {
  headers: {
    authority: "www.bottlery.eu",
    pragma: "no-cache",
    "cache-control": "no-cache",
    accept: "/",
    "x-requested-with": "XMLHttpRequest",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-gpc": "1",
    origin: "https://www.bottlery.eu",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://www.bottlery.eu/visos-prekes/",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    cookie: 'PHPSESSID=8621ab5520e0b71af4882ef5aea4e37a; n18v3="yes"',
  },
};
[
  "ALCO_WINE",
  "ALCO_STRONG",
  "POS_SALES",
  //   "ADVERTISEMENT",
  //   "FOOD",
  "ALCO_LIGHT",
  //   "PERSONAL_CARE",
  //   "NO_ALCO_BEVERAGES",
  "ALCO_FREE",
  //   "HOUSEHOLD_ACCESS",
];

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ["ALCO_WINE"]: Category.WINE,
    ["ALCO_STRONG"]: Category.STRONG,
    ["POS_SALES"]: Category.OTHER,
    ["ADVERTISEMENT"]: Category.OTHER,
    ["FOOD"]: Category.OTHER,
    ["ALCO_LIGHT"]: Category.LIGHT,
    ["PERSONAL_CARE"]: Category.OTHER,
    ["NO_ALCO_BEVERAGES"]: Category.OTHER,
    ["ALCO_FREE"]: Category.FREE,
    ["HOUSEHOLD_ACCESS"]: Category.OTHER,
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

export const fetchProducts = async () => {
  const {
    data: { error, data },
  } = await axios
    .post<{
      error: any;
      data: BottleryItem[];
    }>(BOTTLERY_URL, requestData, config)
    .catch(() => {
      throw new Error("Bottlery API error");
    });

  if (error) {
    throw new Error("Bottlery response error");
  }

  const items: Product[] = data.map(mapProduct);
  return items;
};
