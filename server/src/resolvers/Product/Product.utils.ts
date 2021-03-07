import { Field, InputType, registerEnumType } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Product } from '../../entity/Product';
import { columnNameDictionary, PRODUCT_SELECT } from './product.queries';

export enum SortableField {
  alcVolume = 'alcVolume',
  volume = 'volume',
  discount = 'discount',
  priceCurrent = 'priceCurrent',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortableField, {
  name: 'SortableField',
});

registerEnumType(Order, {
  name: 'Sort',
});

@InputType()
export class ProductSort {
  @Field(type => SortableField)
  field: SortableField;
  @Field(type => Order)
  order: Order;
}

export const parseSortOrder = (sort?: ProductSort[]): { [key: string]: string } | undefined =>
  sort?.reduce<{ [key: string]: string }>(
    (acc, { field, order }) => ({
      ...acc,
      [field]: order,
    }),
    {},
  );

const operatorDict: { [key: string]: string } = {
  gte: '>=',
  lte: '<=',
  eq: '=',
};

export const parseFilter = (filter: any) => {
  if (!filter) {
    return '';
  }

  const conditions = Object.entries(filter).map(([filterKey, value]) => {
    const [field, operator] = filterKey.split('_');
    const fieldValue = columnNameDictionary[field] ?? `"${field}"`;
    if (operator === 'like') {
      return `${fieldValue} ILIKE '%${value}%'`;
    }
    return `${fieldValue} ${operatorDict[operator]} ${value}`;
  });
  // TODO return array instead and join using andWhere clause
  return conditions.join(' AND ');
};

export const createProductBuilder = () => {
  return getConnection()
    .createQueryBuilder(Product, 'product')
    .select(PRODUCT_SELECT)
    .innerJoinAndSelect('product.category', 'c', 'product."categoryId" = c.id')
    .innerJoinAndSelect('product.store', 's', 'product."storeId" = s.id')
    .innerJoinAndSelect('product_statistic', 'stats', 'product.id = stats.id');
};
