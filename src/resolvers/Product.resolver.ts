import { Arg, FieldResolver, Int, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Price } from '../entity/Price';
import { Product } from '../entity/Product';

const getPrices = (product: Product) => {
  return Price.find({ where: { product } });
};

@Resolver(of => Product)
export class ProductResolver implements ResolverInterface<Product> {
  @FieldResolver()
  async prices(@Root() product: Product): Promise<Product['prices']> {
    return getPrices(product);
  }

  @FieldResolver()
  async priceMean(@Root() product: Product): Promise<Product['priceMean']> {
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
    const prices = await getPrices(product);
    return prices
      .sort(
        (a, b) =>
          prices.filter(v => v.value === a.value).length -
          prices.filter(v => v.value === b.value).length,
      )
      .pop()!.value;
  }

  @Query(type => [Product])
  async allProducts(): Promise<Product[]> {
    const products = await Product.find({ relations: ['category', 'store'] });

    if (!products.length) {
      throw new Error('No products exists');
    }
    console.timeEnd('go');

    return products;
  }

  @Query(type => Product)
  async product(@Arg('id', () => Int) id: number): Promise<Product> {
    const product = await Product.findOne({ where: { id }, relations: ['category', 'store'] });
    if (!product) {
      throw new Error(`No product with id: ${id}`);
    }

    return product;
  }
}
