import { Category } from '../stores/store.types';

export const categorySeed = Object.values(Category).map(value => ({
  name: value,
}));
