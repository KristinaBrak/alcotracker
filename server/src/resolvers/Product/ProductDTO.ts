import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Filter } from 'type-graphql-filter';
import { Price } from '../../entity/Price';

@ObjectType()
export class ProductDTO {
  @Field(type => Int)
  id: number;

  @Field(type => String)
  @Filter(['like'], type => String)
  name: string;

  @Field(type => [Price])
  prices: Price[];

  @Field(type => Float)
  @Filter(['lte', 'gte', 'eq'], type => Float)
  priceCurrent: number;

  @Field(type => Float)
  @Filter(['lte', 'gte', 'eq'], type => Float)
  priceMean: number;

  @Field(type => Float)
  @Filter(['lte', 'gte', 'eq'], type => Float)
  priceMode: number;

  @Field(type => Float)
  @Filter(['lte', 'gte', 'eq'], type => Float)
  discount: number;

  @Field(type => String)
  @Filter(['like'], type => String)
  category: string;

  @Field(type => String)
  @Filter(['like'], type => String)
  store: string;

  @Field(type => Float, { nullable: true })
  @Filter(['lte', 'gte', 'eq'], type => Float)
  alcVolume: number | null;

  @Field(type => Float, { nullable: true })
  @Filter(['lte', 'gte', 'eq'], type => Float)
  volume: number | null;

  @Field(type => String)
  link: string;

  @Field(type => String)
  image: string;

  @Field(type => Date)
  createdAt: Date;
}
