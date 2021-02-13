import { Arg, Int, Query, Resolver } from 'type-graphql';
import { Product } from '../entity/Product';

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  async allProducts(): Promise<Product[]> {
    const products = await Product.find({ relations: ['prices'] });

    if (!products) {
      throw new Error('No products exists');
    }

    return products;
  }

  @Query(() => Product)
  async product(@Arg('id', () => Int) id: number): Promise<Product> {
    const product = await Product.findOne({ where: { id }, relations: ['prices', 'store'] });
    if (!product) {
      throw new Error(`No product with id: ${id}`);
    }

    return product;
  }
}
