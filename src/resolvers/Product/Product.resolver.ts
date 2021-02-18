import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Int,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { generateFilterType } from 'type-graphql-filter';
import { getConnection } from 'typeorm';
import { Price } from '../../entity/Price';
import { Product } from '../../entity/Product';
import { parseFilter, ProductSort } from './Product.utils';

@ArgsType()
class ProductArgs {
  @Field(type => [ProductSort], { nullable: true })
  sort?: ProductSort[];
  @Field(generateFilterType(Product), { nullable: true })
  filter?: any;
  @Field(type => Int, { nullable: true })
  skip?: number;
  @Field(type => Int, { nullable: true })
  take?: number;
}

@Resolver(of => Product)
export class ProductResolver implements ResolverInterface<Product> {
  @FieldResolver()
  async prices(@Root() product: Product): Product['prices'] {
    return product.prices;
  }

  @FieldResolver()
  async priceMean(@Root() product: Product): Promise<number> {
    const connection = getConnection();
    const { avg } = await connection
      .createQueryBuilder(Price, 'price')
      .select('AVG(value)::NUMERIC(10,2)')
      .where('price."productId" = :id', { id: product.id })
      .getRawOne();
    return avg;
  }

  @FieldResolver()
  async priceMode(@Root() product: Product): Promise<Product['priceMode']> {
    const prices = await product.prices;
    return prices
      .sort(
        (a, b) =>
          prices.filter(v => v.value === a.value).length -
          prices.filter(v => v.value === b.value).length,
      )
      .pop()!.value;
  }

  @Query(type => [Product])
  async products(@Args() { sort, filter, skip, take }: ProductArgs): Promise<Product[]> {
    const builder = getConnection()
      .getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.store', 'store')
      .where(parseFilter('product', filter))
      .skip(skip)
      .take(take);

    const orderedBuilder =
      sort?.reduce((acc, { field, order }) => {
        return acc.addOrderBy(`product.${field}`, order, 'NULLS LAST');
      }, builder) ?? builder;

    return orderedBuilder.addOrderBy('product.id').getMany();
  }

  @Query(type => Product)
  async product(@Arg('id', () => Int) id: number): Promise<Product> {
    const product = await Product.findOne({
      where: { id },
      relations: ['category', 'store'],
    });
    if (!product) {
      throw new Error(`No product with id: ${id}`);
    }

    return product;
  }
}
