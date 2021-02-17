import { Field, InputType, registerEnumType } from 'type-graphql';

export enum SortableField {
  alcVolume = 'alcVolume',
  volume = 'volume',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortableField, {
  name: 'FilterableField',
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

export const parseFilter = (table: string, filter: any) => {
  if (!filter) {
    return '';
  }
  const conditions = Object.entries(filter).map(([filterKey, value]) => {
    const [field, operator] = filterKey.split('_');
    if (operator === 'like') {
      return `${table}.${field} ILIKE '%${value}%'`;
    }
    return `${table}.${field} ${operatorDict[operator]} ${value}`;
  });
  return conditions.join(' AND ');
};
