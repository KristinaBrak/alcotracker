import { Field, Float, Int, ObjectType } from 'type-graphql';
import { ViewColumn, ViewEntity } from 'typeorm';

@ObjectType()
@ViewEntity({
  expression: `
  select z.*, 
  (1 - z."priceCurrent" / z."priceMode")::numeric(10,2) as "discount"
  from (
  select p.id, calc."priceMean", calc."priceMode", (
    select x.value as "priceCurrent"
    from price x
    where x."productId" = p.id
    order by "createdAt" desc
    limit 1
  ) as "priceCurrent"
  from product p
  left join (
    select pr."productId", avg(pr.value)::NUMERIC(10,2) as "priceMean",
    mode() within group(order by pr.value) as "priceMode"
    from price pr
    group by pr."productId"
  ) as calc on calc."productId" = p.id 
  where calc."productId" = p.id and p."alcVolume" > 0
  order by p.id
  ) as z;
  `,
})
export class ProductStatistic {
  @Field(type => Int)
  @ViewColumn()
  id: number;

  @Field(type => Float)
  priceCurrent: number;

  @Field(type => Float)
  @ViewColumn()
  priceMean: number;

  @Field(type => Float)
  @ViewColumn()
  priceMode: number;
}
