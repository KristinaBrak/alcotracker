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
