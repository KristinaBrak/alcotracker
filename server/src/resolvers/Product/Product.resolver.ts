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
import { columnNameDictionary } from './product.queries';
import { createProductBuilder, parseFilter, ProductSort } from './Product.utils';
import { ProductDTO } from './ProductDTO';

@ArgsType()
class ProductArgs {
  @Field(type => [ProductSort], { nullable: true })
  sort?: ProductSort[];
  @Field(generateFilterType(ProductDTO), { nullable: true })
  filter?: any;
  @Field(type => Int, { nullable: true })
  skip?: number;
  @Field(type => Int, { nullable: true })
  take?: number;
}

@Resolver(of => ProductDTO)
export class ProductResolver implements ResolverInterface<ProductDTO> {
  @FieldResolver()
  async prices(@Root() product: ProductDTO): Promise<ProductDTO['prices']> {
    const connection = getConnection();
    const prices = await connection
      .createQueryBuilder(Price, 'price')
      .where('price."productId" = :id', { id: product.id })
      .orderBy('price.createdAt')
      .getMany();
    return prices;
  }

  @Query(type => [ProductDTO])
  async products(@Args() { sort, filter, skip, take }: ProductArgs): Promise<ProductDTO[]> {
    const parsedFilter = parseFilter(filter);

    const builder = createProductBuilder().where(parsedFilter).offset(skip).limit(take);

    const orderedBuilder =
      sort?.reduce((acc, { field, order }) => {
        return acc.addOrderBy(
          `${columnNameDictionary[field] ?? `"${field}"`}`,
          order,
          'NULLS LAST',
        );
      }, builder) ?? builder;

    const result = await orderedBuilder.addOrderBy('product.id').getRawMany();

    return result;
  }

  @Query(type => ProductDTO)
  async product(@Arg('id', () => Int) id: number): Promise<ProductDTO> {
    const product = await createProductBuilder()
      .where('product.id = :id', {
        id,
      })
      .getRawOne();

    if (!product) {
      throw new Error(`No product with id: ${id}`);
    }

    return product;
  }
}
