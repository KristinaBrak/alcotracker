export enum Category {
  WINE = 'wine',
  STRONG = 'strong',
  LIGHT = 'light',
  FREE = 'free',
  OTHER = 'other',
}

export interface ApiProduct {
  name: string;
  category: Category;
  price: number;
  alcVolume?: number;
  volume?: number;
  link: string;
  image: string;
}
