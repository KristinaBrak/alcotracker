import { Category } from '../service/stores/store.types';

export const categorySeed = Object.values(Category).map(value => ({
  name: value,
}));
